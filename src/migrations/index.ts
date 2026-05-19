import * as migration_20260508_045738_sync_cta_changes from './20260508_045738_sync_cta_changes';
import * as migration_20260512_081916_comparison_variants from './20260512_081916_comparison_variants';
import * as migration_20260519_055348_add_richtext_description from './20260519_055348_add_richtext_description';
import * as migration_20260519_070417_change_comparison_description_to_richtext from './20260519_070417_change_comparison_description_to_richtext';
import * as migration_20260519_071959_add_icon_to_comparison_items from './20260519_071959_add_icon_to_comparison_items';

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
    name: '20260519_055348_add_richtext_description',
  },
  {
    up: migration_20260519_070417_change_comparison_description_to_richtext.up,
    down: migration_20260519_070417_change_comparison_description_to_richtext.down,
    name: '20260519_070417_change_comparison_description_to_richtext',
  },
  {
    up: migration_20260519_071959_add_icon_to_comparison_items.up,
    down: migration_20260519_071959_add_icon_to_comparison_items.down,
    name: '20260519_071959_add_icon_to_comparison_items'
  },
];
