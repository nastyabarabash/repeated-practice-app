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

const randomQuestion = async ({ params, response, render }) => {
  const topicId = params.id;

  if (!topicId) {
    render("quiz.eta", {
      error: "Invalid topic ID.",
      quizzes: [],
      topic: {},
    });
    return;
  }

  const question = await quizService.getRandomQuestion(topicId);

  if (!question || !question.id) {
    render("quiz.eta", {
      error: "No questions available for this topic.",
      quizzes: [],
      topic: { id: topicId, name: "Unknown Topic" },
    });
    return;
  }

  response.redirect(`/quiz/${topicId}/questions/${question.id}`);
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

const submitAnswer = async ({ params, request, state, response }) => {
  const topicId = parseInt(params.id, 10);
  const questionId = parseInt(params.qId, 10);
  const optionId = parseInt(params.oId, 10);

  const user = await state.session.get("user");
  const userId = user ? user.id : null; 

  if (isNaN(topicId) || isNaN(questionId) || isNaN(optionId)) {
    response.status = 400;
    response.body = { error: "Invalid topic, question, or option ID." };
    return;
  }

  const answerData = {
    user_id: userId,
    question_id: questionId,
    question_answer_option_id: optionId,
  };

  const answer = await quizService.saveUserAnswer(answerData);

  const chosenOption = await optionsService.getOptionById(optionId);
  
  const correctOption = await optionsService.getCorrectOptionByQuestionId(questionId);

  if (!chosenOption || !correctOption) {
    response.status = 404;
    response.body = { error: "Option or correct answer not found." };
    return;
  }

  if (chosenOption.is_correct) {
    response.redirect(`/quiz/${topicId}/questions/${questionId}/correct`);
  } else {
    response.redirect(`/quiz/${topicId}/questions/${questionId}/incorrect`);
  }
};

const showCorrectAnswerPage = async ({ params, render }) => {
  const topicId = parseInt(params.id, 10);
  const questionId = parseInt(params.qId, 10);

  const question = await quizService.getQuestionById(questionId);

  render("correct.eta", {
    topicId: topicId,
    questionId: questionId,
  });
};

const showIncorrectAnswerPage = async ({ params, render }) => {
  const topicId = parseInt(params.id, 10);
  const questionId = parseInt(params.qId, 10);

  const question = await quizService.getQuestionById(questionId);
  const correctAnswer = await optionsService.getCorrectOptionByQuestionId(questionId);

  render("incorrect.eta", {
    topicId: topicId,
    correctAnswerText: correctAnswer.option_text,
  });
};

export { listTopics, listQuizzes, randomQuestion, showQuestion, submitAnswer, showCorrectAnswerPage, showIncorrectAnswerPage };