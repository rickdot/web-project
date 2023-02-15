import * as quizService from "../../services/quizService.js";

const getRandomQuestionId = async ({response, render}) => {
    const question = await quizService.getRandomQuestionId();
    // no questions so far
    if (!question) {
        render("NoQuestion.eta");
        return
    }

    response.redirect(`/quiz/${question.id}`);
}

const getQuestionAndOptions = async ({ render, params }) => {
    const question_id = params.id;
    const questionData = await quizService.getQuestionAndOptions(question_id);
    
    render("quiz.eta", questionData );
};

const processChoice = async ({params, response, state}) => {
    const question_id = params.id;
    const option_id = params.optionId;
    const user_id = (await state.session.get("user")).id;
    const is_correct = await quizService.handleChoice(user_id, question_id, option_id);
    if (is_correct) {
        response.redirect(`/quiz/${question_id}/correct`);
    } else {
        response.redirect(`/quiz/${question_id}/incorrect`);
    }
}

const showCorrect = async ({params, render}) => {
    render("correct.eta");
}

const showIncorrect = async ({params, render}) => {
    const question_id = params.id;
    const correctOption = await quizService.getCorrectOption(question_id);
    render("incorrect.eta",{ correctOptionText: correctOption});
}


export { getRandomQuestionId,
    getQuestionAndOptions,
    processChoice,
    showCorrect, 
    showIncorrect,
    }