import * as migration_20260903_074210 from './20260903_074210';

export const migrations = [
  {
    up: migration_20260903_074210.up,
    down: migration_20260903_074210.down,
    name: '20260903_074210'
  },
];
