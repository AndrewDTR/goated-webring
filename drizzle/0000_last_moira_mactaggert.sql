CREATE TABLE `invites` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`expires_at` integer NOT NULL,
	`uses` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invites_id_unique` ON `invites` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `invites_code_unique` ON `invites` (`code`);--> statement-breakpoint
CREATE TABLE `settings` (
	`setting` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_setting_unique` ON `settings` (`setting`);--> statement-breakpoint
CREATE TABLE `sites` (
	`id` integer PRIMARY KEY NOT NULL,
	`link` text NOT NULL,
	`order` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_id_unique` ON `sites` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sites_link_unique` ON `sites` (`link`);--> statement-breakpoint
CREATE UNIQUE INDEX `sites_order_unique` ON `sites` (`order`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);