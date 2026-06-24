import { HeroSlide, Institution, UniformCategory, Uniform, InstitutionNotice, GalleryItem, ContactSubmission, WebsiteSettings } from '../types';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [];

export const DEFAULT_INSTITUTIONS: Institution[] = [];

export const DEFAULT_CATEGORIES: UniformCategory[] = [];

export const DEFAULT_UNIFORMS: Uniform[] = [];

export const DEFAULT_NOTICES: InstitutionNotice[] = [];

export const DEFAULT_GALLERY: GalleryItem[] = [];

export const DEFAULT_CONTACT_SUBMISSIONS: ContactSubmission[] = [];

export const DEFAULT_SETTINGS: WebsiteSettings = {
  logoImage: '',
  logoText: 'ZESTWEAR',
  logoSubText: 'UNIFORMS',
  favicon: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  whatsappNumber: '',
  socialLinks: {},
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  }
};
