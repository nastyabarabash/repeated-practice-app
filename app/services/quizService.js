import { sql } from "../database/database.js";

const listAvailableQuizzes = async (topicId) => {
  if (!topicId) {
    throw new Error('topicId is required');
  }

  const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
  return rows;
};

const getRandomQuestion = async (topicId = null) => {
  if (topicId) {
    const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY RANDOM() LIMIT 1`;
    return rows.length > 0 ? rows[0] : null;
  } else {
    const rows = await sql`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`;
    return rows.length > 0 ? rows[0] : null;
  }
};

const getQuestionById = async (questionId) => {
  if (!questionId) {
    throw new Error("Invalid questionId passed to getQuestionById");
  }
  const rows = await sql`SELECT * FROM questions WHERE id = ${questionId}`;
  return rows.length > 0 ? rows[0] : null;
};

const saveUserAnswer = async (answerData) => {
  const result = await sql`
    INSERT INTO question_answers (user_id, question_id, question_answer_option_id)
    VALUES (${answerData.user_id}, ${answerData.question_id}, ${answerData.question_answer_option_id})
    RETURNING id;
  `;
  return result;
};

export { listAvailableQuizzes, getRandomQuestion, getQuestionById, saveUserAnswer };