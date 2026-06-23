/**
 * Types and interfaces for Zestwear Uniforms platform.
 */

export type UserRole = 'guest' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  email: string;
  phone: string;
  description: string;
  mission: string;
  vision: string;
  isVerified: boolean;
  isSuspended: boolean;
  isTrusted?: boolean;
  isFeatured?: boolean;
}

export interface UniformCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Uniform {
  id: string;
  institutionId: string; // "all" for general or specific institution ID
  name: string;
  sku: string;
  categoryId: string; // ref to Categories
  gender: 'boys' | 'girls' | 'unisex';
  description: string;
  fabricType: string;
  price: number;
  discountPrice?: number;
  availableSizes: string[]; // e.g. ["S", "M", "L", "XL"]
  stockQuantity: number;
  isArchived: boolean;
  images: {
    main: string;
    front?: string;
    back?: string;
    side?: string;
    gallery: string[];
  };
}

export interface InstitutionNotice {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  attachment?: string;
  publishDate: string;
}

export interface GalleryItem {
  id: string;
  institutionId: string; // "all" for general, or specific
  image: string;
  title: string;
  category: 'institution' | 'campus' | 'event' | 'uniform';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  institutionName?: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface WebsiteSettings {
  logoImage?: string;
  logoText: string;
  logoSubText: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string; // WhatsApp ordering target
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}
