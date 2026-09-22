export interface MegaMenuPage {
  title: string
  slug: string
  href: string
  description: string
  sections: {
    label: string
    href: string
  }[]
}

export const megaMenuPages: MegaMenuPage[] = [
  {
    title: 'Home',
    slug: 'home',
    href: '/',
    description:
      'Independent engineering practice by Omkar. Specialized in performant systems, data reconciliation, and edge architecture.',
    sections: [
      {
        label: 'Hero',
        href: '#hero',
      },
      {
        label: 'Services',
        href: '#services',
      },
      {
        label: 'Contact',
        href: '#contact',
      },
    ],
  },
  {
    title: 'Posts',
    slug: 'posts',
    href: '/posts',
    description:
      'Technical writing, experiments, notes, and practical explorations across web, data, automation, and engineering.',
    sections: [
      {
        label: 'Latest Posts',
        href: '#latest-posts',
      },
      {
        label: 'Technical Notes',
        href: '#technical-notes',
      },
    ],
  },
  {
    title: 'Contact',
    slug: 'contact',
    href: '/contact',
    description:
      'Have a project, technical problem, or idea that needs engineering support? Get in touch.',
    sections: [
      {
        label: 'Contact',
        href: '#contact',
      },
    ],
  },
]
