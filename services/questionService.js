import { executeQuery } from "../database/database.js";

// check if the user has permission to access the question
const checkAuthorization = async (user_id, question_id) => {
  const res = await executeQuery("SELECT user_id FROM questions WHERE id = $1",
    question_id
  );
  if (user_id !== res.rows[0].user_id) {
    return false
  }
  return true
}

const getQuestionsByUserId = async (user_id) => {
  const res = await executeQuery(`SELECT * FROM questions WHERE user_id = $1;`, user_id);
  return res.rows;
};

const addQuestion = async (userId, title, question_text) => {
    await executeQuery(
      `INSERT INTO questions
        (user_id, title, question_text)
          VALUES ($1, $2, $3);`,
      userId,
      title,
      question_text,
    );
  };

const getQuestion = async (question_id) => {
    const res = await executeQuery(`SELECT * FROM questions WHERE id = $1;`, question_id);
    return res.rows[0]; // only one 
};

const getQuestionOptions = async (question_id) => {
  const res = await executeQuery(`SELECT * FROM question_answer_options WHERE question_id = $1;`, question_id);
  return res.rows;  // can be empty or multiple
};

// usually a question can be deleted when all its options were deleted, but add an insurance
const deleteQuestionByQuestionId = async (question_id) => {
  await executeQuery("DELETE FROM question_answers WHERE question_id = $1", question_id);
  await executeQuery("DELETE FROM question_answer_options WHERE question_id = $1", question_id);
  await executeQuery("DELETE FROM questions WHERE id = $1", question_id);
};

const addAnswerOption = async (question_id, option_text, is_correct) => {
    await executeQuery(
        `INSERT INTO question_answer_options
          (question_id, option_text, is_correct)
            VALUES ($1, $2, $3);`,
        question_id,
        option_text,
        is_correct,
      );
};

const removeOptionByOptionId = async (option_id) => {
  // remove related answers first
  await executeQuery(`DELETE FROM question_answers WHERE question_answer_option_id = $1 `, option_id);
  await executeQuery(`DELETE FROM question_answer_options WHERE id = $1 `, option_id);

};




export { 
  addQuestion, 
  getQuestionsByUserId, 
  getQuestion, 
  addAnswerOption, 
  getQuestionOptions, 
  removeOptionByOptionId,
  deleteQuestionByQuestionId,
  checkAuthorization,
}