import { CheckCircle2, MapPin, Globe, ExternalLink } from 'lucide-react';
import { Institution } from '../types';

interface FeaturedInstitutionsProps {
  institutions: Institution[];
  onSelectInstitution: (slug: string) => void;
}

export default function FeaturedInstitutions({ institutions, onSelectInstitution }: FeaturedInstitutionsProps) {
  // Only display active, verified, and explicitly featured institutions
  const displayedInsts = institutions.filter(inst => inst.isVerified && !inst.isSuspended && inst.isFeatured).slice(0, 6);

  if (displayedInsts.length === 0) return null;

  return (
    <section id="featured-institutions" className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              VERIFIED PORTALS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Featured Institutions
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md text-sm md:text-base">
            Select your institution to access authorized uniform dress codes, notice announcements, and official campus collection channels.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedInsts.map(inst => (
            <div
              key={inst.id}
              className="group bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden hover:border-black dark:hover:border-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              {/* Banner Area */}
              <div className="relative h-44 overflow-hidden bg-neutral-200">
                <img
                  src={inst.banner}
                  alt={inst.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

                {/* Verification Overlay Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-white/95 text-black text-[10px] font-mono font-bold uppercase rounded-full shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 fill-green-500/10" />
                  Verified Partner
                </div>
              </div>

              {/* Institution Body with Overlapping Logo */}
              <div className="p-6 relative pt-12">
                {/* Logo Overlap */}
                <div className="absolute top-0 left-6 -translate-y-1/2 w-16 h-16 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-white shadow-md overflow-hidden flex items-center justify-center p-0.5">
                  <img src={inst.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                </div>

                <div className="space-y-4">
                  {/* Title & Badge */}
                  <div>
                    <h3 className="text-xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 flex items-center gap-1.5">
                      {inst.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{inst.city}, {inst.state}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {inst.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 border-t border-neutral-100 dark:border-neutral-900 pt-4">
                    {inst.website && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" />
                        Official URL
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-1 font-bold text-neutral-500 dark:text-neutral-300">
                      PIN {inst.pincode}
                    </span>
                  </div>

                  {/* View Portal Action Button */}
                  <button
                    onClick={() => onSelectInstitution(inst.slug)}
                    className="w-full mt-4 py-3 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View Official Portal
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
