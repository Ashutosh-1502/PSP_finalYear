// NPM Deps
import { Router } from "express";

// Internal Deps
import { ProductsRoutes } from "@/routes/products/routes";
import { Middleware } from "@/middleware/auth";

const middleware = new Middleware();
export class ProductsRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(middleware.authMiddleware);
    this.router.get("/", ProductsRoutes.get);
    this.router.get("/:id", ProductsRoutes.getOne);
  }
}
