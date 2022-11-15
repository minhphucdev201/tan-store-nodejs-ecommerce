const catalogsRouter = require("./catalogs.route");
const productsRouter = require("./products.route");
const usersRouter = require("./users.route");
function route(app) {
  app.use("/catalogs", catalogsRouter);
  app.use("/products", productsRouter);
  app.use("/users", usersRouter);
}

module.exports = route;
