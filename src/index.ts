require("dotenv").config();

// import { Application } from "./application";
import { Application } from "./application";

// Create and start the application using the entry point class
const application = new Application();
application.initialize();
