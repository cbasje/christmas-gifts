CREATE TABLE "secret_santa_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"family" integer NOT NULL,
	"giver" text NOT NULL,
	"receiver" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_family_families_id_fk" FOREIGN KEY ("family") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_giver_users_id_fk" FOREIGN KEY ("giver") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_receiver_users_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;