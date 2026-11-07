import * as migration_20260927_171006_ai_vector from './20260927_171006_ai_vector'
import * as migration_20260928_150741_add_vector_source_metadata from './20260928_150741_add_vector_source_metadata'
import * as migration_20261106_233000_add_placeholder_to_form_blocks from './20261106_233000_add_placeholder_to_form_blocks'
import * as migration_20261107_003000_compulsory_preview_step from './20261107_003000_compulsory_preview_step'
import * as migration_20261107_182500_add_object_key_to_media from './20261107_182500_add_object_key_to_media'

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
    up: migration_20261106_233000_add_placeholder_to_form_blocks.up,
    down: migration_20261106_233000_add_placeholder_to_form_blocks.down,
    name: '20261106_233000_add_placeholder_to_form_blocks',
  },
  {
    up: migration_20261107_003000_compulsory_preview_step.up,
    down: migration_20261107_003000_compulsory_preview_step.down,
    name: '20261107_003000_compulsory_preview_step',
  },
  {
    up: migration_20261107_182500_add_object_key_to_media.up,
    down: migration_20261107_182500_add_object_key_to_media.down,
    name: '20261107_182500_add_object_key_to_media',
  },
]
