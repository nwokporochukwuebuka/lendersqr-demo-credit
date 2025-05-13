import { Server } from "./server";
import config from "./config/config";
import logger from "./config/logger";

/**
 * Application class that serves as the entry point
 * and coordinates the server lifecycle
 */
export class Application {
  private server: Server;

  constructor() {
    this.server = new Server();
    this.setupShutdownHandlers();
  }

  /**
   * Initialize and start the application
   */
  public initialize(): void {
    this.startServer();
  }

  /**
   * Start the server and handle the result
   */
  private startServer(): void {
    this.server
      .start(config.port)
      .then(this.handleServerStartSuccess.bind(this))
      .catch(this.handleServerStartError.bind(this));
  }

  /**
   * Handle successful server start
   */
  private handleServerStartSuccess(): void {
    logger.info(`Db connected and app listening on port ${config.port}`);
  }

  /**
   * Handle server start errors
   */
  private handleServerStartError(error: Error): void {
    logger.error(error);
    process.exit(1);
  }

  /**
   * Set up handlers for process signals
   */
  private setupShutdownHandlers(): void {
    process.on("SIGTERM", this.handleShutdown.bind(this));
    process.on("SIGINT", this.handleShutdown.bind(this));
  }

  /**
   * Handle graceful shutdown
   */
  private handleShutdown(): void {
    logger.info("Shutting down...");

    this.server
      .stop()
      .then(() => {
        logger.info("Server closed");
        process.exit(0);
      })
      .catch((error: Error) => {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      });
  }
}
