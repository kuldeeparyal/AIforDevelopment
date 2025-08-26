import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  text: text("text").notNull(),
  type: text("type").notNull(), // "slider", "radio", "text", "multiselect"
  options: jsonb("options"), // for radio/multiselect questions
  labels: jsonb("labels"), // for slider questions
  min: integer("min").default(0),
  max: integer("max").default(10),
  order: integer("order").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  conditionalOn: varchar("conditional_on"), // ID of question this depends on
  conditionalValue: jsonb("conditional_value"), // Value that triggers this question
  scoringGuidance: text("scoring_guidance"), // Guidance for scoring open-ended questions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationName: text("organization_name"),
  contactEmail: text("contact_email"),
  responses: jsonb("responses").$type<Record<string, number | string>>().notNull(),
  categoryScores: jsonb("category_scores").$type<Record<string, number>>().notNull(),
  overallScore: integer("overall_score").notNull(),
  readinessLevel: text("readiness_level").notNull(),
  aiAnalysis: jsonb("ai_analysis").$type<{
    summary: string;
    insights: string[];
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  }>(),
  customSummary: text("custom_summary"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
}));

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  completedAt: true,
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Survey response validation schema
export const surveyResponseSchema = z.object({
  organizationName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  responses: z.record(z.string(), z.union([z.number().min(0).max(10), z.string()])),
});

export type SurveyResponse = z.infer<typeof surveyResponseSchema>;

// Category and readiness level enums
export const ReadinessLevel = {
  NEEDS_FOUNDATION: "Level 1 - Needs Foundation",
  EMERGING: "Level 2 - Emerging", 
  DEVELOPING: "Level 3 - Developing",
  ADVANCED: "Level 4 - Advanced"
} as const;

export type ReadinessLevelType = typeof ReadinessLevel[keyof typeof ReadinessLevel];

export const CategoryId = {
  STRATEGY: "strategy",
  PEOPLE: "people", 
  TECHNOLOGY: "technology",
  DATA: "data",
  PROCESSES: "processes",
  RESOURCES: "resources"
} as const;

export type CategoryIdType = typeof CategoryId[keyof typeof CategoryId];
