import { sql } from "../database/database.js";

const listAvailableTopics = async () => {
  const rows = await sql`SELECT * FROM topics ORDER BY name ASC`;
  return rows;
};

const addTopic = async (userId, name) => {
  await sql`INSERT INTO topics (user_id, name) VALUES (${userId}, ${name})`;
};

const findTopicByName = async (name) => {
  const rows = await sql`SELECT * FROM topics WHERE name = ${name}`;
  return rows.length > 0 ? rows[0] : null;
}

const deleteTopic = async (topicId) => {
  const questions = await sql`SELECT id FROM questions WHERE topic_id = ${topicId}`;
  
  for (const question of questions) {
    const questionId = question.id;

    await sql`DELETE FROM question_answers WHERE question_id = ${questionId}`;

    await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;
  }

  await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;

  await sql`DELETE FROM topics WHERE id = ${topicId}`;


  // await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;

  // await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;

  // await sql`DELETE FROM topics WHERE id = ${topicId}`;
};

const getTopicById = async ({ id }) => {
  const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;
  return rows.length > 0 ? rows[0] : null;
};

export { listAvailableTopics, addTopic, findTopicByName, deleteTopic, getTopicById };