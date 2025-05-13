import path from "path";
import type { Knex } from "knex";
import config from "../config/config";

// Update with your config settings.
interface IKnexConfig {
  [key: string]: Knex.Config;
}

const dbConfig: IKnexConfig = {
  development: {
    client: "mysql2",
    connection: {
      host: config.db.host,
      port: Number(config.db.port),
      password: config.db.password,
      database: config.db.name,
      user: config.db.user,
    },
    migrations: {
      directory: path.join(__dirname + "/migrations"),
    },
    seeds: {
      directory: path.join(__dirname + "/seeds"),
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      host: config.db.host,
      port: Number(config.db.port),
      password: config.db.password,
      database: config.db.name,
      user: config.db.user,
    },
    migrations: {
      directory: path.join(__dirname + "/migrations"),
    },
    seeds: {
      directory: path.join(__dirname + "/seeds"),
    },
  },

  production: {
    client: "mysql2",
    connection: {
      host: config.db.host,
      port: Number(config.db.port),
      password: config.db.password,
      database: config.db.name,
      user: config.db.user,
    },
    migrations: {
      directory: path.join(__dirname + "/migrations"),
    },
    seeds: {
      directory: path.join(__dirname + "/seeds"),
    },
  },
};

export default dbConfig;
