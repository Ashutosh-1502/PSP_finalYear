import { Router } from "express";
import { TestRoutes } from "@/routes/test/routes";

export class TestRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.router.delete("/cleanup/drop-db", TestRoutes.dropTestDB);
  }
}
