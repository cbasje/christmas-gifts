-- Existing rows get the current year before the NOT NULL column is added;
-- the default is removed again afterwards (new rows always specify a season).
ALTER TABLE "secret_santa_assignments" ADD COLUMN "season" integer NOT NULL DEFAULT (EXTRACT(YEAR FROM NOW())::int);--> statement-breakpoint
ALTER TABLE "secret_santa_assignments" ALTER COLUMN "season" DROP DEFAULT;--> statement-breakpoint

-- Remove duplicate assignments (same family + giver) left over from before the
-- season column existed, keeping the most recent row per family + giver.
DELETE FROM "secret_santa_assignments" a
USING "secret_santa_assignments" b
WHERE a."id" < b."id"
  AND a."family" = b."family"
  AND a."giver" = b."giver";--> statement-breakpoint

ALTER TABLE "families" ADD COLUMN "secret_santa_season" integer DEFAULT 0 NOT NULL;--> statement-breakpoint

CREATE UNIQUE INDEX "secret_santa_assignments_family_giver_season_index" ON "secret_santa_assignments" USING btree ("family","giver","season");