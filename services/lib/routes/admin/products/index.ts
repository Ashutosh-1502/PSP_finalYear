// NPM Deps
import { Router } from "express";

// Internal Deps
import { ProductsRoutes } from "@/routes/admin/products/routes";
import { Middleware } from "@/middleware/auth";

const middleware = new Middleware();
export class ProductsRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(middleware.adminMiddleware);
    this.router.post("/", ProductsRoutes.create);
    this.router
      .put("/:id", ProductsRoutes.update)
      .delete("/:id", ProductsRoutes.delete);
  }
}
