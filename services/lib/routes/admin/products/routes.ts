// NPM Dependencies
import status from "http-status";
import { Response, NextFunction } from "express";

// Internal Dependencies
import { ProductsHelpers } from "@/routes/admin/products/helpers";
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { ProductType } from "@/utils/interfaces/module/product";
import { Validator } from "node-input-validator";

export class ProductsRoutes {
  public static update = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id: string = req.params.id;
      const update: ProductType = req.body;
      // Fetch companyRef from `req.user` to prevent unauthorized access to other companies' data.
      // This is done to prevent other ADMIN's misusing companyRef in `req.body`.
      const companyRef: string = req.user.companyRef;

      const data = await ProductsHelpers.findAndUpdate(id, update, companyRef);
      if (!data) {
        return ErrorResponse(res, status.BAD_REQUEST, {
          message: "Bad request. check the body",
        });
      }
      return SuccessResponse(res, status.OK, { message: "Success.", data });
    } catch (error) {
      next(error);
    }
  };

  public static create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const document: ProductType = req.body;
      // Fetch companyRef from `req.user` to prevent unauthorized access to other companies' data.
      // This is done to prevent other ADMIN's misusing companyRef in `req.body`.
      document.companyRef = req.user.companyRef;

      const validator = new Validator(req.body, {
        title: "required",
        description: "required",
      });

      const matched = await validator.check();

      if (!matched) {
        return ErrorResponse(res, status.UNPROCESSABLE_ENTITY, {
          message: "Validation error",
          errors: validator.errors,
        });
      }

      const data = await ProductsHelpers.create(document);
      return SuccessResponse(res, status.OK, { message: "Success.", data });
    } catch (error) {
      next(error);
    }
  };

  public static delete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id: string = req.params.id;
      // Fetch companyRef from `req.user` to prevent unauthorized access to other companies' data.
      // This is done to prevent other ADMIN's misusing companyRef in `req.body`.
      const companyRef: string = req.user.companyRef;
      const data = ProductsHelpers.softDelete(id, companyRef);
      if (!data) {
        return ErrorResponse(res, status.BAD_REQUEST, {
          message: "Bad request. check the body",
        });
      }
      return SuccessResponse(res, status.OK, { message: "Success.", data });
    } catch (error) {
      next(error);
    }
  };
}
