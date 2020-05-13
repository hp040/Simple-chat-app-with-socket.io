module.exports = {
  init: async () => {
    return new Promise(async (resolve, reject) => {
      express = module.exports = require("express");
      schedule = module.exports = require("node-schedule");
      MongoClient = module.exports = require("mongodb").MongoClient;
      bodyParser = require("body-parser");
      cheerio = module.exports = require("cheerio");
      // request = module.exports = require("sync-request");
      axios = module.exports = require("axios");
      fetch = module.exports = require("node-fetch");
      request_web = module.exports = require("request");
      app = module.exports = express();
      let http = require("http");
      let https = require("https");
      let fs = require("fs");
      let PORT = config.PORT || 1337;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(
        express.json({
          limit: "100mb",
          type: "application/json",
        })
      );
      // Add headers
      app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", "*");

        // Request methods you wish to allow
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );

        // Request headers you wish to allow
        res.setHeader(
          "Access-Control-Allow-Headers",
          "X-Requested-With,content-type"
        );

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", true);

        // Pass to next layer of middleware
        next();
      });
      let server;
      users = module.exports = {};
      userNames = module.exports = [];
      if (process.argv[2] == "https") {
        server = https.createServer(
          {
            key: fs.readFileSync(config.KeyFile),
            cert: fs.readFileSync(config.certFile),
          },
          app
        );
      } else {
        server = http.createServer(app);
      }
      io = module.exports = require("socket.io")(server, {
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ["websocket", "polling", "xhr-polling", "flashsocket"],
      });

      io.on("connection", (socket) => {
        console.log(socket.id);
        socket.on("req", (msg) => {
          console.log(msg);
          msg = typeof msg != "object" ? JSON.parse(msg) : msg;
          let en = msg.en;
          let data = msg.data;
          eventCases.bindEventToSocket(en, data, socket);
        });
      });
      server.listen(PORT, () => {
        console.log(`server started on port ${PORT}`);
      });
      resolve();
    });
  },
  mongoConnect: async () => {
    return new Promise((resolve, reject) => {
      const uri = config.mongoSrv;
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      client.connect((err) => {
        db = module.exports = client.db("scrapper");
        console.log("connected to database");

        // perform actions on the collection object
        // client.close();
        resolve();
      });
    });
  },
  initRoutes: async () => {
    return new Promise(async (resolve, reject) => {
      index = module.exports = require(path.resolve(
        __dirname,
        "../routes/index"
      ));

      app.use("/", index);
    });
  },
  addSeconds: async (date, seconds) => {
    return new Promise((resolve, reject) => {
      resolve(new Date(date.getTime() + seconds * 1000));
    });
  },
  sendDataToUser: (socket, data) => {
    if (data) {
      socket.emit("res", data);
    } else {
      socket.emit("res", { en: "error", data: {}, err: 1 });
    }
  },
  sendBySocketId: async (data, socketId) => {
    if (socketId) {
      if (data) {
        io.to(socketId).emit("res", data);
      } else {
        io.to(socketId).emit("res", { en: "error", data: {}, err: 1 });
      }
    } else {
      console.trace("socketId missing");
    }
  },
  validateParams: function (...args) {
    flag = true;
    for (var i = 0; i < args.length; i++) {
      if (typeof args[i] == "undefined" || args[i] === "" || args[i] == null) {
        flag = false;
        console.log("error in parmas ===>>>", args[i], i);

        break;
      }
    }
    return flag;
  },
};
