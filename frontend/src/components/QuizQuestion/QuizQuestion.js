import React, { useMemo } from "react";
import "./QuizQuestion.css";

const QuizQuestion = ({ questionData, selectedOption, onAnswerSelected, reviewMode = false }) => {
	const { question, correct_answer, incorrect_answers } = questionData;

	const shuffledAnswers = useMemo(() => {
		const allAnswers = [
			...incorrect_answers.map((answer) => ({ answer, correct: false })),
			{ answer: correct_answer, correct: true },
		];
		// During review, no need to shuffle the answers to maintain consistent order for review
		if (!reviewMode) {
			return allAnswers.sort(() => Math.random() - 0.5);
		}
		return allAnswers;
	}, [correct_answer, incorrect_answers, reviewMode]);

	return (
		<div className="question-wrapper">
			<h3 className="question" dangerouslySetInnerHTML={{ __html: question }} />
			<div className="answers">
				{shuffledAnswers.map((option, index) => {
					let optionClassName = "answer";
					const isSelected = selectedOption && option.answer === selectedOption.answer;

					if (reviewMode) {
						if (isSelected) {
							optionClassName += option.correct ? " correct" : " wrong";
						} else if (option.correct) {
							optionClassName += " correct"; // Mark the correct answer if not selected
						}
					} else {
						if (isSelected) {
							optionClassName += " selected";
						}
					}

					return (
						<button
							className={optionClassName}
							key={index}
							onClick={() => !reviewMode && onAnswerSelected(option)}
							dangerouslySetInnerHTML={{ __html: option.answer }}
							disabled={reviewMode} // Disable buttons in review mode
						/>
					);
				})}
			</div>
		</div>
	);
};

export default QuizQuestion;
