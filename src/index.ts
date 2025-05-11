import express, { Express } from "express";

const app: Express = express();

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;
