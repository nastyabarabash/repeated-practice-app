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

const getRandomQuestionAPI = async ({ request, response }) => {
  const url = new URL(request.url);
  const topicId = url.searchParams.get("topicId");

  const randomQuestion = await quizService.getRandomQuestion(topicId);

  if (!randomQuestion) {
    response.status = 404;
    response.body = { error: "No random question found." };
    return;
  }

  const answerOptions = await optionsService.listAvailableOptions(randomQuestion.id);

  const responseData = {
    questionId: randomQuestion.id,
    questionText: randomQuestion.question_text,
    answerOptions: answerOptions.map(option => ({
      optionId: option.id,
      optionText: option.option_text,
    })),
  };

  response.status = 200;
  response.body = responseData;
}

export { listAvailableQuestions, getRandomQuestionAPI };