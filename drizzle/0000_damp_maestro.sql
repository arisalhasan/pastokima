CREATE TABLE `cms_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`operation` text NOT NULL,
	`revision` integer NOT NULL,
	`content` text NOT NULL,
	`actor` text NOT NULL,
	`created` integer NOT NULL,
	`summary` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `history_operation` ON `cms_history` (`operation`);--> statement-breakpoint
CREATE TABLE `cms_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window` integer NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cms_media` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`size` integer NOT NULL,
	`created` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cms_proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`base` integer NOT NULL,
	`content` text NOT NULL,
	`summary` text NOT NULL,
	`expires` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cms_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`revision` integer NOT NULL,
	`content` text NOT NULL,
	`last_op` text NOT NULL
);
