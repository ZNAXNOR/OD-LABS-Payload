import * as migration_20260508_045738_sync_cta_changes from './20260508_045738_sync_cta_changes';

export const migrations = [
  {
    up: migration_20260508_045738_sync_cta_changes.up,
    down: migration_20260508_045738_sync_cta_changes.down,
    name: '20260508_045738_sync_cta_changes'
  },
];
