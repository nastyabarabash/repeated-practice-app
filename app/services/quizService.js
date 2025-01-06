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

export { listAvailableQuizzes, getRandomQuestion, getQuestionById };