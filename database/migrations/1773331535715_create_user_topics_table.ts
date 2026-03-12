import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "user_topics";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.timestamp("created_at");
			table.timestamp("updated_at");
			table.text("name");
			table.integer("user_id").unsigned().notNullable();
			table.foreign("user_id").references("users.id").onDelete("CASCADE");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
