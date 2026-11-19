ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint

-- Grant the organizer role: this user is the only one who can start and end a season
UPDATE "users" SET "is_admin" = true WHERE "id" = 'b925bcc6-8df0-41a8-b12a-edd578aafb37';