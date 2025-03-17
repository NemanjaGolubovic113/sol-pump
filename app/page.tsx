import HomepageView from '@/sections/p/homepage/homepage-view';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <div className="w-full max-w-[100vw]">
        <HomepageView />
      </div>
    </Suspense>
  );
}
