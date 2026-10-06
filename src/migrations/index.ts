import * as migration_20261005_034529_initial from './20261005_034529_initial';
import * as migration_20261005_042059_add_board_contact_links from './20261005_042059_add_board_contact_links';

export const migrations = [
  {
    up: migration_20261005_034529_initial.up,
    down: migration_20261005_034529_initial.down,
    name: '20261005_034529_initial',
  },
  {
    up: migration_20261005_042059_add_board_contact_links.up,
    down: migration_20261005_042059_add_board_contact_links.down,
    name: '20261005_042059_add_board_contact_links'
  },
];
