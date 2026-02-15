import type { Site, Ui, Features } from './types'

export const SITE: Site = {
  website: 'https://mmlac.com',
  base: '/',
  title: 'Methodos Mechanicus',
  description:
    'Posts about software development, open source, and other tech topics by Markus Lachinger.',
  author: 'Markus Lachinger',
  lang: 'en',
  ogLocale: 'en_US',
  imageDomains: ['cdn.bsky.app', 'images.unsplash.com'],
}

export const UI: Ui = {
  internalNavs: [
    {
      path: '/blog',
      title: 'Blog',
      displayMode: 'alwaysText',
      text: 'Blog',
    },
    {
      path: '/highlights',
      title: 'Highlights',
      displayMode: 'alwaysText',
      text: 'Highlights',
    },
    {
      path: '/projects',
      title: 'Projects',
      displayMode: 'alwaysText',
      text: 'Projects',
    },
    {
      path: '/',
      title: 'About Me',
      displayMode: 'alwaysText',
      text: 'About Me',
    },
  ],
  socialLinks: [
    {
      link: 'https://github.com/mmlac',
      title: 'Markus Lachinger on Github',
      displayMode: 'alwaysIcon',
      icon: 'i-uil-github-alt',
    },
    {
      link: 'https://x.com/mLachinger',
      title: 'Markus Lachinger on Twitter',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-twitter-x-fill',
    },
    {
      link: 'https://linkedin.com/in/mmlac',
      title: 'Markus Lachinger on LinkedIn',
      displayMode: 'alwaysIcon',
      icon: 'i-meteor-icons-linkedin',
    },
  ],
  navBarLayout: {
    left: [],
    right: [
      'internalNavs',
      'hr',
      'socialLinks',
      'hr',
      'searchButton',
      'themeButton',
      'rssLink',
    ],
    mergeOnMobile: true,
  },
  tabbedLayoutTabs: [
    { title: 'Changelog', path: '/changelog' },
    { title: 'AstroBlog', path: '/feeds' },
    { title: 'AstroStreams', path: '/streams' },
  ],
  groupView: {
    maxGroupColumns: 3,
    showGroupItemColorOnHover: true,
  },
  githubView: {
    monorepos: [
      'withastro/astro',
      'withastro/starlight',
      'lin-stephanie/astro-loaders',
    ],
    mainLogoOverrides: [
      [/starlight/, 'https://starlight.astro.build/favicon.svg'],
    ],
    subLogoMatches: [
      [/theme/, 'i-unjs-theme-colors'],
      [/github/, 'https://github.githubassets.com/favicons/favicon.svg'],
      [/tweet/, 'i-logos-twitter'],
      [/bluesky/, 'i-logos-bluesky'],
    ],
  },
  externalLink: {
    newTab: false,
    cursorType: '',
    showNewTabIcon: false,
  },
  postMetaStyle: 'minimal',
}

/**
 * Configures whether to enable special features:
 *  - Set to `false` or `[false, {...}]` to disable the feature.
 *  - Set to `[true, {...}]` to enable and configure the feature.
 */
export const FEATURES: Features = {
  slideEnterAnim: [true, { enterStep: 60 }],
  ogImage: [
    true,
    {
      authorOrBrand: `${SITE.title}`,
      fallbackTitle: `${SITE.description}`,
      fallbackBgType: 'plum',
    },
  ],
  toc: [
    true,
    {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
      displayPosition: 'left',
      displayMode: 'content',
    },
  ],
  share: [
    true,
    {
      twitter: [true, '@mLachinger'],
      bluesky: false,
      mastodon: false,
      facebook: false,
      pinterest: false,
      reddit: true,
      telegram: false,
      whatsapp: false,
      email: false,
    },
  ],
  giscus: [
    true,
    {
      'data-repo': 'mmlac/mmlac-blog',
      'data-repo-id': 'R_kgDORMv7Yg',
      'data-category': 'General',
      'data-category-id': 'DIC_kwDORMv7Ys4C2KnA',
      'data-mapping': 'pathname',
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-lang': 'en',
    },
  ],
  search: [
    true,
    {
      includes: ['blog', 'highlights'],
      filter: true,
      navHighlight: true,
      batchLoadSize: [true, 5],
      maxItemsPerPage: [true, 3],
    },
  ],
}
