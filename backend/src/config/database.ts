import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: Database;
  private connection: mongoose.Connection | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.connection) {
      return;
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      this.connection = mongoose.connection;
      console.log(`MongoDB Connected: ${this.connection.host}`);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  public getConnection(): mongoose.Connection {
    if (!this.connection) {
      throw new Error("Database not connected");
    }
    return this.connection;
  }
}

export default Database;
