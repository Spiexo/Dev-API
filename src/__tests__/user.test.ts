import request from "supertest";
import app from "../app";
import db from "../__mocks__/config";


jest.mock('../config/config');

jest.mock("../middlewares/auth.middlewares", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: 1 };
    next();
  }
}));


describe("User Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /profil → retourne les infos de l'utilisateur connecté", async () => {
    db.get.mockResolvedValue({
      id: 1,
      username: "john",
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
      bio: "Hello",
      avatar_url: null,
    });

    const res = await request(app).get("/user/profil");

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe("john");
    expect(db.get).toHaveBeenCalledTimes(1);
  });

  test("GET /profil/:id → retourne un profil existant", async () => {
    db.get.mockResolvedValue({
      id: 5,
      username: "alice",
      first_name: "Alice",
      last_name: "Doe",
      bio: "photographe",
      avatar_url: null,
    });

    const res = await request(app).get("/user/profil/5");

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe("alice");
    expect(db.get).toHaveBeenCalledTimes(1);
  });

  test("GET /profil/:id → retourne 404 si l'utilisateur n'existe pas", async () => {
    db.get.mockResolvedValue(undefined);

    const res = await request(app).get("/user/profil/99");

    expect(res.status).toBe(404);
  });

  test("GET /users → retourne une liste paginée d'utilisateurs", async () => {
    db.all.mockResolvedValue([
      { id: 1, username: "john", email: "john@test.com" },
      { id: 2, username: "alice", email: "alice@test.com" }
    ]);

    db.get.mockResolvedValue({ count: 2 });

    const res = await request(app).get("/user/users");

    expect(res.status).toBe(201);
    expect(res.body.data.length).toBe(2);
    expect(db.all).toHaveBeenCalledTimes(1);
    expect(db.get).toHaveBeenCalledTimes(1);
  });

  test("PUT / → modifie le profil", async () => {
    db.run.mockResolvedValue({ changes: 1 });

    db.get.mockResolvedValue({
      id: 1,
      username: "updated",
      email: "john@test.com",
      first_name: "John",
      last_name: "Doe",
      bio: "new bio"
    });

    const res = await request(app)
      .put("/")
      .send({ username: "updated", bio: "new bio" });

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe("updated");
    expect(db.run).toHaveBeenCalledTimes(1);
  });

  test("DELETE / → supprime l'utilisateur si mot de passe ok", async () => {
    db.get.mockResolvedValue({
      username: "john",
      password: "$2b$10$hashedpwd"
    });

    jest.spyOn(require("bcrypt"), "compare")
      .mockResolvedValue(true);

    db.run.mockResolvedValue({ changes: 1 });

    const res = await request(app)
      .delete("/")
      .send({ passwordTest: "test123" });

    expect(res.status).toBe(201);
    expect(res.body.message).toContain("supprimé");
    expect(db.run).toHaveBeenCalledTimes(1);
  });

});
