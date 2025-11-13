"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config/config");
const user_services_1 = require("../../services/user.services");
jest.mock("../../config/config");
describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("findUserByEmail → renvoie un utilisateur", async () => {
        const mockUser = { id: 1, email: "test@example.com" };
        config_1.query.mockResolvedValue([mockUser]);
        const result = await (0, user_services_1.findUserByEmail)("test@example.com");
        expect(config_1.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = ?", ["test@example.com"]);
        expect(result).toEqual(mockUser);
    });
    test("createUser → insère un utilisateur", async () => {
        config_1.run.mockResolvedValue({ lastID: 12 });
        const data = {
            username: "john",
            email: "john@example.com",
            password: "hash",
        };
        const result = await (0, user_services_1.createUser)(data);
        expect(config_1.run).toHaveBeenCalledWith("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", ["john", "john@example.com", "hash"]);
        expect(result.lastID).toBe(12);
    });
    test("banUser → met à jour is_banned", async () => {
        config_1.run.mockResolvedValue({ changes: 1 });
        const result = await (0, user_services_1.banUser)(3);
        expect(config_1.run).toHaveBeenCalledWith("UPDATE users SET is_banned = 1 WHERE id = ?", [3]);
        expect(result.changes).toBe(1);
    });
});
