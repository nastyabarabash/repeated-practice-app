import { sql } from "../database/database.js";

const addOption = async (questionId, optionText, isCorrect) => {
  await sql`INSERT INTO question_answer_options
    (question_id, option_text, is_correct)
      VALUES (${questionId}, ${optionText}, ${isCorrect})`;
};

const listAvailableOptions = async (questionId) => {
  if (!questionId) {
    throw new Error('questionId is required');
  }

  const rows = await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
  return rows;
};

const deleteOption = async (id) => {
  if (!id) {
    throw new Error("Option ID is required.");
  }

  await sql`DELETE FROM question_answer_options WHERE id = ${id}`;
};

const getCorrectOptionByQuestionId = async (questionId) => {
    const result = await sql`
      SELECT * FROM question_answer_options 
      WHERE question_id = ${questionId} AND is_correct = TRUE
      LIMIT 1;
    `;
    return result[0];
};

const getOptionById = async (optionId) => {
  const rows = await sql`
    SELECT * FROM question_answer_options
    WHERE id = ${optionId}
  `;
  
  if (rows.length > 0) {
    return rows[0];
  } else {
    throw new Error("Option not found");
  }
};

export { addOption, listAvailableOptions, deleteOption, getCorrectOptionByQuestionId, getOptionById };
