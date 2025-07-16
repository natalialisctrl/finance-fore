CREATE TABLE "economic_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"inflation_rate" real NOT NULL,
	"gdp_growth" real NOT NULL,
	"consumer_price_index" real NOT NULL,
	"last_updated" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_name" text NOT NULL,
	"current_price" real NOT NULL,
	"average_price_30_day" real NOT NULL,
	"price_range" jsonb NOT NULL,
	"recommendation" text NOT NULL,
	"percentage_change" real NOT NULL,
	"emoji" text NOT NULL,
	"description" text NOT NULL,
	"last_updated" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_list_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"item_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"estimated_price" real NOT NULL,
	"average_price" real NOT NULL,
	"recommendation" text NOT NULL,
	"savings" real NOT NULL,
	"completed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"category" text NOT NULL,
	"budget_amount" real NOT NULL,
	"spent_amount" real NOT NULL,
	"month" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_savings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"weekly_total" real NOT NULL,
	"projected_monthly" real NOT NULL,
	"best_purchases" jsonb NOT NULL,
	"week_of" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");