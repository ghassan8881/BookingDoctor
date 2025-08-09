// lib/db.js
import sql from "mssql";

// Configuration with environment variables (recommended for security)
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 30000, // 30 seconds connection timeout
  },
  pool: {
    max: 10, // Maximum number of connections in pool
    min: 0,
    idleTimeoutMillis: 30000, // 30 seconds idle timeout
  },
};

let connectionPool;

/**
 * Establishes database connection and returns the connection pool
 * @returns {Promise<sql.ConnectionPool>}
 * @throws {Error} If connection fails
 */
export async function connectToDatabase() {
  if (connectionPool) {
    console.log("Using existing database connection");
    return connectionPool;
  }

  try {
    console.log("Establishing new database connection...");
    connectionPool = await sql.connect(config);

    // Add event listeners for connection errors
    connectionPool.on("error", (err) => {
      console.error("Database connection error:", err);
      connectionPool = null; // Force new connection on next attempt
    });

    console.log("Successfully connected to database");
    return connectionPool;
  } catch (err) {
    const errorMessage = `Database connection failed (server: ${config.server}, db: ${config.database})`;

    // Enhanced error logging
    console.error("\x1b[31m%s\x1b[0m", "‼️ " + errorMessage); // Red colored output
    console.error("Error details:", {
      code: err.code,
      message: err.message,
      stack: err.stack,
    });

    // Throw custom error with more context
    const dbError = new Error(errorMessage);
    dbError.originalError = err;
    dbError.isDatabaseError = true;
    throw dbError;
  }
}

/**
 * Gracefully closes the database connection
 */
export async function closeDatabaseConnection() {
  try {
    if (connectionPool) {
      await connectionPool.close();
      console.log("Database connection closed");
    }
  } catch (err) {
    console.error("Error closing database connection:", err);
  } finally {
    connectionPool = null;
  }
}

// Cleanup on process termination
process.on("SIGINT", async () => {
  await closeDatabaseConnection();
  process.exit(0);
});
