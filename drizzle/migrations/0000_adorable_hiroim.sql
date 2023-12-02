CREATE TABLE IF NOT EXISTS "gift_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" text,
	"notes" text,
	"recipient_id" text NOT NULL,
	"gifted_by_id" text,
	"link" text,
	"pic" text,
	"purchased" boolean DEFAULT false NOT NULL,
	"idea" boolean DEFAULT false NOT NULL,
	"idea_link_id" text,
	"groups" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"start" timestamp DEFAULT now() NOT NULL,
	"end" timestamp,
	"reason" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "keys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hashed_password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL,
	"group" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"user_name" text NOT NULL,
	"partner_id" text,
	"groups" jsonb,
	"hue" integer DEFAULT 145 NOT NULL,
	"sizes" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_gifted_by_id_users_id_fk" FOREIGN KEY ("gifted_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "keys" ADD CONSTRAINT "keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
