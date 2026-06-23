import {
  HeroSlide,
  Institution,
  Uniform,
  UniformCategory,
  InstitutionNotice,
  GalleryItem,
  ContactSubmission,
  WebsiteSettings
} from '../types';

export interface InitialData {
  slides: HeroSlide[];
  institutions: Institution[];
  categories: UniformCategory[];
  uniforms: Uniform[];
  notices: InstitutionNotice[];
  galleryItems: GalleryItem[];
  contacts: ContactSubmission[];
  settings: WebsiteSettings | null;
}

// Fetch all aggregate data from NeonDB backend
export async function fetchInitialData(): Promise<InitialData> {
  const res = await fetch('/api/data');
  if (!res.ok) {
    throw new Error(`Failed to fetch initial data: ${res.statusText}`);
  }
  return res.json();
}

// Send a single contact submission to the database
export async function submitContact(contact: ContactSubmission): Promise<void> {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contact)
  });
  if (!res.ok) {
    throw new Error(`Failed to submit contact message: ${res.statusText}`);
  }
}

// Sync changes to any model list or settings back to NeonDB database
export async function syncData(
  type: 'slides' | 'institutions' | 'uniforms' | 'categories' | 'notices' | 'galleryItems' | 'contacts' | 'settings',
  data: any
): Promise<void> {
  const res = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type, data })
  });
  if (!res.ok) {
    throw new Error(`Failed to sync ${type} data: ${res.statusText}`);
  }
}
