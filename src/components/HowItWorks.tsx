import { Search, ListFilter, Sparkles, Send, Truck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Search Institution',
      description: 'Enter your school, college, or university name in the search portal or select from verified directories.',
      icon: Search
    },
    {
      step: '02',
      title: 'Select Uniform',
      description: 'Review the approved garment items and matching styles tailored to your exact enrolled department.',
      icon: ListFilter
    },
    {
      step: '03',
      title: 'Choose Size',
      description: 'Select from available sizes (XS to XXXL, 22 to 48) and adjust your required purchase quantity.',
      icon: Sparkles
    },
    {
      step: '04',
      title: 'Place WhatsApp Order',
      description: 'Click Order Now to automatically generate a pre-formatted WhatsApp draft and hit send to confirm.',
      icon: Send
    },
    {
      step: '05',
      title: 'Receive Delivery',
      description: 'Your uniform undergoes rigorous quality vetting and arrives right at your steps with zero delay.',
      icon: Truck
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-100 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase">
            OPERATIONAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold tracking-tight text-neutral-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto font-sans">
            Acquiring your certified campus uniforms takes less than 60 seconds. Learn the effortless ordering flow.
          </p>
        </div>

        {/* Steps Cards Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((st, idx) => {
            const IconComp = st.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-black border border-neutral-150 dark:border-neutral-900 p-6 rounded-2xl flex flex-col justify-between group hover:border-black dark:hover:border-white transition-all duration-300 shadow-xs"
              >
                {/* Number indicator */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-extrabold font-sans tracking-tight text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {st.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center border border-neutral-200/50 dark:border-neutral-800">
                    <IconComp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                </div>

                {/* Info Text */}
                <div className="space-y-2 mt-auto">
                  <h4 className="text-base font-bold font-sans tracking-tight text-neutral-900 dark:text-white">
                    {st.title}
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
