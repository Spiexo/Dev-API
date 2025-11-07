import { query, run } from "../../config/config";
import { findUserByEmail, createUser, banUser } from "../../services/user.services";

jest.mock("../../config/config");

describe("UserService", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("findUserByEmail → renvoie un utilisateur", async () => {
    const mockUser = { id: 1, email: "test@example.com" };

    (query as jest.Mock).mockResolvedValue([mockUser]);

    const result = await findUserByEmail("test@example.com");

    expect(query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE email = ?",
      ["test@example.com"]
    );
    expect(result).toEqual(mockUser);
  });

  test("createUser → insère un utilisateur", async () => {
    (run as jest.Mock).mockResolvedValue({ lastID: 12 });

    const data = {
      username: "john",
      email: "john@example.com",
      password: "hash",
    };

    const result = await createUser(data);

    expect(run).toHaveBeenCalledWith(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      ["john", "john@example.com", "hash"]
    );
    expect(result.lastID).toBe(12);
  });

  test("banUser → met à jour is_banned", async () => {
    (run as jest.Mock).mockResolvedValue({ changes: 1 });

    const result = await banUser(3);

    expect(run).toHaveBeenCalledWith(
      "UPDATE users SET is_banned = 1 WHERE id = ?",
      [3]
    );
    expect(result.changes).toBe(1);
  });
});
