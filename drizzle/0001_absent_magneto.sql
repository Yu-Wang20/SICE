CREATE TABLE `hand_outcomes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hole_cards` varchar(20) NOT NULL,
	`flop` varchar(30) NOT NULL,
	`flop_strength` varchar(30) NOT NULL,
	`turn` varchar(40) NOT NULL,
	`turn_strength` varchar(30) NOT NULL,
	`river` varchar(50) NOT NULL,
	`river_strength` varchar(30) NOT NULL,
	`flop_to_turn_improvement` boolean DEFAULT false,
	`turn_to_river_improvement` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hand_outcomes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hand_strength_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hand_type` varchar(30) NOT NULL,
	`total_count` int DEFAULT 0,
	`improvement_to_turn_count` int DEFAULT 0,
	`improvement_to_river_count` int DEFAULT 0,
	`improvement_to_turn_pct` float DEFAULT 0,
	`improvement_to_river_pct` float DEFAULT 0,
	CONSTRAINT `hand_strength_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `hand_strength_stats_hand_type_unique` UNIQUE(`hand_type`)
);
--> statement-breakpoint
CREATE TABLE `position_ranges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`position` varchar(10) NOT NULL,
	`hand_category` varchar(20) NOT NULL,
	`frequency` float DEFAULT 0,
	`push_fold_equity` float DEFAULT 0,
	`opponent_type` varchar(20) NOT NULL,
	CONSTRAINT `position_ranges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `research_concepts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`author` varchar(100),
	`year` int,
	`category` varchar(50),
	`description` text,
	`linked_feature` varchar(50),
	`feature_description` text,
	`key_insight` text,
	CONSTRAINT `research_concepts_id` PRIMARY KEY(`id`)
);
