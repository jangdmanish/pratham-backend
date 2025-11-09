//import mongoose from 'mongoose';
//import { v4 as uuidv4 } from 'uuid';
import app from "./app.js";
import config from "./config/config.js";
import appLogger from "./config/appLogger.js";
//import { chatService } from './services/index.js';
import SocketManager from "./utils/socketManager.ts";
import { startOllama } from "./services/ollama.service.ts";
// Database Connection
//mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
// appLogger.info('Connected to MongoDB');
//});

startOllama();

// Server Setup
const server = app.listen(config.port, () => {
  appLogger.info(`Server listening to port ${config.port}`);
});

SocketManager.getInstance().initialize(server);

app.get("/", (_, res) => res.send("Pratham server is running 🚀"));

// Handle graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      appLogger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  appLogger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  appLogger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
