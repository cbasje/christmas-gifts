CREATE TABLE "partners" (
	"user_a" uuid NOT NULL,
	"user_b" uuid NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	CONSTRAINT "partners_user_a_user_b_pk" PRIMARY KEY("user_a","user_b"),
	CONSTRAINT "partners_order" CHECK ("partners"."user_a" < "partners"."user_b")
);
--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_a_users_id_fk" FOREIGN KEY ("user_a") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_b_users_id_fk" FOREIGN KEY ("user_b") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint

-- Backfill existing partner pairs from the old users.partner_id column.
-- partner_id was text and stored the pair on BOTH rows, so LEAST/GREATEST gives
-- the canonical order (user_a < user_b) and DISTINCT collapses the two copies.
-- The cast is required because partner_id was text, not uuid.
INSERT INTO "partners" ("user_a", "user_b", "created_at")
SELECT DISTINCT
	LEAST(u."id", u."partner_id"::uuid),
	GREATEST(u."id", u."partner_id"::uuid),
	now()
FROM "users" u
WHERE u."partner_id" IS NOT NULL
ON CONFLICT DO NOTHING;--> statement-breakpoint

-- The partner pairs now live in their own table; drop the denormalized column
ALTER TABLE "users" DROP COLUMN "partner_id";