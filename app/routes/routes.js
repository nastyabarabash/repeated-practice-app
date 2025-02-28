import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicsController from "./controllers/topicsController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionsController from "./controllers/questionsController.js";
import * as optionsController from "./controllers/optionsController.js";
import * as quizController from "./controllers/quizController.js";

import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicsController.listTopics);
router.post("/topics", topicsController.addATopic);
router.post("/topics/:id/delete", topicsController.deleteTopic);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/topics/:id", questionsController.listQuestions);
router.post("/topics/:id/questions", questionsController.addAQuestion);
router.get("/topics/:id/questions/:qId", questionsController.questionData);
router.post("/topics/:id/questions/:qId/delete", questionsController.deleteQuestion);
router.post("/topics/:id/questions/:qId/options", optionsController.addAnOption);
router.post("/topics/:id/questions/:qId/options/:oId/delete", optionsController.deleteAnOption);

router.get("/api/questions", questionApi.listAvailableQuestions);
router.get("/api/questions/random", questionApi.getRandomQuestionAPI);
router.post("/api/questions/answer", questionApi.submitAnswer);

router.get("/quiz", quizController.listTopics);
router.post("/quiz/:id", quizController.randomQuestion);
router.get("/quiz/:id/questions/:qId", quizController.showQuestion);
router.post("/quiz/:id/questions/:qId/options/:oId", quizController.submitAnswer);
router.get("/quiz/:id/questions/:qId/correct", quizController.showCorrectAnswerPage);
router.get("/quiz/:id/questions/:qId/incorrect", quizController.showIncorrectAnswerPage);

export { router };