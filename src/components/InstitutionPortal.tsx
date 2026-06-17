import React, { useState } from 'react';
import {
  CheckCircle2, MapPin, Globe, Mail, Phone, ShoppingBag, Eye,
  Info, Image as ImageIcon, ClipboardList, PhoneCall, Grid, Pin, Calendar
} from 'lucide-react';
import {
  Institution, Uniform, UniformCategory, InstitutionNotice, GalleryItem, ContactSubmission
} from '../types';

interface InstitutionPortalProps {
  institution: Institution;
  uniforms: Uniform[];
  categories: UniformCategory[];
  notices: InstitutionNotice[];
  galleryItems: GalleryItem[];
  onQuickView: (uniform: Uniform) => void;
  onInstantOrder: (uniform: Uniform) => void;
  onNewContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'date' | 'isRead'>) => void;
}

export default function InstitutionPortal({
  institution,
  uniforms,
  categories,
  notices,
  galleryItems,
  onQuickView,
  onInstantOrder,
  onNewContactSubmission
}: InstitutionPortalProps) {
  const [activeTab, setActiveTab] = useState<'uniforms' | 'about' | 'gallery' | 'notices' | 'contact'>('uniforms');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<'all' | 'boys' | 'girls' | 'unisex'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Contact State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Filters specific to this institution
  const relevantUniforms = uniforms.filter(u => u.institutionId === institution.id && !u.isArchived);
  const relevantNotices = notices.filter(n => n.institutionId === institution.id);
  const relevantGallery = galleryItems.filter(g => g.institutionId === institution.id);

  // filter uniforms further by gender and category
  const filteredUniforms = relevantUniforms.filter(u => {
    if (selectedGenderFilter !== 'all' && u.gender !== selectedGenderFilter) return false;
    if (selectedCategoryFilter !== 'all' && u.categoryId !== selectedCategoryFilter) return false;
    return true;
  });

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Uniform Item';
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    onNewContactSubmission({
      name: contactName,
      email: contactEmail,
      institutionName: `${institution.name} Portal Submission`,
      message: contactMessage
    });

    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setHasSubmitted(true);
    setTimeout(() => setHasSubmitted(false), 5000);
  };

  return (
    <div id="institution-portal-page" className="pt-20 bg-neutral-50 dark:bg-black min-h-screen">
      {/* Banner & Cover Section */}
      <div className="relative h-64 sm:h-80 md:h-[350px] overflow-hidden bg-neutral-900 border-b border-neutral-100 dark:border-neutral-900">
        <img
          src={institution.banner}
          alt={institution.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/25 to-transparent" />
      </div>

      {/* Institution Metadata Overlap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
        <div className="bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-8">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            {/* Logo box */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-neutral-900 bg-white shadow-lg shrink-0 p-1 flex items-center justify-center">
              <img src={institution.logo} alt="" className="w-full h-full object-cover rounded-xl" />
            </div>

            <div className="space-y-2.5">
              {/* Name & Badge */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3.5xl font-extrabold font-sans tracking-tight text-neutral-900 dark:text-white leading-none">
                  {institution.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/10 rounded-full text-[10px] font-mono tracking-wider font-extrabold uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified portal
                </span>
              </div>

              {/* Location parameters */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-sans">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-neutral-400" /> {institution.address}, {institution.city}, {institution.state} - {institution.pincode}</span>
              </div>

              {/* Contacts row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs font-mono text-neutral-400">
                {institution.website && (
                  <a href={institution.website} target="_blank" referrerPolicy="no-referrer" className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" /> {institution.website.replace('https://', '')}
                  </a>
                )}
                <span>•</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-neutral-400" /> {institution.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-neutral-400" /> {institution.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Sticky Tab Selectors */}
        <div className="flex items-center border-b border-neutral-150 dark:border-neutral-900 mt-10 overflow-x-auto gap-4 scrollbar-none sticky top-20 bg-neutral-50/95 dark:bg-black/95 backdrop-blur-md z-20 py-2">
          <button
            onClick={() => setActiveTab('uniforms')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-tight uppercase border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'uniforms'
                ? 'border-black text-black dark:border-white dark:text-white font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Grid className="w-4 h-4" /> Uniform Catalog
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-tight uppercase border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-black text-black dark:border-white dark:text-white font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Info className="w-4 h-4" /> Institutional About
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-tight uppercase border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'border-black text-black dark:border-white dark:text-white font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Gallery
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-tight uppercase border-b-2 transition-all flex items-center gap-2 relative ${
              activeTab === 'notices'
                ? 'border-black text-black dark:border-white dark:text-white font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Announcements Notice Board
            {relevantNotices.length > 0 && (
              <span className="px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-mono text-[9px] font-extrabold">
                {relevantNotices.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold tracking-tight uppercase border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'contact'
                ? 'border-black text-black dark:border-white dark:text-white font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <PhoneCall className="w-4 h-4" /> Portal Support Desk
          </button>
        </div>

        {/* Tab content panel */}
        <div id="portal-tab-content-container" className="pt-8">
          {/* 1. UNIFORMS TAB */}
          {activeTab === 'uniforms' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Sizing & Filtering Toolbar */}
              <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between">
                {/* Category selectors */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors ${
                      selectedCategoryFilter === 'all'
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:bg-black/50 hover:dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-900'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:bg-black/50 hover:dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-900'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Gender Splitter */}
                <div className="flex bg-neutral-50 dark:bg-neutral-900 rounded-xl p-0.5 border border-neutral-200/50 dark:border-neutral-850 shrink-0">
                  {(['all', 'boys', 'girls', 'unisex'] as const).map(gender => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGenderFilter(gender)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                        selectedGenderFilter === gender
                          ? 'bg-white dark:bg-neutral-950 text-black dark:text-white shadow-xs font-bold'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Rendering Grid */}
              {filteredUniforms.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-3xl">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h4 className="text-lg font-bold font-sans text-neutral-700 dark:text-neutral-300">No Portal Uniforms Listed</h4>
                  <p className="text-neutral-400 text-xs mt-1.5">No authorized dress codes match the custom criteria filters established.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredUniforms.map(uniform => {
                    const discountPercentage = uniform.discountPrice
                      ? Math.round(((uniform.price - uniform.discountPrice) / uniform.price) * 100)
                      : 0;

                    return (
                      <div
                        key={uniform.id}
                        className="group bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden hover:border-black dark:hover:border-white transition-all duration-300 shadow-sm flex flex-col justify-between"
                      >
                        {/* Image overlay */}
                        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                          <img src={uniform.images.main} alt={uniform.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          
                          {discountPercentage > 0 && (
                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-red-500 text-white rounded font-mono text-[9px] font-extrabold uppercase">
                              -{discountPercentage}% Off
                            </span>
                          )}

                          {/* Quick view button overlay */}
                          <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => onQuickView(uniform)}
                              className="px-5 py-2.5 bg-white text-black hover:bg-neutral-100 rounded-xl text-xs font-extrabold tracking-tight transition-transform duration-200 transform translate-y-2 group-hover:translate-y-0"
                            >
                              Quick View
                            </button>
                          </div>
                        </div>

                        {/* text details */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block">
                              {getCategoryName(uniform.categoryId)} • {uniform.gender}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight line-clamp-1 block leading-none">
                              {uniform.name}
                            </h4>
                            <p className="text-[10px] text-neutral-400 tracking-wider">Sizes: {uniform.availableSizes.join(', ')}</p>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                            <div>
                              {uniform.discountPrice ? (
                                <div className="leading-none">
                                  <span className="block text-[10px] text-neutral-400 line-through">₹{uniform.price.toLocaleString('en-IN')}</span>
                                  <span className="text-base font-extrabold text-black dark:text-white tracking-tight leading-none">₹{uniform.discountPrice.toLocaleString('en-IN')}</span>
                                </div>
                              ) : (
                                <span className="text-base font-extrabold text-black dark:text-white tracking-tight leading-none">₹{uniform.price.toLocaleString('en-IN')}</span>
                              )}
                            </div>

                            <button
                              onClick={() => onQuickView(uniform)}
                              className="px-3.5 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> Order
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-3xl p-6 md:p-8 animate-fadeIn max-w-4xl mx-auto space-y-10">
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white uppercase">
                  Institutional Profile
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
                  {institution.description}
                </p>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-neutral-100 dark:border-neutral-900">
                {/* Mission */}
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-3">
                  <span className="inline-flex w-7 h-7 bg-black text-white dark:bg-white dark:text-black text-xs font-bold items-center justify-center rounded-lg font-mono">M</span>
                  <h4 className="text-base font-extrabold text-neutral-950 dark:text-white uppercase tracking-wider font-sans">
                    Academic Mission
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                    {institution.mission}
                  </p>
                </div>

                {/* Vision */}
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-3">
                  <span className="inline-flex w-7 h-7 bg-black text-white dark:bg-white dark:text-black text-xs font-bold items-center justify-center rounded-lg font-mono">V</span>
                  <h4 className="text-base font-extrabold text-neutral-950 dark:text-white uppercase tracking-wider font-sans">
                    Future Vision
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                    {institution.vision}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-fadeIn">
              {relevantGallery.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-3xl">
                  <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400 font-sans">No photos uploaded under this custom institution gallery.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {relevantGallery.map(g => (
                    <div key={g.id} className="group bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-2 pb-4 overflow-hidden relative shadow-xs hover:border-black dark:hover:border-white transition-all">
                      <div className="aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-3 relative">
                        <img src={g.image} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/85 text-white text-[9px] font-mono uppercase tracking-wider rounded">
                          {g.category}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold font-sans tracking-tight text-neutral-900 dark:text-white px-1 leading-none line-clamp-1 block">
                        {g.title}
                      </h5>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. NOTICES TAB */}
          {activeTab === 'notices' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
              {relevantNotices.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-3xl">
                  <ClipboardList className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400 font-sans">No notice briefings currently pinned under this institution board.</p>
                </div>
              ) : (
                relevantNotices.map(n => (
                  <div key={n.id} className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl space-y-4 hover:border-black transition-all">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-3">
                      <h4 className="text-base sm:text-lg font-bold font-sans text-neutral-950 dark:text-white">
                        {n.title}
                      </h4>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" /> {n.publishDate}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans">
                      {n.description}
                    </p>
                    {n.attachment && (
                      <div className="pt-2">
                        <a
                          href={n.attachment}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="inline-flex items-center gap-1.5 text-xs text-black dark:text-white font-mono uppercase font-bold hover:underline"
                        >
                          📎 View Official Syllabus/Attachment Spec
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. CONTACT TAB */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-3xl p-6 md:p-8 animate-fadeIn">
              {hasSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <span className="inline-flex w-12 h-12 rounded-full bg-green-500/10 text-green-500 items-center justify-center mb-2">
                    ✓
                  </span>
                  <h4 className="text-lg font-bold font-sans">Portal Query Sent</h4>
                  <p className="text-neutral-400 text-xs sm:text-sm max-w-sm mx-auto">
                    Your official portal inquiry is submitted. Administrators will confirm specifications with counselors.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-sans">Direct Desk Inquiry</h3>
                    <p className="text-xs text-neutral-400">Submit requests regarding size issues or customized fits.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-sans focus:outline-none focus:border-black dark:focus:border-white text-neutral-800 dark:text-neutral-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@doe.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-sans focus:outline-none focus:border-black dark:focus:border-white text-neutral-800 dark:text-neutral-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g. Seeking information regarding delivery timelines to hostels, or custom fits..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-sans focus:outline-none focus:border-black dark:focus:border-white text-neutral-800 dark:text-neutral-100 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors shadow-md"
                  >
                    Submit Portal Form Desk
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
