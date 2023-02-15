import { executeQuery } from "../database/database.js";

const findAnswersByOptionId = async ( option_id) => {
    const result = await executeQuery(
      "SELECT * FROM question_answers WHERE question_answer_option_id = $1;",
      option_id,
    );
  
    return result.rows;
};

const deleteAnswersByOptionId = async (option_id) => {
    await executeQuery(
        "DELETE FROM question_answers WHERE question_answer_option_id = $1",
        option_id,
    );
}

export { findAnswersByOptionId, deleteAnswersByOptionId }