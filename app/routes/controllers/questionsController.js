import * as questionsService from "../../services/questionsService.js";
import * as topicsService from "../../services/topicsService.js";
import * as optionsService from "../../services/optionsService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  question: [validasaur.required, validasaur.minLength(3)],
};

const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const question = params.get("question_text")?.trim();

  return { question: question || "" };
};

const addAQuestion = async ({ params, request, response, render, state }) => {
  const topicId = params.id;

  if (!topicId) {
    const questions = await questionsService.listAvailableQuestions(topicId);
    render("questions.eta", {
      error: "Missing or invalid topic ID.",
      questions,
      topic: { id: topicId },
    });
    return;
  }

  const user = await state.session?.get("user");

  if (!user || !user.id) {
    const questions = await questionsService.listAvailableQuestions(topicId);
    render("questions.eta", {
      error: "You must be logged in to add a question.",
      questions,
      topic: { id: topicId },
    });
    return;
  }

  const userId = user.id;
  const questionData = await getQuestionData(request);

  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );

  if (!passes) {
    const questions = await questionsService.listAvailableQuestions(topicId);

    render("questions.eta", {
      validationErrors: errors,
      questions,
      topic: { id: topicId },
      question_text: questionData.question, 
    });
    return;
  }

  await questionsService.addQuestion(userId, topicId, questionData.question);
  response.redirect(`/topics/${topicId}`);
};

const deleteQuestion = async ({ params, response }) => {
  const topicId = params.id;
  const questionId = params.qId;

  if (!topicId || !questionId) {
    response.status = 400;
    response.body = { error: "Topic ID and Question ID are required." };
    return;
  }

  await questionsService.deleteQuestion(questionId);
  response.redirect(`/topics/${topicId}`);
};

const listQuestions = async ({ params, render }) => {
  const topicId = params.id;

  if (!topicId) {
    render("questions.eta", {
      error: "Missing or invalid topic ID.",
      questions: [],
      topic: null,
    });
    return;
  }

  const topic = await topicsService.getTopicById({ id: topicId });
  if (!topic) {
    render("questions.eta", {
      error: "Topic not found.",
      questions: [],
      topic: null,
    });
    return;
  }

  const questions = await questionsService.listAvailableQuestions(topicId);
  render("questions.eta", { topic, questions });
};

const questionData = async ({ params, response, render }) => {
  const questionId = params.qId;
  const topicId = params.id;

  const options = await optionsService.listAvailableOptions(questionId);
  const question = await questionsService.getQuestionById({ id: questionId });
  if (!question) {
    response.status = 404;
    response.body = "Question not found.";
    return;
  }

  const topic = await topicsService.getTopicById({ id: topicId });
  if (!topic) {
    response.status = 404;
    response.body = "Topic not found.";
    return;
  }

  render("question.eta", { question, options, topic: { id: topicId }, });
};

export { addAQuestion, deleteQuestion, listQuestions, questionData };