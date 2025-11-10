import { Loader2 } from 'lucide-react';

export default function AdminRoot() {
  return (
    <div className='min-h-screen grid place-items-center bg-background'>
      <div className='flex items-center gap-3 text-zinc-100'>
        <Loader2 className='w-6 h-6 animate-spin' />
        {/* <span>...</span> */}
      </div>
    </div>
  );
}
