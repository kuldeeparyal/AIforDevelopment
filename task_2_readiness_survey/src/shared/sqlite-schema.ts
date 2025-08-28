import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().$default(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const questions = sqliteTable("questions", {
  id: text("id").primaryKey().$default(() => crypto.randomUUID()),
  categoryId: text("category_id").notNull().references(() => categories.id),
  text: text("text").notNull(),
  type: text("type").notNull(), // "slider", "radio", "text", "multiselect"
  options: text("options", { mode: "json" }), // for radio/multiselect questions
  labels: text("labels", { mode: "json" }), // for slider questions
  min: integer("min").default(0),
  max: integer("max").default(10),
  order: integer("order").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  conditionalOn: text("conditional_on"), // ID of question this depends on
  conditionalValue: text("conditional_value", { mode: "json" }), // Value that triggers this question
  scoringGuidance: text("scoring_guidance"), // Guidance for scoring open-ended questions
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const assessments = sqliteTable("assessments", {
  id: text("id").primaryKey().$default(() => crypto.randomUUID()),
  organizationName: text("organization_name"),
  contactEmail: text("contact_email"),
  responses: text("responses", { mode: "json" }).$type<Record<string, number | string>>().notNull(),
  categoryScores: text("category_scores", { mode: "json" }).$type<Record<string, number>>().notNull(),
  overallScore: integer("overall_score").notNull(),
  readinessLevel: text("readiness_level").notNull(),
  aiAnalysis: text("ai_analysis", { mode: "json" }).$type<{
    summary: string;
    insights: string[];
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  }>(),
  customSummary: text("custom_summary"),
  completedAt: text("completed_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
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