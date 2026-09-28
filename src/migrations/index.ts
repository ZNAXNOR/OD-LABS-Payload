import * as migration_20260927_171006_ai_vector from './20260927_171006_ai_vector';

export const migrations = [
  {
    up: migration_20260927_171006_ai_vector.up,
    down: migration_20260927_171006_ai_vector.down,
    name: '20260927_171006_ai_vector'
  },
];
