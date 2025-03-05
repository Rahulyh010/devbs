import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodSchema } from "zod";

interface Schemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate =
  (schemas: Schemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas?.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas?.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas?.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          errors: err.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      } else {
        next(err);
      }
    }
  };

// import { z } from "zod";
// import { Request, Response, NextFunction } from "express";
// import { resHandler } from "./helpers/resHandler";

// // import { z } from "zod";
// // import { Request, Response, NextFunction } from "express";

// export const validate =
//   (schema: z.ZodSchema) =>
//   (req: Request, res: Response, next: NextFunction): void => {
//     try {
//       // Parse the request body, query, and params using the schema
//       schema.parse({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });
//       next(); // Proceed to the next middleware or route handler
//     } catch (err) {
//       if (err instanceof z.ZodError) {
//         // Extract the paths of the errors
//         const errorPaths = err.errors.map((e) => e.path.join("."));
//         // Send a 400 Bad Request response with validation errors
//         res.status(400).json({
//           error: errorPaths,
//         });
//         return;
//       }
//       // Pass any other errors to the next error-handling middleware
//       next(err);
//     }
//   };
