import { Server, Socket } from "socket.io";
import ollama from 'ollama'

interface UserSocket {
  userId: string;
  socketId: string;
}

class SocketManager {
  private static instance: SocketManager;
  private io: Server | null = null;
  private connectedUsers: Map<string, string> = new Map(); // userId → socketId

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public initialize(httpServer: any): void {
    if (this.io) {
      console.warn("⚠️ Socket.io already initialized");
      return;
    }

    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle registration (e.g., when user logs in)
      socket.on("register", (userId: string) => {
        this.connectedUsers.set(userId, socket.id);
        console.log(`✅ Registered user ${userId} with socket ${socket.id}`);
        this.io?.emit("users", Array.from(this.connectedUsers.keys())); // broadcast user list
      });

      // Handle private messages
      socket.on("private_message", (data: { to: string; message: string }) => {
        const recipientSocketId = this.connectedUsers.get(data.to);
        if (recipientSocketId) {
          this.io?.to(recipientSocketId).emit("private_message", {
            from: socket.id,
            message: data.message,
          });
        } else {
          console.log(`❌ User ${data.to} not connected`);
        }
      });

      socket.on('client_message', async (data) => {
        console.log("data" + data);
        const response = await ollama.chat({
          model: 'gemma3:270m',
          messages: [{ role: 'user', content: data}],
          stream: true,
        });
        //console.log(part.message.content);
        for await (const part of response) {
          socket.emit('server_message', part.message.content);
        }
      });

      // Example: broadcast to all
      socket.on("broadcast", (msg: string) => {
        socket.broadcast.emit("broadcast", msg);
      });

      socket.on("disconnect", () => {
        // Remove user from map on disconnect
        for (const [userId, sockId] of this.connectedUsers.entries()) {
          if (sockId === socket.id) {
            this.connectedUsers.delete(userId);
            console.log(`❌ User ${userId} disconnected`);
            break;
          }
        }
        this.io?.emit("users", Array.from(this.connectedUsers.keys()));
      });
    });

    console.log("✅ Socket.io initialized");
  }

  public getIO(): Server {
    if (!this.io) {
      throw new Error("Socket.io not initialized. Call initialize() first.");
    }
    return this.io;
  }

  /** Send a message to a specific user */
  public emitToUser(userId: string, event: string, data: any): void {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io?.to(socketId).emit(event, data);
    }
  }

  /** Emit to all connected clients */
  public emitToAll(event: string, data: any): void {
    this.io?.emit(event, data);
  }

  /** Get connected users (for debugging or UI) */
  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}

export default SocketManager;

