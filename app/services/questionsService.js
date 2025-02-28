import { sql } from "../database/database.js";

const addQuestion = async (userId, topicId, questionText) => {
  await sql`INSERT INTO questions
      (user_id, topic_id, question_text)
        VALUES (${userId}, ${topicId}, ${questionText})`;
};

const listAvailableQuestionsAPI = async (topicId = null) => {
  if (topicId) {
    const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY RANDOM()`;
    return rows.length > 0 ? rows[0] : null;
  } else {
    const rows = await sql`SELECT * FROM questions ORDER BY RANDOM()`;
    return rows.length > 0 ? rows[0] : null;
  }
};

const listAvailableQuestions = async (topicId) => {
  if (!topicId) {
    throw new Error('topicId is required');
  }

  const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
  return rows;

}

const deleteQuestion = async (questionId) => {
  if (!questionId) {
    throw new Error("Question ID is required.");
  }
  await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;

  await sql`DELETE FROM questions WHERE id = ${questionId}`;
};

const getQuestionById = async ({ id }) => {
  const rows = await sql`SELECT * FROM questions WHERE id = ${id}`;
  return rows.length > 0 ? rows[0] : null;
};

export { addQuestion, listAvailableQuestionsAPI, listAvailableQuestions, deleteQuestion, getQuestionById };