import { Router } from "express";
import { AdminUsersRouter } from "@/routes/admin/users";
import { ProductsRouter } from "@/routes/admin/products";

export class AdminRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use("/user", new AdminUsersRouter().router);
    this.router.use("/products", new ProductsRouter().router);
  }
}
