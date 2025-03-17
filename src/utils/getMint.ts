import { Connection, PublicKey } from '@solana/web3.js';
import { getMint as getTokenMint } from '@solana/spl-token';

export async function getMint(connection: Connection, mintAddress: PublicKey) {
  try {
    const mintInfo = await getTokenMint(connection, mintAddress);
    return mintInfo;
  } catch (error) {
    console.error('Error getting mint info:', error);
    throw error;
  }
} 