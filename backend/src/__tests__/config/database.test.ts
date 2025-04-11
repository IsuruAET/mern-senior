import mongoose from "mongoose";
import Database from "../../config/database";

// Mock mongoose
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: {
    host: "localhost",
  },
}));

describe("Database Configuration", () => {
  let database: Database;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    database = Database.getInstance();
  });

  afterEach(() => {
    // Reset the singleton instance
    (Database as any).instance = null;
  });

  it("should be a singleton", () => {
    const instance1 = Database.getInstance();
    const instance2 = Database.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should connect to MongoDB successfully", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);
    await database.connect();
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
  });

  it("should handle connection errors", async () => {
    const error = new Error("Connection failed");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    // Mock process.exit
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit() was called");
    });

    await expect(database.connect()).rejects.toThrow(
      "process.exit() was called"
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should not connect if already connected", async () => {
    // First connection
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);
    await database.connect();

    // Second connection attempt
    await database.connect();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it("should throw error when getting connection before connecting", () => {
    expect(() => database.getConnection()).toThrow("Database not connected");
  });

  it("should return connection after successful connection", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);
    await database.connect();
    const connection = database.getConnection();
    expect(connection).toBeDefined();
    expect(connection.host).toBe("localhost");
  });
});
