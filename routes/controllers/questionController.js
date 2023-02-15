import * as questionService from "../../services/questionService.js";
import {
  minLength,
  required,
  validate,
} from "../../deps.js";


const questionvalidationRules = {
  title: [required, minLength(1)],
  question_text: [required, minLength(1)],
};

const optionValidationRules = {
  option_text: [required, minLength(1)]
};

// listing all questions created by current user
const listQuestions = async ({ render, request, session, state }) => {
  const user_id = (await state.session.get("user")).id;
  render("questions.eta", {questions: await questionService.getQuestionsByUserId(user_id)});
};

// adding a question
const addQuestion = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const user_id = (await state.session.get("user")).id;
  // data for rendering page
  const data = {
    questions: await questionService.getQuestionsByUserId(user_id),
    title: params.get("title"),
    question_text: params.get("question_text"),
    errors: null,
  };
  // validate
  const [passes, errors] = await validate(data, questionvalidationRules);
  if (!passes) {
    data.errors = errors;
    render("questions.eta", data);
    return
  }
  // validation passed
  await questionService.addQuestion(
    user_id,
    data.title,
    data.question_text,
  );
  response.redirect("/questions");
};


// viewing a question with spicified questionID
const viewQuestion = async ({ response, render, state, params }) => {
  // authorization, check if the question was created by current user
  const user_id = (await state.session.get("user")).id;
  const auth = await questionService.checkAuthorization(user_id, params.id);
  if (!auth) {
    response.body = "you don't have the right to access this";
    return
  }
  
  const question_id = params.id;
  render("question.eta", { 
    question: await questionService.getQuestion(question_id), 
    options: await questionService.getQuestionOptions(question_id),
  });
}

// adding an answer option
const addAnswerOption = async ({ request, response, params, render, state }) => {
  // authorization, check if the question was created by current user
  const user_id = (await state.session.get("user")).id;
  const auth = await questionService.checkAuthorization(user_id, params.id);
  if (!auth) {
    response.body = "you don't have the right to access this";
    return
  }
  // handling form
  const body = request.body({ type: "form" });
  const formparams = await body.value;
  // handling checkbox
  let is_correct = false;
  if (formparams.get("is_correct")) {
    is_correct = true;
  }
  // data for rendering page
  const question_id = params.id;
  const data = {
    option_text: formparams.get("option_text"),
    correctness: is_correct,
    errors: null,
    question: await questionService.getQuestion(question_id), 
    options: await questionService.getQuestionOptions(question_id),
  };
  // validate
  const [passes, errors] = await validate(data, optionValidationRules);
  if (!passes) {
    data.errors = errors;
    render("question.eta", data);
    return
  }
  // validate passed
  await questionService.addAnswerOption(
    question_id,
    formparams.get("option_text"),
    is_correct,
  );
  response.redirect(`/questions/${question_id}`);
};

// removing an answer option
const deleteOption = async ({ response, params, state}) => {
  // authorization
  const user_id = (await state.session.get("user")).id;
  const auth = await questionService.checkAuthorization(user_id, params.questionId);
  if (!auth) {
    response.body = "you don't have the right to access this";
    return
  }

  const question_id = params.questionId;
  const option_id = params.optionId;

  await questionService.removeOptionByOptionId(option_id)

  response.redirect(`/questions/${question_id}`)
}

// removing a question
const deleteQuestion = async ({response, params, state}) => {
  // authorization
  const user_id = (await state.session.get("user")).id;
  const auth = await questionService.checkAuthorization(user_id, params.id);
  if (!auth) {
    response.body = "you don't have the right to access this";
    return
  }

  const question_id = params.id;
  await questionService.deleteQuestionByQuestionId(question_id);
  response.redirect("/questions")
}

export { 
  addQuestion, 
  listQuestions, 
  viewQuestion, 
  addAnswerOption, 
  deleteOption, 
  deleteQuestion,
}