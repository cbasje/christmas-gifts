CREATE TABLE IF NOT EXISTS "gift_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"price" text,
	"notes" text,
	"recipient_id" text NOT NULL,
	"gifted_by_id" text,
	"link" text,
	"purchased" boolean DEFAULT false,
	"idea" boolean DEFAULT false,
	"idea_link_id" text,
	"groups" jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "gift_items_id_unique" UNIQUE("id"),
	CONSTRAINT "gift_items_idea_link_id_unique" UNIQUE("idea_link_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "keys" (
	"id" text PRIMARY KEY NOT NULL,
	"hashed_password" text,
	"user_id" text NOT NULL,
	CONSTRAINT "keys_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL,
	"group" text,
	CONSTRAINT "sessions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"user_name" text NOT NULL,
	"partnerId" text,
	"groups" jsonb,
	"hue" integer DEFAULT 145,
	"sizes" jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_partnerId_unique" UNIQUE("partnerId")
);
