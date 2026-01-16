import * as migration_20260115_134721 from './20260115_134721';

export const migrations = [
  {
    up: migration_20260115_134721.up,
    down: migration_20260115_134721.down,
    name: '20260115_134721'
  },
];
