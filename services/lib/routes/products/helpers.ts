import { Products } from "@/db/models/products";
import { STATUS } from "@/utils/enums/enums";
import { ObjectId } from "@/utils/helpers/commonHelper";
import { createFacetPipeline } from "@/utils/helpers/queryHelper";
import { PaginatedSearchQuery } from "@/utils/interfaces/common/query";

export class ProductsHelpers {
  public static findOne = async (id: string) => {
    return Products.findOne({ _id: ObjectId(id) });
  };

  public static findAll = async (query: PaginatedSearchQuery) => {
    const page = query.page;
    const limit = query.pageSize;
    const skips = (page - 1) * limit;
    const searchValue = query.searchValue;
    const sortBy = query.sortBy === "true" ? 1 : -1;
    const companyRef = query.companyRef;

    const facetPipeline = createFacetPipeline(page, skips, limit);

    return Products.aggregate([
      {
        $match:
          searchValue && searchValue.length
            ? {
                title: { $regex: searchValue, $options: "i" },
                status: STATUS.ACTIVE,
                companyRef: ObjectId(companyRef),
              }
            : { status: STATUS.ACTIVE, companyRef: ObjectId(companyRef) },
      },
      {
        $sort: {
          price: sortBy,
        },
      },
      ...facetPipeline,
    ]);
  };
}
