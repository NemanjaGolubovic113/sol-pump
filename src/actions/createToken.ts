import {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  ComputeBudgetProgram,
  VersionedTransaction,
  TransactionMessage,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createMintToInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  getMinimumBalanceForRentExemptMint,
  createSetAuthorityInstruction,
  AuthorityType,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync
} from '@solana/spl-token';
import { AnchorProvider, Program, Wallet, BN } from '@project-serum/anchor';
import bs58 from 'bs58';
import fs from 'fs';
import path from "path";
import {
  PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
  createRevokeCollectionAuthorityInstruction,
} from '@metaplex-foundation/mpl-token-metadata';
import UploadFileToBlockChain from '@/utils/uploadToArweave';
import { createTipTransaction } from './feesTx';

const PUMPFUN_PROGRAM_ID = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const feeRecipient = new PublicKey("62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV");//pump fun fee address
const EVENT_AUTH = new PublicKey("Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1");// pump fun event authority address


export interface CreateTokenParams {
  connection: Connection;
  payer: PublicKey;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  totalSupply: number;
  imageUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
}

export interface MetadataJson {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  showName: boolean;
  createdOn: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  tags: string[];
}

export async function createToken({
  connection,
  payer,
  name,
  symbol,
  description,
  decimals,
  totalSupply,
  imageUrl,
  websiteUrl,
  twitterUrl,
  telegramUrl,
}: CreateTokenParams): Promise<{ transaction: Transaction; mintKeypair: Keypair; tokenATA: PublicKey }> {
  // Generate a new keypair for the mint account
  const mintKeypair = Keypair.generate();

  // Prepare metadata JSON for Arweave
  const metadataJson: MetadataJson = {
    name,
    symbol,
    description,
    image: imageUrl,
    showName: true,
    createdOn: "https://pump.fun",
    twitter: twitterUrl,
    telegram: telegramUrl,
    website: websiteUrl,
    tags: ["meme"],
  };

  // Upload metadata to Arweave
  const metadataBlob = new Blob([JSON.stringify(metadataJson)], { type: 'application/json' });
  const arweaveUrl = await UploadFileToBlockChain(metadataBlob);

  if (!arweaveUrl) {
    throw new Error('Failed to upload metadata to Arweave');
  }

  // Calculate minimum lamports needed for the mint
  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  // Get the associated token account address
  const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, payer);

  // Add priority fee instruction (150,000 microlamports = 0.00015 SOL)
  const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 150_000,
  });

  // Add compute units instruction (maximum allowed)
  const addComputeUnitsInstruction = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_400_000,
  });

  // Create metadata instruction with Arweave URL
  const metadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()],
        PROGRAM_ID
      )[0],
      mint: mintKeypair.publicKey,
      mintAuthority: payer,
      payer,
      updateAuthority: payer,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name,
          symbol,
          uri: arweaveUrl,
          creators: [{
            address: new PublicKey(payer.toBase58()),
            verified: true,
            share: 100
          }],
          sellerFeeBasisPoints: 0,
          collection: null,
          uses: null,
        },
        isMutable: false,
        collectionDetails: null,
      },
    }
  );

  // Create transaction
  const transaction = new Transaction().add(
    // Add priority fee and compute units instructions first
    priorityFeeInstruction,
    addComputeUnitsInstruction,
    // Create mint account
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    // Initialize mint
    createInitializeMintInstruction(mintKeypair.publicKey, decimals, payer, payer, TOKEN_PROGRAM_ID),
    // Create associated token account
    createAssociatedTokenAccountInstruction(payer, tokenATA, payer, mintKeypair.publicKey),
    // Mint tokens
    createMintToInstruction(mintKeypair.publicKey, tokenATA, payer, totalSupply * 10 ** decimals),
    // Create metadata
    metadataInstruction,
    // Disable mint authority
    createSetAuthorityInstruction(
      mintKeypair.publicKey,
      payer,
      AuthorityType.MintTokens,
      null,
      [],
      TOKEN_PROGRAM_ID
    ),
    // Disable freeze authority
    createSetAuthorityInstruction(
      mintKeypair.publicKey,
      payer,
      AuthorityType.FreezeAccount,
      null,
      [],
      TOKEN_PROGRAM_ID
    ),
    await createTipTransaction(
      connection,
      0.6, // Platform fee in SOL
      payer,
      new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_FEE_ACCOUNT!)
    )
  );

  return { transaction, mintKeypair, tokenATA };
}

export async function createPumpFunToken({
  connection,
  payer,
  name,
  symbol,
  description,
  decimals,
  totalSupply,
  imageUrl,
  websiteUrl,
  twitterUrl,
  telegramUrl,
}: CreateTokenParams): Promise<{ transaction: Transaction; mintKeypair: Keypair; tokenATA: PublicKey }> {
  // Generate a new keypair for the mint account
  const mintKeypair = Keypair.generate();
  const tokenMint = mintKeypair.publicKey;
  try {
    console.log("name = ", name);
    console.log("symbol = ", symbol);
    console.log("description = ", description);
    console.log("decimals = ", decimals);
    console.log("totalSupply = ", totalSupply);
    console.log("imageUrl = ", imageUrl);
    console.log("websiteUrl = ", websiteUrl);
    console.log("twitterUrl = ", twitterUrl);
    console.log("telegramUrl = ", telegramUrl);

    const imgresponse = await fetch(imageUrl)
    if (!imgresponse.ok) {
      console.log(`Failed to fetch image: ${imgresponse.statusText}`);
    }

    // const ipfsUrl = "https://ipfs.io/ipfs/QmVBM6M4tRGd3Bdcd6ut1FtaApnSwppjbEwRSEsh8B1W31";
// const saveDirectory = "./downloads"; // Ensure this directory exists

  // await downloadAndSaveIPFSFile(imageUrl, saveDirectory);

    const blob = await imgresponse.blob();
    console.log("blob ===", blob);

    let formData = new FormData();
    formData.append("file", blob),
    formData.append("name", name),
    formData.append("symbol", symbol),
    formData.append("description", description),
    formData.append("twitter", twitterUrl),
    formData.append("telegram", telegramUrl),
    formData.append("website", websiteUrl),
    formData.append("showName", "true");
  
    let metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
    });

    let metadataResponseJSON = await metadataResponse.json();
    let tokenUri = metadataResponseJSON.metadataUri;

    // const provider = new AnchorProvider(
    //   connection,
    //   new Wallet(payer),
    //   AnchorProvider.defaultOptions()
    // );

    //@ts-ignore
    const program = new Program(idl, PUMPFUN_PROGRAM_ID/*, provider*/);
    console.log("program___id ===", program.programId);

    // Lookup Table
    const firstAddressLookup = new PublicKey("Ej3wFtgk3WywPnWPD3aychk38MqTdrjtqXkzbK8FpUih");// lookup table address.
    const lookupTableAccount = (await connection.getAddressLookupTable(firstAddressLookup));
    let lookupTableAccounts = [lookupTableAccount.value];

    let instructions = []

    let mintIx: any
    
    // Get the create transaction
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          "publicKey": payer,
          "action": "create",
          "tokenMetadata": {
              name: name,
              symbol: symbol,
              uri: tokenUri
          },
          "mint": tokenMint.toBase58(),
          "denominatedInSol": "false",
          "amount": 100000, // token amount for buy using dev wallet
          "slippage": 5, 
          "priorityFee": 0.0005,
          "pool": "pump"
      })
    });

    if(response.status === 200) { // successfully generated transaction
      const data = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(data));
      const transactionMsg = TransactionMessage.decompile(tx.message);

      for (let ins of transactionMsg.instructions) {
          if (ins.programId.toBase58() === "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P") {//pump.fun program address
              mintIx = ins;// meme coin creation instruction. This is for get creation instruction from pumpportal api.
              break;
          }
      }

      // tx.sign([mintKeypair, PAYER]);
    } else {
        console.log(response.statusText); // log error
    }


    let txBuyDev = await buildMintBuyTx(
      program,
      payer,
      tokenMint,
      0.01,// max sol cost for buy token.
      10000// token amount for dev wallet buy
    );

    instructions = [mintIx, ...txBuyDev.instructions];
    // let signers = [mintKeypair]

    // const versionedTransaction = new VersionedTransaction(
    //     new TransactionMessage({
    //         payerKey: payer,
    //         recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    //         //@ts-ignore
    //         instructions: instructions,
    //         //@ts-ignore
    //     }).compileToV0Message(lookupTableAccounts)
    // )

    // versionedTransaction.sign(signers)

    // const txId = await connection.sendTransaction(versionedTransaction);//execute launch meme coin to pump.fun
    // if (txId) return "Success";

    // Get the associated token account address
    const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, payer);

    // Add priority fee instruction (150,000 microlamports = 0.00015 SOL)
    const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 150_000,
    });

    // Add compute units instruction (maximum allowed)
    const addComputeUnitsInstruction = ComputeBudgetProgram.setComputeUnitLimit({
      units: 1_400_000,
    });

    // Create transaction
    let transaction = new Transaction().add(
      // Add priority fee and compute units instructions first
      priorityFeeInstruction,
      addComputeUnitsInstruction,
    );
    for (let i = 0; i < instructions.length; i ++) {
      transaction = transaction.add(instructions[i])
    }

    console.log("instruction = ", instructions);
    console.log("transaction = ", transaction);
    console.log("mintKeypair = ", mintKeypair.publicKey);
    console.log("tokenATA = ", tokenATA);

    return { transaction, mintKeypair, tokenATA };

  } catch (e) {

  }

}

const buildMintBuyTx = async (
  program : Program,
  payer: PublicKey,
  tokenMint: PublicKey,
  maxSolCost: any,
  tokenAmount: any
) => {
  const mint = new PublicKey(tokenMint);
  const bondingCurve = await getBondingCurve(mint, program.programId);
  const bondingCurveAta = await getAssociatedTokenAddress(
      mint,
      bondingCurve!,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const globalState = new PublicKey(
      "4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"//pump fun global account address
  );
  const user = payer;
  const userAta = getAssociatedTokenAddressSync(mint, user, true);
  const signerTokenAccount = getAssociatedTokenAddressSync(
      mint,
      user,
      true,
      TOKEN_PROGRAM_ID
  );

  const decimals = 6;
  const finalAmount = tokenAmount;

  console.log(`Buy token(${mint.toString()}) ${finalAmount}`);

  //creating tx;
  const tx = new Transaction();

  tx.add(
      createAssociatedTokenAccountInstruction(
          user,
          signerTokenAccount,
          user,
          mint
      )
  );

  const snipeIx = await program.methods
      .buy(
          new BN(finalAmount * 10 ** decimals),
          new BN(maxSolCost * LAMPORTS_PER_SOL)
      )
      .accounts({
          global: globalState,
          feeRecipient: feeRecipient,
          mint: mint,
          bondingCurve: bondingCurve,
          associatedBondingCurve: bondingCurveAta,
          associatedUser: userAta,
          user: user,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          eventAuthority: EVENT_AUTH,
          program: program.programId,
      })
      .instruction();
  tx.add(snipeIx);

  return tx;
}

const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
const getBondingCurve = async (tokenMint: any, programId: any) => {
  let count = 0
  while (count < 20) {
      const seedString = "bonding-curve";

      const [PDA, bump] = PublicKey.findProgramAddressSync(
          [Buffer.from(seedString), tokenMint.toBuffer()],
          programId
      );
  
      if (PDA) return new PublicKey(PDA);
      else {
          count ++;
          await sleep(500)
      }
  }
}

// const downloadAndSaveIPFSFile = async (ipfsUrl: string, saveDirectory: string) => {
//   try {
//     // Fetch the file from IPFS
//     const response = await fetch(ipfsUrl);

//     console.log("1")
//     if (!response.ok) {
//       throw new Error(`Failed to fetch file: ${response.statusText}`);
//     }

//     // Get the file as a Blob
//     const blob = await response.blob();
//     console.log("2 --- ", blob)

//     // Get the MIME type from the response headers
//     const contentType = response.headers.get("content-type") || "application/octet-stream";

//     console.log("3 --- ", contentType)
//     // Determine the file extension from MIME type
//     const extension = getExtensionFromMimeType(contentType);
    
//     console.log("4 --- ", extension)
//     if (!extension) {
//       throw new Error(`Unknown MIME type: ${contentType}`);
//     }

//     console.log("5")
//     // Generate a unique filename with the correct extension
//     const filename = `downloaded_file.${extension}`;
//     const filePath = path.join(saveDirectory, filename);

//     // Convert Blob to Buffer
//     const arrayBuffer = await blob.arrayBuffer();
//     const buffer = new Uint8Array(arrayBuffer);

//     console.log("6 --- ", buffer)
//     // Save the file locally
//     fs.writeFileSync(filePath, buffer);

//     console.log("7")
//     console.log(`File saved successfully as ${filename}`);
//   } catch (error) {
//     console.error("Error downloading or saving file:", error);
//   }
// }

// // Helper function to map MIME types to file extensions
// const getExtensionFromMimeType = (mimeType: string): string | null => {
//   const mimeToExt: Record<string, string> = {
//     "image/png": "png",
//     "image/jpeg": "jpg",
//     "image/gif": "gif",
//     "image/webp": "webp",
//     "video/mp4": "mp4",
//     "video/webm": "webm",
//     "audio/mpeg": "mp3",
//     "audio/wav": "wav",
//     "audio/ogg": "ogg",
//     "application/pdf": "pdf",
//   };

//   return mimeToExt[mimeType] || null;
// }
