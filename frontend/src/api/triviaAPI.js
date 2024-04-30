import axios from "axios";

export const fetchTriviaCategories = async () => {
	try {
		const response = await axios.get("https://opentdb.com/api_category.php");
		return response.data.trivia_categories;
	} catch (error) {
		console.error("Error fetching trivia categories", error);
		throw error;
	}
};

export const fetchQuestions = async (numQuestions, difficulty, categoryId) => {
	try {
		const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`;
		const response = await axios.get(url);
		const data = response.data;
		return data.results;
	} catch (error) {
		console.error("Failed to fetch questions:", error);
	}
};
