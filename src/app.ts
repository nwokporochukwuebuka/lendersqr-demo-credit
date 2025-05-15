// import { Server } from "./server";

// /**
//  * App singleton class to maintain compatibility with existing code
//  */
// class App {
//   private static instance: App;
//   private server: Server;

//   private constructor() {
//     this.server = new Server();
//   }

//   /**
//    * Get the singleton instance
//    */
//   public static getInstance(): App {
//     if (!App.instance) {
//       App.instance = new App();
//     }
//     return App.instance;
//   }

//   /**
//    * Get the Express application
//    */
//   public getExpressApp() {
//     return this.server.getApp();
//   }
// }

// // Export the Express app for compatibility
// export default App.getInstance().getExpressApp();

import { Server } from "http";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import httpStatus from "http-status";

import config from "./config/config";
import logger from "./config/logger";
import morgan from "./config/morgan";
import { authLimiter } from "./middlewares/rateLimiter";
import { Router } from "./routes";
import ApiError from "./utils/ApiError";
import { errorConverter, errorHandler } from "./utils/error";

class App {
  public app: Application;
  public port: number;

  private server: Server | undefined;

  constructor() {
    this.app = express();
    this.port = +config.port || 4000;
    this.initializeMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
    this.setupShutdownHandlers();
  }

  public listen() {
    this.app.listen(this.port, () =>
      logger.info(`${config.appName} running on port ${this.port}`)
    );
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());

    if (config.env !== "test") {
      this.app.use(morgan.successHandler);
      this.app.use(morgan.errorHandler);
    }

    // GZIP compression
    this.app.use(compression());

    if (config.env === "production") {
      this.app.use("/v1/auth", authLimiter);
    }
  }

  private configureRoutes(): void {
    const router = new Router();
    this.app.get("/", (req: Request, res: Response) => {
      res
        .status(httpStatus.OK)
        .json({ status: true, message: "Welcoome to demo credit api" });
    });
    // V1 API routes
    this.app.use("/api/v1", router.routes);

    // Send back a 404 error for any unknown API request
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
    });
  }

  private configureErrorHandling(): void {
    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }

  private setupShutdownHandlers() {
    process.on("SIGTERM", () => this.handleShutdown());
    process.on("SIGINT", () => this.handleShutdown());
  }

  private handleShutdown(): void {
    logger.info("SIGTERM or SIGINT received. Shutting down gracefully...");

    // Close the HTTP server
    if (this.server) {
      this.server.close(() => {
        logger.info("HTTP server closed.");

        // Additional cleanup operations can go here
        // For example, closing database connections
        // db.disconnect().then(...)

        logger.info("Process exiting...");
        process.exit(0);
      });

      // Force shutdown after timeout if graceful shutdown fails
      setTimeout(() => {
        logger.error("Forcing shutdown after timeout");
        process.exit(1);
      }, 10000); // 10 seconds timeout
    } else {
      logger.info("No server instance found. Exiting...");
      process.exit(0);
    }
  }
}

export default App;
