import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "posts";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.timestamp("created_at");
			table.timestamp("updated_at");
      table.text("content")
			table.integer("topic_id").unsigned().notNullable();
			table.foreign("topic_id").references("user_topics.id").onDelete("CASCADE");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
