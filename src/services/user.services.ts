import { query, run } from "../config/config";

export async function findUserByEmail(email: string) {
  const rows = await query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows?.[0] ?? null;
}

export async function createUser(user: {
  username: string;
  email: string;
  password: string;
}) {
  return await run(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [user.username, user.email, user.password]
  );
}

export async function banUser(id: number) {
  return await run(
    "UPDATE users SET is_banned = 1 WHERE id = ?",
    [id]
  );
}
