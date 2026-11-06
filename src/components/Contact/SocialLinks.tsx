import { Facebook, Github, Globe, Instagram, Linkedin, Youtube } from 'lucide-react'

const iconClass = 'size-[18px]'
export function SocialIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase()
  if (key === 'linkedin') return <Linkedin aria-hidden="true" className={iconClass} />
  if (key === 'github') return <Github aria-hidden="true" className={iconClass} />
  if (key === 'instagram') return <Instagram aria-hidden="true" className={iconClass} />
  if (key === 'youtube') return <Youtube aria-hidden="true" className={iconClass} />
  if (key === 'facebook') return <Facebook aria-hidden="true" className={iconClass} />
  if (key === 'x') return <svg aria-hidden="true" className={iconClass} viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.45L5.53 22H2.4l7.25-8.29L1.9 2h6.4l4.43 6.78L18.9 2Zm-1.1 18h1.73L7.36 3.9H5.5L17.8 20Z" /></svg>
  if (key === 'threads') return <svg aria-hidden="true" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18.2 8.2c-.7-3.1-2.8-4.8-6.1-4.8-4.4 0-7 3.2-7 8.5 0 5.1 2.5 8.7 7.1 8.7 3.8 0 6.4-2.1 6.4-5.4 0-2.7-1.8-4.4-4.7-4.4-2.2 0-3.8 1.1-3.8 2.9 0 1.4 1 2.3 2.5 2.3 2.3 0 3.9-1.8 3.9-4.4 0-2.3-1.2-3.8-3.3-3.8" /></svg>
  return <Globe aria-hidden="true" className={iconClass} />
}
type SocialLink = { profile?: string | null; platform?: string | null; url: string }
export function SocialLinks({ links }: { links: SocialLink[] }) {
  return <div className="flex flex-wrap gap-2">{links.map((social, index) => {
    const profile = social.profile === 'od-labs' ? 'OD LABS' : 'Omkar Dalvi'
    const platform = social.platform || 'Social profile'
    const label = profile + ' · ' + platform
    return <a key={social.url + index} href={social.url} target="_blank" rel="noreferrer noopener" aria-label={label} title={label} className="grid size-11 place-items-center border border-zinc-800 text-zinc-400 transition-colors hover:border-odl hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"><SocialIcon platform={platform} /></a>
  })}</div>
}
