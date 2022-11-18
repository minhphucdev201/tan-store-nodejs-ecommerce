// config router
const catalogsRouter = require("./catalogs.route");
const productsRouter = require("./products.route");
const usersRouter = require("./users.route");
const catalogsBlogRouter = require("./catalogsBlog.route");
const blogsRouter = require("./blogs.route");
const commentRouter = require("./comment.route");
const customersRouter = require("./customers.route");
const ordersRouter = require("./orders.route");
const orderDetailsRouter = require("./orderDetails.route");
const couponRouter = require("./coupon.route");
const rolesRouter = require("./roles.route");
const permissionsRouter = require("./permissions.route");
function route(app) {
  app.use("/catalogs", catalogsRouter);
  app.use("/products", productsRouter);
  app.use("/users", usersRouter);
  app.use("/catalogs-blog", catalogsBlogRouter);
  app.use("/blogs", blogsRouter);
  app.use("/comment", commentRouter);
  app.use("/customers", customersRouter);
  app.use("/orders", ordersRouter);
  app.use("/orderDetails", orderDetailsRouter);
  app.use("/coupon", couponRouter);
  app.use("/roles", rolesRouter);
  app.use("/permissions", permissionsRouter);
}

module.exports = route;
