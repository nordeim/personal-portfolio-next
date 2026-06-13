/* ============================================================
   The Engineered Soul — Static Content Library
   All content is stored as static TypeScript data.
   (Replaces Vite's import.meta.glob for Next.js compatibility)
   ============================================================ */

import type { ParsedCollectionItem, ParsedPortfolioItem } from './types';

// ============================================================
// Portfolio Items (Bento Grid)
// ============================================================

const PORTFOLIO_ITEMS: ParsedPortfolioItem[] = [
  {
    slug: 'news-aggregator',
    title: 'OneStopNews',
    category: 'Code',
    accent: '#2457ff',
    status: 'Prototype',
    description:
      'A one-stop place for people who want to stay current without jumping between tabs, feeds, and headlines all day.',
    medium: 'Web app',
    link: 'https://onestopnews.onrender.com/',
    linkLabel: 'Visit OneStopNews',
    body: 'OneStopNews is a compact news and gossip aggregator for people who want to stay in the loop without turning catching up into a full-time activity.\n\nIt brings scattered headlines into one place, making it easier to scan what matters, follow the conversation, and get back to the rest of your day.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'typeset-engine',
    title: 'Typeset Engine',
    category: 'Code',
    accent: '#2457ff',
    status: 'Experiment',
    description:
      'A micro-typography engine that applies optical margin alignment, widow prevention, and contextual ligature rules to arbitrary HTML text.',
    medium: 'JavaScript library',
    link: null,
    linkLabel: 'View',
    body: 'A micro-typography engine that brings print-quality typesetting to the browser. Applies optical margin alignment, widow and orphan prevention, and contextual ligature injection to arbitrary HTML text blocks.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'poetry-fragments',
    title: 'Poetry Fragments',
    category: 'Poetry',
    accent: '#8f55ff',
    status: 'Ongoing',
    description:
      'A collection of poems written between 2019–present. Short, compressed. The line as the unit of thought.',
    medium: 'Poems',
    link: null,
    linkLabel: 'Read',
    body: 'A collection of poems written between 2019–present. Short, compressed. The line as the unit of thought.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'poster-no-04',
    title: 'Poster No. 04',
    category: 'Design',
    accent: '#ff5c35',
    status: 'Archive',
    description:
      'A typographic poster exploring negative space as rhythm. Printed on uncoated stock, 50×70cm.',
    medium: 'Print / Type',
    link: null,
    linkLabel: 'View',
    body: 'A typographic poster exploring negative space as rhythm. Printed on uncoated stock, 50×70cm. Part of an ongoing series investigating the relationship between text and silence.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'still-life-with-grid',
    title: 'Still Life with Grid',
    category: 'Visual Art',
    accent: '#00a77f',
    status: 'Archive',
    description:
      'A series of drawings exploring the relationship between mathematical grids and organic forms. Graphite on paper.',
    medium: 'Drawing',
    link: null,
    linkLabel: 'View',
    body: 'A series of drawings exploring the relationship between mathematical grids and organic forms. Graphite on paper.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'room-tones',
    title: 'Room Tones',
    category: 'Photography',
    accent: '#f2b705',
    status: 'Archive',
    description: 'A photographic study of empty rooms and the sounds they carry.',
    medium: 'Photography',
    link: null,
    linkLabel: 'View',
    body: 'A photographic study of empty rooms and the sounds they carry. Shot on 35mm film, unedited.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'field-notes',
    title: 'Field Notes',
    category: 'Prose',
    accent: '#e5488b',
    status: 'Ongoing',
    description: 'Observations from the margin. Short prose written in transit.',
    medium: 'Prose',
    link: null,
    linkLabel: 'Read',
    body: 'Observations from the margin. Short prose written in transit — airports, trains, waiting rooms. Unpolished by design.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'the-quiet-protocol',
    title: 'The Quiet Protocol',
    category: 'Code / Interactive',
    accent: '#16a3b8',
    status: 'Live',
    description:
      'An interactive web experiment where silence is a design element. No sound, no music — just time.',
    medium: 'Web experiment',
    link: null,
    linkLabel: 'Explore',
    body: 'An interactive web experiment where silence is a design element. No sound, no music — just the passage of time, rendered.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'website-concepts',
    title: 'Website Concepts',
    category: 'Design',
    accent: '#ff5c35',
    status: 'Archive',
    description: 'Concept explorations for websites that reject the template.',
    medium: 'Design / Interactive',
    link: null,
    linkLabel: 'View',
    body: 'A series of concept explorations for websites that reject the template — exploring brutalist, editorial, and experimental directions.',
    image: null,
    collectionSlug: 'portfolio',
  },
  {
    slug: 'birthday-card-experiments',
    title: 'Birthday Card Experiments',
    category: 'Design',
    accent: '#ff5c35',
    status: 'Archive',
    description: 'A year of birthday cards made by hand. Every card, a constraint.',
    medium: 'Print',
    link: null,
    linkLabel: 'View',
    body: 'A year of birthday cards made by hand. Every card, a new constraint: one color, one typeface, one image, no computer.',
    image: null,
    collectionSlug: 'portfolio',
  },
];

// ============================================================
// Collection Items
// ============================================================

const COLLECTION_ITEMS: ParsedCollectionItem[] = [
  // --- Poetry ---
  {
    slug: 'small-instrument',
    collectionSlug: 'poetry',
    title: 'Small Instrument',
    category: 'Poetry',
    accent: '#8f55ff',
    status: 'archive',
    description: 'A poem about craft, restraint, and the instruments we choose to be small.',
    link: null,
    linkLabel: 'Read',
    body: `I want to be a small instrument.
A pencil. A single chord. A line
that does not need a second.

The world is loud and asks for louder.
I am practicing being a room
with a single window.

Give me a sentence.
Give me the patience
to make it the right length.`,
    image: null,
    document: null,
    medium: 'Poem · free verse',
  },
  {
    slug: 'the-weight-of-a-room',
    collectionSlug: 'poetry',
    title: 'The Weight of a Room',
    category: 'Poetry',
    accent: '#8f55ff',
    status: 'archive',
    description: 'A meditation on presence, absence, and the physics of empty spaces.',
    link: null,
    linkLabel: 'Read',
    body: `A room does not know it is empty.
It holds the shape of what was there —
the indent in the cushion,
the ring a glass left on wood.

This is not nostalgia. It is mass.
Every departure leaves weight.
Every silence has a frequency.

I have been trying to measure
the specific gravity of a room
after you leave it.`,
    image: null,
    document: null,
    medium: 'Poem · lyric',
  },
  {
    slug: 'anger',
    collectionSlug: 'poetry',
    title: 'Anger',
    category: 'Poetry',
    accent: '#8f55ff',
    status: 'archive',
    description: 'On the structure of anger — how it holds its shape.',
    link: null,
    linkLabel: 'Read',
    body: `Anger is a very clean thing.
It knows its shape exactly.
It does not leak at the edges
the way grief does, or love.

It sits in the chest like a key
that was made for a lock
you haven't found yet.

I am carrying mine carefully.
Not because I am afraid of it.
Because I want to use it right.`,
    image: null,
    document: null,
    medium: 'Poem · lyric',
  },
  {
    slug: 'depression',
    collectionSlug: 'poetry',
    title: 'Depression',
    category: 'Poetry',
    accent: '#8f55ff',
    status: 'archive',
    description: 'Not darkness. Something more specific.',
    link: null,
    linkLabel: 'Read',
    body: `It is not the dark.
The dark is soft and holds you.
This is something else —
a fluorescence that doesn't warm.

Everything is equidistant.
The cup. The window. The idea
of going outside.

I am here and I am
two inches behind myself,
watching myself
not do things.`,
    image: null,
    document: null,
    medium: 'Poem · lyric',
  },
  {
    slug: 'a-storm-of-fire-and-ice',
    collectionSlug: 'poetry',
    title: 'A Storm of Fire and Ice',
    category: 'Poetry',
    accent: '#8f55ff',
    status: 'archive',
    description: 'A dialectic in two temperatures.',
    link: null,
    linkLabel: 'Read',
    body: `Fire says: I am here, I am here.
Ice says: I was always here.

Fire burns forward.
Ice was already at the destination.

Between them — the storm,
which is neither, which is both,
which is the word for things
that cannot decide what they are.

I live in the storm.
I am learning to call it home.`,
    image: null,
    document: null,
    medium: 'Poem · dialectic',
  },
  // --- Code ---
  {
    slug: 'typeset-engine',
    collectionSlug: 'code',
    title: 'Typeset Engine',
    category: 'Code',
    accent: '#2457ff',
    status: 'experiment',
    description:
      'A micro-typography engine that applies optical margin alignment, widow prevention, and contextual ligature rules.',
    link: null,
    linkLabel: 'View',
    body: 'A micro-typography engine that brings print-quality typesetting to the browser. Applies optical margin alignment, widow and orphan prevention, and contextual ligature injection to arbitrary HTML text blocks.\n\nBuilt in pure JavaScript, no dependencies. The core algorithm walks the DOM, identifies typographic problems, and applies surgical fixes without altering the HTML structure.',
    image: null,
    document: null,
    medium: 'JavaScript / DOM',
  },
  {
    slug: 'marginalia',
    collectionSlug: 'code',
    title: 'Marginalia',
    category: 'Code',
    accent: '#2457ff',
    status: 'archive',
    description: 'A browser extension that renders inline annotations as editorial marginalia.',
    link: null,
    linkLabel: 'View',
    body: 'A browser extension that transforms inline HTML annotations into print-quality editorial marginalia. Inspired by the tradition of scholarly marginalia — notes in the margins of sacred texts.\n\nUses a custom layout algorithm to position notes without overlap, respecting the rhythm of the main column.',
    image: null,
    document: null,
    medium: 'Browser Extension',
  },
  // --- Design ---
  {
    slug: 'poster-no-04',
    collectionSlug: 'design',
    title: 'Poster No. 04',
    category: 'Design',
    accent: '#ff5c35',
    status: 'archive',
    description: 'A typographic poster exploring negative space as rhythm.',
    link: null,
    linkLabel: 'View',
    body: 'A typographic poster exploring negative space as rhythm. Printed on uncoated stock, 50×70cm. Part of an ongoing series investigating the relationship between text and silence.\n\nThe typeface is set at a single weight — 300 — and the only variable is position. Nothing else was changed.',
    image: null,
    document: null,
    medium: 'Print / Type',
  },
  {
    slug: 'birthday-card-experiments',
    collectionSlug: 'design',
    title: 'Birthday Card Experiments',
    category: 'Design',
    accent: '#ff5c35',
    status: 'archive',
    description: 'A year of birthday cards made by hand. Every card, a constraint.',
    link: null,
    linkLabel: 'View',
    body: 'A year of birthday cards made by hand. Every card, a new constraint: one color, one typeface, one image, no computer.\n\nThe constraints were the point. When you cannot fall back on the tool, you find out what you actually know.',
    image: null,
    document: null,
    medium: 'Print',
  },
  // --- Photography ---
  {
    slug: 'room-tones',
    collectionSlug: 'photography',
    title: 'Room Tones',
    category: 'Photography',
    accent: '#f2b705',
    status: 'archive',
    description: 'A photographic study of empty rooms and the sounds they carry.',
    link: null,
    linkLabel: 'View',
    body: 'A photographic study of empty rooms and the sounds they carry. Shot on 35mm film, unedited.\n\nIn film production, "room tone" is the ambient sound of an empty room — recorded so editors can use it to fill silence. These photographs try to do the same thing: record the specific silence of a specific room at a specific time.',
    image: null,
    document: null,
    medium: '35mm film',
  },
  {
    slug: 'photo-note',
    collectionSlug: 'photography',
    title: 'Photo Note',
    category: 'Photography',
    accent: '#f2b705',
    status: 'archive',
    description: 'Notes on photography as a practice of attention.',
    link: null,
    linkLabel: 'View',
    body: 'Photography is not about capturing. It is about choosing not to capture — and then, once, capturing.\n\nThe ratio is important. For every photograph I take, there are a hundred I chose not to. The practice is in the restraint.',
    image: null,
    document: null,
    medium: 'Essay / Photography',
  },
  // --- Stories ---
  {
    slug: 'field-notes',
    collectionSlug: 'stories',
    title: 'Field Notes',
    category: 'Prose',
    accent: '#e5488b',
    status: 'ongoing',
    description: 'Observations from the margin. Short prose written in transit.',
    link: null,
    linkLabel: 'Read',
    body: 'Observations from the margin. Short prose written in transit — airports, trains, waiting rooms. Unpolished by design.\n\n---\n\n**JFK Terminal 4, 06:12**\n\nThe man across from me is reading a physical newspaper. The paper is the International Herald Tribune, which I did not know still existed. He folds it with the precision of someone who has done it ten thousand times.\n\n---\n\n**BART, Oakland to SF, 08:45**\n\nA woman is knitting something red. The train moves. She does not look down.',
    image: null,
    document: null,
    medium: 'Prose fragments',
  },
  {
    slug: 'maudie-house-on-fire',
    collectionSlug: 'stories',
    title: 'Maudie\'s House on Fire',
    category: 'Fiction',
    accent: '#e5488b',
    status: 'archive',
    description: 'A short story about a woman who watches her house burn down and feels nothing.',
    link: null,
    linkLabel: 'Read',
    body: 'Maudie watched the fire from the end of the driveway. She had her coffee cup. She had her robe. She had the specific feeling of having forgotten something important and then remembering it doesn\'t matter.\n\nThe fire department arrived in seven minutes. She timed them.\n\n"Is there anyone inside?" the first firefighter asked.\n\n"No," she said. "There\'s nothing inside."',
    image: null,
    document: null,
    medium: 'Short fiction',
  },
  // --- Artworks ---
  {
    slug: 'still-life-with-grid',
    collectionSlug: 'artworks',
    title: 'Still Life with Grid',
    category: 'Drawing',
    accent: '#00a77f',
    status: 'archive',
    description: 'A series of drawings exploring the relationship between mathematical grids and organic forms.',
    link: null,
    linkLabel: 'View',
    body: 'A series of drawings exploring the relationship between mathematical grids and organic forms. Graphite on paper.\n\nThe grid is pre-printed at 5mm intervals. The drawing has to negotiate with it — sometimes following it, sometimes fighting it. The tension is the subject.',
    image: null,
    document: null,
    medium: 'Graphite on paper',
  },
  {
    slug: 'visual-study',
    collectionSlug: 'artworks',
    title: 'Visual Study No. 7',
    category: 'Drawing',
    accent: '#00a77f',
    status: 'archive',
    description: 'A study in compression: how much can a line carry?',
    link: null,
    linkLabel: 'View',
    body: 'A study in compression: how much can a single line carry?\n\nDrawn in one session, no erasing. The line has to make its decisions once and commit to them. This is the discipline I am trying to bring to writing.',
    image: null,
    document: null,
    medium: 'Ink on paper',
  },
  // --- Web Experiments ---
  {
    slug: 'the-quiet-protocol',
    collectionSlug: 'web-experiments',
    title: 'The Quiet Protocol',
    category: 'Interactive',
    accent: '#16a3b8',
    status: 'live',
    description: 'An interactive web experiment where silence is a design element.',
    link: null,
    linkLabel: 'Explore',
    body: 'An interactive web experiment where silence is a design element. No sound, no music — just the passage of time, rendered.\n\nThe piece runs for exactly 24 hours. After that, it is gone.',
    image: null,
    document: null,
    medium: 'Web / Interactive',
  },
  {
    slug: 'grain-field',
    collectionSlug: 'web-experiments',
    title: 'Grain Field',
    category: 'Interactive',
    accent: '#16a3b8',
    status: 'archive',
    description: 'A generative canvas of CSS noise that responds to cursor movement.',
    link: null,
    linkLabel: 'Explore',
    body: 'A generative canvas of CSS noise that responds to cursor movement. The grain shifts in density based on where the cursor is — denser at the edges, sparser at the center.\n\nBuilt entirely in CSS and vanilla JavaScript. No canvas API, no WebGL.',
    image: null,
    document: null,
    medium: 'CSS / JavaScript',
  },
  {
    slug: 'curious-experiments',
    collectionSlug: 'web-experiments',
    title: 'Curious Experiments',
    category: 'Interactive',
    accent: '#16a3b8',
    status: 'ongoing',
    description: 'A running log of small web experiments — some finished, most not.',
    link: null,
    linkLabel: 'Explore',
    body: 'A running log of small web experiments — some finished, most not. The point is the practice, not the product.',
    image: null,
    document: null,
    medium: 'Various',
  },
  {
    slug: 'onestopnews',
    collectionSlug: 'web-experiments',
    title: 'OneStopNews',
    category: 'Web App',
    accent: '#16a3b8',
    status: 'prototype',
    description: 'A one-stop news aggregator built as a web experiment.',
    link: 'https://onestopnews.onrender.com/',
    linkLabel: 'Visit',
    body: 'A one-stop news aggregator built as a web experiment. Aggregates headlines from multiple sources into a single, scannable view.\n\nBuilt with React and a custom scraping layer. The design is deliberately utilitarian.',
    image: null,
    document: null,
    medium: 'Web App',
  },
  {
    slug: 'website-concepts',
    collectionSlug: 'web-experiments',
    title: 'Website Concepts',
    category: 'Design / Interactive',
    accent: '#16a3b8',
    status: 'archive',
    description: 'Concept explorations for websites that reject the template.',
    link: null,
    linkLabel: 'View',
    body: 'A series of concept explorations for websites that reject the template — exploring brutalist, editorial, and experimental directions. None of these shipped. That\'s the point.',
    image: null,
    document: null,
    medium: 'Figma / HTML',
  },
];

// ============================================================
// Public API
// ============================================================

export function getPortfolioItems(): ParsedPortfolioItem[] {
  return [...PORTFOLIO_ITEMS];
}

export function getCollectionItems(collectionSlug: string): ParsedCollectionItem[] {
  return COLLECTION_ITEMS.filter((item) => item.collectionSlug === collectionSlug);
}

export function getCollectionItem(
  collectionSlug: string,
  itemSlug: string
): ParsedCollectionItem | null {
  return COLLECTION_ITEMS.find(
    (item) => item.collectionSlug === collectionSlug && item.slug === itemSlug
  ) ?? null;
}

export function getCollectionSlugs(): string[] {
  return [...new Set(COLLECTION_ITEMS.map((item) => item.collectionSlug))];
}

export function getCollectionCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const slug of getCollectionSlugs()) {
    counts[slug] = getCollectionItems(slug).length;
  }
  return counts;
}
