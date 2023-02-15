import { executeQuery } from "../database/database.js";

const getRandomQuestionId = async () => {
    const question_id = await executeQuery(`SELECT id FROM questions ORDER BY RANDOM() LIMIT 1;`);

    return question_id.rows[0]; 
}

const getQuestionAndOptions = async (question_id) => {
    const question = await executeQuery(`SELECT * FROM questions WHERE id = $1`, question_id);
    const answer_options = await executeQuery(`SELECT * FROM question_answer_options WHERE question_id = $1`, question_id);

    return {question: question.rows[0],
            answer_options: answer_options.rows,
        }; 
}

const handleChoice = async (user_id, question_id, option_id) => {

    const res = await executeQuery(`SELECT is_correct FROM question_answer_options WHERE id = $1`, option_id);
    const correctness = res.rows[0].is_correct;
    await executeQuery(`INSERT INTO question_answers (user_id, question_id, question_answer_option_id, correct) VALUES ($1,$2,$3,$4)`,
        user_id,
        question_id,
        option_id,
        correctness,
        );
    
    if (correctness) {
        return true;
    } else {
        return false;
    }

};

const getCorrectOption = async (question_id) => {
    const res = await executeQuery(
        "SELECT * FROM question_answer_options WHERE question_id = $1 AND is_correct = $2;",
        question_id,
        true,
    )

    return res.rows[0].option_text;
}


export { getRandomQuestionId,
    getQuestionAndOptions,
    handleChoice,
    getCorrectOption
     }