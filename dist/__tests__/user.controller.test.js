"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controllers_1 = require("../controllers/user.controllers");
const jest_setup_1 = require("../jest.setup");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Mock bcrypt
jest.mock("bcrypt", () => ({
    compare: jest.fn(),
}));
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
beforeEach(() => {
    jest.clearAllMocks();
});
describe("getMyProfil", () => {
    it("retourne le profil si l'utilisateur existe", async () => {
        const req = { user: { id: 1 } };
        const res = mockRes();
        jest_setup_1.fakeDb.get.mockResolvedValue({
            id: 1,
            username: "john",
            email: "john@test.com",
            first_name: "John",
            last_name: "Doe",
            bio: "Hello",
            avatar_url: "url",
        });
        await (0, user_controllers_1.getMyProfil)(req, res);
        expect(jest_setup_1.fakeDb.get).toHaveBeenCalledWith("SELECT * FROM users WHERE id = ?", [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: 1,
                username: "john",
                email: "john@test.com",
                firstName: "John",
                lastName: "Doe",
                bio: "Hello",
                avatar_url: "url",
            },
        });
    });
    it("renvoie 404 si l'utilisateur n'existe pas", async () => {
        const req = { user: { id: 2 } };
        const res = mockRes();
        jest_setup_1.fakeDb.get.mockResolvedValue(undefined);
        await (0, user_controllers_1.getMyProfil)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Utilisateur introuvable",
        });
    });
});
describe("getUserProfilByID", () => {
    it("retourne le profil demandé", async () => {
        const req = { params: { id: "5" } };
        const res = mockRes();
        jest_setup_1.fakeDb.get.mockResolvedValue({
            id: 5,
            username: "louis",
            first_name: "Louis",
            last_name: "Dupont",
            bio: "bio",
            avatar_url: "img",
        });
        await (0, user_controllers_1.getUserProfilByID)(req, res);
        expect(jest_setup_1.fakeDb.get).toHaveBeenCalledWith("SELECT * FROM users WHERE id = ?", ["5"]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: 5,
                username: "louis",
                firstName: "Louis",
                lastName: "Dupont",
                bio: "bio",
                avatar_url: "img",
            },
        });
    });
    it("renvoie 404 si l'utilisateur n'existe pas", async () => {
        const req = { params: { id: "10" } };
        const res = mockRes();
        jest_setup_1.fakeDb.get.mockResolvedValue(undefined);
        await (0, user_controllers_1.getUserProfilByID)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
describe("getAllUsers", () => {
    it("retourne la liste paginée des utilisateurs", async () => {
        const req = { query: { page: "1", limit: "2" } };
        const res = mockRes();
        jest_setup_1.fakeDb.all.mockResolvedValue([
            { id: 1, username: "A", email: "a@test.com" },
            { id: 2, username: "B", email: "b@test.com" },
        ]);
        jest_setup_1.fakeDb.get.mockResolvedValue({ count: 10 });
        await (0, user_controllers_1.getAllUsers)(req, res);
        expect(jest_setup_1.fakeDb.all).toHaveBeenCalledWith("SELECT id, username, email FROM users LIMIT ? OFFSET ?", [2, 0]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            page: 1,
            limit: 2,
            total: 10,
            totalPages: 5,
            data: [
                { id: 1, username: "A", email: "a@test.com" },
                { id: 2, username: "B", email: "b@test.com" },
            ],
        });
    });
});
describe("editProfil", () => {
    it("met à jour le profil", async () => {
        const req = {
            user: { id: 1 },
            body: { username: "newname", bio: "newbio" },
        };
        const res = mockRes();
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 1 });
        jest_setup_1.fakeDb.get.mockResolvedValue({
            id: 1,
            username: "newname",
            email: "john@test.com",
            first_name: "John",
            last_name: "Doe",
            bio: "newbio",
        });
        await (0, user_controllers_1.editProfil)(req, res);
        expect(jest_setup_1.fakeDb.run).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it("retourne 400 si aucun champ valide", async () => {
        const req = { user: { id: 1 }, body: { test: "nope" } };
        const res = mockRes();
        await (0, user_controllers_1.editProfil)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("retourne 404 si aucun changement", async () => {
        const req = { user: { id: 1 }, body: { username: "x" } };
        const res = mockRes();
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 0 });
        await (0, user_controllers_1.editProfil)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
describe("deleteUser", () => {
    it("supprime l'utilisateur si password OK", async () => {
        const req = {
            user: { id: 1 },
            body: { passwordTest: "1234" },
        };
        const res = mockRes();
        jest_setup_1.fakeDb.get.mockResolvedValue({
            username: "john",
            password: "hashed",
        });
        bcrypt_1.default.compare.mockResolvedValue(true);
        jest_setup_1.fakeDb.run.mockResolvedValue({ changes: 1 });
        await (0, user_controllers_1.deleteUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "L'utilisateur john a été supprimé avec succès.",
        });
    });
    it("renvoie 401 si mauvais mot de passe", async () => {
        const req = {
            user: { id: 1 },
            body: { passwordTest: "wrong" },
        };
        const res = mockRes();
        jest_setup_1.fakeDb.get.mockResolvedValue({
            username: "john",
            password: "hashed",
        });
        bcrypt_1.default.compare.mockResolvedValue(false);
        await (0, user_controllers_1.deleteUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("renvoie 404 si utilisateur introuvable", async () => {
        const req = { user: { id: 1 }, body: { passwordTest: "x" } };
        const res = mockRes();
        jest_setup_1.fakeDb.get.mockResolvedValue(undefined);
        await (0, user_controllers_1.deleteUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });
});
