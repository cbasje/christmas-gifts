DROP TABLE "keys";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "expires_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hashed_password" varchar(255);--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "active_expires";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "idle_expires";