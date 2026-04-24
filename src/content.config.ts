import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import {
  VALID_TYPES,
  VALID_BOARDS,
  VALID_STANDARDS,
} from "./utils/validFrontmatter";

const stringOrList = z
  .union([z.string(), z.array(z.string())])
  .optional();

const deviceSchemaExtension = z.object({
  "date-published": z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      if (v instanceof Date) return v.toISOString().split("T")[0];
      return v;
    }),
  type: z
    .string()
    .optional()
    .refine((v) => v === undefined || VALID_TYPES.has(v.toLowerCase()), {
      message: `type must be one of: ${Array.from(VALID_TYPES).join(", ")}`,
    }),
  board: stringOrList,
  standard: stringOrList,
  difficulty: z
    .union([z.string(), z.number()])
    .optional()
    .refine(
      (v) => {
        if (v === undefined) return true;
        const n = typeof v === "string" ? parseInt(v, 10) : v;
        return !isNaN(n) && n >= 1 && n <= 5;
      },
      { message: "difficulty must be between 1 and 5" }
    ),
  "project-url": z.string().url().optional(),
  "made-for-esphome": z.union([z.boolean(), z.string()]).optional(),
  manufacturer: z.coerce.string().optional(),
  model: z.coerce.string().optional(),
  Model: z.coerce.string().optional(),
  description: z.coerce.string().optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: deviceSchemaExtension,
    }),
  }),
};
