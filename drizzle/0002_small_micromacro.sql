CREATE TABLE `deviation_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`hand_history_id` int,
	`decision_point` int,
	`player_action` varchar(50),
	`gto_recommendation` varchar(50),
	`deviation_score` float,
	`explanation` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deviation_analysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hand_histories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`file_name` varchar(255),
	`raw_content` text,
	`analysis_result` json,
	`uploaded_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hand_histories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`question_id` varchar(50) NOT NULL,
	`user_answer` varchar(50) NOT NULL,
	`correct_answer` varchar(50) NOT NULL,
	`is_correct` boolean NOT NULL,
	`time_spent_seconds` int,
	`difficulty` varchar(20),
	`category` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategy_comparisons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`strategy1_id` int,
	`strategy2_id` int,
	`comparison_data` json,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `strategy_comparisons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategy_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`strategy_type` varchar(50) NOT NULL,
	`range_data` json,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `strategy_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_attempts` int DEFAULT 0,
	`correct_answers` int DEFAULT 0,
	`current_streak` int DEFAULT 0,
	`longest_streak` int DEFAULT 0,
	`category_stats` json,
	`last_activity_at` timestamp DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
