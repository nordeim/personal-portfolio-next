/* ============================================================
   The Engineered Soul — Static Data
   Hero slides, about pillars, social links, collection definitions.
   ============================================================ */

import type {
  HeroSlide,
  AboutPillar,
  SocialLink,
  Collection,
} from './types';

// ============================================================
// Portrait key → image path resolver
// ============================================================

const PORTRAIT_MAP: Record<string, string> = {
  'nicholas-yun': '/portraits/nicholas-0.webp',
  'creative-technologist': '/portraits/creative-technologist.jpg',
  'project-archive': '/portraits/project-archive.jpg',
  'open-to-collaborate': '/portraits/open-to-collaborate.jpg',
};

export function getPortraitForKey(key: string): string {
  return PORTRAIT_MAP[key] ?? '/portraits/nicholas-portrait.jpg';
}

// ============================================================
// Build Metadata
// ============================================================

export const buildMetadata = {
  name: 'nicholas-yun-portfolio',
  version: '2.0.0',
  hash: 'nextjs',
};

// ============================================================
// Hero Slides
// ============================================================

export const heroSlides: HeroSlide[] = [
  {
    label: 'Creative Technologist',
    portraitKey: 'nicholas-yun',
    headline: 'Ideas, made tangible.',
    subtitle: 'Code. Design. Words. Images. Experiments.',
    artifactTitle: 'Idea → Interface → Feeling',
    artifactMeta: 'Code / Design / Words',
    signature: 'Nicholas Yun',
    accent: '#2457ff',
    secondaryAccent: '#8f55ff',
    tags: ['Engineering', 'Empathy', 'Intent'],
  },
  {
    label: 'Editorial Soul',
    portraitKey: 'creative-technologist',
    headline: 'Words with weight.',
    subtitle: 'Poetry. Prose. The slow craft of language.',
    artifactTitle: 'Silence → Sentence → Sound',
    artifactMeta: 'Poetry / Prose / Voice',
    signature: 'NY',
    accent: '#8f55ff',
    secondaryAccent: '#e5488b',
    tags: ['Lyrical', 'Restrained', 'Patient'],
  },
  {
    label: 'Visual Builder',
    portraitKey: 'project-archive',
    headline: 'A workshop, not a feed.',
    subtitle: 'Photography. Type. Studies in light and matter.',
    artifactTitle: 'Light → Material → Frame',
    artifactMeta: 'Photography / Art / Studies',
    signature: 'NY',
    accent: '#f2b705',
    secondaryAccent: '#ff5c35',
    tags: ['Atmospheric', 'Tactile', 'Slow'],
  },
];

// ============================================================
// About Pillars
// ============================================================

export const aboutPillars: AboutPillar[] = [
  {
    title: 'A Multidisciplinary Soul',
    paragraphs: [
      'I live at the seam of disciplines — code that breathes, language that lands, images that carry weight. Each discipline informs the others; the seams are where the work happens.',
      'I am not a generalist by default. I am a generalist by design — refusing to let any single medium become a crutch that flattens the others.',
    ],
  },
  {
    title: 'Engineering as Empathy',
    paragraphs: [
      'Code is not a deliverable. It is a relationship — with the user, the future maintainer, the constraints. I write code the way I write a sentence: with intent, restraint, and a refusal to confuse complexity for depth.',
      'The best engineering decisions are felt before they are seen. They are the ones where nothing has to be explained.',
    ],
  },
  {
    title: 'Editorial Discipline',
    paragraphs: [
      'Typography is a moral act. Spacing is a moral act. The decision to leave something empty is as deliberate as the decision to fill it.',
      'I work in the lineage of editorial designers — Brodovitch, Müller-Brockmann — where restraint is a craft and whitespace is a structural element, not absence.',
    ],
  },
  {
    title: 'Post-AI Authenticity',
    paragraphs: [
      'I am not interested in optimizing for the algorithm. I am interested in work that could not have been made by anyone else, in any other moment.',
      'In a world of infinite synthetic output, the only defensible position is to be irreducibly specific — to refuse the easy template, the safe gradient, the generic font pairing.',
    ],
  },
];

// ============================================================
// Social Links
// ============================================================

export const socialLinks: SocialLink[] = [
  {
    label: 'Email',
    icon: 'mail',
    href: 'mailto:nicholas@example.com',
    description: 'The slowest, most direct way to reach me.',
  },
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    href: 'https://linkedin.com/in/nicholasyun',
    description: 'Professional context and occasional thought.',
  },
  {
    label: 'GitHub',
    icon: 'github',
    href: 'https://github.com/nicholasyun',
    description: 'Where the code lives, unpolished and alive.',
  },
  {
    label: 'Instagram',
    icon: 'instagram',
    href: 'https://instagram.com/nicholasyun',
    description: 'Visual dispatches from the workshop.',
  },
];

// ============================================================
// Collection Definitions
// ============================================================

export const collectionDefinitions: Collection[] = [
  {
    slug: 'poetry',
    title: 'Poetry',
    category: 'Words',
    accent: '#8f55ff',
    description: 'Fragments, lyrics, and compressed thought. Poetry as a practice of restraint.',
    status: 'ongoing',
  },
  {
    slug: 'code',
    title: 'Code',
    category: 'Engineering',
    accent: '#2457ff',
    description: 'Experiments, tools, and systems built with deliberate intent.',
    status: 'active',
  },
  {
    slug: 'design',
    title: 'Design',
    category: 'Visual',
    accent: '#ff5c35',
    description: 'Editorial work, posters, type studies, and visual systems.',
    status: 'active',
  },
  {
    slug: 'photography',
    title: 'Photography',
    category: 'Image',
    accent: '#f2b705',
    description: 'Studies in light, texture, and the weight of ordinary things.',
    status: 'archive',
  },
  {
    slug: 'stories',
    title: 'Stories',
    category: 'Prose',
    accent: '#e5488b',
    description: 'Short fiction, field notes, and narrative sketches.',
    status: 'ongoing',
  },
  {
    slug: 'artworks',
    title: 'Artworks',
    category: 'Visual Art',
    accent: '#00a77f',
    description: 'Visual studies, drawings, and experiments in form.',
    status: 'archive',
  },
  {
    slug: 'web-experiments',
    title: 'Web Experiments',
    category: 'Interactive',
    accent: '#16a3b8',
    description: 'Conceptual web pieces, interactive sketches, and digital curiosities.',
    status: 'active',
  },
];
