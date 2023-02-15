import { executeQuery } from "../database/database.js";

// get question text of a question
const findQuestionTextById = async (question_id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE id = $1;",question_id);
    const questionText = res.rows[0].question_text;
    return questionText;
};
// get option text of a option
const findOptionTextById = async (option_id) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE id = $1;",option_id);
    const optionText = res.rows[0].option_text;
    return optionText;
};
// get all answers given by a user
const findAnswersByUserId = async (user_id) => {
    const res = await executeQuery("SELECT * FROM question_answers WHERE user_id = $1;",user_id);
    return res.rows;
};
// get all questions created by a user
const findQuestionsByUserId = async (user_id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE user_id = $1;",user_id,);
    return res.rows;
}
// get all answers of a question
const findAnswersByQuestionId = async (question_id) => {
    const res = await executeQuery("SELECT * FROM question_answers WHERE question_id = $1;",question_id);
    return res.rows;
}
// find top 5 users with most answered questions
const findTop5 = async () => {
    const topRes = await executeQuery(
        "SELECT user_id,COUNT(correct) " + 
        "FROM question_answers " +
        "WHERE correct = true " +
        "GROUP BY user_id " +
        "ORDER BY COUNT(correct) DESC " +
        "LIMIT 5;"
    );
    return topRes.rows;
}
// for showing email instead of user_id
const findEmailByUserId = async (user_id) => {
    const res = await executeQuery("SELECT * FROM users WHERE id =$1", user_id);
    return res.rows[0];
}

const getStatDataByUserId = async (user_id) => {
    const givenAnswers = await findAnswersByUserId(user_id);
    // 1. number of answers the user given
    const answerCount = givenAnswers.length;
    // details of each answer  not used yet
    const answers = givenAnswers;
    const answersDetail = [];
    for (const answer of answers) {
        const question_text = await findQuestionTextById(answer.question_id);
        const option_text = await findOptionTextById(answer.question_answer_option_id);
        answersDetail.push({
            qText: question_text,
            oText: option_text,
            correctness: answer.correct
        })
    }

    // 2. total number of correct answers
    let correctCount = 0;
    answers.forEach( answer => {
        if (answer.correct === true) {
            correctCount = correctCount + 1;
        }
    })
    
    const questionsOfThisUser = await findQuestionsByUserId(user_id);
    let question_id_list = []; // stores the question ids that created by current user
    questionsOfThisUser.forEach(question => {
        question_id_list.push(question.id);
    })

    // 3. number of answers given to the user's question
    let answersGivenToThisUsersQuestion = []
    for (const question_id of question_id_list) {
        const temp = await findAnswersByQuestionId(question_id);
        if (temp.length !== 0) {
            answersGivenToThisUsersQuestion = answersGivenToThisUsersQuestion.concat(temp)
        }
    }
    const numberOfAnswersGiven = answersGivenToThisUsersQuestion.length;

    // 4. top 5 users
    let TopUserInfo = []
    const top5users = await findTop5();
    for (const user of top5users) {
        const theEmail = await findEmailByUserId(user.user_id);
        TopUserInfo.push({
            email: theEmail.email,
            correctAnswersCount: Number(user.count),
        })
    }
    
    const allStat = {
        answer_Count: answerCount,
        answersData: answersDetail,
        correct_Count: correctCount,
        answer_given_count: numberOfAnswersGiven,
        topUsers: TopUserInfo

    };

    return allStat;
};

export {getStatDataByUserId}