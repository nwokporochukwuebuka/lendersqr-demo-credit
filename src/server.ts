import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import httpStatus from "http-status";
import config from "./config/config";
import morgan from "./config/morgan";
import { errorConverter, errorHandler } from "./utils/error";
import ApiError from "./utils/ApiError";
import { authLimiter } from "./middlewares/rateLimiter";
import { Router } from "./routes/index";

export class Server {
  private app: Express;
  private server: http.Server | null;

  constructor() {
    this.app = express();
    this.server = null;
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // Morgan logging
    if (config.env !== "test") {
      this.app.use(morgan.successHandler);
      this.app.use(morgan.errorHandler);
    }

    // Set security HTTP headers
    this.app.use(helmet());

    // Parse JSON request body
    this.app.use(express.json());

    // Parse urlencoded request body
    this.app.use(express.urlencoded({ extended: true }));

    // GZIP compression
    this.app.use(compression());

    // Enable CORS
    this.app.use(cors());
    // this.app.options("*", cors());

    // Limit repeated failed requests to auth endpoints
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
    this.app.use("/v1", router.routes);

    // Send back a 404 error for any unknown API request
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
    });
  }

  private configureErrorHandling(): void {
    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }

  public async start(port: number | string): Promise<http.Server> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(port, () => {
          resolve(this.server as http.Server);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // For testing purposes
  public getApp(): Express {
    return this.app;
  }
}
