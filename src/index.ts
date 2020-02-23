import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import ServerConfig from "./config/ServerConfig";
import DatabaseConfig from "./config/DatabaseConfig";
import Logger from "./config/LoggerConfig";
import CustomerController from "./controller/CustomerController";
// import swaggerConfig from "./config/swaggerConfig";

const app: express.Application = express();
dotenv.config();
/* Configure and connect to the database */
DatabaseConfig.connectToDatabase(app);
/* Configure the server with additional features */
ServerConfig.configureServer(app);

/* Configure swagger */
// swaggerConfig(app);

/* Connect the various routes to the application */
CustomerController.registerController(app);

const IP = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  Logger.info(
    `${chalk.yellow("★")} Application running in http://${IP}:${PORT}`,
  );
});

module.exports = app;
