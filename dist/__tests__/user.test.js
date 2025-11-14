"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const config_1 = __importDefault(require("../__mocks__/config"));
jest.mock('../config/config');
// Mock du middleware authenticateToken
jest.mock("../middlewares/auth.middlewares", () => {
    return (req, res, next) => {
        req.user = { id: 1 }; // utilisateur authentifié
        next();
    };
});
describe("User Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // -------------------------
    // GET /profil
    // -------------------------
    test("GET /profil → retourne les infos de l'utilisateur connecté", async () => {
        config_1.default.get.mockResolvedValue({
            id: 1,
            username: "john",
            email: "john@test.com",
            first_name: "John",
            last_name: "Doe",
            bio: "Hello",
            avatar_url: null,
        });
        const res = await (0, supertest_1.default)(app_1.default).get("/profil");
        expect(res.status).toBe(200);
        expect(res.body.user.username).toBe("john");
        expect(config_1.default.get).toHaveBeenCalledTimes(1);
    });
    // -------------------------
    // GET /profil/:id
    // -------------------------
    test("GET /profil/:id → retourne un profil existant", async () => {
        config_1.default.get.mockResolvedValue({
            id: 5,
            username: "mike",
            first_name: "Mike",
            last_name: "Tyson",
            bio: "Boxeur",
            avatar_url: null,
        });
        const res = await (0, supertest_1.default)(app_1.default).get("/profil/5");
        expect(res.status).toBe(200);
        expect(res.body.user.username).toBe("mike");
        expect(config_1.default.get).toHaveBeenCalledTimes(1);
    });
    test("GET /profil/:id → retourne 404 si l'utilisateur n'existe pas", async () => {
        config_1.default.get.mockResolvedValue(undefined);
        const res = await (0, supertest_1.default)(app_1.default).get("/profil/99");
        expect(res.status).toBe(404);
    });
    // -------------------------
    // GET /users
    // -------------------------
    test("GET /users → retourne une liste paginée d'utilisateurs", async () => {
        config_1.default.all.mockResolvedValue([
            { id: 1, username: "john", email: "john@test.com" },
            { id: 2, username: "anna", email: "anna@test.com" }
        ]);
        config_1.default.get.mockResolvedValue({ count: 2 });
        const res = await (0, supertest_1.default)(app_1.default).get("/users");
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(config_1.default.all).toHaveBeenCalledTimes(1);
        expect(config_1.default.get).toHaveBeenCalledTimes(1);
    });
    // -------------------------
    // PUT /
    // -------------------------
    test("PUT / → modifie le profil", async () => {
        config_1.default.run.mockResolvedValue({ changes: 1 });
        config_1.default.get.mockResolvedValue({
            id: 1,
            username: "updated",
            email: "john@test.com",
            first_name: "John",
            last_name: "Doe",
            bio: "new bio"
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/")
            .send({ username: "updated", bio: "new bio" });
        expect(res.status).toBe(200);
        expect(res.body.user.username).toBe("updated");
        expect(config_1.default.run).toHaveBeenCalledTimes(1);
    });
    // -------------------------
    // DELETE /
    // -------------------------
    test("DELETE / → supprime l'utilisateur si mot de passe ok", async () => {
        config_1.default.get.mockResolvedValue({
            username: "john",
            password: "$2b$10$hashedpwd"
        });
        // bcrypt.compare doit être mocké
        jest.spyOn(require("bcrypt"), "compare")
            .mockResolvedValue(true);
        config_1.default.run.mockResolvedValue({ changes: 1 });
        const res = await (0, supertest_1.default)(app_1.default)
            .delete("/")
            .send({ passwordTest: "test123" });
        expect(res.status).toBe(200);
        expect(res.body.message).toContain("supprimé");
        expect(config_1.default.run).toHaveBeenCalledTimes(1);
    });
});
