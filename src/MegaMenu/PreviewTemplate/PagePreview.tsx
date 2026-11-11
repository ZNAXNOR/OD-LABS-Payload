import type { MegaMenuEntry } from '../registry'
import { PreviewFrame } from './PreviewFrame'
export const PagePreview = ({ entry }: { entry: MegaMenuEntry }) => <PreviewFrame entry={entry} showSections />
