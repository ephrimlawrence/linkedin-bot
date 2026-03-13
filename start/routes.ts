/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from "#start/kernel";
import { controllers } from "#generated/controllers";
import router from "@adonisjs/core/services/router";

router.on("/").render("pages/home").as("home");

router
	.group(() => {
		router.get("login", [controllers.Session, "create"]);
		router.get("oauth-redirect", [controllers.Session, "store"]);
	})
	.use(middleware.guest());

router
	.group(() => {
		router.get("topics", [controllers.Topics, "create"]).as("topics");
		router.post("topics", [controllers.Topics, "store"]);
	})
	.use(middleware.auth());

router
	.group(() => {
		router.get("posts", [controllers.Posts, "index"]).as("posts");
	})
	.use(middleware.auth());

router
	.group(() => {
		router.post("logout", [controllers.Session, "destroy"]);
	})
	.use(middleware.auth());
