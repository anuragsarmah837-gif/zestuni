import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2, MapPin, Search, ExternalLink, School
} from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';

// Types
import {
  UserRole, HeroSlide, Institution, Uniform, UniformCategory,
  InstitutionNotice, GalleryItem, ContactSubmission, WebsiteSettings
} from './types';

// Seed Data Fallbacks
import {
  DEFAULT_HERO_SLIDES, DEFAULT_INSTITUTIONS, DEFAULT_CATEGORIES,
  DEFAULT_UNIFORMS, DEFAULT_NOTICES, DEFAULT_GALLERY,
  DEFAULT_CONTACT_SUBMISSIONS, DEFAULT_SETTINGS
} from './data/defaultData';

// Component Imports
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import TrustedInstitutions from './components/TrustedInstitutions';
import FeaturedInstitutions from './components/FeaturedInstitutions';
import FeaturedUniforms from './components/FeaturedUniforms';
import AboutSection from './components/AboutSection';
import HowItWorks from './components/HowItWorks';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProductDetailModal from './components/ProductDetailModal';
import InstitutionPortal from './components/InstitutionPortal';
import AdminPanel from './components/AdminPanel';
import { fetchInitialData, submitContact, syncData } from './services/api';

export default function App() {
  // ----------------------------------------------------
  // CLERK AUTHENTICATION HOOK
  // ----------------------------------------------------
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  let currentRole: UserRole = 'guest';
  if (isSignedIn) {
    if (user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'super_admin') {
      currentRole = 'super_admin';
    } else {
      currentRole = 'user';
    }
  }

  // Helper to parse current hash into activeView and selectedInstitutionSlug
  const parseHash = () => {
    const hash = window.location.hash || '#/';
    if (hash.startsWith('#/portal/')) {
      const slug = hash.replace('#/portal/', '');
      return { activeView: 'home', selectedInstitutionSlug: slug };
    } else {
      const view = hash.replace('#/', '') || 'home';
      const validViews = ['home', 'institutions', 'uniforms', 'how-it-works', 'about', 'contact', 'admin'];
      if (validViews.includes(view)) {
        return { activeView: view, selectedInstitutionSlug: null };
      }
      return { activeView: 'home', selectedInstitutionSlug: null };
    }
  };

  const initialRoute = parseHash();
  const [activeViewVal, setActiveViewVal] = useState<string>(initialRoute.activeView);
  const [selectedInstitutionSlugVal, setSelectedInstitutionSlugVal] = useState<string | null>(initialRoute.selectedInstitutionSlug);

  const activeView = activeViewVal;
  const selectedInstitutionSlug = selectedInstitutionSlugVal;

  const setActiveView = useCallback((view: string | ((prev: string) => string)) => {
    const nextView = typeof view === 'function' ? view(activeViewVal) : view;
    window.location.hash = `#/${nextView}`;
  }, [activeViewVal]);

  const setSelectedInstitutionSlug = useCallback((slug: string | null | ((prev: string | null) => string | null)) => {
    const nextSlug = typeof slug === 'function' ? slug(selectedInstitutionSlugVal) : slug;
    if (nextSlug) {
      window.location.hash = `#/portal/${nextSlug}`;
    } else {
      if (window.location.hash.startsWith('#/portal/')) {
        window.location.hash = `#/${activeViewVal}`;
      }
    }
  }, [activeViewVal, selectedInstitutionSlugVal]);

  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash();
      setActiveViewVal(route.activeView);
      setSelectedInstitutionSlugVal(route.selectedInstitutionSlug);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ----------------------------------------------------
  // SYNC STATE TRACKING
  // ----------------------------------------------------
  // Track if initial DB load has completed to prevent overwriting DB with stale localStorage data
  const hasLoadedFromDB = useRef(false);
  // Track which data types have been modified by admin (to sync only admin changes)
  const adminModifiedTypes = useRef<Set<string>>(new Set());
  // Sync status for UI feedback
  const [syncStatus, setSyncStatus] = useState<{ type: string; status: 'syncing' | 'success' | 'error' } | null>(null);

  // Core Arrays - Initialize from localStorage as fallback, but DB data takes priority
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('zw_slides');
    return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem('zw_institutions');
    return saved ? JSON.parse(saved) : DEFAULT_INSTITUTIONS;
  });

  const [uniforms, setUniforms] = useState<Uniform[]>(() => {
    const saved = localStorage.getItem('zw_uniforms');
    return saved ? JSON.parse(saved) : DEFAULT_UNIFORMS;
  });

  const [categories, setCategories] = useState<UniformCategory[]>(() => {
    const saved = localStorage.getItem('zw_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [notices, setNotices] = useState<InstitutionNotice[]>(() => {
    const saved = localStorage.getItem('zw_notices');
    return saved ? JSON.parse(saved) : DEFAULT_NOTICES;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('zw_gallery');
    return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
  });

  const [contacts, setContacts] = useState<ContactSubmission[]>(() => {
    const saved = localStorage.getItem('zw_contacts');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACT_SUBMISSIONS;
  });

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('zw_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Search and Filtering HUD States
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  // Quick View HUD
  const [selectedUniformForQuickView, setSelectedUniformForQuickView] = useState<Uniform | null>(null);

  // Loading state for database fetch
  const [isLoading, setIsLoading] = useState(true);

  // ----------------------------------------------------
  // HELPER: Sync single data type to DB with error handling
  // ----------------------------------------------------
  const syncToDB = useCallback(async (type: string, data: any) => {
    setSyncStatus({ type, status: 'syncing' });
    try {
      await syncData(type as any, data);
      localStorage.setItem(`zw_${type}`, JSON.stringify(data));
      setSyncStatus({ type, status: 'success' });
      // Clear success status after 2 seconds
      setTimeout(() => setSyncStatus(null), 2000);
    } catch (err) {
      console.error(`Failed to sync ${type} to database:`, err);
      setSyncStatus({ type, status: 'error' });
      // Still save to localStorage as fallback
      localStorage.setItem(`zw_${type}`, JSON.stringify(data));
    }
  }, []);

  // ----------------------------------------------------
  // LOAD DATA FROM DATABASE ON MOUNT
  // ----------------------------------------------------
  useEffect(() => {
    async function loadData() {
      let dbSuccess = false;
      try {
        const dbData = await fetchInitialData();
        dbSuccess = true;
        
        // DB is the source of truth — always update from DB (even if empty)
        setSlides(dbData.slides || []);
        setInstitutions(dbData.institutions || []);
        setUniforms(dbData.uniforms || []);
        setCategories(dbData.categories || []);
        setNotices(dbData.notices || []);
        setGalleryItems(dbData.galleryItems || []);
        setContacts(dbData.contacts || []);
        if (dbData.settings) setSettings(dbData.settings);
        
        // Update localStorage cache with DB data
        localStorage.setItem('zw_slides', JSON.stringify(dbData.slides || []));
        localStorage.setItem('zw_institutions', JSON.stringify(dbData.institutions || []));
        localStorage.setItem('zw_uniforms', JSON.stringify(dbData.uniforms || []));
        localStorage.setItem('zw_categories', JSON.stringify(dbData.categories || []));
        localStorage.setItem('zw_notices', JSON.stringify(dbData.notices || []));
        localStorage.setItem('zw_gallery', JSON.stringify(dbData.galleryItems || []));
        localStorage.setItem('zw_contacts', JSON.stringify(dbData.contacts || []));
        if (dbData.settings) localStorage.setItem('zw_settings', JSON.stringify(dbData.settings));
        
        // Mark that we've loaded from DB - now sync effects can run
        hasLoadedFromDB.current = true;
      } catch (err) {
        console.error('Failed to load data from NeonDB, using cached data:', err);
        // Only use localStorage as fallback if DB fetch failed
        if (!dbSuccess) {
          const savedSlides = localStorage.getItem('zw_slides');
          if (savedSlides) setSlides(JSON.parse(savedSlides));
        }
        hasLoadedFromDB.current = true;
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // ----------------------------------------------------
  // DYNAMIC SEO OPTIMIZATION
  // ----------------------------------------------------
  useEffect(() => {
    if (settings && settings.seo) {
      document.title = settings.seo.metaTitle || 'Zestwear Uniforms';
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', settings.seo.metaDescription || 'Premium school and digital ordering platform.');

      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      if (settings.seo.ogImage) {
        ogImage.setAttribute('content', settings.seo.ogImage);
      }
    }
  }, [settings]);

  // ----------------------------------------------------
  // SYNC TO DB ONLY AFTER ADMIN EDITS (not on initial load)
  // ----------------------------------------------------
  // These effects only sync when adminModifiedTypes contains the type
  // This prevents the initial DB load from triggering a re-sync
  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('slides')) return;
    syncToDB('slides', slides);
  }, [slides, syncToDB]);

  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('institutions')) return;
    syncToDB('institutions', institutions);
  }, [institutions, syncToDB]);

  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('uniforms')) return;
    syncToDB('uniforms', uniforms);
  }, [uniforms, syncToDB]);

  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('categories')) return;
    syncToDB('categories', categories);
  }, [categories, syncToDB]);

  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('notices')) return;
    syncToDB('notices', notices);
  }, [notices, syncToDB]);

  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('galleryItems')) return;
    syncToDB('galleryItems', galleryItems);
  }, [galleryItems, syncToDB]);

  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('contacts')) return;
    syncToDB('contacts', contacts);
  }, [contacts, syncToDB]);

  useEffect(() => {
    if (!hasLoadedFromDB.current || !adminModifiedTypes.current.has('settings')) return;
    syncToDB('settings', settings);
  }, [settings, syncToDB]);

  // Handle direct navigation routing callback
  const handleSelectInstitution = (slug: string) => {
    window.location.hash = `#/portal/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePartnerWithUs = () => {
    window.location.hash = '#/contact';
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleFindUniform = () => {
    window.location.hash = '#/uniforms';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit contact submitter synchronizers
  const handleNewSubmission = (submission: Omit<ContactSubmission, 'id' | 'date' | 'isRead'>) => {
    const newRecord: ContactSubmission = {
      id: `c-${Date.now()}`,
      ...submission,
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };
    setContacts(prev => [newRecord, ...prev]);
    submitContact(newRecord).catch(console.error);
  };

  // Extract cities and states for dynamic filters in directory
  const availableCities = Array.from(new Set(institutions.map(i => i.city)));
  const availableStates = Array.from(new Set(institutions.map(i => i.state)));

  // Filter verified institutions for main Directory list
  const filteredInstitutionsDirectory = institutions.filter(inst => {
    if (!inst.isVerified || inst.isSuspended) return false;
    if (cityFilter !== 'all' && inst.city !== cityFilter) return false;
    if (stateFilter !== 'all' && inst.state !== stateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      // If the user searches for the site brand itself, bypass the school/college filter
      if (q.includes('zestwear') || q.includes('zest wear') || q === 'zest' || q === 'zestwear uniform') {
        return true;
      }
      return (
        inst.name.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q) ||
        inst.state.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Determine which active institution is rendered for portal
  const activePortalInstitution = selectedInstitutionSlug
    ? institutions.find(i => i.slug === selectedInstitutionSlug && !i.isSuspended)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-800 border-t-white animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-sans text-neutral-800 dark:text-neutral-100 dark:bg-black antialiased min-h-screen flex flex-col justify-between">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        setSelectedInstitutionSlug={setSelectedInstitutionSlug}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        settings={settings}
        currentRole={currentRole}
      />

      {/* Sync Status Indicator */}
      {syncStatus && (
        <div className={`fixed top-24 right-6 z-50 px-4 py-2 rounded-lg shadow-lg text-xs font-mono tracking-wide transition-all duration-300 ${
          syncStatus.status === 'syncing' 
            ? 'bg-blue-500 text-white' 
            : syncStatus.status === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
        }`}>
          {syncStatus.status === 'syncing' && (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Syncing {syncStatus.type}...
            </span>
          )}
          {syncStatus.status === 'success' && (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {syncStatus.type} synced
            </span>
          )}
          {syncStatus.status === 'error' && (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Sync failed - saved locally
            </span>
          )}
        </div>
      )}

      {/* Admin Panel Quick Back Floating Action Bar */}
      {activeView === 'admin' && (
        <div className="fixed top-24 left-6 z-40">
          <button
            onClick={() => { setActiveView('home'); setSelectedInstitutionSlug(null); }}
            className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black rounded-full text-xs font-bold shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-100 transition-colors"
          >
            ← Leave Admin Console
          </button>
        </div>
      )}

      {/* 2. Page Router Framework */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          /* ADMIN CONSOLE VIEW */
          <AdminPanel
            currentRole={currentRole}
            slides={slides}
            setSlides={(val) => { adminModifiedTypes.current.add('slides'); setSlides(val); }}
            institutions={institutions}
            setInstitutions={(val) => { adminModifiedTypes.current.add('institutions'); setInstitutions(val); }}
            uniforms={uniforms}
            setUniforms={(val) => { adminModifiedTypes.current.add('uniforms'); setUniforms(val); }}
            categories={categories}
            setCategories={(val) => { adminModifiedTypes.current.add('categories'); setCategories(val); }}
            notices={notices}
            setNotices={(val) => { adminModifiedTypes.current.add('notices'); setNotices(val); }}
            galleryItems={galleryItems}
            setGalleryItems={(val) => { adminModifiedTypes.current.add('galleryItems'); setGalleryItems(val); }}
            contacts={contacts}
            setContacts={(val) => { adminModifiedTypes.current.add('contacts'); setContacts(val); }}
            settings={settings}
            setSettings={(val) => { adminModifiedTypes.current.add('settings'); setSettings(val); }}
          />
        ) : activePortalInstitution ? (
          /* DYNAMIC PORTAL PAGE FOR SELECTED COLLEGE/SCHOOL */
          <InstitutionPortal
            institution={activePortalInstitution}
            uniforms={uniforms}
            categories={categories}
            notices={notices}
            galleryItems={galleryItems}
            onQuickView={(uni) => setSelectedUniformForQuickView(uni)}
            onInstantOrder={(uni) => setSelectedUniformForQuickView(uni)}
            onNewContactSubmission={handleNewSubmission}
          />
        ) : activeView === 'institutions' ? (
          /* INSTITUTIONS DIRECTORY LISTINGS PAGE */
          <div className="pt-24 min-h-screen bg-neutral-50 dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              {/* Header */}
              <div className="text-center space-y-4 mb-12">
                <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">OFFICIAL DIRECTORY</span>
                <h1 className="text-3xl sm:text-5.5xl font-extrabold font-sans tracking-tight text-neutral-900 dark:text-white leading-none">
                  Verified Partner portals
                </h1>
                <p className="text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
                  Search school, college, and university catalogs. Secure compliant dress codes and uniforms.
                </p>
              </div>

              {/* Filtering Toolbar */}
              <div className="bg-white dark:bg-neutral-950 p-6 border rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between mb-10 shadow-xs">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search name, city, state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-black border rounded-xl text-sm focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                {/* City filter & state filter */}
                <div className="flex flex-wrap gap-4 w-full md:w-auto items-center justify-end">
                  {/* City */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">City</span>
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="px-3.5 py-2 bg-neutral-50 dark:bg-black border rounded-xl text-xs font-semibold"
                    >
                      <option value="all">All Cities</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">State</span>
                    <select
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                      className="px-3.5 py-2 bg-neutral-50 dark:bg-black border rounded-xl text-xs font-semibold"
                    >
                      <option value="all">All States</option>
                      {availableStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid block */}
              {filteredInstitutionsDirectory.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border">
                  <School className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h4 className="font-bold text-neutral-700">No Verified Institutions Found</h4>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">No schools match the filter or search credentials.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredInstitutionsDirectory.map(inst => (
                    <div
                      key={inst.id}
                      className="group bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden hover:border-black dark:hover:border-white transition-all shadow-xs"
                    >
                      <div className="relative h-44 overflow-hidden bg-neutral-100">
                        <img src={inst.banner} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" />
                        <span className="absolute top-3 right-3 px-3 py-1 bg-white/95 text-black text-[9px] font-mono font-extrabold rounded-full uppercase shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 fill-green-500/10" /> Verified
                        </span>
                      </div>

                      <div className="p-6 relative pt-12">
                        {/* Logo Overlap */}
                        <div className="absolute top-0 left-6 -translate-y-1/2 w-16 h-16 rounded-xl border bg-white shadow-md overflow-hidden flex items-center justify-center p-0.5">
                          <img src={inst.logo} className="w-full h-full object-cover rounded-lg" />
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-extrabold font-sans tracking-tight text-neutral-900 dark:text-white leading-none">
                              {inst.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{inst.city}, {inst.state}</span>
                            </div>
                          </div>

                          <p className="text-neutral-500 dark:text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                            {inst.description}
                          </p>

                          <button
                            onClick={() => handleSelectInstitution(inst.slug)}
                            className="w-full py-3 bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
                          >
                            Explore Portal Store
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        ) : activeView === 'uniforms' ? (
          /* GLOBAL BROWSE UNIFORMS PAGE */
          <div className="pt-24 bg-neutral-50 dark:bg-black">
            <FeaturedUniforms
              uniforms={uniforms}
              categories={categories}
              institutions={institutions}
              onQuickView={(uni) => setSelectedUniformForQuickView(uni)}
              onInstantOrder={(uni) => setSelectedUniformForQuickView(uni)}
            />
          </div>
        ) : activeView === 'how-it-works' ? (
          /* TIMELINE STEPS VIEW */
          <div className="pt-24 bg-white dark:bg-black">
            <HowItWorks />
          </div>
        ) : activeView === 'about' ? (
          /* TEXT ABOUT DETAILS VIEW */
          <div className="pt-16 bg-white dark:bg-black">
            <AboutSection />
          </div>
        ) : activeView === 'contact' ? (
          /* CONTACT VIEW PANEL */
          <div className="pt-16">
            <ContactSection settings={settings} onNewSubmission={handleNewSubmission} />
          </div>
        ) : (
          /* DEFAULT ROOT HOME LANDING PAGE */
          <div className="animate-fadeIn">
            {/* Hero Slider Management */}
            <HeroSlider
              slides={slides}
              onFindUniform={handleFindUniform}
              onPartnerWithUs={handlePartnerWithUs}
            />

            {/* Scrolling Pillars */}
            <TrustedInstitutions
              institutions={institutions}
              onSelectInstitution={handleSelectInstitution}
            />

            {/* Featured Institutions Grid */}
            <FeaturedInstitutions
              institutions={institutions}
              onSelectInstitution={handleSelectInstitution}
            />

            {/* Featured Uniforms Category Grid */}
            <FeaturedUniforms
              uniforms={uniforms}
              categories={categories}
              institutions={institutions}
              onQuickView={(uni) => setSelectedUniformForQuickView(uni)}
              onInstantOrder={(uni) => setSelectedUniformForQuickView(uni)}
              limit={8}
              filterHomepage={true}
              onViewAll={handleFindUniform}
            />

            {/* Textile standards details */}
            <AboutSection />

            {/* 5 simplified ordering steps */}
            <HowItWorks />

            {/* Contact panel submissions */}
            <ContactSection
              settings={settings}
              onNewSubmission={handleNewSubmission}
            />
          </div>
        )}
      </main>

      {/* 3. Global footer */}
      <Footer
        settings={settings}
        setActiveView={setActiveView}
        setSelectedInstitutionSlug={setSelectedInstitutionSlug}
      />

      {/* 4. Product Zoom detailed popup */}
      {selectedUniformForQuickView && (
        <ProductDetailModal
          uniform={selectedUniformForQuickView}
          categories={categories}
          institutions={institutions}
          settings={settings}
          onClose={() => setSelectedUniformForQuickView(null)}
        />
      )}
    </div>
  );
}
