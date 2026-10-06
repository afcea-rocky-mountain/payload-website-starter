import * as migration_20261005_034529_initial from './20261005_034529_initial';
import * as migration_20261005_042059_add_board_contact_links from './20261005_042059_add_board_contact_links';
import * as migration_20261006_230306_add_blob_storage_fields from './20261006_230306_add_blob_storage_fields';

export const migrations = [
  {
    up: migration_20261005_034529_initial.up,
    down: migration_20261005_034529_initial.down,
    name: '20261005_034529_initial',
  },
  {
    up: migration_20261005_042059_add_board_contact_links.up,
    down: migration_20261005_042059_add_board_contact_links.down,
    name: '20261005_042059_add_board_contact_links',
  },
  {
    up: migration_20261006_230306_add_blob_storage_fields.up,
    down: migration_20261006_230306_add_blob_storage_fields.down,
    name: '20261006_230306_add_blob_storage_fields'
  },
];
