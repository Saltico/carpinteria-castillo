// src/i18n/content.ts
// Contenido de páginas por locale.
// ES: verbatim de site-spec.json (aprobado 2026-11-06, meta.approvedAt).
// EN: copy SEO (title/description) aprobado en el anexo del gate; el resto
//     del contenido visible es traducción formal/corporativa.

import type { IconName } from '@/lib/icons';
import type { Locale, RouteKey } from './ui';

// ─── Tipos ───────────────────────────────────────────────────────────

export interface Cta {
  label: string;
  routeKey: RouteKey;
}

export interface ServiceCard {
  title: string;
  description: string;
  icon: IconName;
  hash: string;
}

export interface ServiceDetail extends ServiceCard {
  id: string;
  features: string[];
}

export type GalleryImageKey =
  | 'closet'
  | 'door-oak'
  | 'table'
  | 'chair'
  | 'bookcase'
  | 'entry-door';

export interface GalleryItem {
  title: string;
  category: string;
  image: GalleryImageKey;
}

interface PageHero {
  heading: string;
  subheading: string;
}

export interface HomePageContent {
  title: string;
  description: string;
  hero: PageHero & { eyebrow: string; cta: Cta };
  servicesPreview: { title: string; moreLabel: string; items: ServiceCard[] };
  projectsPreview: { title: string; cta: Cta };
  contactCta: { title: string; description: string; cta: Cta };
}

export interface ServicesPageContent {
  title: string;
  description: string;
  hero: PageHero;
  details: ServiceDetail[];
}

export interface ProjectsPageContent {
  title: string;
  description: string;
  hero: PageHero;
  gallery: { title: string; note: string; items: GalleryItem[] };
}

export interface ContactChannel {
  channel: 'email' | 'phone' | 'whatsapp';
  label: string;
  description: string;
  actionLabel: string;
}

export interface ContactPageContent {
  title: string;
  description: string;
  hero: PageHero;
  channels: { title: string; note: string; items: ContactChannel[] };
}

// ─── Home ────────────────────────────────────────────────────────────

export const homeContent: Record<Locale, HomePageContent> = {
  es: {
    title: 'Carpintería Castillo | Muebles a medida en madera maciza',
    description:
      'Carpintería artesanal especializada en muebles a medida, puertas de madera maciza y restauración. Diseño, calidad y calidez en cada proyecto.',
    hero: {
      eyebrow: 'Carpintería artesanal',
      heading: 'Muebles a medida con alma de madera',
      subheading:
        'Diseñamos y construimos piezas únicas que transforman tu espacio con la calidez de la madera noble.',
      cta: { label: 'Conoce nuestros servicios', routeKey: 'services' },
    },
    servicesPreview: {
      title: 'Nuestros servicios',
      moreLabel: 'Más información',
      items: [
        {
          title: 'Muebles a medida',
          description: 'Diseño y fabricación de muebles personalizados para cada espacio.',
          icon: 'cabinet',
          hash: 'muebles-a-medida',
        },
        {
          title: 'Puertas',
          description: 'Puertas de madera maciza con terminaciones de alta calidad.',
          icon: 'door',
          hash: 'puertas',
        },
        {
          title: 'Restauración',
          description: 'Devolvemos la vida a piezas antiguas respetando su esencia.',
          icon: 'restore',
          hash: 'restauracion',
        },
      ],
    },
    projectsPreview: {
      title: 'Proyectos recientes',
      cta: { label: 'Ver galería completa', routeKey: 'projects' },
    },
    contactCta: {
      title: '¿Tienes un proyecto en mente?',
      description: 'Conversemos. Te asesoramos sin compromiso.',
      cta: { label: 'Contáctanos', routeKey: 'contact' },
    },
  },
  en: {
    title: 'Carpintería Castillo | Custom-Made Wooden Furniture',
    description:
      'Artisan carpentry specialized in custom-made furniture, solid wood doors, and restoration. Quality, design, and warmth in every project we craft.',
    hero: {
      eyebrow: 'Artisan carpentry',
      heading: 'Custom furniture with the soul of wood',
      subheading:
        'We design and build unique pieces that transform your space with the warmth of fine wood.',
      cta: { label: 'Explore our services', routeKey: 'services' },
    },
    servicesPreview: {
      title: 'Our Services',
      moreLabel: 'Learn more',
      items: [
        {
          title: 'Custom Furniture',
          description: 'Design and manufacture of personalised furniture for every space.',
          icon: 'cabinet',
          hash: 'custom-furniture',
        },
        {
          title: 'Doors',
          description: 'Solid wood doors with high-quality finishes.',
          icon: 'door',
          hash: 'doors',
        },
        {
          title: 'Restoration',
          description: 'We bring old pieces back to life, respecting their essence.',
          icon: 'restore',
          hash: 'restoration',
        },
      ],
    },
    projectsPreview: {
      title: 'Recent Projects',
      cta: { label: 'View the full gallery', routeKey: 'projects' },
    },
    contactCta: {
      title: 'Do you have a project in mind?',
      description: "Let's talk. We will advise you with no obligation.",
      cta: { label: 'Contact Us', routeKey: 'contact' },
    },
  },
};

// ─── Servicios ───────────────────────────────────────────────────────

export const servicesContent: Record<Locale, ServicesPageContent> = {
  es: {
    title: 'Servicios de Carpintería | Muebles, Puertas y Restauración',
    description:
      'Servicios de carpintería: muebles a medida diseñados a tu espacio, puertas de madera maciza con terminaciones de calidad y restauración de piezas antiguas.',
    hero: {
      heading: 'Servicios',
      subheading: 'Tres especialidades, un mismo compromiso: la excelencia en madera.',
    },
    details: [
      {
        id: 'muebles-a-medida',
        title: 'Muebles a medida',
        description:
          'Diseñamos y fabricamos muebles únicos adaptados a tu espacio, necesidades y estilo. Desde bibliotecas y closets hasta comedores y escritorios, cada pieza se construye con maderas seleccionadas y terminaciones de alta calidad.',
        features: [
          'Diseño personalizado',
          'Maderas nobles seleccionadas',
          'Terminaciones a elección',
          'Entrega e instalación',
        ],
        icon: 'cabinet',
        hash: 'muebles-a-medida',
      },
      {
        id: 'puertas',
        title: 'Puertas',
        description:
          'Fabricamos puertas de madera maciza y semimaciza con diseños clásicos y contemporáneos. Cada puerta se construye con precisión para garantizar durabilidad, aislamiento y estética.',
        features: [
          'Madera maciza y semimaciza',
          'Diseños clásicos y modernos',
          'Medidas exactas',
          'Herrajes de calidad',
        ],
        icon: 'door',
        hash: 'puertas',
      },
      {
        id: 'restauracion',
        title: 'Restauración',
        description:
          'Devolvemos la vida a muebles y piezas antiguas con técnicas respetuosas que conservan su carácter y esencia. Restauramos con oficio para que cada pieza siga contando su historia.',
        features: [
          'Diagnóstico inicial',
          'Tratamiento de madera',
          'Reparación estructural',
          'Terminación fiel al original',
        ],
        icon: 'restore',
        hash: 'restauracion',
      },
    ],
  },
  en: {
    title: 'Carpentry Services | Furniture, Doors & Restoration',
    description:
      'Carpentry services: custom furniture tailored to your space, solid wood doors with quality finishes, and restoration of antique wooden pieces.',
    hero: {
      heading: 'Services',
      subheading: 'Three specialties, one commitment: excellence in wood.',
    },
    details: [
      {
        id: 'custom-furniture',
        title: 'Custom Furniture',
        description:
          'We design and craft unique furniture adapted to your space, needs and style. From bookcases and wardrobes to dining tables and desks, every piece is built with selected timber and high-quality finishes.',
        features: [
          'Bespoke design',
          'Selected fine timber',
          'Finishes of your choice',
          'Delivery and installation',
        ],
        icon: 'cabinet',
        hash: 'custom-furniture',
      },
      {
        id: 'doors',
        title: 'Doors',
        description:
          'We build solid and semi-solid wood doors in classic and contemporary designs. Every door is crafted with precision to guarantee durability, insulation and aesthetics.',
        features: [
          'Solid and semi-solid wood',
          'Classic and modern designs',
          'Exact measurements',
          'Quality hardware',
        ],
        icon: 'door',
        hash: 'doors',
      },
      {
        id: 'restoration',
        title: 'Restoration',
        description:
          'We bring furniture and antique pieces back to life using respectful techniques that preserve their character and essence. We restore with craftsmanship so every piece keeps telling its story.',
        features: [
          'Initial assessment',
          'Wood treatment',
          'Structural repair',
          'Finish faithful to the original',
        ],
        icon: 'restore',
        hash: 'restoration',
      },
    ],
  },
};

// ─── Proyectos ───────────────────────────────────────────────────────

export const projectsContent: Record<Locale, ProjectsPageContent> = {
  es: {
    title: 'Proyectos de Carpintería Castillo | Muebles y Puertas',
    description:
      'Galería de proyectos de carpintería: muebles a medida, puertas de madera maciza y restauraciones. Cada trabajo refleja oficio, dedicación y diseño.',
    hero: {
      heading: 'Proyectos',
      subheading: 'Una selección de trabajos que reflejan nuestro oficio.',
    },
    gallery: {
      title: 'Galería de trabajos',
      note: 'Las imágenes mostradas son de referencia. Pronto esta galería contará con fotografías de trabajos reales.',
      items: [
        { title: 'Closet a medida', category: 'Muebles', image: 'closet' },
        { title: 'Puerta de roble', category: 'Puertas', image: 'door-oak' },
        { title: 'Mesa de comedor', category: 'Muebles', image: 'table' },
        { title: 'Restauración silla antigua', category: 'Restauración', image: 'chair' },
        { title: 'Biblioteca empotrada', category: 'Muebles', image: 'bookcase' },
        { title: 'Puerta de entrada', category: 'Puertas', image: 'entry-door' },
      ],
    },
  },
  en: {
    title: 'Projects | Carpintería Castillo - Custom Woodwork Gallery',
    description:
      'Portfolio of carpentry projects: custom furniture, solid wood doors, and restoration work. Each piece reflects craft, dedication, and design.',
    hero: {
      heading: 'Projects',
      subheading: 'A selection of work that reflects our craft.',
    },
    gallery: {
      title: 'Work Gallery',
      note: 'The images shown are for reference only. This gallery will soon feature photographs of real projects.',
      items: [
        { title: 'Custom wardrobe', category: 'Furniture', image: 'closet' },
        { title: 'Oak door', category: 'Doors', image: 'door-oak' },
        { title: 'Dining table', category: 'Furniture', image: 'table' },
        { title: 'Antique chair restoration', category: 'Restoration', image: 'chair' },
        { title: 'Built-in bookcase', category: 'Furniture', image: 'bookcase' },
        { title: 'Entrance door', category: 'Doors', image: 'entry-door' },
      ],
    },
  },
};

// ─── Contacto ────────────────────────────────────────────────────────

export const contactContent: Record<Locale, ContactPageContent> = {
  es: {
    title: 'Contacto | Carpintería Castillo - Cotiza tu Proyecto',
    description:
      'Escríbenos por email o WhatsApp para cotizar tu proyecto de carpintería. Respondemos cada consulta de forma personalizada, clara y a la brevedad.',
    hero: {
      heading: 'Contacto',
      subheading: 'Cuéntanos tu idea. Te respondemos a la brevedad.',
    },
    channels: {
      title: 'Canal de contacto',
      note: 'Atendemos consultas de lunes a viernes. Responderemos tu mensaje a la brevedad.',
      items: [
        {
          channel: 'email',
          label: 'Correo electrónico',
          description: 'Escríbenos con los detalles de tu proyecto y te responderemos a la brevedad.',
          actionLabel: 'Enviar un correo',
        },
        {
          channel: 'phone',
          label: 'Teléfono',
          description: 'Llámanos directamente para conversar sobre tu proyecto.',
          actionLabel: 'Llamar',
        },
        {
          channel: 'whatsapp',
          label: 'WhatsApp',
          description: 'La vía más rápida para cotizaciones y consultas sin compromiso.',
          actionLabel: 'Abrir WhatsApp',
        },
      ],
    },
  },
  en: {
    title: 'Contact | Carpintería Castillo - Get a Custom Quote',
    description:
      'Reach out by email or WhatsApp to request a quote for your carpentry project. We respond to every inquiry in a prompt, clear, and personal way.',
    hero: {
      heading: 'Contact',
      subheading: 'Tell us about your idea. We will reply shortly.',
    },
    channels: {
      title: 'Contact Channels',
      note: 'We attend enquiries Monday to Friday. We will reply to your message shortly.',
      items: [
        {
          channel: 'email',
          label: 'Email',
          description:
            'Write to us with the details of your project and we will get back to you shortly.',
          actionLabel: 'Send an email',
        },
        {
          channel: 'phone',
          label: 'Phone',
          description: 'Call us directly to discuss your project.',
          actionLabel: 'Call',
        },
        {
          channel: 'whatsapp',
          label: 'WhatsApp',
          description: 'The fastest way to reach us: quotes and questions with no obligation.',
          actionLabel: 'Open WhatsApp',
        },
      ],
    },
  },
};
