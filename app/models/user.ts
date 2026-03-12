import { UserSchema } from "#database/schema";
import hash from "@adonisjs/core/services/hash";
import { compose } from "@adonisjs/core/helpers";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import UserTopic from "./user_topic.ts";
import { hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

/**
 * User model represents a user in the application.
 * It extends UserSchema and includes authentication capabilities
 * through the withAuthFinder mixin.
 */
export default class User extends compose(UserSchema, withAuthFinder(hash)) {
	@hasMany(() => UserTopic)
	declare topics: HasMany<typeof UserTopic>;
}
