import * as migration_20260523_185742 from './20260523_185742';
import * as migration_20260524_110354 from './20260524_110354';

export const migrations = [
  {
    up: migration_20260523_185742.up,
    down: migration_20260523_185742.down,
    name: '20260523_185742',
  },
  {
    up: migration_20260524_110354.up,
    down: migration_20260524_110354.down,
    name: '20260524_110354'
  },
];
