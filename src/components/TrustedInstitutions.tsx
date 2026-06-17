import { School } from 'lucide-react';
import { Institution } from '../types';

interface TrustedInstitutionsProps {
  institutions: Institution[];
  onSelectInstitution: (slug: string) => void;
}

export default function TrustedInstitutions({ institutions, onSelectInstitution }: TrustedInstitutionsProps) {
  const verifiedList = institutions.filter(i => i.isVerified && !i.isSuspended);

  return (
    <section id="trusted-institutions" className="py-12 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-100 dark:border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase mb-8">
          Trusted by Elite Educational Foundations
        </p>

        {/* Scrolling Infinite Banner */}
        <div className="relative w-full flex overflow-x-hidden">
          <div className="flex gap-6 shrink-0 animate-marquee whitespace-nowrap py-1">
            {/* Set 1 */}
            {verifiedList.map(item => (
              <button
                key={`${item.id}-trust-1`}
                onClick={() => onSelectInstitution(item.slug)}
                className="inline-flex items-center gap-3 bg-white dark:bg-black border border-neutral-200/60 dark:border-neutral-800 px-6 py-3.5 rounded-full hover:border-black dark:hover:border-white transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-102 duration-300"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-100 dark:border-neutral-800 flex items-center justify-center bg-neutral-50">
                  {item.logo ? (
                    <img src={item.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <School className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </div>
                <span className="text-sm font-sans font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                  {item.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </button>
            ))}
            {/* Set 2 (for loop visual continuity) */}
            {verifiedList.map(item => (
              <button
                key={`${item.id}-trust-2`}
                onClick={() => onSelectInstitution(item.slug)}
                className="inline-flex items-center gap-3 bg-white dark:bg-black border border-neutral-200/60 dark:border-neutral-800 px-6 py-3.5 rounded-full hover:border-black dark:hover:border-white transition-all cursor-pointer shadow-xs hover:shadow-md hover:scale-102 duration-300"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-100 dark:border-neutral-800 flex items-center justify-center bg-neutral-50">
                  {item.logo ? (
                    <img src={item.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <School className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </div>
                <span className="text-sm font-sans font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                  {item.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
