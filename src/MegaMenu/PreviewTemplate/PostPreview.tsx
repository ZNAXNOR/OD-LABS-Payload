import type { MegaMenuEntry } from '../registry'
import { PreviewDate, PreviewFrame } from './PreviewFrame'
export const PostPreview = ({ entry }: { entry: MegaMenuEntry }) => <PreviewFrame entry={entry} metadata={<>{entry.publishedAt && <PreviewDate value={entry.publishedAt} />}{entry.categories?.map((category) => <span key={category} className="border border-zinc-800 px-2 py-1 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{category}</span>)}</>} />
