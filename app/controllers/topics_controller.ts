// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http";

export default class TopicsController {
	/**
	 * Display the signup page
	 */
	async create({ view }: HttpContext) {
		const topics = [
			"AI",
			"Mathematics",
			"Engineering",
			"Geography",
			"Quantum Mechanics",
			"Linguistics",
			"Marine Biology",
			"Renaissance Art",
			"Game Theory",
			"Urban Planning",
			"Astrophysics",
			"Ancient Mythology",
			"Cybersecurity",
			"Neuroscience",
			"Cryptocurrency",
			"Microbiology",
			"Architectural History",
			"Paleontology",
			"Philosophy of Ethics",
			"Meteorology",
			"Sociology",
			"Botany",
			"International Relations",
			"Organic Chemistry",
			"Fashion Design",
			"Robotics",
			"Music Theory",
			"Genetics",
			"Ecological Conservation",
			"Behavioral Economics",
			"Photography",
			"Human Anatomy",
			"Criminology",
			"Aerodynamics",
			"Culinary Arts",
			"Political Science",
			"Anthropology",
			"Theology",
			"Psychology",
			"Renewable Energy",
			"Film Theory",
			"Nanotechnology",
			"Medieval History",
			"Journalism",
			"Materials Science",
			"Agriculture",
			"Sports Medicine",
			"Graphic Design",
			"Epidemiology",
			"Logistics & Supply Chain",
			"Cosmology",
			"Etymology",
			"Space Exploration",
		];
		return view.render("pages/topics", { topics: topics });
	}

	async store({ request, auth, response, session }: HttpContext) {
		const { topic } = request.all();
		console.log(topic);

		return response.json({ working: true });
	}
}
