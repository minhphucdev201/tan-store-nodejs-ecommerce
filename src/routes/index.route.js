const catalogsRouter = require("./catalogs.route");
const productsRouter = require("./products.route");
const usersRouter = require("./users.route");
const catalogsBlogRouter = require("./catalogsBlog.route");
const blogsRouter = require("./blogs.route");
function route(app) {
  app.use("/catalogs", catalogsRouter);
  app.use("/products", productsRouter);
  app.use("/users", usersRouter);
  app.use("/catalogs-blog", catalogsBlogRouter);
  app.use("/blogs", blogsRouter);
}

module.exports = route;
