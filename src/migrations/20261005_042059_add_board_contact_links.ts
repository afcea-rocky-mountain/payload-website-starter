import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "board_members" ADD COLUMN "github" varchar;
  ALTER TABLE "board_members" ADD COLUMN "website" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "board_members" DROP COLUMN "github";
  ALTER TABLE "board_members" DROP COLUMN "website";`)
}
