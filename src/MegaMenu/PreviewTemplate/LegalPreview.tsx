import type { MegaMenuEntry } from '../registry'
import { PreviewDate, PreviewFrame } from './PreviewFrame'
export const LegalPreview = ({ entry }: { entry: MegaMenuEntry }) => <PreviewFrame entry={entry} metadata={<>{entry.documentType && <span className="border border-zinc-800 px-2 py-1 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{entry.documentType.replaceAll('-', ' ')}</span>}{entry.updatedAt && <PreviewDate value={entry.updatedAt} />}</>} />
