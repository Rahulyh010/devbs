import { z, ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest = (
  bodySchema?: ZodObject<ZodRawShape>,
  querySchema?: ZodObject<ZodRawShape>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (bodySchema) {
        const bodyValidation = bodySchema.safeParse(req.body);
        if (!bodyValidation.success) {
          return res.status(400).json({
            success: false,
            errors: bodyValidation.error.format(),
          });
        }
      }

      if (querySchema) {
        const queryValidation = querySchema.safeParse(req.query);
        if (!queryValidation.success) {
          return res.status(400).json({
            success: false,
            errors: queryValidation.error.format(),
          });
        }
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Validation error", error });
    }
  };
};

export default validateRequest;
