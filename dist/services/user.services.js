"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.banUser = banUser;
const config_1 = require("../config/config");
async function findUserByEmail(email) {
    const rows = await (0, config_1.query)("SELECT * FROM users WHERE email = ?", [email]);
    return rows?.[0] ?? null;
}
async function createUser(user) {
    return await (0, config_1.run)("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [user.username, user.email, user.password]);
}
async function banUser(id) {
    return await (0, config_1.run)("UPDATE users SET is_banned = 1 WHERE id = ?", [id]);
}
