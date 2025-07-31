import { Products } from "@/db/models/products";
import { ProductType } from "@/utils/interfaces/module/product";
import { STATUS } from "@/utils/enums/enums";
import { ObjectId } from "@/utils/helpers/commonHelper";

export class ProductsHelpers {
  public static findOne = async (id: string) => {
    return Products.findOne({
      _id: ObjectId(id),
    });
  };

  public static findAndUpdate = async (
    id: string,
    update: ProductType,
    companyRef: string,
  ) => {
    return Products.findOneAndUpdate(
      { $and: [{ _id: id, companyRef: companyRef }] },
      { ...update },
      { returnDocument: "after" },
    );
  };

  public static create = async (document: ProductType) => {
    return Products.create(document);
  };

  public static softDelete = async (id: string, companyRef: string) => {
    return Products.findOneAndUpdate(
      { $and: [{ _id: id, companyRef: companyRef }] },
      { $set: { status: STATUS.DELETED } },
      { returnDocument: "after" },
    );
  };
}
