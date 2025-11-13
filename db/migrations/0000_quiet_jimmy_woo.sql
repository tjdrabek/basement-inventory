CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`tote_id` text NOT NULL,
	`name` text NOT NULL,
	`brand` text,
	`quantity` integer,
	`description` text,
	FOREIGN KEY (`tote_id`) REFERENCES `totes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `totes` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`color` text NOT NULL,
	`description` text
);
