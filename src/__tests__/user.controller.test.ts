import {
  getMyProfil,
  getUserProfilByID,
  getAllUsers,
  editProfil,
  deleteUser,
} from "../controllers/user.controllers";

import { fakeDb } from "../jest.setup";
import bcrypt from "bcrypt";

// Mock bcrypt
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getMyProfil", () => {
  it("retourne le profil si l'utilisateur existe", async () => {
    const req: any = { user: { id: 1 } };
    const res = mockRes();

    fakeDb.get.mockResolvedValue({
      id: 1,
      username: "john",
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
      bio: "Hello",
      avatar_url: "url",
    });

    await getMyProfil(req, res);

    expect(fakeDb.get).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [1]
    );

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
    const req: any = { user: { id: 2 } };
    const res = mockRes();

    fakeDb.get.mockResolvedValue(undefined);

    await getMyProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Utilisateur introuvable",
    });
  });
});

describe("getUserProfilByID", () => {
  it("retourne le profil demandé", async () => {
    const req: any = { params: { id: "5" } };
    const res = mockRes();

    fakeDb.get.mockResolvedValue({
      id: 5,
      username: "louis",
      first_name: "Louis",
      last_name: "Dupont",
      bio: "bio",
      avatar_url: "img",
    });

    await getUserProfilByID(req, res);

    expect(fakeDb.get).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      ["5"]
    );

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
    const req: any = { params: { id: "10" } };
    const res = mockRes();

    fakeDb.get.mockResolvedValue(undefined);

    await getUserProfilByID(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("getAllUsers", () => {
  it("retourne la liste paginée des utilisateurs", async () => {
    const req: any = { query: { page: "1", limit: "2" } };
    const res = mockRes();

    fakeDb.all.mockResolvedValue([
      { id: 1, username: "A", email: "a@test.com" },
      { id: 2, username: "B", email: "b@test.com" },
    ]);

    fakeDb.get.mockResolvedValue({ count: 10 });

    await getAllUsers(req, res);

    expect(fakeDb.all).toHaveBeenCalledWith(
      "SELECT id, username, email FROM users LIMIT ? OFFSET ?",
      [2, 0]
    );

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
    const req: any = {
      user: { id: 1 },
      body: { username: "newname", bio: "newbio" },
    };
    const res = mockRes();

    fakeDb.run.mockResolvedValue({ changes: 1 });
    fakeDb.get.mockResolvedValue({
      id: 1,
      username: "newname",
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
      bio: "newbio",
    });

    await editProfil(req, res);

    expect(fakeDb.run).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("retourne 400 si aucun champ valide", async () => {
    const req: any = { user: { id: 1 }, body: { test: "nope" } };
    const res = mockRes();

    await editProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 404 si aucun changement", async () => {
    const req: any = { user: { id: 1 }, body: { username: "x" } };
    const res = mockRes();

    fakeDb.run.mockResolvedValue({ changes: 0 });

    await editProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteUser", () => {
  it("supprime l'utilisateur si password OK", async () => {
    const req: any = {
      user: { id: 1 },
      body: { passwordTest: "1234" },
    };
    const res = mockRes();

    fakeDb.get.mockResolvedValue({
      username: "john",
      password: "hashed",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    fakeDb.run.mockResolvedValue({ changes: 1 });

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "L'utilisateur john a été supprimé avec succès.",
    });
  });

  it("renvoie 401 si mauvais mot de passe", async () => {
    const req: any = {
      user: { id: 1 },
      body: { passwordTest: "wrong" },
    };
    const res = mockRes();

    fakeDb.get.mockResolvedValue({
      username: "john",
      password: "hashed",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("renvoie 404 si utilisateur introuvable", async () => {
    const req: any = { user: { id: 1 }, body: { passwordTest: "x" } };
    const res = mockRes();

    fakeDb.get.mockResolvedValue(undefined);

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
