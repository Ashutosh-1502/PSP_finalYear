import { Request, Response, NextFunction } from "express";
import status from "http-status";
import mongoose from "mongoose";
import envConfig from "@/utils/configuration/environment";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { supabase } from "@/services/supabaseClient";
import { User } from "@/db/models/user";
import { ENV } from "@/utils/enums/enums";

export class TestRoutes {
  public static dropTestDB = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (envConfig.NODE_ENV !== ENV.TEST) {
        return ErrorResponse(res, status.FORBIDDEN, {
          message: "Operation not allowed in this environment",
        });
      }

      await TestRoutes.deleteUserByEmail("test@byldd.com");
      await mongoose.connection.dropDatabase();

      console.log("Test database dropped and user deleted successfully");

      return SuccessResponse(res, status.OK, {
        message: "Test database dropped and user deleted successfully",
      });
    } catch (error) {
      console.error("Error dropping test database:", error);
      next(error);
    }
  };

  private static deleteUserByEmail = async (email: string) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.supabaseUserId) {
        console.warn(
          `User with email ${email} not found or missing Supabase ID.`,
        );
        return;
      }

      const { error } = await supabase.auth.admin.deleteUser(
        user.supabaseUserId,
      );

      if (error) {
        console.error(`Error deleting user (${email}):`, error.message);
        return;
      }

      console.log(`User with email ${email} deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete user by email:", err);
    }
  };
}
