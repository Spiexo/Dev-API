import { register, login, logout, refreshToken } from "../controllers/auth.controllers";
import { fakeDb } from "../jest.setup";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("signed_token"),
  verify: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn(),
}));

describe("register", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("retourne 400 si champs manquants", async () => {
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 400 si mot de passe invalide", async () => {
    req.body = { username: "a", email: "b@test.com", password: "weak" };
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 400 si email déjà utilisé", async () => {
    req.body = { username: "a", email: "b@test.com", password: "Motdepasse!" };

    fakeDb.get.mockResolvedValue({ id: 1 });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Cet email est déjà utilisé." });
  });

  it("inscrit un utilisateur avec succès", async () => {
    req.body = { username: "john", email: "john@test.com", password: "SuperPass!" };

    fakeDb.get.mockResolvedValueOnce(null);
    fakeDb.run.mockResolvedValueOnce({ lastID: 1 });
    fakeDb.get.mockResolvedValueOnce({
      id: 1,
      username: "john",
      email: "john@test.com",
    });

    await register(req, res);

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

    const sqlError: any = new Error("SQL error");
    sqlError.code = "SQLITE_CONSTRAINT";

    fakeDb.get.mockResolvedValue(null);
    fakeDb.run.mockRejectedValue(sqlError);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 500 sur erreur serveur", async () => {
    req.body = { username: "john", email: "john@test.com", password: "SuperPass!" };

    fakeDb.get.mockRejectedValue(new Error("fail"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});


describe("login", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("retourne 400 si champs manquants", async () => {
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 401 si utilisateur introuvable", async () => {
    req.body = { email: "a@test.com", password: "test" };

    fakeDb.get.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("refuse un utilisateur banni", async () => {
    req.body = { email: "ban@test.com", password: "test" };

    fakeDb.get.mockResolvedValue({ id: 1, email: "ban@test.com", password: "hashed", is_banned: 1 });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retourne 401 si mauvais mot de passe", async () => {
    req.body = { email: "a@test.com", password: "wrong" };

    fakeDb.get.mockResolvedValue({
      id: 1,
      email: "a@test.com",
      password: "hashed",
      is_banned: 0,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("connexion réussie", async () => {
    req.body = { email: "a@test.com", password: "correct" };

    fakeDb.get.mockResolvedValue({
      id: 1,
      email: "a@test.com",
      password: "hashed",
      is_banned: 0,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    fakeDb.run.mockResolvedValue({ changes: 1 });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "signed_token",
    });
  });
});


describe("logout", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("retourne 400 si champs manquants", async () => {
    await logout(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 404 si utilisateur introuvable", async () => {
    req.body = { email: "test", password: "pass" };
    fakeDb.get.mockResolvedValue(null);

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 401 si mauvais mot de passe", async () => {
    req.body = { email: "test", password: "wrong" };

    fakeDb.get.mockResolvedValue({ id: 1, password: "hashed" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("déconnexion réussie sans token actif", async () => {
    req.body = { email: "test", password: "correct" };

    fakeDb.get.mockResolvedValue({ id: 1, password: "hashed" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    fakeDb.run.mockResolvedValue({ changes: 0 });

    await logout(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Déconnexion réussie (aucun token actif trouvé).",
    });
  });

  it("déconnexion réussie", async () => {
    req.body = { email: "test", password: "correct" };

    fakeDb.get.mockResolvedValue({ id: 1, password: "hashed" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    fakeDb.run.mockResolvedValue({ changes: 2 });

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});


describe("refreshToken", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("retourne 401 si aucun token fourni", async () => {
    await refreshToken(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retourne 403 si token introuvable en BDD", async () => {
    req.body = { refreshToken: "abc" };
    fakeDb.get.mockResolvedValue(null);

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retourne un nouveau token si refresh token valide", async () => {
    req.body = { refreshToken: "valid" };

    fakeDb.get.mockResolvedValue({ token: "valid", user_id: 1 });

    (jwt.verify as jest.Mock).mockReturnValue({ id: 1, mail: "a@test.com" });

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "signed_token",
    });
  });

  it("gère un token invalide", async () => {
    req.body = { refreshToken: "invalid" };

    fakeDb.get.mockResolvedValue({ token: "invalid" });

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid token");
    });

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
