import knex, { Knex } from "knex";
import dbConfig from "./knexfile";
import config from "../config/config";

const configs = dbConfig[config.env || "development"];

const db = knex(configs);

export default db;
