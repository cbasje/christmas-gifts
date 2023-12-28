CREATE TABLE IF NOT EXISTS "ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" text,
	"recipient_id" text NOT NULL,
	"gifted_by_id" text,
	"link" text,
	"gift_item_id" text,
	"purchased" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "gift_items" DROP COLUMN IF EXISTS "idea";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ideas" ADD CONSTRAINT "ideas_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ideas" ADD CONSTRAINT "ideas_gifted_by_id_users_id_fk" FOREIGN KEY ("gifted_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ideas" ADD CONSTRAINT "ideas_gift_item_id_gift_items_id_fk" FOREIGN KEY ("gift_item_id") REFERENCES "gift_items"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
