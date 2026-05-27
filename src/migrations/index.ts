import * as migration_20260526_132910 from './20260526_132910';
import * as migration_20260527_073706 from './20260527_073706';
import * as migration_20260527_112652 from './20260527_112652';

export const migrations = [
  {
    up: migration_20260526_132910.up,
    down: migration_20260526_132910.down,
    name: '20260526_132910',
  },
  {
    up: migration_20260527_073706.up,
    down: migration_20260527_073706.down,
    name: '20260527_073706',
  },
  {
    up: migration_20260527_112652.up,
    down: migration_20260527_112652.down,
    name: '20260527_112652'
  },
];
