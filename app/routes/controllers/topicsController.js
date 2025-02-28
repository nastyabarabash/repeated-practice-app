import * as topicsService from "../../services/topicsService.js";
import * as requestUtils from "../utils/requestUtils.js";
import { validasaur } from "../../deps.js";

const topicValidationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};

const getTopicData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    name: params.get("name"),
  };
};

const addATopic = async ({ request, response, render, state }) => {
  const topicData = await getTopicData(request);

  const user = await state.session?.get("user");
  const userId = user ? user.id : null;

  const [passes, errors] = await validasaur.validate(
    topicData,
    topicValidationRules,
  );

  if (!passes) {
    topicData.validationErrors = errors;
    topicData.topics = await topicsService.listAvailableTopics();
    render("topics.eta", topicData);
    return;
  }

  const existingTopic = await topicsService.findTopicByName(topicData.name);
  if (existingTopic) {
    topicData.validationErrors = { name: ["Topic name already exists"] };
    topicData.topics = await topicsService.listAvailableTopics();
    render("topics.eta", topicData);
    return;
  }

  await topicsService.addTopic(userId, topicData.name);
  response.redirect("/topics");
};

const listTopics = async ({ render, state }) => {
  render("topics.eta", {
    topics: await topicsService.listAvailableTopics(),
    user: await state.session.get("user"),
  });
};

const deleteTopic = async ({ state, params, response }) => {
  const user = await state.session?.get("user");

  if (!user || !user.admin) {
    response.status = 403;
    response.body = "Error 403";
    return;
  }

  const topicId = params.id;

  if (!topicId) {
    response.status = 400;
    response.body = "Error 400";
    return;
  }

  await topicsService.deleteTopic(topicId);

  response.redirect("/topics");
};

export { addATopic, deleteTopic, listTopics };