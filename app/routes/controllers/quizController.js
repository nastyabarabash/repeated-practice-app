import * as topicsService from "../../services/topicsService.js";
import * as quizService from "../../services/quizService.js";
import * as optionsService from "../../services/optionsService.js";
import { validasaur } from "../../deps.js";

const listTopics = async ({ render, state }) => {
  render("quizzes.eta", {
    topics: await topicsService.listAvailableTopics(),
    user: await state.session.get("user"),
  });
};

const listQuizzes = async ({ params, render }) => {
  const topicId = params.id;

  if (!topicId) {
    render("quiz.eta", {
      error: "Missing or invalid topic ID.",
      quizzes: [],
      topic: null,
    });
    return;
  }

  const topic = await topicsService.getTopicById({ id: topicId });
  if (!topic) {
    render("quiz.eta", {
      error: "Topic not found.",
      quizzes: [],
      topic: null,
    });
    return;
  }

  const quizzes = await quizService.getRandomQuestion(topicId);
  render("quiz.eta", { topic, quizzes });
};

const randomQuestion = async ({ params, response }) => {
  const topicId = params.id;

  const randomQuestion = await quizService.getRandomQuestion(topicId);

  if (!randomQuestion || !randomQuestion.id) {
    response.status = 404;
    response.body = "No questions found for this topic.";
    return;
  }

  response.redirect(`/quiz/${topicId}/questions/${randomQuestion.id}`);
};

const showQuestion = async ({ params, render }) => {
  const topicId = parseInt(params.id, 10); 
  const questionId = parseInt(params.qId, 10);

  if (isNaN(topicId) || isNaN(questionId)) {
    console.error("Invalid topic ID or question ID:", { topicId, questionId });
    render("quiz.eta", { message: "Invalid topic ID or question ID." });
    return;
  }

  const question = await quizService.getQuestionById(questionId);
  if (!question) {
    console.error("Question not found:", questionId);
    render("quiz.eta", { message: "Question not found." });
    return;
  }

  const options = await optionsService.listAvailableOptions(questionId);

  render("quiz.eta", {
    randomQuestion: question,
    options,
    topicId, 
  });
};



export { listTopics, listQuizzes, randomQuestion, showQuestion };