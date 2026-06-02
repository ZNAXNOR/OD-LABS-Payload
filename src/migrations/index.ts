import * as migration_20260529_072942 from './20260529_072942';
import * as migration_20260530_100421 from './20260530_100421';
import * as migration_20260531_090229_add_prefixed_artifacts from './20260531_090229_add_prefixed_artifacts';
import * as migration_20260531_091732 from './20260531_091732';
import * as migration_20260601_150321 from './20260601_150321';
import * as migration_20260601_151837 from './20260601_151837';

export const migrations = [
  {
    up: migration_20260529_072942.up,
    down: migration_20260529_072942.down,
    name: '20260529_072942',
  },
  {
    up: migration_20260530_100421.up,
    down: migration_20260530_100421.down,
    name: '20260530_100421',
  },
  {
    up: migration_20260531_090229_add_prefixed_artifacts.up,
    down: migration_20260531_090229_add_prefixed_artifacts.down,
    name: '20260531_090229_add_prefixed_artifacts',
  },
  {
    up: migration_20260531_091732.up,
    down: migration_20260531_091732.down,
    name: '20260531_091732',
  },
  {
    up: migration_20260601_150321.up,
    down: migration_20260601_150321.down,
    name: '20260601_150321',
  },
  {
    up: migration_20260601_151837.up,
    down: migration_20260601_151837.down,
    name: '20260601_151837'
  },
];
