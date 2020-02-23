import mongoose from "mongoose";
import { Application } from "express";
import chalk from "chalk";
import logger from "./LoggerConfig";

class DatabaseConfig {
  static connectToDatabase(app: Application) {
    logger.info(`${chalk.yellow("⚒")} Configuring database`);

    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection
      .on("open", () => {
        logger.info(`${chalk.yellow("✓")} MongoDB connected.`);
      })
      .on("error", (err: any) => {
        logger.error(err);
        logger.info(
          `${chalk.red(
            "✗",
          )} MongoDB connection error. Please make sure MongoDB is running.`,
        );
        process.exit();
      });
  }
}

export default DatabaseConfig;
