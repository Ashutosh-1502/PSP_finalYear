import { Request, Response, NextFunction } from "express";
import status from "http-status";
import envConfig from "@/utils/configuration/environment";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import {getJWTToken } from "@/utils/helpers/commonHelper";
import { Validator } from "node-input-validator";
import {
  COOKIE_NAME,
} from "@/utils/enums/enums";
import { User } from "@/db/models/user";
import { cookieOptions } from "@/utils/configuration/cookieOptions";
import bcrypt from "bcrypt";

export class AuthRoutes {
  static JWT_SECRET: string = envConfig.JWT_SECRET;
  static SALT_ROUNDS = 10;

  public static register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validator = new Validator(req.body, {
        email: "required|email",
        password: "required",
        name: "required",
      });

      const matched = await validator.check();

      if (!matched) {
        return ErrorResponse(res, status.UNPROCESSABLE_ENTITY, {
          message: validator.errors,
          errors: validator.errors,
        });
      }

      const { email, password, name} = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return ErrorResponse(res, status.BAD_REQUEST, {
          message: "User already exists!",
        });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, AuthRoutes.SALT_ROUNDS);

      const user = await User.create({
        email,
        name,
        password: hashedPassword,   // store hashed password
      });

      const token = getJWTToken(user);

      res.cookie(COOKIE_NAME.TOKEN, token, cookieOptions);

      return SuccessResponse(res, status.OK, {
        message: "Success.",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  public static login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validator = new Validator(req.body, {
        email: "required|email",
        password: "required",
      });

      const matched = await validator.check();

      if (!matched) {
        return SuccessResponse(res, status.UNPROCESSABLE_ENTITY, {
          message: "Validation error",
          errors: validator.errors,
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({
        email: email,
        password: password
      });

      if (!user) {
        return ErrorResponse(res, status.CONFLICT, {
          message: "Your account doesnt exists please signup",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return ErrorResponse(res, status.UNAUTHORIZED, {
          message: "Invalid credentials",
        });
      }

      const token = getJWTToken(user);

      res.cookie(COOKIE_NAME.TOKEN, token, cookieOptions);

      return SuccessResponse(res, status.OK, {
        message: "Success.",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  public static logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.clearCookie(COOKIE_NAME.TOKEN, cookieOptions);

      return SuccessResponse(res, status.OK, {
        message: "Logged out successfully.",
      });
    } catch (error) {
      next(error);
    }
  };
}
