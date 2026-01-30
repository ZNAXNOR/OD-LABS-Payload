// Define local type since BannerBlock is not in payload-types
interface BannerBlock {
  id?: string | null
  blockName?: string | null
  blockType: 'banner'
  // Add other banner-specific properties as needed
}

export interface BannerBlockProps extends BannerBlock {
  className?: string
}

export type BannerStyle = 'info' | 'warning' | 'error' | 'success'
