import * as migration_20260927_171006_ai_vector from './20260927_171006_ai_vector'
import * as migration_20260928_150741_add_vector_source_metadata from './20260928_150741_add_vector_source_metadata'
import * as migration_20261028_legal_pages from './20261028_legal_pages'

export const migrations = [
  {
    up: migration_20260927_171006_ai_vector.up,
    down: migration_20260927_171006_ai_vector.down,
    name: '20260927_171006_ai_vector',
  },
  {
    up: migration_20260928_150741_add_vector_source_metadata.up,
    down: migration_20260928_150741_add_vector_source_metadata.down,
    name: '20260928_150741_add_vector_source_metadata',
  },
  {
    up: migration_20261028_legal_pages.up,
    down: migration_20261028_legal_pages.down,
    name: '20261028_legal_pages',
  },
]
