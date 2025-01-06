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
  await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;

  await sql`DELETE FROM topics WHERE id = ${topicId}`;
};

const getTopicById = async ({ id }) => {
  const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;
  return rows.length > 0 ? rows[0] : null;
};

export { listAvailableTopics, addTopic, findTopicByName, deleteTopic, getTopicById };