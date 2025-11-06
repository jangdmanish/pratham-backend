/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import app from './app.js';
import config from './config/config.js';
import appLogger from './config/appLogger.js';
//import { chatService } from './services/index.js';
//import {FilesetResolver, LlmInference} from './assets/tasks-genai/package/genai_bundle.mjs';
//const gemmaModelFileName = './assets/gemma-3n-E2B-it-int4-Web.litertlm';
import SocketManager from './utils/socketManager.js';
// Database Connection
//mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
 // appLogger.info('Connected to MongoDB');
//});

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
      appLogger.info('Server closed');
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

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  appLogger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
