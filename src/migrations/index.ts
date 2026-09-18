import * as migration_20260910_180920 from './20260910_180920';

export const migrations = [
  {
    up: migration_20260910_180920.up,
    down: migration_20260910_180920.down,
    name: '20260910_180920'
  },
];
