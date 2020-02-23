// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"config/LoggerConfig.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const winston_1 = require("winston");

const logFormatter = info => {
  const {
    timestamp,
    message
  } = info;
  return `${timestamp} - ${message}`;
};

const logger = winston_1.createLogger({
  level: process.env.LOGGER_LOGLEVEL || 'debug',
  format: winston_1.format.combine(winston_1.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), winston_1.format.colorize({
    all: true
  }), winston_1.format.printf(logFormatter)),
  transports: [new winston_1.transports.Console()]
});
exports.default = logger;
},{}],"config/ServerConfig.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const chalk_1 = __importDefault(require("chalk"));

const body_parser_1 = __importDefault(require("body-parser"));

const method_override_1 = __importDefault(require("method-override"));

const morgan_1 = __importDefault(require("morgan"));

const helmet_1 = __importDefault(require("helmet"));

const compression_1 = __importDefault(require("compression"));

const stats_1 = __importDefault(require("@phil-r/stats"));

const errorhandler_1 = __importDefault(require("errorhandler"));

const cors_1 = __importDefault(require("cors"));

const express_status_monitor_1 = __importDefault(require("express-status-monitor"));

const protect_1 = __importDefault(require("@risingstack/protect"));

const LoggerConfig_1 = __importDefault(require("./LoggerConfig"));

class ServerConfig {
  static configureServer(app) {
    LoggerConfig_1.default.info(`${chalk_1.default.yellow("⚒")} Configuring server`);
    const {
      statsMiddleware,
      getStats
    } = stats_1.default({
      endpointStats: true,
      customStats: true,
      addHeader: true
    });
    app.use(morgan_1.default("dev"));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.json({
      type: "application/vnd.api+json"
    }));
    app.use(body_parser_1.default.urlencoded({
      extended: true
    }));
    app.use(method_override_1.default("X-HTTP-Method-Override"));
    app.use(helmet_1.default());
    app.use(compression_1.default());
    app.use(express_status_monitor_1.default());
    app.use(statsMiddleware);
    app.get("/stats", (req, res) => res.send(getStats()));
    app.use(cors_1.default());

    if (process.env.NODE_ENV === "development") {
      app.use(errorhandler_1.default());
    }

    app.use(protect_1.default.express.sqlInjection({
      body: true,
      loggerFunction: LoggerConfig_1.default.error
    }));
    app.use(protect_1.default.express.xss({
      body: true,
      loggerFunction: LoggerConfig_1.default.error
    }));
    LoggerConfig_1.default.info(`${chalk_1.default.yellow("⚒")} Server configuration completed`);
  }

}

exports.default = ServerConfig;
},{"./LoggerConfig":"config/LoggerConfig.ts"}],"config/DatabaseConfig.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const mongoose_1 = __importDefault(require("mongoose"));

const chalk_1 = __importDefault(require("chalk"));

const LoggerConfig_1 = __importDefault(require("./LoggerConfig"));

class DatabaseConfig {
  static connectToDatabase(app) {
    LoggerConfig_1.default.info(`${chalk_1.default.yellow("⚒")} Configuring database`);
    mongoose_1.default.set("useFindAndModify", false);
    mongoose_1.default.set("useCreateIndex", true);
    mongoose_1.default.set("useNewUrlParser", true);
    mongoose_1.default.set("useUnifiedTopology", true);
    mongoose_1.default.connect(process.env.MONGO_URI);
    mongoose_1.default.connection.on("open", () => {
      LoggerConfig_1.default.info(`${chalk_1.default.yellow("✓")} MongoDB connected.`);
    }).on("error", err => {
      LoggerConfig_1.default.error(err);
      LoggerConfig_1.default.info(`${chalk_1.default.red("✗")} MongoDB connection error. Please make sure MongoDB is running.`);
      process.exit();
    });
  }

}

exports.default = DatabaseConfig;
},{"./LoggerConfig":"config/LoggerConfig.ts"}],"schema/CustomerModel.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const mongoose_1 = __importStar(require("mongoose"));

const CustomerSchema = new mongoose_1.Schema({
  name: {
    type: mongoose_1.default.Schema.Types.String,
    required: true
  },
  email: {
    type: mongoose_1.default.Schema.Types.String,
    unique: true,
    required: true
  },
  phone: {
    type: mongoose_1.default.Schema.Types.String,
    unique: true,
    required: true
  }
});
CustomerSchema.virtual("id").get(() => this._id);
const CustomerModel = mongoose_1.default.model("Customer", CustomerSchema, "Customer");
exports.default = CustomerModel;
},{}],"models/Customer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class Customer {
  constructor(name, email, phone) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

}

exports.default = Customer;
},{}],"utils/CustomerMapper.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Customer_1 = __importDefault(require("../models/Customer"));

class CustomerMapper {
  static mapCustomer(customer) {
    const customerCopy = new Customer_1.default();
    customerCopy.id = customer.get("_id");
    customerCopy.name = customer.get("name");
    customerCopy.email = customer.get("email");
    customerCopy.phone = customer.get("phone");
    return customerCopy;
  }

  static mapCustomers(customers) {
    return customers.map(this.mapCustomer);
  }

}

exports.default = CustomerMapper;
},{"../models/Customer":"models/Customer.ts"}],"models/Response.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class Response {
  constructor() {
    this.body = {
      errors: []
    };
  }

}

exports.default = Response;
},{}],"service/CustomerService.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const LoggerConfig_1 = __importDefault(require("../config/LoggerConfig"));

const CustomerModel_1 = __importDefault(require("../schema/CustomerModel"));

const CustomerMapper_1 = __importDefault(require("../utils/CustomerMapper"));

const Response_1 = __importDefault(require("../models/Response"));

class CustomerService {
  static async getCustomerFromDB() {
    const response = new Response_1.default();

    try {
      LoggerConfig_1.default.info("[CustomerService] Inside getCustomerFromDB");
      const resp = await CustomerModel_1.default.find({});
      response.body.data = CustomerMapper_1.default.mapCustomers(resp);
      response.status = 200;
    } catch (error) {
      LoggerConfig_1.default.error("[CustomerService] Error in getCustomerFromDB ", error);
      response.body.errors.push(error);
      response.status = 500;
    }

    return response;
  }

  static async addCustomerToDB(customer) {
    const response = new Response_1.default();

    try {
      LoggerConfig_1.default.info("[CustomerService] Inside addCustomerToDB ", customer);
      const newCustomer = new CustomerModel_1.default();
      newCustomer.set("name", customer.name);
      newCustomer.set("email", customer.email);
      newCustomer.set("phone", customer.phone);
      const resp = await newCustomer.save();
      response.body.data = CustomerMapper_1.default.mapCustomer(resp);
      response.status = 200;
    } catch (error) {
      LoggerConfig_1.default.error("[CustomerService] Error in addCustomerToDB ", error);
      response.body.errors.push(error);
      response.status = 500;
    }

    return response;
  }

  static async deleteCustomerFromDB(id) {
    const response = new Response_1.default();

    try {
      LoggerConfig_1.default.info("[CustomerService] Inside deleteCustomerFromDB " + id);
      const resp = await CustomerModel_1.default.findByIdAndDelete(id);

      if (resp === null) {
        response.body.errors.push("No data found for this id " + id);
        response.status = 500;
      } else {
        response.body.data = CustomerMapper_1.default.mapCustomer(resp);
        response.status = 200;
      }
    } catch (error) {
      LoggerConfig_1.default.error("[CustomerService] Error in deleteCustomerFromDB" + error);
      response.body.errors.push(error);
      response.status = 500;
    }

    return response;
  }

}

exports.default = CustomerService;
},{"../config/LoggerConfig":"config/LoggerConfig.ts","../schema/CustomerModel":"schema/CustomerModel.ts","../utils/CustomerMapper":"utils/CustomerMapper.ts","../models/Response":"models/Response.ts"}],"controller/CustomerController.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const LoggerConfig_1 = __importDefault(require("../config/LoggerConfig"));

const CustomerService_1 = __importDefault(require("../service/CustomerService"));

const Customer_1 = __importDefault(require("../models/Customer"));

class CustomerController {
  static registerController(app, url = "/customer") {
    app.get(`${url}/getCustomer`, this.getCustomer);
    app.post(`${url}/addCustomer`, this.addCustomer);
    app.delete(`${url}/deleteCustomer/:id`, this.deleteCustomer);
  }

  static async getCustomer(req, res) {
    LoggerConfig_1.default.info("[CustomerController] Inside getCustomer");
    const resp = await CustomerService_1.default.getCustomerFromDB();
    LoggerConfig_1.default.info("[CustomerController] getCustomer - Response", resp);
    res.status(resp.status).send(resp.body);
  }

  static async addCustomer(req, res) {
    LoggerConfig_1.default.info("[CustomerController] Inside addCustomer");
    const newCustomer = new Customer_1.default(req.body.name, req.body.email, req.body.phone);
    const resp = await CustomerService_1.default.addCustomerToDB(newCustomer);
    LoggerConfig_1.default.info("[CustomerController] addCustomer - Response", resp);
    res.status(resp.status).send(resp.body);
  }

  static async deleteCustomer(req, res) {
    LoggerConfig_1.default.info("[CustomerController] Inside deleteCustomer");
    const resp = await CustomerService_1.default.deleteCustomerFromDB(req.params.id);
    LoggerConfig_1.default.info("[CustomerController] deleteCustomer - Response", resp);
    res.status(resp.status).send(resp.body);
  }

}

exports.default = CustomerController;
},{"../config/LoggerConfig":"config/LoggerConfig.ts","../service/CustomerService":"service/CustomerService.ts","../models/Customer":"models/Customer.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const express_1 = __importDefault(require("express"));

const dotenv_1 = __importDefault(require("dotenv"));

const chalk_1 = __importDefault(require("chalk"));

const ServerConfig_1 = __importDefault(require("./config/ServerConfig"));

const DatabaseConfig_1 = __importDefault(require("./config/DatabaseConfig"));

const LoggerConfig_1 = __importDefault(require("./config/LoggerConfig"));

const CustomerController_1 = __importDefault(require("./controller/CustomerController"));

const app = express_1.default();
dotenv_1.default.config();
DatabaseConfig_1.default.connectToDatabase(app);
ServerConfig_1.default.configureServer(app);
CustomerController_1.default.registerController(app);
const IP = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  LoggerConfig_1.default.info(`${chalk_1.default.yellow("★")} Application running in http://${IP}:${PORT}`);
});
module.exports = app;
},{"./config/ServerConfig":"config/ServerConfig.ts","./config/DatabaseConfig":"config/DatabaseConfig.ts","./config/LoggerConfig":"config/LoggerConfig.ts","./controller/CustomerController":"controller/CustomerController.ts"}]},{},["index.ts"], null)
//# sourceMappingURL=/index.js.map