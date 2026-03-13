import { PostSchema } from "#database/schema";
import { belongsTo } from "@adonisjs/lucid/orm";
import UserTopic from "./user_topic.ts";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

export default class Post extends PostSchema {
	@belongsTo(() => UserTopic, { foreignKey: "topicId" })
	declare topic: BelongsTo<typeof UserTopic>;
}
