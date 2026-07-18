import React, { useState } from 'react';
import {
  Shield, Edit3, Trash2, Plus, RefreshCw, BarChart3, Sliders, School,
  ShoppingBag, ClipboardList, Image as ImageIcon, Mail, Settings,
  Check, Play, Pause, Eye, FileText, CheckCircle2, ChevronRight, X, ArrowUp, Copy, BookOpen
} from 'lucide-react';
import {
  UserRole, HeroSlide, Institution, Uniform, UniformCategory,
  InstitutionNotice, GalleryItem, ContactSubmission, WebsiteSettings
} from '../types';
import CloudinaryUpload from './CloudinaryUpload';

interface AdminPanelProps {
  currentRole: UserRole;
  slides: HeroSlide[];
  setSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  institutions: Institution[];
  setInstitutions: React.Dispatch<React.SetStateAction<Institution[]>>;
  uniforms: Uniform[];
  setUniforms: React.Dispatch<React.SetStateAction<Uniform[]>>;
  categories: UniformCategory[];
  setCategories: React.Dispatch<React.SetStateAction<UniformCategory[]>>;
  notices: InstitutionNotice[];
  setNotices: React.Dispatch<React.SetStateAction<InstitutionNotice[]>>;
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  contacts: ContactSubmission[];
  setContacts: React.Dispatch<React.SetStateAction<ContactSubmission[]>>;
  settings: WebsiteSettings;
  setSettings: (settings: WebsiteSettings) => void;
}

export default function AdminPanel({
  currentRole,
  slides,
  setSlides,
  institutions,
  setInstitutions,
  uniforms,
  setUniforms,
  categories,
  setCategories,
  notices,
  setNotices,
  galleryItems,
  setGalleryItems,
  contacts,
  setContacts,
  settings,
  setSettings
}: AdminPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'slides' | 'institutions' | 'categories' | 'notices' | 'contacts' | 'settings'>('dashboard');
  const [selectedInstId, setSelectedInstId] = useState<string | null>(null);

  // Multi-use Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Notifications Log Toast Simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------
  // SUB-FORMS: SLIDES STATE MANAGEMENTS
  // ----------------------------------------------------
  const [slideForm, setSlideForm] = useState<Omit<HeroSlide, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: 'Find Uniform',
    buttonLink: '#uniforms',
    displayOrder: 1,
    isActive: true
  });

  const handleCreateOrEditSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSlides(prev => prev.map(s => s.id === editingId ? { ...s, ...slideForm } : s));
      triggerToast('Hero slide successfully updated.');
    } else {
      const newSlide: HeroSlide = {
        id: `slide-${Date.now()}`,
        ...slideForm
      };
      setSlides(prev => [...prev, newSlide]);
      triggerToast('New hero slide added to registry.');
    }
    resetFormState();
  };

  const handleToggleSlideActive = (id: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    triggerToast('Slide visibility state updated.');
  };

  const handleDeleteSlide = (id: string) => {
    setSlides(prev => prev.filter(s => s.id !== id));
    triggerToast('Hero slide removed.');
  };

  // ----------------------------------------------------
  // SUB-FORMS: INSTITUTIONS MANAGEMENTS
  // ----------------------------------------------------
  const [instForm, setInstForm] = useState<Omit<Institution, 'id'>>({
    name: '',
    slug: '',
    logo: '',
    banner: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    website: '',
    email: '',
    phone: '',
    description: '',
    mission: '',
    vision: '',
    isVerified: true,
    isSuspended: false
  });

  const handleCreateOrEditInst = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instForm.name || !instForm.slug || !instForm.logo || !instForm.banner || !instForm.address || !instForm.city || !instForm.pincode) {
      triggerToast('Please fill all mandatory fields (Name, Logo, Banner, Address, City, Pincode).');
      return;
    }

    if (editingId) {
      setInstitutions(prev => prev.map(i => i.id === editingId ? { ...i, ...instForm } : i));
      triggerToast('Institution portal data saved.');
    } else {
      const newInst: Institution = {
        id: `inst-${Date.now()}`,
        ...instForm
      };
      setInstitutions(prev => [...prev, newInst]);
      triggerToast('New verified institution portal added.');
    }
    resetFormState();
  };

  const handleVerifyToggleInst = (id: string) => {
    setInstitutions(prev => prev.map(i => i.id === id ? { ...i, isVerified: !i.isVerified } : i));
    triggerToast('Institution verification status toggled.');
  };

  const handleSuspendToggleInst = (id: string) => {
    setInstitutions(prev => prev.map(i => i.id === id ? { ...i, isSuspended: !i.isSuspended } : i));
    triggerToast('Institution suspension visibility toggled.');
  };

  const handleTrustedToggleInst = (id: string) => {
    setInstitutions(prev => {
      const currentTrustedCount = prev.filter(i => i.isTrusted).length;
      return prev.map(inst => {
        if (inst.id === id) {
          if (!inst.isTrusted && currentTrustedCount >= 6) {
            triggerToast('Maximum of 6 institutions can be featured in the Trusted Banner.');
            return inst;
          }
          return { ...inst, isTrusted: !inst.isTrusted };
        }
        return inst;
      });
    });
    if (institutions.find(i => i.id === id)?.isTrusted) {
      triggerToast('Institution removed from Trusted Banner.');
    } else {
      triggerToast('Institution added to Trusted Banner.');
    }
  };

  const handleFeaturedToggleInst = (id: string) => {
    setInstitutions(prev => {
      const currentFeaturedCount = prev.filter(i => i.isFeatured).length;
      return prev.map(inst => {
        if (inst.id === id) {
          if (!inst.isFeatured && currentFeaturedCount >= 6) {
            triggerToast('Maximum of 6 institutions can be Featured.');
            return inst;
          }
          return { ...inst, isFeatured: !inst.isFeatured };
        }
        return inst;
      });
    });
    if (institutions.find(i => i.id === id)?.isFeatured) {
      triggerToast('Institution removed from Featured section.');
    } else {
      triggerToast('Institution added to Featured section.');
    }
  };

  const handleDeleteInst = (id: string) => {
    setInstitutions(prev => prev.filter(i => i.id !== id));
    triggerToast('Institution portal removed permanently.');
  };

  // ----------------------------------------------------
  // SUB-FORMS: UNIFORM SKU MANAGEMENT
  // ----------------------------------------------------
  const [uniForm, setUniForm] = useState<Omit<Uniform, 'id'>>({
    institutionId: '',
    name: '',
    sku: '',
    categoryId: '',
    gender: 'unisex',
    description: '',
    fabricType: '',
    price: 0,
    discountPrice: undefined,
    availableSizes: [],
    stockQuantity: 100, // Default to 100 since field is removed
    isArchived: false,
    showOnHomepage: true,
    images: {
      main: '',
      front: '',
      back: '',
      side: '',
      gallery: []
    }
  });

  const handleCreateOrEditUniform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniForm.name) {
      triggerToast('Garment Name is required.');
      return;
    }
    if (!uniForm.images.main) {
      triggerToast('Main Display Image is required.');
      return;
    }

    if (editingId) {
      setUniforms(prev => prev.map(u => u.id === editingId ? { ...u, ...uniForm } : u));
      triggerToast('Uniform SKU product parameters updated.');
    } else {
      const newUni: Uniform = {
        id: `uni-${Date.now()}`,
        ...uniForm,
        institutionId: selectedInstId || uniForm.institutionId,
        sku: uniForm.sku || `SKU-${Date.now().toString().slice(-6)}`,
        fabricType: uniForm.fabricType || 'Standard Blend'
      };
      setUniforms(prev => [...prev, newUni]);
      triggerToast('New official uniform SKU integrated.');
    }
    resetFormState();
  };

  const handleDuplicateUniform = (uni: Uniform) => {
    const duplicated: Uniform = {
      ...uni,
      id: `uni-${Date.now()}`,
      sku: `${uni.sku}-COPY`,
      name: `${uni.name} (Copy)`
    };
    setUniforms(prev => [...prev, duplicated]);
    triggerToast('Uniform duplicate cloned successfully.');
  };

  const handleArchiveToggleUniform = (id: string) => {
    setUniforms(prev => prev.map(u => u.id === id ? { ...u, isArchived: !u.isArchived } : u));
    triggerToast('Uniform archiving status updated.');
  };

  const handleDeleteUniform = (id: string) => {
    setUniforms(prev => prev.filter(u => u.id !== id));
    triggerToast('Uniform SKU removed.');
  };

  // Sizing checkbox togglers
  const handleSizeCheckboxToggle = (size: string) => {
    setUniForm(prev => {
      const sizes = prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size];
      return { ...prev, availableSizes: sizes };
    });
  };

  // ----------------------------------------------------
  // CATEGORIES STATE DECK
  // ----------------------------------------------------
  const [newCatName, setNewCatName] = useState('');
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const slug = newCatName.toLowerCase().replace(/\s+/g, '-');

    if (editingId) {
      setCategories(prev => prev.map(c => c.id === editingId ? { ...c, name: newCatName, slug } : c));
      setEditingId(null);
      setNewCatName('');
      triggerToast('Category updated.');
    } else {
      const newCat: UniformCategory = {
        id: `cat-${Date.now()}`,
        name: newCatName,
        slug
      };
      setCategories(prev => [...prev, newCat]);
      setNewCatName('');
      triggerToast('New categorical class added.');
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    triggerToast('Category dismissed.');
  };

  // ----------------------------------------------------
  // NOTICE BOARD BRIEF STATS
  // ----------------------------------------------------
  const [noticeForm, setNoticeForm] = useState<Omit<InstitutionNotice, 'id'>>({
    institutionId: 'inst-1',
    title: '',
    description: '',
    attachment: '',
    publishDate: new Date().toISOString().split('T')[0]
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.description) return;

    if (editingId) {
      setNotices(prev => prev.map(n => n.id === editingId ? { ...n, ...noticeForm } : n));
      triggerToast('Notice panel announcement item updated.');
    } else {
      const newNot: InstitutionNotice = {
        id: `not-${Date.now()}`,
        ...noticeForm
      };
      setNotices(prev => [...prev, newNot]);
      triggerToast('New campus notice board item published.');
    }
    resetFormState();
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    triggerToast('Notice item removed.');
  };

  // ----------------------------------------------------
  // GALLERY BULK LOADS
  // ----------------------------------------------------
  const [bulkGalleryUrls, setBulkGalleryUrls] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<'institution' | 'campus' | 'event' | 'uniform'>('campus');
  const [galleryInstId, setGalleryInstId] = useState('inst-1');
  const [galleryTitle, setGalleryTitle] = useState('Campus Parade');

  const handleBulkUploadGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkGalleryUrls) return;
    const urlList = bulkGalleryUrls.split(',').map(u => u.trim()).filter(Boolean);
    const newItems: GalleryItem[] = urlList.map((url, idx) => ({
      id: `gal-new-${Date.now()}-${idx}`,
      institutionId: galleryInstId,
      image: url,
      title: `${galleryTitle} #${idx + 1}`,
      category: galleryCategory
    }));

    setGalleryItems(prev => [...prev, ...newItems]);
    setBulkGalleryUrls('');
    setGalleryTitle('Campus Parade');
    triggerToast(`Bulk uploaded ${newItems.length} photos to institution stack.`);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
    triggerToast('Image deleted.');
  };

  // ----------------------------------------------------
  // CONTACT READING LOGS
  // ----------------------------------------------------
  const handleMarkContactAsRead = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, isRead: true } : c));
    triggerToast('Submission status set to audited.');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    triggerToast('Inquiry request discarded.');
  };

  // ----------------------------------------------------
  // CENTRAL UTILS
  // ----------------------------------------------------
  const resetFormState = () => {
    setEditingId(null);
    setShowAddForm(false);
    // Refresh templates
    setSlideForm({
      title: '', subtitle: '', description: '', image: '',
      buttonText: 'Find Uniform', buttonLink: '#uniforms', displayOrder: 1, isActive: true
    });
    setInstForm({
      name: '', slug: '',
      logo: '',
      banner: '',
      address: '', city: '', state: '', pincode: '',
      website: '', email: '', phone: '', description: '', mission: '', vision: '',
      isVerified: true, isSuspended: false
    });
    setUniForm({
      institutionId: selectedInstId || '', name: '', sku: '', categoryId: categories[0]?.id || '', gender: 'unisex',
      description: '', fabricType: '', price: 0, discountPrice: undefined,
      availableSizes: [], stockQuantity: 0, isArchived: false,
      showOnHomepage: true,
      images: { main: '', front: '', back: '', side: '', gallery: [] }
    });
    setNoticeForm({
      institutionId: '', title: '', description: '', attachment: '',
      publishDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditTrigger = (type: 'slide' | 'inst' | 'uniform' | 'notice', item: any) => {
    setEditingId(item.id);
    setShowAddForm(true);
    if (type === 'slide') {
      setSlideForm({
        title: item.title, subtitle: item.subtitle, description: item.description,
        image: item.image, buttonText: item.buttonText, buttonLink: item.buttonLink,
        displayOrder: item.displayOrder, isActive: item.isActive
      });
    } else if (type === 'inst') {
      setInstForm({
        name: item.name, slug: item.slug, logo: item.logo, banner: item.banner,
        address: item.address, city: item.city, state: item.state, pincode: item.pincode,
        website: item.website, email: item.email, phone: item.phone, description: item.description,
        mission: item.mission, vision: item.vision, isVerified: item.isVerified, isSuspended: item.isSuspended
      });
    } else if (type === 'uniform') {
      setUniForm({
        institutionId: item.institutionId, name: item.name, sku: item.sku,
        categoryId: item.categoryId, gender: item.gender, description: item.description,
        fabricType: item.fabricType, price: item.price, discountPrice: item.discountPrice,
        availableSizes: item.availableSizes, stockQuantity: item.stockQuantity,
        isArchived: item.isArchived,
        showOnHomepage: item.showOnHomepage !== false,
        images: item.images
      });
    } else if (type === 'notice') {
      setNoticeForm({
        institutionId: item.institutionId, title: item.title, description: item.description,
        attachment: item.attachment, publishDate: item.publishDate
      });
    }
  };

  return (
    <div id="admin-panel-viewport" className="pt-24 bg-neutral-50 dark:bg-black min-h-screen">
      {/* Toast HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider shadow-2xl animate-bounce">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Navigation Sidebar Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-neutral-200 dark:border-neutral-900 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-500 animate-none" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-sans tracking-tight">ZW Admin Console</h2>
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-0.5">
                Connected Role: <span className="font-extrabold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md uppercase">{currentRole.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <span className="text-xs text-neutral-400 font-mono hidden md:inline">
            SYSTEM ENGINE VERSION 1.15 • SQL SIMULATED FLUX
          </span>
        </div>

        {/* Tab Selection Row */}
        <div className="flex items-center overflow-x-auto gap-2 border-b border-neutral-200 dark:border-neutral-900 pb-2 scrollbar-none">
          <button
            onClick={() => { setActiveAdminTab('dashboard'); resetFormState(); }}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'dashboard' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 text-neutral-500'
              }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview Dashboard
          </button>
          {currentRole === 'super_admin' && (
            <button
              onClick={() => { setActiveAdminTab('slides'); resetFormState(); }}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'slides' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 text-neutral-500'
                }`}
            >
              <Sliders className="w-4 h-4" /> Slider Manager
            </button>
          )}
          {currentRole === 'super_admin' && (
            <button
              onClick={() => { setActiveAdminTab('institutions'); resetFormState(); setSelectedInstId(null); }}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'institutions' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 text-neutral-500'
                }`}
            >
              <School className="w-4 h-4" /> Institutions Portal Port
            </button>
          )}
          <button
            onClick={() => { setActiveAdminTab('categories'); resetFormState(); }}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'categories' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 text-neutral-500'
              }`}
          >
            <BookOpen className="w-4 h-4" /> SKU Category Schema
          </button>

          {currentRole === 'super_admin' && (
            <button
              onClick={() => { setActiveAdminTab('settings'); resetFormState(); }}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'settings' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 text-neutral-500'
                }`}
            >
              <Settings className="w-4 h-4" /> Tenant Config
            </button>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* PANEL VIEWPORTS */}
        {/* ---------------------------------------------------- */}
        <div className="mt-8">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Widgets 1 */}
                <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Total Portals</span>
                  <span className="block text-3xl font-extrabold font-sans tracking-tight text-neutral-900 dark:text-white mt-1">
                    {institutions.length}
                  </span>
                  <div className="mt-3 text-[10px] font-mono text-green-500 flex items-center gap-1 leading-none">
                    <CheckCircle2 className="w-3 h-3" /> {institutions.filter(i => i.isVerified).length} Verified
                  </div>
                </div>

                {/* Widgets 2 */}
                <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">SKU Uniform items</span>
                  <span className="block text-3xl font-extrabold font-sans tracking-tight text-neutral-900 dark:text-white mt-1">
                    {uniforms.length}
                  </span>
                  <span className="block text-[10px] font-mono text-neutral-400 mt-3 leading-none truncate block">
                    {uniforms.filter(u => u.isArchived).length} Archived
                  </span>
                </div>



                {/* Widgets 5 */}
                <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Target Slides</span>
                  <span className="block text-3xl font-extrabold font-sans tracking-tight text-neutral-900 dark:text-white mt-1">
                    {slides.length}
                  </span>
                  <span className="block text-[10px] font-mono text-neutral-400 mt-3 leading-none block">
                    {slides.filter(s => s.isActive).length} Active Deck
                  </span>
                </div>
              </div>

              {/* Graphic SVG Plot Trends */}
              {(() => {
                const graphData = institutions.map(inst => ({
                  name: inst.slug || inst.name.substring(0, 8),
                  count: uniforms.filter(u => u.institutionId === inst.id).length
                })).sort((a, b) => b.count - a.count).slice(0, 5);
                const maxCount = Math.max(...graphData.map(d => d.count), 1);

                return (
                  <div className="bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl p-6">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <h4 className="text-base font-extrabold uppercase font-sans text-neutral-900 dark:text-white">Institution Expansion Graph</h4>
                        <p className="text-xs text-neutral-400">Top portals by SKU uniform count</p>
                      </div>
                      <div className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-xs font-mono font-bold">Dynamic Trends</div>
                    </div>

                    {/* Simple compliant bar graph */}
                    <div className="h-60 flex items-end justify-between gap-4 pt-4 border-b border-neutral-100 dark:border-neutral-900">
                      {graphData.length === 0 ? (
                        <div className="w-full text-center text-neutral-400 text-xs pb-4">No data available</div>
                      ) : (
                        graphData.map((data, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                            <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">{data.count}</span>
                            <div 
                              className={`w-full transition-all rounded-t-lg ${idx === 0 ? 'bg-black dark:bg-white' : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-800 dark:group-hover:bg-neutral-700'}`} 
                              style={{ height: `${(data.count / maxCount) * 80 + 5}%` }} 
                            />
                            <span className={`text-[10px] font-mono truncate w-full text-center ${idx === 0 ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-400'}`}>
                              {data.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: HERO SLIDER MANAGEMENT */}
          {activeAdminTab === 'slides' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold font-sans">Active Hero Slide Elements</h3>
                {!showAddForm && (
                  <button
                    onClick={() => { setShowAddForm(true); setEditingId(null); }}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-xs font-bold leading-none flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slide Card
                  </button>
                )}
              </div>

              {/* Form panel */}
              {showAddForm && (
                <form onSubmit={handleCreateOrEditSlide} className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider">{editingId ? 'Edit Hero Slide' : 'Create New Hero Slide (Up to 10 Slides supported)'}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Slide Main Title *</label>
                      <input
                        type="text"
                        required
                        value={slideForm.title}
                        onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Subtitle Small Label</label>
                      <input
                        type="text"
                        value={slideForm.subtitle}
                        onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <CloudinaryUpload 
                      label="Background Image URL *"
                      defaultPreview={slideForm.image}
                      onUploadSuccess={(url) => setSlideForm({ ...slideForm, image: url })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-neutral-400">Description Copy text</label>
                    <textarea
                      rows={2}
                      value={slideForm.description}
                      onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Button CTA Label</label>
                      <input
                        type="text"
                        value={slideForm.buttonText}
                        onChange={(e) => setSlideForm({ ...slideForm, buttonText: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Button CTA Link URL</label>
                      <input
                        type="text"
                        value={slideForm.buttonLink}
                        onChange={(e) => setSlideForm({ ...slideForm, buttonLink: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Display Order index</label>
                      <input
                        type="number"
                        value={slideForm.displayOrder}
                        onChange={(e) => setSlideForm({ ...slideForm, displayOrder: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold leading-none"
                    >
                      {editingId ? 'Update Slide' : 'Publish Slide'}
                    </button>
                    <button
                      type="button"
                      onClick={resetFormState}
                      className="px-4 py-2 border rounded-lg text-xs font-sans text-neutral-500 hover:bg-neutral-50 leading-none"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Table list of slides */}
              <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900/60 font-mono uppercase text-neutral-400 border-b border-neutral-150 dark:border-neutral-900">
                      <th className="p-4">Rank</th>
                      <th className="p-4">Slide Visuals</th>
                      <th className="p-4">Subtitle & Heading</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150 dark:divide-neutral-900">
                    {slides.sort((a, b) => a.displayOrder - b.displayOrder).map(slide => (
                      <tr key={slide.id} className="hover:bg-neutral-50/50">
                        <td className="p-4 font-mono font-bold text-neutral-500">#{slide.displayOrder}</td>
                        <td className="p-4">
                          <img src={slide.image} className="w-20 h-11 object-cover rounded-md border border-neutral-200" />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-neutral-800 dark:text-neutral-100">{slide.title}</div>
                          <div className="text-[10px] font-mono text-neutral-400 mt-1">{slide.subtitle}</div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleSlideActive(slide.id)}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold border transition-colors ${slide.isActive
                                ? 'bg-green-500/10 text-green-500 border-green-500/10'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                              }`}
                          >
                            {slide.isActive ? 'Active' : 'Paused'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditTrigger('slide', slide)}
                            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 dark:text-neutral-300"
                            title="Edit specs"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INSTITUTIONS MANAGEMENT */}
          {activeAdminTab === 'institutions' && !selectedInstId && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold font-sans">Verified Institutions Stack</h3>
                {!showAddForm && (
                  <button
                    onClick={() => { setShowAddForm(true); setEditingId(null); }}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-xs font-bold leading-none flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Enlist New Institution
                  </button>
                )}
              </div>

              {/* Form block */}
              {showAddForm && (
                <form onSubmit={handleCreateOrEditInst} className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider">{editingId ? 'Edit Institution Metadata' : 'Enlist New Verified Institution'}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Institution Registered Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bahona College"
                        value={instForm.name}
                        onChange={(e) => setInstForm({ ...instForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Slug path token (autogenerated)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. bahona-college"
                        value={instForm.slug}
                        onChange={(e) => setInstForm({ ...instForm, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <CloudinaryUpload 
                        label="Logo URL *"
                        defaultPreview={instForm.logo}
                        onUploadSuccess={(url) => setInstForm({ ...instForm, logo: url })}
                      />
                    </div>
                    <div className="space-y-1">
                      <CloudinaryUpload 
                        label="Banner URL *"
                        defaultPreview={instForm.banner}
                        onUploadSuccess={(url) => setInstForm({ ...instForm, banner: url })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Campus Address *</label>
                      <input
                        type="text"
                        required
                        value={instForm.address}
                        onChange={(e) => setInstForm({ ...instForm, address: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">City *</label>
                      <input
                        type="text"
                        required
                        value={instForm.city}
                        onChange={(e) => setInstForm({ ...instForm, city: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={instForm.pincode}
                        onChange={(e) => setInstForm({ ...instForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Campus Official Website URL</label>
                      <input
                        type="url"
                        value={instForm.website}
                        onChange={(e) => setInstForm({ ...instForm, website: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Email Address</label>
                      <input
                        type="email"
                        value={instForm.email}
                        onChange={(e) => setInstForm({ ...instForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Phone Hotline</label>
                      <input
                        type="text"
                        value={instForm.phone}
                        onChange={(e) => setInstForm({ ...instForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Descriptions, missions and visions */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-neutral-400">Institution Profile / Description</label>
                    <textarea
                      rows={2}
                      value={instForm.description}
                      onChange={(e) => setInstForm({ ...instForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Academic Mission Statement</label>
                      <textarea
                        rows={2}
                        value={instForm.mission}
                        onChange={(e) => setInstForm({ ...instForm, mission: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Campus Vision Concept</label>
                      <textarea
                        rows={2}
                        value={instForm.vision}
                        onChange={(e) => setInstForm({ ...instForm, vision: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold leading-none"
                    >
                      {editingId ? 'Save Edits' : 'Enlist Portal'}
                    </button>
                    <button
                      type="button"
                      onClick={resetFormState}
                      className="px-4 py-2 border rounded-lg text-xs text-neutral-500 hover:bg-neutral-50 leading-none"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* List table */}
              <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900/60 font-mono uppercase text-neutral-400 border-b border-neutral-150 dark:border-neutral-900">
                      <th className="p-4">Logo</th>
                      <th className="p-4">Name & Address</th>
                      <th className="p-4">Verification</th>
                      <th className="p-4">Banner</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Suspended</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150 dark:divide-neutral-900">
                    {institutions.map(inst => (
                      <tr key={inst.id} className="hover:bg-neutral-50/50 cursor-pointer" onClick={() => { setSelectedInstId(inst.id); resetFormState(); }}>
                        <td className="p-4 flex items-center gap-3">
                          <img src={inst.logo} className="w-10 h-10 object-cover rounded-lg border bg-white" />
                          <div>
                            <span className="font-bold text-neutral-800 dark:text-neutral-100">{inst.name}</span>
                            <span className="block text-[9px] uppercase font-mono text-neutral-400 mt-0.5">{inst.slug}</span>
                          </div>
                        </td>
                        <td className="p-4 font-sans text-neutral-700 dark:text-neutral-300">
                          {inst.city}, {inst.state}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleVerifyToggleInst(inst.id); }}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold border transition-colors ${inst.isVerified
                                ? 'bg-green-500/10 text-green-500 border-green-500/10'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                              }`}
                          >
                            {inst.isVerified ? 'Verified' : 'Unverified'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleTrustedToggleInst(inst.id); }}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold border transition-colors ${inst.isTrusted
                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/10'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                              }`}
                          >
                            {inst.isTrusted ? 'Trusted' : 'Hidden'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleFeaturedToggleInst(inst.id); }}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold border transition-colors ${inst.isFeatured
                                ? 'bg-purple-500/10 text-purple-500 border-purple-500/10'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                              }`}
                          >
                            {inst.isFeatured ? 'Featured' : 'Hidden'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSuspendToggleInst(inst.id); }}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold border transition-colors ${inst.isSuspended
                                ? 'bg-amber-500/15 text-amber-500 border-amber-500/15'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                              }`}
                          >
                            {inst.isSuspended ? 'Suspended' : 'Active'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEditTrigger('inst', inst)}
                            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 dark:text-neutral-300"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInst(inst.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: UNIFORM SKU CATALOGUE (Now nested under Institutions) */}
          {activeAdminTab === 'institutions' && selectedInstId && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => { setSelectedInstId(null); resetFormState(); }}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 rounded-lg text-xs font-bold font-sans transition-colors flex items-center gap-1 text-neutral-600 dark:text-neutral-300"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to Institutions List
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold font-sans">
                  {institutions.find(i => i.id === selectedInstId)?.name} - Uniform Catalog
                </h3>
                {!showAddForm && (
                  <button
                    onClick={() => { setShowAddForm(true); setEditingId(null); }}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-xs font-bold leading-none flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Integrate New Uniform SKU
                  </button>
                )}
              </div>

              {/* Form trigger layout */}
              {showAddForm && (
                <form onSubmit={handleCreateOrEditUniform} className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider">{editingId ? 'Edit Uniform Details' : 'Integrate New Uniform SKU'}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Garment Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Formal Boys Shirt"
                        value={uniForm.name}
                        onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Fabric Type</label>
                      <input
                        type="text"
                        placeholder="e.g. 100% Cotton, Standard Blend"
                        value={uniForm.fabricType}
                        onChange={(e) => setUniForm({ ...uniForm, fabricType: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Garment Category *</label>
                      <select
                        value={uniForm.categoryId}
                        onChange={(e) => setUniForm({ ...uniForm, categoryId: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Target Gender Segment *</label>
                      <select
                        value={uniForm.gender}
                        onChange={(e) => setUniForm({ ...uniForm, gender: e.target.value as any })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      >
                        <option value="boys">Boys</option>
                        <option value="girls">Girls</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Price (INR) *</label>
                      <input
                        type="number"
                        required
                        value={uniForm.price}
                        onChange={(e) => setUniForm({ ...uniForm, price: parseInt(e.target.value) || 1, discountPrice: undefined })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                      />
                    </div>

                    {/* Stock switch */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400 flex items-center">Archive Status</label>
                      <div className="pt-2">
                        <label className="inline-flex items-center cursor-pointer gap-2">
                          <input
                            type="checkbox"
                            checked={uniForm.isArchived}
                            onChange={(e) => setUniForm({ ...uniForm, isArchived: e.target.checked })}
                            className="rounded border-neutral-300 dark:border-neutral-800 text-black focus:ring-0 w-4 h-4"
                          />
                          <span className="text-xs">Archive SKU</span>
                        </label>
                      </div>
                    </div>

                    {/* Show on Homepage switch */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400 flex items-center">Homepage Display</label>
                      <div className="pt-2">
                        <label className="inline-flex items-center cursor-pointer gap-2">
                          <input
                            type="checkbox"
                            checked={uniForm.showOnHomepage !== false}
                            onChange={(e) => setUniForm({ ...uniForm, showOnHomepage: e.target.checked })}
                            className="rounded border-neutral-300 dark:border-neutral-800 text-black focus:ring-0 w-4 h-4"
                          />
                          <span className="text-xs">Show on Homepage</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sizing Checkboxes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block pb-1">Available Authorized Sizes *</label>
                    <div className="flex flex-wrap gap-4 text-xs">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48'].map(sz => (
                        <label key={sz} className="inline-flex items-center gap-1.5 cursor-pointer font-semibold font-sans">
                          <input
                            type="checkbox"
                            checked={uniForm.availableSizes.includes(sz)}
                            onChange={() => handleSizeCheckboxToggle(sz)}
                            className="rounded text-black focus:ring-0 w-4 h-4 shrink-0"
                          />
                          <span>{sz}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Multi images URLs */}
                  <div className="space-y-1 bg-neutral-50 dark:bg-black/30 p-4 rounded-xl border border-neutral-150 dark:border-neutral-900">
                    <span className="block text-[10px] uppercase font-mono text-neutral-400 mb-3">Multi-View Image Bindings (Images)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {/* Main */}
                      <div className="space-y-1">
                        <CloudinaryUpload 
                          label="Main Display Image *"
                          defaultPreview={uniForm.images.main}
                          onUploadSuccess={(url) => setUniForm({ ...uniForm, images: { ...uniForm.images, main: url } })}
                        />
                      </div>
                      {/* Front */}
                      <div className="space-y-1">
                        <CloudinaryUpload 
                          label="Front View Image"
                          defaultPreview={uniForm.images.front}
                          onUploadSuccess={(url) => setUniForm({ ...uniForm, images: { ...uniForm.images, front: url } })}
                        />
                      </div>
                      {/* Back */}
                      <div className="space-y-1">
                        <CloudinaryUpload 
                          label="Back View Image"
                          defaultPreview={uniForm.images.back}
                          onUploadSuccess={(url) => setUniForm({ ...uniForm, images: { ...uniForm.images, back: url } })}
                        />
                      </div>
                      {/* Side */}
                      <div className="space-y-1">
                        <CloudinaryUpload 
                          label="Side View Image"
                          defaultPreview={uniForm.images.side}
                          onUploadSuccess={(url) => setUniForm({ ...uniForm, images: { ...uniForm.images, side: url } })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-neutral-400">Detailed Description / Fit specifications</label>
                    <textarea
                      rows={2}
                      value={uniForm.description}
                      onChange={(e) => setUniForm({ ...uniForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold leading-none"
                    >
                      {editingId ? 'Save SKU Specs' : 'Integrate SKU'}
                    </button>
                    <button
                      type="button"
                      onClick={resetFormState}
                      className="px-4 py-2 border rounded-lg text-xs text-neutral-500 hover:bg-neutral-50 leading-none"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Grid table */}
              <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900/60 font-mono uppercase text-neutral-400 border-b border-neutral-150 dark:border-neutral-900">
                      <th className="p-4">SKU Code</th>
                      <th className="p-4">Uniform Profile</th>
                      <th className="p-4">Pricing</th>
                      <th className="p-4">Homepage</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150 dark:divide-neutral-900">
                    {uniforms.filter(u => u.institutionId === selectedInstId).map(uni => (
                      <tr key={uni.id} className="hover:bg-neutral-50/50">
                        <td className="p-4 font-mono font-bold">{uni.sku}</td>
                        <td className="p-4 flex items-center gap-3">
                          <img src={uni.images.main} className="w-10 h-10 object-cover rounded-lg border" />
                          <div>
                            <span className="font-bold text-neutral-800 dark:text-neutral-100">{uni.name}</span>
                            <span className="block text-[9px] uppercase font-mono text-neutral-400 mt-0.5">{uni.gender}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-neutral-800 dark:text-neutral-200">
                          {uni.discountPrice ? (
                            <span>₹{uni.discountPrice} <span className="text-[9px] line-through text-neutral-400">₹{uni.price}</span></span>
                          ) : `₹${uni.price}`}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              const updated = uniforms.map(u => u.id === uni.id ? { ...u, showOnHomepage: u.showOnHomepage === false } : u);
                              setUniforms(updated);
                              triggerToast('Uniform homepage visibility updated.');
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border transition-colors ${uni.showOnHomepage !== false ? 'bg-green-500/10 text-green-500 border-green-500/10 hover:bg-green-500/20' : 'bg-neutral-100 text-neutral-400 border-neutral-200 hover:bg-neutral-200'}`}
                          >
                            {uni.showOnHomepage !== false ? 'Featured' : 'Hidden'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleDuplicateUniform(uni)}
                            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 dark:text-neutral-300"
                            title="Duplicate Copy"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleArchiveToggleUniform(uni.id)}
                            className={`p-1.5 hover:bg-neutral-100 rounded text-neutral-600 dark:text-neutral-300 ${uni.isArchived ? 'opacity-30' : ''}`}
                            title="Archive"
                          >
                            <Eye className="w-4 h-4-sm" />
                          </button>
                          <button
                            onClick={() => handleEditTrigger('uniform', uni)}
                            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600 dark:text-neutral-300"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUniform(uni.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIES SCHEMA EDITOR */}
          {activeAdminTab === 'categories' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
              <h3 className="text-lg font-bold font-sans">SaaS Custom Categories Editor</h3>

              <form onSubmit={handleAddCategory} className="flex gap-4 p-4 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] uppercase font-mono text-neutral-400">New Category Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Winter Pullovers"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold leading-none shrink-0"
                >
                  {editingId ? 'Save Changes' : 'Create Class'}
                </button>
              </form>

              {/* Categories list */}
              <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl">
                <span className="block text-[10px] uppercase font-mono text-neutral-400 mb-4 pb-2 border-b">Active System Slices</span>
                <div className="space-y-2">
                  {categories.map((cat, index) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-black/50 border border-neutral-100 rounded-xl">
                      <div>
                        <span className="text-xs font-sans font-bold text-neutral-800 dark:text-neutral-100">{cat.name}</span>
                        <span className="block text-[9px] font-mono text-neutral-450 mt-1 uppercase">Slug Ref: {cat.slug}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setNewCatName(cat.name);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded transition-colors"
                          title="Edit class"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                          title="Delete class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CAMPUS NOTICE BOARD ANNUNCIATOR */}
          {activeAdminTab === 'notices' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold font-sans">Official Calendar Announcement Feeds</h3>
                {!showAddForm && (
                  <button
                    onClick={() => { setShowAddForm(true); setEditingId(null); }}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-xs font-bold leading-none flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish New Pinned Notice
                  </button>
                )}
              </div>

              {showAddForm && (
                <form onSubmit={handleCreateNotice} className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider">{editingId ? 'Edit Broadcaster Pinned Announcement' : 'Publish New Campus Board Announcement'}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Assigned Target Institution *</label>
                      <select
                        value={noticeForm.institutionId}
                        onChange={(e) => setNoticeForm({ ...noticeForm, institutionId: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      >
                        {institutions.map(inst => (
                          <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Announcement Header Line *</label>
                      <input
                        type="text"
                        required
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Attachment Brochure Spec URL (Optional)</label>
                      <input
                        type="url"
                        value={noticeForm.attachment || ''}
                        onChange={(e) => setNoticeForm({ ...noticeForm, attachment: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-neutral-400">Publish Date Codex</label>
                      <input
                        type="date"
                        required
                        value={noticeForm.publishDate}
                        onChange={(e) => setNoticeForm({ ...noticeForm, publishDate: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-neutral-400">Editorial Announcement Content *</label>
                    <textarea
                      rows={3}
                      required
                      value={noticeForm.description}
                      onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold leading-none"
                    >
                      {editingId ? 'Modify Post' : 'Announce Live'}
                    </button>
                    <button
                      type="button"
                      onClick={resetFormState}
                      className="px-4 py-2 border rounded-lg text-xs text-neutral-500 hover:bg-neutral-50 leading-none"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Table broads list */}
              <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900/60 font-mono uppercase text-neutral-400 border-b border-neutral-150 dark:border-neutral-900">
                      <th className="p-4">Issuer Institution</th>
                      <th className="p-4">Title Header</th>
                      <th className="p-4">Issued date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150 dark:divide-neutral-900">
                    {notices.map(not => (
                      <tr key={not.id} className="hover:bg-neutral-50/50">
                        <td className="p-4 font-bold text-neutral-700 dark:text-neutral-300">
                          {institutions.find(i => i.id === not.institutionId)?.name || 'General Broadcaster'}
                        </td>
                        <td className="p-4 font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-sm">
                          {not.title}
                        </td>
                        <td className="p-4 font-mono">{not.publishDate}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditTrigger('notice', not)}
                            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(not.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 8: CONTACT SUBMISSIONS */}
          {activeAdminTab === 'contacts' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold font-sans">Institutional Partner Submissions Log</h3>

              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-neutral-950 border rounded-3xl">
                    <Mail className="w-12 h-12 text-neutral-300 mx-auto" />
                    <p className="text-neutral-500 dark:text-neutral-400 font-sans mt-3">No submissions received in the buffer database.</p>
                  </div>
                ) : (
                  contacts.map(c => (
                    <div
                      key={c.id}
                      className={`p-6 border rounded-2xl space-y-4 transition-all bg-white dark:bg-neutral-950 ${c.isRead ? 'border-neutral-200 dark:border-neutral-900 opacity-70' : 'border-red-400'
                        }`}
                    >
                      <div className="flex items-start justify-between border-b pb-3">
                        <div>
                          <h4 className="text-sm sm:text-base font-sans font-bold flex items-center gap-2">
                            {c.name}
                            {!c.isRead && (
                              <span className="text-[8px] font-mono uppercase bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded-md tracking-wider">Unread</span>
                            )}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase block leading-none">
                            {c.email} • {c.institutionName || 'Self-Represented Individual'}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">{c.date}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed font-sans mt-2">
                        "{c.message}"
                      </p>

                      <div className="flex items-center gap-4 pt-4 border-t mt-4 justify-end">
                        {!c.isRead && (
                          <button
                            onClick={() => handleMarkContactAsRead(c.id)}
                            className="px-3.5 py-1.5 bg-neutral-100 hover:bg-black hover:text-white dark:bg-neutral-900 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 font-bold leading-none flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Reviewed
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="px-3.5 py-1.5 text-xs text-red-500 hover:bg-neutral-50 rounded-lg font-bold leading-none flex items-center gap-1 border border-transparent hover:border-neutral-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Purge Logs
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS PANEL */}
          {activeAdminTab === 'settings' && (
            <form
              onSubmit={(e) => { e.preventDefault(); triggerToast('Core system configurations saved.'); }}
              className="p-6 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-900 rounded-3xl space-y-6 animate-fadeIn max-w-4xl mx-auto"
            >
              <div>
                <h3 className="text-lg font-extrabold font-sans">System Configurations & SEO Panel</h3>
                <p className="text-xs text-neutral-400">Deploy changes across primary branding titles, WhatsApp forwarding indexes, and search spiders.</p>
              </div>

              {/* Brand coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <CloudinaryUpload 
                    label="Main Logo Image"
                    defaultPreview={settings.logoImage}
                    onUploadSuccess={(url) => setSettings({ ...settings, logoImage: url })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-neutral-400">Main Logo text</label>
                  <input
                    type="text"
                    required
                    value={settings.logoText}
                    onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-extrabold uppercase font-sans text-neutral-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-neutral-400 font-sans">Subtitle Logo trim</label>
                  <input
                    type="text"
                    required
                    value={settings.logoSubText}
                    onChange={(e) => setSettings({ ...settings, logoSubText: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-neutral-400">Order WhatsApp Target (with country-code) *</label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Support info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-neutral-400">Support Desk Email</label>
                  <input
                    type="email"
                    required
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-neutral-400">Helpline phone</label>
                  <input
                    type="text"
                    required
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-neutral-400">Main Registered Headquarters Address</label>
                <input
                  type="text"
                  required
                  value={settings.contactAddress}
                  onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-black border rounded-lg text-xs"
                />
              </div>

              {/* SEO parameters */}
              <div className="p-4 bg-neutral-50 dark:bg-black/30 border border-neutral-150 dark:border-neutral-900 rounded-xl space-y-4 pt-4 border-t">
                <span className="block text-[10px] uppercase font-mono text-neutral-400 mb-2">Metadata SEO configs & Search Indexing</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-neutral-400">Meta Title Header</label>
                    <input
                      type="text"
                      required
                      value={settings.seo.metaTitle}
                      onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: e.target.value } })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-black border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <CloudinaryUpload 
                      label="OG Graph Card Image URL"
                      defaultPreview={settings.seo.ogImage}
                      onUploadSuccess={(url) => setSettings({ ...settings, seo: { ...settings.seo, ogImage: url } })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-neutral-400">Meta Crawler Description (150 chars max recommended)</label>
                  <textarea
                    rows={2}
                    required
                    value={settings.seo.metaDescription}
                    onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: e.target.value } })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-black border rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-widest leading-none mt-4 transition-colors shadow-lg"
              >
                Save configurations
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
