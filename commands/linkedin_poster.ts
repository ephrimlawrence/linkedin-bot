import UserTopic from "#models/user_topic";
import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import { createPost } from "../app/helpers/linkedin_api.ts";

export default class LinkedinPoster extends BaseCommand {
	static commandName = "linkedin:poster";
	static description = "";

	static options: CommandOptions = {};

	async run() {
		this.logger.info("Executing LinkedIn poster command");

		const topics = await UserTopic.all();
		for (const topic of topics) {
			const currentDay = new Date().getDay();
			if ((topic.days as number[]).indexOf(currentDay) === -1) {
				continue;
			}

			if ((topic.days as string[]).indexOf(currentDay.toString()) === -1) {
				continue;
			}

			await topic.load("user");

			await createPost({ user: topic.user, topic: topic });
		}
	}
}
