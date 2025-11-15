CREATE TABLE "family_gifts" (
	"family" integer NOT NULL,
	"gift" integer NOT NULL,
	CONSTRAINT "family_gifts_family_gift_pk" PRIMARY KEY("family","gift")
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"slug" text,
	CONSTRAINT "families_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "family_users" (
	"family" integer NOT NULL,
	"user" text NOT NULL,
	CONSTRAINT "family_users_family_user_pk" PRIMARY KEY("family","user")
);
--> statement-breakpoint
ALTER TABLE "maintenance" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "maintenance" CASCADE;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_name_unique";--> statement-breakpoint
ALTER TABLE "gift_items" DROP CONSTRAINT "gift_items_recipient_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "ideas" DROP CONSTRAINT "ideas_gift_item_id_gift_items_id_fk";
--> statement-breakpoint
ALTER TABLE "ideas" DROP CONSTRAINT "ideas_recipient_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "idea_link_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gift_items" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "family_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "family_gifts" ADD CONSTRAINT "family_gifts_family_families_id_fk" FOREIGN KEY ("family") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "family_gifts" ADD CONSTRAINT "family_gifts_gift_gift_items_id_fk" FOREIGN KEY ("gift") REFERENCES "public"."gift_items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "family_users" ADD CONSTRAINT "family_users_family_families_id_fk" FOREIGN KEY ("family") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "family_users" ADD CONSTRAINT "family_users_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "families_slug_index" ON "families" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_idea_link_id_ideas_id_fk" FOREIGN KEY ("idea_link_id") REFERENCES "public"."ideas"("id") ON DELETE set null ON UPDATE set null;--> statement-breakpoint
ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "gift_items_recipient_id_index" ON "gift_items" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "ideas_gifted_by_id_index" ON "ideas" USING btree ("gifted_by_id");--> statement-breakpoint
CREATE INDEX "ideas_family_id_index" ON "ideas" USING btree ("family_id");--> statement-breakpoint
CREATE INDEX "users_user_name_index" ON "users" USING btree ("user_name");--> statement-breakpoint
ALTER TABLE "gift_items" DROP COLUMN "groups";--> statement-breakpoint
ALTER TABLE "ideas" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "ideas" DROP COLUMN "gift_item_id";--> statement-breakpoint
ALTER TABLE "ideas" DROP COLUMN "purchased";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "groups";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "hashed_password";