import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Background ambient elements could go here */}
      <main className="w-full max-w-md h-full bg-slate-50 relative overflow-hidden flex flex-col sm:h-[800px] sm:min-h-[800px] sm:rounded-[2.5rem] sm:shadow-2xl sm:border sm:border-white/50">
        {children}
      </main>
    </div>
  );
}
