import { sql } from "../database/database.js";

const addUser = async (email, password, isAdmin) => {
  await sql`INSERT INTO users
      (email, password, admin)
        VALUES (${email}, ${password}, ${isAdmin})`;
};

const findUserByEmail = async (email) => {
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows;
};

export { addUser, findUserByEmail };