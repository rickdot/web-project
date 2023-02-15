import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as statController from "./controllers/statController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/questions", questionController.listQuestions);
router.post("/questions", questionController.addQuestion);
router.get("/questions/:id", questionController.viewQuestion);
router.post("/questions/:id/options", questionController.addAnswerOption);
router.post("/questions/:questionId/options/:optionId/delete", questionController.deleteOption);
router.post("/questions/:id/delete", questionController.deleteQuestion);

router.get("/quiz", quizController.getRandomQuestionId);
router.get("/quiz/:id", quizController.getQuestionAndOptions);
router.post("/quiz/:id/options/:optionId", quizController.processChoice);
router.get("/quiz/:id/correct", quizController.showCorrect);
router.get("/quiz/:id/incorrect", quizController.showIncorrect);

router.get("/statistics", statController.showStatPage);
router.get("/statistics/answers", statController.showUserAnswers);

router.get("/api/questions/random", questionApi.getRandomQuestion);
router.post("/api/questions/answer", questionApi.processChoice);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/description", mainController.showDescription);
router.get("/logout", loginController.logout);

export { router };