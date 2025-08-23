import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-dark-900 text-light-100 flex-col justify-between p-12">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="Nike" width={32} height={32} priority className="filter invert" />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">
            Just Do It
          </h1>
          <p className="text-xl text-light-200 max-w-md">
            Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
          </p>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-light-100 rounded-full"></div>
            <div className="w-2 h-2 bg-light-400 rounded-full"></div>
            <div className="w-2 h-2 bg-light-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="text-sm text-light-400">
          © 2024 Nike. All rights reserved.
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
