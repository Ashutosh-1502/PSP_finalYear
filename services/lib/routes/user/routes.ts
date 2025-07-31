// import { Response, NextFunction } from "express";
// import status from "http-status";
// import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
// import { Validator } from "node-input-validator";
// import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
// import envConfig from "@/utils/configuration/environment";
// import { getJWTToken } from "@/utils/helpers/commonHelper";
// import { User } from "@/db/models/user";
// import { COOKIE_NAME } from "@/utils/enums/enums";
// import { cookieOptions } from "@/utils/configuration/cookieOptions";

// export class UserRoutes {
//   static JWT_SECRET: string = envConfig.JWT_SECRET;

//   public static me = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       if (!req.user) {
//         return ErrorResponse(res, status.UNAUTHORIZED, { message: "Error." });
//       } else {
//         // tracking the user last activity time
//         await User.findByIdAndUpdate(req.user._id, {
//           lastActivity: Date.now(),
//         });
//         return SuccessResponse(res, status.OK, {
//           message: "Success.",
//           data: req.user,
//         });
//       }
//     } catch (error) {
//       next(error);
//     }
//   };

//   public static updateProfile = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       const update = req.body;

//       const validator = new Validator(update, {
//         "name.first": "string",
//         "name.last": "string",
//       });

//       const matched = await validator.check();

//       if (!matched || (!update.name.first && !update.name.last)) {
//         return ErrorResponse(res, status.UNPROCESSABLE_ENTITY, {
//           message: "Validation error",
//           errors: validator.errors,
//         });
//       }

//       const companyRef = req.user?.companyRef;
//       const message = "Your profile has been updated successfully!";

//       // Access files using req.files
//       update.name.first = update.name.first || req.user.name.first;
//       update.name.last = update.name.last || req.user.name.last;

//       const updatedUser = await User.findByIdAndUpdate(req.user._id, update, {
//         returnDocument: "after",
//       });


//       const token = getJWTToken(updatedUser);

//       res.cookie(COOKIE_NAME.TOKEN, token, cookieOptions);

//       return SuccessResponse(res, status.OK, {
//         message: "User profile updated successfully",
//         data: {
//           user: updatedUser,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public static changePassword = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       const validator = new Validator(req.body, {
//         currentPassword: "required",
//         newPassword: "required",
//         confirmedPassword: "required",
//       });

//       const matched = await validator.check();

//       if (!matched) {
//         return ErrorResponse(res, status.UNPROCESSABLE_ENTITY, {
//           message: "Validation error",
//           errors: validator.errors,
//         });
//       }

//       const { currentPassword, newPassword, confirmedPassword } = req.body;

//       if (newPassword !== confirmedPassword) {
//         return ErrorResponse(res, status.UNPROCESSABLE_ENTITY, {
//           message: "New password and confirmed password do not match",
//         });
//       }

//       const userId = req.user._id;
//       const companyRef = req.user?.companyRef;
//       const message = "Your Password has been changed succesfully";

//       const token = getJWTToken(req.user);

//       res.cookie(COOKIE_NAME.TOKEN, token, cookieOptions);

//       return SuccessResponse(res, status.OK, {
//         message: `Changed password successfully`,
//         data: { user: req.user },
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
// }
