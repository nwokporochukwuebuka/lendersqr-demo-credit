import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

interface EnvVars {
  NODE_ENV: "development" | "production" | "test";
  PORT: string;
  JWT_SECRET: string;
  JWT_EXPIRE_IN_MINUTE: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_TEST_NAME: string;
  DB_PORT: string;
  PASSWORD_SALT: string;
  PIN_SALT: string;
  ADJUTOR_BASE_URL: string;
  ADJUTOR_API_KEY: string;
  APP_NAME: string;
}

const envVarsSchema = Joi.object<EnvVars>({
  NODE_ENV: Joi.string().valid("production", "development", "test").required(),
  PORT: Joi.string().default("4000"),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE_IN_MINUTE: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_TEST_NAME: Joi.string(),
  DB_PORT: Joi.string().required().default("9090"),
  PASSWORD_SALT: Joi.string().required(),
  PIN_SALT: Joi.string().required(),
  ADJUTOR_BASE_URL: Joi.string().required(),
  ADJUTOR_API_KEY: Joi.string().required(),
  APP_NAME: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  appName: envVars.APP_NAME,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    expireInMinute: envVars.JWT_EXPIRE_IN_MINUTE,
  },
  db: {
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
    test_name: envVars.DB_TEST_NAME,
    port: envVars.DB_PORT,
  },
  password: {
    salt: envVars.PASSWORD_SALT,
  },
  pin: {
    salt: envVars.PIN_SALT,
  },
  adjutor: {
    baseUrl: envVars.ADJUTOR_BASE_URL,
    apiKey: envVars.ADJUTOR_API_KEY,
  },
};

export default config;
