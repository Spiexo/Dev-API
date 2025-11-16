"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_controllers_1 = require("../controllers/admin.controllers");
const jest_setup_1 = require("../jest.setup");
describe("banUser", () => {
    let req;
    let res;
    beforeEach(() => {
        req = { params: { id: "1" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });
    it("banni un utilisateur non banni", async () => {
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, is_banned: 0 });
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 1 });
        await (0, admin_controllers_1.banUser)(req, res);
        expect(jest_setup_1.fakeDb.get).toHaveBeenCalledWith("SELECT id, is_banned FROM users WHERE id = ?", ["1"]);
        expect(jest_setup_1.fakeDb.run).toHaveBeenCalledWith("UPDATE users SET is_banned = 1 WHERE id = ?", ["1"]);
        expect(jest_setup_1.fakeDb.run).toHaveBeenCalledWith("DELETE FROM refresh_tokens WHERE user_id = ?", ["1"]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Utilisateur 1 banni.",
        });
    });
    it("retourne 404 si l'utilisateur n'existe pas", async () => {
        jest_setup_1.fakeDb.get.mockResolvedValue(undefined);
        await (0, admin_controllers_1.banUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Utilisateur introuvable",
        });
    });
    it("retourne une erreur si l'utilisateur est déjà banni", async () => {
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, is_banned: 1 });
        await (0, admin_controllers_1.banUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "L'utilisateur est déjà banni",
        });
    });
});
describe("unbanUser", () => {
    let req;
    let res;
    beforeEach(() => {
        req = { params: { id: "1" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });
    it("déban un utilisateur banni", async () => {
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, is_banned: 1 });
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 1 });
        await (0, admin_controllers_1.unbanUser)(req, res);
        expect(jest_setup_1.fakeDb.get).toHaveBeenCalledWith("SELECT id, is_banned FROM users WHERE id = ?", ["1"]);
        expect(jest_setup_1.fakeDb.run).toHaveBeenCalledWith("UPDATE users SET is_banned = 0 WHERE id = ?", ["1"]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Utilisateur 1 débanni.",
        });
    });
    it("retourne 404 si l'utilisateur n'existe pas", async () => {
        jest_setup_1.fakeDb.get.mockResolvedValue(undefined);
        await (0, admin_controllers_1.unbanUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Utilisateur introuvable",
        });
    });
    it("retourne une erreur si l'utilisateur n'est pas banni", async () => {
        jest_setup_1.fakeDb.get.mockResolvedValue({ id: 1, is_banned: 0 });
        await (0, admin_controllers_1.unbanUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "L'utilisateur n'est pas banni",
        });
    });
});
