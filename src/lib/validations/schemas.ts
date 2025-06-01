import { z } from "zod";

// User schema for validation
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .optional(),
  role: z.enum(["ADMIN", "EDUCATOR", "PROFESSIONAL", "PARENT", "STUDENT", "GUEST"]).default("STUDENT"),
});

// Profile schema for validation
export const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  school: z.string().optional(),
  yearGroup: z.string().optional(),
  specialNeeds: z.string().optional(),
  learningStyle: z.string().optional(),
});

// Assessment schema for validation
export const assessmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.string(),
  questions: z.array(
    z.object({
      id: z.string().optional(),
      text: z.string(),
      type: z.enum(["multiple-choice", "open-ended", "matching", "file-upload"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
    })
  ),
  published: z.boolean().default(false),
});

// Response schema for validation
export const responseSchema = z.object({
  assessmentId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.union([z.string(), z.array(z.string())]),
    })
  ),
});

// Resource schema for validation
export const resourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.string(),
  url: z.string().url("Invalid URL").optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Curriculum schema for validation
export const curriculumSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  objectives: z.array(z.string()),
  level: z.string().optional(),
  subject: z.string().optional(),
});

// Project schema for validation
export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  content: z.string().optional(),
  status: z.string(),
});

// Immersive environment schema for validation
export const immersiveEnvironmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  sceneData: z.record(z.any()),
});
