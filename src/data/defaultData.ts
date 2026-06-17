import { HeroSlide, Institution, UniformCategory, Uniform, InstitutionNotice, GalleryItem, ContactSubmission, WebsiteSettings } from '../types';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'School Uniforms Elite',
    subtitle: 'OFFICIAL CAMPUS LINE',
    description: 'Shop official institution-approved uniforms with verified quality and seamless online ordering. Engineered for comfort and daily academic performance.',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200',
    buttonText: 'Find Uniforms',
    buttonLink: '#uniforms',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'slide-2',
    title: 'College Blazer & Formals',
    subtitle: 'ACADEMIC EXCELLENCE',
    description: 'Dressing the future leaders. Premium college uniforms, custom blazers, and professional wear tailored to perfection utilizing selected breathable fabrics.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    buttonText: 'Partner With Us',
    buttonLink: '#contact',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'slide-3',
    title: 'Sports & Athletics Kits',
    subtitle: 'PERFORMANCE WEAR',
    description: 'Dynamic team jerseys, athletic shorts, and tracking gear representing your institutional colors with sweat-wicking advanced dry-fit performance fabrics.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200',
    buttonText: 'Browse Kits',
    buttonLink: '#uniforms',
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'slide-4',
    title: 'Lab Coats & Professional Care',
    subtitle: 'SCIENTIFIC & MEDICAL',
    description: 'Premium anti-static lab coats, medical scrubs, and technical attire tailored for scientific exploration, university clinics, and experimental laboratories.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200',
    buttonText: 'Shop Professional',
    buttonLink: '#uniforms',
    displayOrder: 4,
    isActive: true
  },
  {
    id: 'slide-5',
    title: 'Institution Partnerships',
    subtitle: 'ENTERPRISE SOLUTIONS',
    description: 'Equip your entire organization with customized portal ordering. Experience 100% compliance, premium quality control, and zero administration hassle.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    buttonText: 'Apply For Partnership',
    buttonLink: '#contact',
    displayOrder: 5,
    isActive: true
  }
];

export const DEFAULT_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    name: 'Bahona College',
    slug: 'bahona-college',
    logo: 'https://images.unsplash.com/photo-1594312915251-48db9280c8f1?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000',
    address: 'Post Office Bahona, J.B. Road',
    city: 'Jorhat',
    state: 'Assam',
    pincode: '785101',
    website: 'https://www.bahonacollege.edu.in',
    email: 'info@bahonacollege.edu.in',
    phone: '+91 98765 43210',
    description: 'A premier institute of higher education in Assam dedicated to fostering academic excellence, holistic personal growth, and social responsibility.',
    mission: 'To impart quality higher education, develop professional competency, and integrate traditional moral values with contemporary skills.',
    vision: 'To build an enlightened, equitable society through continuous higher learning, research orientation, and active community outreach.',
    isVerified: true,
    isSuspended: false
  },
  {
    id: 'inst-2',
    name: 'Cotton University',
    slug: 'cotton-university',
    logo: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
    address: 'Panbazar, Near Dighalipukhuri',
    city: 'Guwahati',
    state: 'Assam',
    pincode: '781001',
    website: 'https://cottonuniversity.ac.in',
    email: 'admin@cottonuniversity.ac.in',
    phone: '+91 361 224466',
    description: 'Cotton University is a highly prestigious public state university focused on outstanding academic lineages, pioneering scientific research, and liberal arts.',
    mission: 'To sustain cottonian legacy through cutting-edge educational models, modern technical laboratory practices, and robust sports integration.',
    vision: 'To serve as a major global epicenter for intellectual development, creative thinking, and path-breaking research in Eastern India.',
    isVerified: true,
    isSuspended: false
  },
  {
    id: 'inst-3',
    name: 'Dibrugarh University',
    slug: 'dibrugarh-university',
    logo: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&q=80&w=1000',
    address: 'Rajabheta, National Highway 37',
    city: 'Dibrugarh',
    state: 'Assam',
    pincode: '786004',
    website: 'https://dibru.ac.in',
    email: 'registrar@dibru.ac.in',
    phone: '+91 373 237023',
    description: 'Established in 1965, Dibrugarh University is the easternmost university in India, offering state-of-the-art vocational programs, industrial linkages, and cultural studies.',
    mission: 'To offer industry-relevant curriculum, nurture innovation, and establish specialized centers for oil and tea research studies.',
    vision: 'To emerge as an elite global platform for comprehensive academic learning, advanced technical training, and cultural conservation.',
    isVerified: true,
    isSuspended: false
  },
  {
    id: 'inst-4',
    name: 'Don Bosco School',
    slug: 'don-bosco-school',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000',
    address: 'Sogane Path, Kharghuli',
    city: 'Guwahati',
    state: 'Assam',
    pincode: '781004',
    website: 'https://donboscoguwahati.net',
    email: 'principal@donboscoguwahati.net',
    phone: '+91 94350 49121',
    description: 'An outstanding nursery to secondary co-educational institute emphasizing mental health, leadership skills, structural discipline, and spiritual integrity.',
    mission: 'To prepare young boys and girls to become responsible citizens of character, dedication, moral conviction, and technical aptitude.',
    vision: 'A premier educational ecosystem grounded in Salesian pedagogy, fostering empathetic collaboration, intellectual brilliance, and moral focus.',
    isVerified: true,
    isSuspended: false
  },
  {
    id: 'inst-5',
    name: 'Nirmala Convent School',
    slug: 'nirmala-convent-school',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1000',
    address: 'C.R. Avenue, Civil Crossway',
    city: 'Silchar',
    state: 'Assam',
    pincode: '788005',
    website: 'https://nirmalaconventsilchar.org',
    email: 'nirmalaconvent@outlook.com',
    phone: '+91 3842 260515',
    description: 'Nirmala Convent School offers structured holistic education focusing on female empowerment, collaborative arts, high technological literacy, and community building.',
    mission: 'To inspire scholastic heights and ethical standardizations, nurturing intellectual agility in a disciplined loving climate.',
    vision: 'Empowering children with comprehensive knowledge systems, self-reliance, emotional stability, and compassionate community responsibility.',
    isVerified: true,
    isSuspended: false
  }
];

export const DEFAULT_CATEGORIES: UniformCategory[] = [
  { id: 'cat-1', name: 'School Boys Uniform', slug: 'school-boys-uniform' },
  { id: 'cat-2', name: 'School Girls Uniform', slug: 'school-girls-uniform' },
  { id: 'cat-3', name: 'College Uniform', slug: 'college-uniform' },
  { id: 'cat-4', name: 'Sports Uniform', slug: 'sports-uniform' },
  { id: 'cat-5', name: 'Lab Coat', slug: 'lab-coat' },
  { id: 'cat-6', name: 'Blazer Collection', slug: 'blazer' },
  { id: 'cat-7', name: 'Accessories', slug: 'accessories' }
];

export const DEFAULT_UNIFORMS: Uniform[] = [
  {
    id: 'uni-1',
    institutionId: 'inst-1', // Bahona College
    name: 'Formal Boys College Uniform',
    sku: 'BC-FORMAL-BOY-01',
    categoryId: 'cat-3',
    gender: 'boys',
    description: 'Premium formal sky blue shirt with white trim paired with tailored dark navy trousers. Built with premium ultra-soft cotton-blend fabric for long study hours.',
    fabricType: '60% Cotton, 40% Polyester Premium Royal Blend',
    price: 1850,
    discountPrice: 1650,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stockQuantity: 150,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=600',
      front: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=600',
      back: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
      side: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600',
      gallery: [
        'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600'
      ]
    }
  },
  {
    id: 'uni-2',
    institutionId: 'inst-1', // Bahona College
    name: 'Formal Girls College Uniform',
    sku: 'BC-FORMAL-GIRL-01',
    categoryId: 'cat-3',
    gender: 'girls',
    description: 'Classic sky-blue Kurti with structured high collar, paired elegantly with comfortable navy-blue leggings and draped cotton dupatta.',
    fabricType: '100% Breathable Cotton Handspun Blend',
    price: 1750,
    discountPrice: 1590,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockQuantity: 120,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      front: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      back: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=600',
      gallery: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=600'
      ]
    }
  },
  {
    id: 'uni-3',
    institutionId: 'inst-1', // Bahona College
    name: 'Bahona Collegiate Sports Tracksuit',
    sku: 'BC-SPORTS-TRACK-02',
    categoryId: 'cat-4',
    gender: 'unisex',
    description: 'Heavy duty, dry-fit athletic tracksuit with moisture-wicking capability. Designed in royal blue with gold brand accent piping.',
    fabricType: '100% Interlock Tech Polyester',
    price: 2400,
    discountPrice: 2100,
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockQuantity: 80,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      gallery: []
    }
  },
  {
    id: 'uni-4',
    institutionId: 'inst-2', // Cotton University
    name: 'Cottonian Royal Blazer Coat',
    sku: 'CU-BLAZER-ELITE-05',
    categoryId: 'cat-6',
    gender: 'unisex',
    description: 'Elite royal navy heavy blazer complete with brass embossed custom Cotton University insignia buttons and inside pocketing structures.',
    fabricType: 'Premium Wool Blend Tweed & Viscose Lining',
    price: 3800,
    discountPrice: 3499,
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    stockQuantity: 200,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      front: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      back: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=600',
      gallery: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
      ]
    }
  },
  {
    id: 'uni-5',
    institutionId: 'inst-2', // Cotton University
    name: 'Scientific Research White Lab Coat',
    sku: 'CU-LAB-COAT-09',
    categoryId: 'cat-5',
    gender: 'unisex',
    description: 'Professional anti-wrinkle, acid-resistant white lab coat featuring three reinforced utility pockets and custom side accesses.',
    fabricType: 'Thick Twilled Cotton-Polyester Blend',
    price: 950,
    discountPrice: 850,
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockQuantity: 340,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1581093588401-f3c22d7a224a?auto=format&fit=crop&q=80&w=600',
      gallery: []
    }
  },
  {
    id: 'uni-6',
    institutionId: 'inst-3', // Dibrugarh University
    name: 'Dibrugarh University Fine Polo Shirt',
    sku: 'DU-POLO-ATH-01',
    categoryId: 'cat-4',
    gender: 'unisex',
    description: 'High elasticity, collared athletic polo with embroidered varsity sports emblem, designed for sports events and laboratory routines.',
    fabricType: 'Double-Pique Egyptian Cotton Knit',
    price: 890,
    discountPrice: 790,
    availableSizes: ['S', 'M', 'L', 'XL'],
    stockQuantity: 400,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600',
      gallery: []
    }
  },
  {
    id: 'uni-7',
    institutionId: 'inst-4', // Don Bosco School
    name: 'Bosconian Primary School Boys Uniform',
    sku: 'DB-SCH-BOY-01',
    categoryId: 'cat-1',
    gender: 'boys',
    description: 'Starch-free premium white shirt with striped collar, paired with navy blue pleated shorts, complete with standard belt loops.',
    fabricType: 'Mild Cotton Blend Non-Allergenic',
    price: 1250,
    discountPrice: 1100,
    availableSizes: ['24', '26', '28', '30', '32'],
    stockQuantity: 500,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
      gallery: []
    }
  },
  {
    id: 'uni-8',
    institutionId: 'inst-5', // Nirmala Convent School
    name: 'Nirmalian Secondary Girls Uniform Set',
    sku: 'NC-SCH-GIRL-02',
    categoryId: 'cat-2',
    gender: 'girls',
    description: 'Smart grey pinafore dress with high-comfort white inner shirt, custom burgundy tie, and comfortable elastic waist adjusting tabs.',
    fabricType: 'Stain-Resistant Twill Poly-Cotton',
    price: 1450,
    discountPrice: 1300,
    availableSizes: ['26', '28', '30', '32', '34', '36'],
    stockQuantity: 280,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=600',
      gallery: []
    }
  },
  {
    id: 'uni-9',
    institutionId: 'inst-4', // Don Bosco School
    name: 'Official School Monogram Woolen Pullover',
    sku: 'DB-SCH-WINTER-03',
    categoryId: 'cat-6',
    gender: 'unisex',
    description: 'Crimson red soft, non-scratchy school monogrammed pullover sweater. Highly insulated with double stitched cuffs for children.',
    fabricType: '100% Hypoallergenic Cashmilon Wool',
    price: 1150,
    availableSizes: ['28', '30', '32', '34', '36'],
    stockQuantity: 190,
    isArchived: false,
    images: {
      main: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
      gallery: []
    }
  }
];

export const DEFAULT_NOTICES: InstitutionNotice[] = [
  {
    id: 'not-1',
    institutionId: 'inst-1',
    title: 'Approved Uniform Guidelines for 2026 Academic Session',
    description: 'Effective July 2026, all first-semester enrolled students must purchase the certified formal uniform. Zestwear Uniforms portal is the official channel to secure compliance. Do not purchase counterfeit blends as texture matching is strict.',
    publishDate: '2026-06-15'
  },
  {
    id: 'not-2',
    institutionId: 'inst-1',
    title: 'Winter Wear Shift Announcement',
    description: 'Notice is hereby given that the maroon blazers are mandatory across morning prayers starting November 1st. Order yours before September to avoid peak rush shipping.',
    publishDate: '2026-06-10'
  },
  {
    id: 'not-3',
    institutionId: 'inst-2',
    title: 'Cotton University Convocation Gown Collection',
    description: 'Graduating batches may order their ceremonial utility gowns and matching royal blue sash sashes via the Zestwear portal. Bookings close soon.',
    publishDate: '2026-06-05'
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    institutionId: 'inst-1',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=500',
    title: 'Bahona Campus Assembly',
    category: 'campus'
  },
  {
    id: 'gal-2',
    institutionId: 'inst-1',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=500',
    title: 'Annual Sports Parade',
    category: 'event'
  },
  {
    id: 'gal-3',
    institutionId: 'inst-1',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500',
    title: 'Student Union Representatives',
    category: 'institution'
  },
  {
    id: 'gal-4',
    institutionId: 'inst-2',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=500',
    title: 'Cotton Academic Quadrangle',
    category: 'campus'
  }
];

export const DEFAULT_CONTACT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'c-1',
    name: 'Dr. Mukul Chandra Baruah',
    email: 'mukul.baruah@bahona.edu.in',
    institutionName: 'Bahona College, Jorhat',
    message: 'We want to expand the design options for our newly launched vocational wing uniforms. Please contact the commerce hod regarding customized fabrics.',
    date: '2026-06-16',
    isRead: false
  },
  {
    id: 'c-2',
    name: 'Sister Mary Joseph',
    email: 'nirmalaconvent@outlook.com',
    institutionName: 'Nirmala Convent School',
    message: 'We appreciate the immaculate grade standards provided last year. We are planning to initiate secondary level blazers and require physical samples by next week.',
    date: '2026-06-14',
    isRead: true
  }
];

export const DEFAULT_SETTINGS: WebsiteSettings = {
  logoText: 'ZESTWEAR',
  logoSubText: 'UNIFORMS',
  favicon: '⚡',
  contactEmail: 'partnership@zestwearuniforms.com',
  contactPhone: '+91 94355 12121',
  contactAddress: 'T.R. Phukan Road, Jorhat, Assam - 785001',
  whatsappNumber: '919435512121', // exact format for direct url
  socialLinks: {
    instagram: 'https://instagram.com/zestwear_uniforms',
    facebook: 'https://facebook.com/zestwear_uniforms',
    twitter: 'https://twitter.com/zestwear_uni'
  },
  seo: {
    metaTitle: 'Zestwear Uniforms - Premium Institution-Approved Portals',
    metaDescription: 'Shop official campus uniform collections for Bahona College, Cotton University, Dibrugarh University, Don Bosco, and elite institutes with 1-click WhatsApp order generation and zero-hassle supply chains.',
    ogImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'
  }
};
