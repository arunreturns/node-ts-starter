import chalk from "chalk";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
// const path = require('path'); const favicon = require("serve-favicon");
import initStats from "@phil-r/stats";
import errorhandler from "errorhandler";
import cors from "cors";
import expressStatusMonitor from "express-status-monitor";
// const csrf = require('csurf')
import protect from "@risingstack/protect";
import logger from "./LoggerConfig";
import { Application } from "express";

class ServerConfig {
  static configureServer(app: Application) {
    logger.info(`${chalk.yellow("⚒")} Configuring server`);
    // app.use(favicon(path.join(__dirname, 'favicon.ico')));
    const { statsMiddleware, getStats } = initStats({
      endpointStats: true,
      customStats: true,
      addHeader: true,
    });

    /* Enable CSRF */
    // app.use(csrf({cookie: true}))

    /* Log API requests */
    app.use(morgan("dev"));
    /* Use bodyParser */
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    app.use(bodyParser.urlencoded({ extended: true }));
    /* Use methodOverride */
    app.use(methodOverride("X-HTTP-Method-Override"));
    /* Helmet is actually just a collection of nine smaller middleware functions
     that set security-related HTTP headers */
    app.use(helmet());
    /* Gzip compressing can greatly decrease the size of the response body
     and hence increase the speed of a web app */
    app.use(compression());
    /* Middleware for monitoring express status */
    app.use(expressStatusMonitor());
    /* Stats */
    app.use(statsMiddleware);
    app.get("/stats", (req, res) => res.send(getStats()));

    /* Enable CORS */
    app.use(cors());

    if (process.env.NODE_ENV === "development") {
      // Only add errorHandler for development
      app.use(errorhandler());
    }
    /* Protect the API */
    app.use(
      protect.express.sqlInjection({
        body: true,
        loggerFunction: logger.error,
      }),
    );

    app.use(protect.express.xss({ body: true, loggerFunction: logger.error }));

    // app.use(protect.express.rateLimiter({   db: client,   id: (request) =>
    // request.connection.remoteAddress }))

    logger.info(`${chalk.yellow("⚒")} Server configuration completed`);
  }
}

export default ServerConfig;
