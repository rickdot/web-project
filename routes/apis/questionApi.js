import { executeQuery } from "../../database/database.js";

const getRandomQuestion = async ({ response}) => {
    

    const randomQuestion = (await executeQuery(`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1;`)).rows;
    // if no question
    if (randomQuestion.length === 0) {
        response.body = {};
    }

    const data = {
        questionId : randomQuestion[0].id,
        questionTitle : randomQuestion[0].title,
        questionText : randomQuestion[0].question_text,
        answerOptions: []
    }

    
    const options = (await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1;", randomQuestion[0].id)).rows;
    // if no option
    if (options.length !== 0) {
        for (const option of options) {
        data.answerOptions.push({
            optionId : option.id,
            optionText : option.option_text
        })
        }
    }


    response.body = data;
}


const processChoice = async ({ request}) => {
    const body = request.body({ type: "json" });
    const document = await body.value;

    const question_id = Number(document.questionId);
    const option_id = Number(document.optionId);

    const is_correct = await executeQuery("SELECT is_correct FROM question_answer_options WHERE question_id = $1 AND id = $2",
        question_id,
        option_id,
    )
    if (is_correct) {
        response.body = {correct: true};
    } else {
        response.body = {correct: false};
    }

}

export{
    getRandomQuestion,
    processChoice,
}