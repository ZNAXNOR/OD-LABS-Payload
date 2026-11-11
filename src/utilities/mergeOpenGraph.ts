import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'OD LABS — Web, Data, Automation & Software Engineering by Omkar Dalvi.',
  images: [
    {
      url: `${getServerSideURL()}/ODLABS-OG.webp`,
    },
  ],
  siteName: 'OD LABS',
  title: 'OD LABS',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
