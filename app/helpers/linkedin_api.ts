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
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});

	const data = (await resp.json()) as {
		name: string;
		email: string;
		sub: string;
	};

	return { email: data.email, fullName: data.name, sub: data.sub };
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
								text: `Create a post on the topic '${opts.topic.name}' that will be posted on LinkedIn. Must be concise and straight to the point. Add a bit of humor for engagement. Do not use markdown formatting, return raw text + emoji (where appropriate)`,
							},
						],
					},
				],
			}),
		},
	);

	const postText = ((await geminiResponse.json()) as any).candidates[0]
		.content.parts[0].text;

	// console.log(geminiData);

	const response = await fetch("https://api.linkedin.com/rest/posts", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${opts.user.accessToken}`,
			"X-Restli-Protocol-Version": "2.0.0",
			"Linkedin-Version": "202601",
			// "Content-Type": "application/json",
		},
		body: JSON.stringify({
        "author": `urn:li:person:${opts.user.linkedinId}`,
			// author: "urn:li:organization:5515715",
			commentary: postText,
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

	const data = await response.text();
	console.log(data);
	return data;
}
