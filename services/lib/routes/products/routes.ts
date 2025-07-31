// NPM Dependencies
import status from "http-status";
import { Response, NextFunction } from "express";

// Internal Dependencies
import { ProductsHelpers } from "@/routes/products/helpers";
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import { SuccessResponse } from "@/utils/helpers/apiResponse";
import { PaginatedSearchQuery } from "@/utils/interfaces/common/query";

export class ProductsRoutes {
  public static get = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query: PaginatedSearchQuery = req.query;
      const companyRef = req.user.companyRef;
      const data = await ProductsHelpers.findAll({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 50),
        searchValue: String(query.searchValue ?? ""),
        sortBy: query.sortBy,
        companyRef,
      });
      return SuccessResponse(res, status.OK, {
        message: "Success.",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getOne = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id: string = req.params.id;
      const data = await ProductsHelpers.findOne(id);
      return SuccessResponse(res, status.OK, { message: "Success.", data });
    } catch (error) {
      next(error);
    }
  };
}
