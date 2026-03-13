// import type { HttpContext } from '@adonisjs/core/http'

import Post from "#models/post";
import { HttpContext } from "@adonisjs/core/http";

export default class PostsController {
	async index({ view, auth }: HttpContext) {
		return view.render("pages/posts", {
			posts: await Post.query().preload("topic", (query) => {
				return query.where({ userId: auth.user!.id });
				//  ({ topic: { userId: auth.user?.id } });
			}),
		});
	}
}
