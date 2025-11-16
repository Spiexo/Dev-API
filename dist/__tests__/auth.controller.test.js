"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controllers_1 = require("../controllers/auth.controllers");
const jest_setup_1 = require("../jest.setup");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockReturnValue("signed_token"),
    verify: jest.fn(),
}));
jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashed_password"),
    compare: jest.fn(),
}));
describe("register", () => {
    let req;
    let res;
    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });
    it("retourne 400 si champs manquants", async () => {
        await (0, auth_controllers_1.register)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("retourne 400 si mot de passe invalide", async () => {
        req.body = { username: "a", email: "b@test.com", password: "weak" };
        await (0, auth_controllers_1.register)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("retourne 400 si email déjà utilisé", async () => {
        req.body = { username: "a", email: "b@test.com", password: "Motdepasse!" };
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1 });
        await (0, auth_controllers_1.register)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Cet email est déjà utilisé." });
    });
    it("inscrit un utilisateur avec succès", async () => {
        req.body = { username: "john", email: "john@test.com", password: "SuperPass!" };
        jest_setup_1.fakeDb.get.mockResolvedValueOnce(null);
        jest_setup_1.fakeDb.run.mockResolvedValueOnce({ lastID: 1 });
        jest_setup_1.fakeDb.get.mockResolvedValueOnce({
            id: 1,
            username: "john",
            email: "john@test.com",
        });
        await (0, auth_controllers_1.register)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Inscription réussie",
            accessToken: "signed_token",
            user: {
                id: 1,
                username: "john",
                email: "john@test.com",
            },
        });
    });
    it("retourne une erreur SQLITE_CONSTRAINT", async () => {
        req.body = { username: "john", email: "john@test.com", password: "SuperPass!" };
        const sqlError = new Error("SQL error");
        sqlError.code = "SQLITE_CONSTRAINT";
        jest_setup_1.fakeDb.get.mockResolvedValue(null);
        jest_setup_1.fakeDb.run.mockRejectedValue(sqlError);
        await (0, auth_controllers_1.register)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("retourne 500 sur erreur serveur", async () => {
        req.body = { username: "john", email: "john@test.com", password: "SuperPass!" };
        jest_setup_1.fakeDb.get.mockRejectedValue(new Error("fail"));
        await (0, auth_controllers_1.register)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
describe("login", () => {
    let req;
    let res;
    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });
    it("retourne 400 si champs manquants", async () => {
        await (0, auth_controllers_1.login)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("retourne 401 si utilisateur introuvable", async () => {
        req.body = { email: "a@test.com", password: "test" };
        jest_setup_1.fakeDb.get.mockResolvedValue(null);
        await (0, auth_controllers_1.login)(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("refuse un utilisateur banni", async () => {
        req.body = { email: "ban@test.com", password: "test" };
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, email: "ban@test.com", password: "hashed", is_banned: 1 });
        await (0, auth_controllers_1.login)(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it("retourne 401 si mauvais mot de passe", async () => {
        req.body = { email: "a@test.com", password: "wrong" };
        jest_setup_1.fakeDb.get.mockResolvedValue({
            id: 1,
            email: "a@test.com",
            password: "hashed",
            is_banned: 0,
        });
        bcrypt_1.default.compare.mockResolvedValue(false);
        await (0, auth_controllers_1.login)(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("connexion réussie", async () => {
        req.body = { email: "a@test.com", password: "correct" };
        jest_setup_1.fakeDb.get.mockResolvedValue({
            id: 1,
            email: "a@test.com",
            password: "hashed",
            is_banned: 0,
        });
        bcrypt_1.default.compare.mockResolvedValue(true);
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 1 });
        await (0, auth_controllers_1.login)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            accessToken: "signed_token",
        });
    });
});
describe("logout", () => {
    let req;
    let res;
    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });
    it("retourne 400 si champs manquants", async () => {
        await (0, auth_controllers_1.logout)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("retourne 404 si utilisateur introuvable", async () => {
        req.body = { email: "test", password: "pass" };
        jest_setup_1.fakeDb.get.mockResolvedValue(null);
        await (0, auth_controllers_1.logout)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
    it("retourne 401 si mauvais mot de passe", async () => {
        req.body = { email: "test", password: "wrong" };
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, password: "hashed" });
        bcrypt_1.default.compare.mockResolvedValue(false);
        await (0, auth_controllers_1.logout)(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("déconnexion réussie sans token actif", async () => {
        req.body = { email: "test", password: "correct" };
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, password: "hashed" });
        bcrypt_1.default.compare.mockResolvedValue(true);
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 0 });
        await (0, auth_controllers_1.logout)(req, res);
        expect(res.json).toHaveBeenCalledWith({
            message: "Déconnexion réussie (aucun token actif trouvé).",
        });
    });
    it("déconnexion réussie", async () => {
        req.body = { email: "test", password: "correct" };
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, password: "hashed" });
        bcrypt_1.default.compare.mockResolvedValue(true);
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 2 });
        await (0, auth_controllers_1.logout)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
describe("refreshToken", () => {
    let req;
    let res;
    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });
    it("retourne 401 si aucun token fourni", async () => {
        await (0, auth_controllers_1.refreshToken)(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("retourne 403 si token introuvable en BDD", async () => {
        req.body = { refreshToken: "abc" };
        jest_setup_1.fakeDb.get.mockResolvedValue(null);
        await (0, auth_controllers_1.refreshToken)(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it("retourne un nouveau token si refresh token valide", async () => {
        req.body = { refreshToken: "valid" };
        jest_setup_1.fakeDb.get.mockResolvedValue({ token: "valid", user_id: 1 });
        jsonwebtoken_1.default.verify.mockReturnValue({ id: 1, mail: "a@test.com" });
        await (0, auth_controllers_1.refreshToken)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            accessToken: "signed_token",
        });
    });
    it("gère un token invalide", async () => {
        req.body = { refreshToken: "invalid" };
        jest_setup_1.fakeDb.get.mockResolvedValue({ token: "invalid" });
        jsonwebtoken_1.default.verify.mockImplementation(() => {
            throw new Error("invalid token");
        });
        await (0, auth_controllers_1.refreshToken)(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});
