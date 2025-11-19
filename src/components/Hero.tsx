import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-12 md:pt-0 md:pb-0 font-mono text-white/90">

      <div className="w-full max-w-5xl px-4">
        {/* Main Drawing Area Placeholder (Optional context) */}
        <div className="w-full h-64 md:h-96 border-x border-t border-white/20 relative overflow-hidden bg-white/[0.02]">
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>
          <div className="absolute bottom-4 left-4 text-xs text-white/40">
            NOTE 1: ALL DIMENSIONS IN PIXELS UNLESS OTHERWISE SPECIFIED.<br/>
            NOTE 2: INTERFACE TOLERANCES ACCORDING TO WCAG 2.1.
          </div>

          {/* Decorative Technical Lines */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 opacity-30" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
             <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
             <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border border-white/20 bg-black/40 backdrop-blur-sm"
        >
          {/* Top Row: Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/20">
            {/* Project / Organization */}
            <div className="col-span-1 md:col-span-3 p-4 border-b md:border-b-0 md:border-r border-white/20">
              <span className="block text-[10px] text-white/50 uppercase tracking-widest mb-1">Organization / Project</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">Andrew's Portfolio</h1>
            </div>
            {/* Logo / Stamp Area */}
            <div className="col-span-1 p-4 flex items-center justify-center bg-white/5">
               <div className="text-center">
                 <span className="block text-2xl font-bold border-2 border-white/40 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-1">A</span>
                 <span className="text-[10px] uppercase">Approved</span>
               </div>
            </div>
          </div>

          {/* Middle Row: Title */}
          <div className="grid grid-cols-1 border-b border-white/20">
            <div className="p-4">
              <span className="block text-[10px] text-white/50 uppercase tracking-widest mb-1">Title / Role</span>
              <h2 className="text-xl md:text-2xl font-light uppercase tracking-wide">Electrical Engineer & Creative Technologist</h2>
            </div>
          </div>

          {/* Bottom Row: Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 text-xs">

            <div className="p-3 border-r border-b md:border-b-0 border-white/20">
              <span className="block text-white/40 uppercase mb-1">Designed By</span>
              <span className="font-semibold">ANDREW</span>
            </div>

            <div className="p-3 border-r border-b md:border-b-0 border-white/20">
              <span className="block text-white/40 uppercase mb-1">Date</span>
              <span className="font-semibold">NOV 2025</span>
            </div>

            <div className="p-3 border-r border-b md:border-b-0 border-white/20">
              <span className="block text-white/40 uppercase mb-1">Scale</span>
              <span className="font-semibold">1:1</span>
            </div>

            <div className="p-3">
              <span className="block text-white/40 uppercase mb-1">Drawing No.</span>
              <span className="font-semibold">2025-PF-001</span>
            </div>

          </div>
        </motion.div>

        {/* Revision Table (Decorative) */}
        <div className="mt-4 border border-white/20 text-[10px] hidden md:block opacity-60">
           <div className="grid grid-cols-12 border-b border-white/20 bg-white/5 font-bold">
             <div className="col-span-1 p-2 border-r border-white/20 text-center">REV</div>
             <div className="col-span-2 p-2 border-r border-white/20 text-center">DATE</div>
             <div className="col-span-7 p-2 border-r border-white/20">DESCRIPTION</div>
             <div className="col-span-2 p-2 text-center">APPROVED</div>
           </div>
           <div className="grid grid-cols-12">
             <div className="col-span-1 p-2 border-r border-white/20 text-center">01</div>
             <div className="col-span-2 p-2 border-r border-white/20 text-center">2025-11-18</div>
             <div className="col-span-7 p-2 border-r border-white/20">INITIAL RELEASE FOR REVIEW</div>
             <div className="col-span-2 p-2 text-center">AM</div>
           </div>
        </div>

      </div>
    </section>
  );
};
