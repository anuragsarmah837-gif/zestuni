import { Sparkles, Shield, Bookmark, MapPin, Truck, History } from 'lucide-react';

export default function AboutSection() {
  const highlights = [
    {
      icon: Shield,
      title: 'Verified Institution Partnerships',
      desc: 'All products are officially approved by corresponding institution chancellery heads.'
    },
    {
      icon: Sparkles,
      title: 'Premium Quality Uniforms',
      desc: 'Ensured with triple-threaded resilience, color-fast dyeing, and breathable fabrics.'
    },
    {
      icon: Bookmark,
      title: 'Dedicated Student Portals',
      desc: 'Direct channels filtering irrelevant gear, maintaining perfect design regulation compliance.'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'High velocity tracking delivering kits to remote zones across India.'
    },
    {
      icon: History,
      title: 'Easy Reordering',
      desc: 'Retrieve historic client sizes, quantities, and addresses instantly for yearly extensions.'
    },
    {
      icon: Shield,
      title: 'Secure Ordering',
      desc: 'Transparent processing backed by real-time WhatsApp direct verification chats.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase">
                THE ZESTWEAR MISSION
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                Redefining Uniform Management
              </h2>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
              Zestwear Uniforms delivers a streamlined paradigm shift. By designing bespoke verified digital portals and utilizing automated communication lines, we completely relieve schools, colleges, and students from obsolete physical inventory management.
            </p>

            {/* Grid of highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              {highlights.map((hl, idx) => {
                const IconComp = hl.icon;
                return (
                  <div key={idx} className="space-y-3">
                    <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 rounded-lg flex items-center justify-center">
                      <IconComp className="w-4 h-4 text-black dark:text-white" />
                    </div>
                    <h4 className="text-base font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
                      {hl.title}
                    </h4>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                      {hl.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Cards Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Media Placeholder Box - Designed elegantly on a black frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group shadow-lg">
              <div className="absolute inset-0 bg-neutral-950/40 z-10 transition-colors group-hover:bg-neutral-950/20" />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                alt="Uniform Craftsmanship Video Background"
                className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent">
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-300">Brand Video</span>
                <h4 className="text-base font-bold font-sans tracking-tight text-white mt-1">Impeccable Textile Standards</h4>
              </div>
            </div>

            {/* Vision Card */}
            <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl space-y-2 hover:border-black dark:hover:border-white transition-all">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">OUR EXECUTIVE VISION</span>
              <h4 className="text-lg font-bold font-sans text-neutral-900 dark:text-white">Eliminating Administration Bottlenecks</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                To serve as India’s primary standardized digital uniform infrastructure—transforming administrative supply chains, enabling direct-to-student fulfillment, and maintaining impeccable quality assurance across 10,000+ elite educational campuses.
              </p>
            </div>

            {/* Mission Card */}
            <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl space-y-2 hover:border-black dark:hover:border-white transition-all">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">OUR SERVICE MISSION</span>
              <h4 className="text-lg font-bold font-sans text-neutral-900 dark:text-white">Precision Textiles & Rapid Fulfilment</h4>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Provide certified non-allergenic garments that guarantee all-day academic comfort, paired with direct-to-WhatsApp smart portals that eradicate manual, error-prone spreadsheets for school board administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
