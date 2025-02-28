import * as questionsService from "../../services/questionsService.js";
import * as quizService from "../../services/quizService.js";
import * as optionsService from "../../services/optionsService.js";

const listAvailableQuestions = async ({ response }) => {
  const questions = await questionsService.listAvailableQuestionsAPI();

  for (let i = 0; i < questions.length; i++) {
    delete questions[i].id;
    delete questions[i].user_id;
  }

  response.body = questions;
};

const getRandomQuestionAPI = async ({ response }) => {
  const randomQuestion = await quizService.getRandomQuestion();

  if (!randomQuestion) {
    response.body = {};
    return;
  }

  const answerOptions = await optionsService.listAvailableOptions(randomQuestion.id);

  response.status = 200;
  response.body = {
    questionId: randomQuestion.id,
    questionText: randomQuestion.question_text,
    answerOptions: answerOptions.map((option) => ({
      optionId: option.id,
      optionText: option.option_text,
    })),
  };
};

const submitAnswer = async ({ request, response }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      response.status = 400;
      response.body = { error: "Content-Type must be application/json" };
      return;
    }

    const { questionId, optionId } = await request.body().value;

    if (!questionId || !optionId) {
      response.status = 400;
      response.body = { error: "Missing questionId or optionId" };
      return;
    }

    const chosenOption = await optionsService.getOptionById(optionId);
    if (!chosenOption) {
      response.status = 404;
      response.body = { error: "Option not found" };
      return;
    }

    const correctOption = await optionsService.getCorrectOptionByQuestionId(questionId);
    if (!correctOption) {
      response.status = 404;
      response.body = { error: "Correct option not found" };
      return;
    }

    const isCorrect = chosenOption.is_correct;

    response.status = 200;
    response.body = { correct: isCorrect };
  } catch (err) {
    console.error("Error submitting answer:", err);
    response.status = 500;
    response.body = { error: "An error occurred while submitting the answer" };
  }
};

export { listAvailableQuestions, getRandomQuestionAPI, submitAnswer };