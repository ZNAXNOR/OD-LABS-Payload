import * as migration_20260508_045738_sync_cta_changes from './20260508_045738_sync_cta_changes';
import * as migration_20260512_081916_comparison_variants from './20260512_081916_comparison_variants';
import * as migration_20260519_055348_add_richtext_description from './20260519_055348_add_richtext_description';

export const migrations = [
  {
    up: migration_20260508_045738_sync_cta_changes.up,
    down: migration_20260508_045738_sync_cta_changes.down,
    name: '20260508_045738_sync_cta_changes',
  },
  {
    up: migration_20260512_081916_comparison_variants.up,
    down: migration_20260512_081916_comparison_variants.down,
    name: '20260512_081916_comparison_variants',
  },
  {
    up: migration_20260519_055348_add_richtext_description.up,
    down: migration_20260519_055348_add_richtext_description.down,
    name: '20260519_055348_add_richtext_description'
  },
];
