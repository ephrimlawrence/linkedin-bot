import User from "#models/user";
import UserTopic from "#models/user_topic";
import env from "#start/env";

/**
 * Fetches user info using auth token
 *
 * Docs: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
 */
export async function getUserInfo(accessToken: string) {
	const resp = await fetch("https://api.linkedin.com/v2/userinfo", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});

	const data = (await resp.json()) as {
		name: string;
		email: string;
	};

	console.log(data);
	return { email: data.email, fullName: data.name };
}

export async function createPost(opts: { user: User; topic: UserTopic }) {
	const geminiResponse = await fetch(
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
		{
			method: "POST",
			headers: {
				"x-goog-api-key": env.get("GEMINI_API_KEY"),

				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{
								text: `Create a LinkedIn post on the topic '${opts.topic.name}'`,
							},
						],
					},
				],
			}),
		},
	);

	console.log(await geminiResponse.json());

	const response = await fetch("https://api.linkedin.com/rest/posts", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${opts.user.accessToken}`,
			"X-Restli-Protocol-Version": "2.0.0",
			"Linkedin-Version": "202601",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			author: "urn:li:organization:5515715",
			commentary: "Sample text Post",
			visibility: "PUBLIC",
			distribution: {
				feedDistribution: "MAIN_FEED",
				targetEntities: [],
				thirdPartyDistributionChannels: [],
			},
			lifecycleState: "PUBLISHED",
			isReshareDisabledByAuthor: false,
		}),
	});

	const data = await response.json();
	console.log(data);
	return data;
}
