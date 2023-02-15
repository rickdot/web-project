import { executeQuery } from "../database/database.js";

const addUser = async (email, hash) => {
  await executeQuery(
    `INSERT INTO users
      (email, password)
        VALUES ($1, $2)`,
    email,
    hash,
  );
};

const findUserByEmail = async (email) => {
  const result = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );

  return result.rows;
};

export { addUser, findUserByEmail };