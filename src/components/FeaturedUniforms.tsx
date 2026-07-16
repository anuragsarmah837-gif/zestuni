import { useState } from 'react';
import { Eye, ShoppingBag, EyeOff, Sparkles, Pin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Uniform, UniformCategory, Institution } from '../types';

interface FeaturedUniformsProps {
  uniforms: Uniform[];
  categories: UniformCategory[];
  institutions: Institution[];
  onQuickView: (uniform: Uniform) => void;
  onInstantOrder: (uniform: Uniform) => void;
  limit?: number;
  filterHomepage?: boolean;
  onViewAll?: () => void;
}

export default function FeaturedUniforms({
  uniforms,
  categories,
  institutions,
  onQuickView,
  onInstantOrder,
  limit,
  filterHomepage,
  onViewAll
}: FeaturedUniformsProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage(1);
  };

  const visibleUniforms = uniforms.filter(u => {
    if (u.isArchived) return false;
    if (filterHomepage && u.showOnHomepage === false) return false;
    if (selectedCategorySlug === 'all') return true;
    const category = categories.find(c => c.id === u.categoryId);
    return category?.slug === selectedCategorySlug;
  });

  const itemsPerPage = 16;
  const totalPages = Math.ceil(visibleUniforms.length / itemsPerPage);

  const displayedUniforms = limit 
    ? visibleUniforms.slice(0, limit) 
    : visibleUniforms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getInstitutionName = (id: string) => {
    const inst = institutions.find(i => i.id === id);
    return inst ? inst.name : 'Zestwear Elite';
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Official Uniform';
  };

  return (
    <section id="featured-uniforms" className="py-24 bg-neutral-50 dark:bg-neutral-900/45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1 text-xs font-mono tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Institution-Approved Essentials
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Official Campus Garments
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto">
            Browse our verified design directory. Every single SKU matches institutional dress code regulation matrices perfectly.
          </p>
        </div>

        {/* Dynamic Category Sliders/Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              selectedCategorySlug === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white'
            }`}
          >
            All Collections
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                selectedCategorySlug === cat.slug
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Uniform Grid */}
        {displayedUniforms.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-black border border-neutral-100 dark:border-neutral-900 rounded-3xl">
            <EyeOff className="w-12 h-12 text-neutral-300 mx-auto mb-4 animate-none" />
            <p className="text-neutral-500 dark:text-neutral-400 font-sans">No uniforms currently seeded under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedUniforms.map(uniform => {
              const discountPercentage = uniform.discountPrice
                ? Math.round(((uniform.price - uniform.discountPrice) / uniform.price) * 100)
                : 0;

              return (
                <div
                  key={uniform.id}
                  className="group bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col shadow-xs hover:shadow-lg"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 flex items-center justify-center">
                    <img
                      src={uniform.images.main}
                      alt={uniform.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Left badge (Institution Tag) */}
                    <div className="absolute top-3 left-3 bg-black/75 dark:bg-white/80 border border-neutral-800 dark:border-neutral-200 backdrop-blur-md text-white dark:text-black px-2.5 py-1 rounded-md text-[9px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" />
                      <span className="truncate max-w-[120px]">{getInstitutionName(uniform.institutionId)}</span>
                    </div>

                    {/* Right badge (Discount percentage) */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase tracking-wider">
                        -{discountPercentage}% Off
                      </div>
                    )}

                    {/* Bottom Hover Options Layer */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center items-center gap-2.5">
                      <button
                        onClick={() => onQuickView(uniform)}
                        className="px-3 py-2 bg-white text-black hover:bg-neutral-200 rounded-lg text-xs font-extrabold tracking-tight transition-transform duration-200 flex items-center gap-1.5 shadow-md hover:scale-102"
                        title="Quick View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category Label */}
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                        {getCategoryName(uniform.categoryId)} • {uniform.gender}
                      </span>

                      {/* Name */}
                      <h4 className="text-base font-bold font-sans tracking-tight text-neutral-900 dark:text-white line-clamp-1 mb-2">
                        {uniform.name}
                      </h4>


                    </div>

                    {/* Footer Row (Price and Order Button) */}
                    <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-4 mt-2">
                      <div className="flex flex-col">
                        {uniform.discountPrice ? (
                          <>
                            <span className="text-xs text-neutral-400 line-through leading-none">
                              ₹{uniform.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-lg font-extrabold text-black dark:text-white tracking-tight mt-1 leading-none">
                              ₹{uniform.discountPrice.toLocaleString('en-IN')}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-extrabold text-black dark:text-white tracking-tight leading-none">
                            ₹{uniform.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Active Order Button */}
                      <button
                        onClick={() => onQuickView(uniform)} // Force view the size selection before direct whatsapp
                        className="px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-extrabold tracking-tight transition-colors duration-300 flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!limit && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  document.getElementById('featured-uniforms')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800 transition-all duration-200 flex items-center justify-center
                ${currentPage === 1 
                  ? 'opacity-40 cursor-not-allowed text-neutral-400' 
                  : 'bg-white hover:bg-neutral-50 dark:bg-black dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white shadow-xs hover:scale-102 cursor-pointer'
                }
              `}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  document.getElementById('featured-uniforms')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                  ${currentPage === page
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-102'
                    : 'bg-white hover:bg-neutral-50 dark:bg-black dark:hover:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white hover:scale-102'
                  }
                `}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                  document.getElementById('featured-uniforms')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              disabled={currentPage === totalPages}
              className={`p-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800 transition-all duration-200 flex items-center justify-center
                ${currentPage === totalPages 
                  ? 'opacity-40 cursor-not-allowed text-neutral-400' 
                  : 'bg-white hover:bg-neutral-50 dark:bg-black dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white shadow-xs hover:scale-102 cursor-pointer'
                }
              `}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {onViewAll && (
          <div className="mt-12 text-center">
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-102 cursor-pointer font-sans"
            >
              View All Uniforms
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
