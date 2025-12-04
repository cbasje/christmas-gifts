BEGIN;
ALTER TABLE "family_users" DROP CONSTRAINT "family_users_user_users_id_fk";
ALTER TABLE "secret_santa_assignments" DROP CONSTRAINT "secret_santa_assignments_giver_users_id_fk";
ALTER TABLE "secret_santa_assignments" DROP CONSTRAINT "secret_santa_assignments_receiver_users_id_fk";
ALTER TABLE "gift_items" DROP CONSTRAINT "gift_items_recipient_id_users_id_fk";
ALTER TABLE "gift_items" DROP CONSTRAINT "gift_items_gifted_by_id_users_id_fk";
ALTER TABLE "ideas" DROP CONSTRAINT "ideas_gifted_by_id_users_id_fk";
ALTER TABLE "ideas" DROP CONSTRAINT "ideas_recipient_id_users_id_fk";

ALTER TABLE "family_users" ALTER COLUMN "user" SET DATA TYPE uuid USING "user"::uuid;
ALTER TABLE "secret_santa_assignments" ALTER COLUMN "giver" SET DATA TYPE uuid USING giver::uuid;
ALTER TABLE "secret_santa_assignments" ALTER COLUMN "receiver" SET DATA TYPE uuid USING receiver::uuid;
ALTER TABLE "gift_items" ALTER COLUMN "recipient_id" SET DATA TYPE uuid USING recipient_id::uuid;
ALTER TABLE "gift_items" ALTER COLUMN "gifted_by_id" SET DATA TYPE uuid USING gifted_by_id::uuid;
ALTER TABLE "ideas" ALTER COLUMN "recipient_id" SET DATA TYPE uuid USING recipient_id::uuid;
ALTER TABLE "ideas" ALTER COLUMN "gifted_by_id" SET DATA TYPE uuid USING gifted_by_id::uuid;
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "family_users" ADD CONSTRAINT "family_users_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_giver_users_id_fk" FOREIGN KEY ("giver") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_receiver_users_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_gifted_by_id_users_id_fk" FOREIGN KEY ("gifted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_gifted_by_id_users_id_fk" FOREIGN KEY ("gifted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
COMMIT;
