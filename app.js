process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
  });
path = module.exports = require("path");
config = module.exports = require(path.resolve(__dirname, "./config.json"));

common = module.exports = require(path.resolve(__dirname, "./classes/common"));
eventCases = module.exports = require(path.resolve(
  __dirname,
  "./classes/eventCases"
));
eventClasses = module.exports = require(path.resolve(
  __dirname,
  "./classes/eventClasses"
));

(async () => {
  await common.init();
  // await common.mongoConnect();
  await common.initRoutes();
})();
