import * as questionsService from "../../services/questionsService.js";
import * as topicsService from "../../services/topicsService.js";
import * as optionsService from "../../services/optionsService.js";
import { validasaur } from "../../deps.js";

const optionValidationRules = {
  optionText: [validasaur.required, validasaur.minLength(3)],
};

const getOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const optionText = params.get("option_text")?.trim() || "";
  const isCorrect = params.get("is_correct") === "on";

  return { optionText: optionText || "" , isCorrect };
};

const addAnOption = async ({ params, request, response, render, state }) => {
  const questionId = parseInt(params.qId, 10);
  const topicId = params.id;

  if (!topicId || !questionId) {
    const questions = await questionsService.listAvailableQuestions(topicId);
    render("questions.eta", {
      error: "Missing or invalid topic ID or question ID.",
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

  const optionData = await getOptionData(request);

  const [passes, errors] = await validasaur.validate(
    optionData, 
    optionValidationRules
  );

  if (!passes) {
    const options = await optionsService.listAvailableOptions(questionId);
    const question = await questionsService.getQuestionById(questionId);

    render("question.eta", {
      validationErrors: errors,
      options,
      question,
      option_text: optionData.optionText,
    });
    return;
  }

  await optionsService.addOption(questionId, optionData.optionText, optionData.isCorrect);
  response.redirect(`/topics/${topicId}/questions/${questionId}`);
};

const deleteAnOption = async ({ params, response }) => {
  const topicId = params.id;
  const questionId = params.qId;
  const optionId = params.oId;

  if (!topicId || !questionId || !optionId) {
    response.status = 400;
    response.body = { error: "Topic ID, Question ID, and Option ID are required." };
    return;
  }

    await optionsService.deleteOption(optionId);
    response.redirect(`/topics/${topicId}/questions/${questionId}`);
};


export { addAnOption, deleteAnOption };