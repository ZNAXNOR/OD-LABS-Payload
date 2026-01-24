import * as migration_20260115_134721 from './20260115_134721'
import * as migration_20260122_140000_identifier_optimization from './20260122_140000_identifier_optimization'
import * as migration_20260123_072356 from './20260123_072356'
import * as migration_20260123_072930 from './20260123_072930'
import * as migration_20260123_100934_fix_missing_tables from './20260123_100934_fix_missing_tables'

export const migrations = [
  {
    up: migration_20260115_134721.up,
    down: migration_20260115_134721.down,
    name: '20260115_134721',
  },
  {
    up: migration_20260122_140000_identifier_optimization.up,
    down: migration_20260122_140000_identifier_optimization.down,
    name: '20260122_140000_identifier_optimization',
  },
  {
    up: migration_20260123_072356.up,
    down: migration_20260123_072356.down,
    name: '20260123_072356',
  },
  {
    up: migration_20260123_072930.up,
    down: migration_20260123_072930.down,
    name: '20260123_072930',
  },
  {
    up: migration_20260123_100934_fix_missing_tables.up,
    down: migration_20260123_100934_fix_missing_tables.down,
    name: '20260123_100934_fix_missing_tables',
  },
]
