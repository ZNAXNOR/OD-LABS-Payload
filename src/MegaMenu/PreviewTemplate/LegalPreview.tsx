import type { MegaMenuEntry } from '../registry'
import { PreviewDate, PreviewFrame } from './PreviewFrame'
export const LegalPreview = ({ entry }: { entry: MegaMenuEntry }) => <PreviewFrame entry={entry} metadata={<>{entry.documentType && <span className="border border-border-default px-2 py-1 font-mono text-[10px] tracking-wide text-text-secondary uppercase">{entry.documentType.replaceAll('-', ' ')}</span>}{entry.updatedAt && <PreviewDate value={entry.updatedAt} />}</>} />
