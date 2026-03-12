import User from "#models/user";
import env from "#start/env";
import type { HttpContext } from "@adonisjs/core/http";
import { randomUUID } from "crypto";

/**
 * SessionController handles user authentication and session management.
 * It provides methods for displaying the login page, authenticating users,
 * and logging out.
 */
export default class SessionController {
	private redirectUri = `${env.get("APP_URL")}/oauth-redirect`;

	/**
	 * Display the login page
	 */
	async create({ response }: HttpContext) {
		const state = randomUUID();

		await User.create({ state: state });
		const url = encodeURI(
			`https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${this.redirectUri}&state=${state}&response_type=code&scope=w_member_social`,
		);
		return response.redirect(url);
	}

	/**
	 * Authenticate user credentials and create a new session
	 */
	async store({ request, auth, response, session }: HttpContext) {
		const { code, state } = request.all();
		const user = await User.findByOrFail({ state: state });

		const form = new URLSearchParams();
		form.append("grant_type", "authorization_code");
		form.append("code", code);
		form.append("client_id", process.env.LINKEDIN_CLIENT_ID!);
		form.append("client_secret", process.env.LINKEDIN_CLIEN_SECRET!);
		form.append("redirect_uri", this.redirectUri);

		const resp = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
			method: "POST",
			body: form,
		});

		const data = (await resp.json()) as {
			access_token: string;
			expires_in: number;
			score: string;
		};

		user.accessToken = data.access_token;
		await user.save();

		console.log(user);
		// await session.put("isLoggedIn", true);

		// 	const user = await User.verifyCredentials(email, password);

		await auth.use("web").login(user);
		response.redirect().toRoute("home");
	}

	/**
	 * Log out the current user and destroy their session
	 */
	async destroy({ auth, response }: HttpContext) {
		await auth.use("web").logout();
		response.redirect().toRoute("session.create");
	}
}
