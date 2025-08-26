import type { Assessment, InsertAssessment, Category, Question } from "@shared/schema";
import { db } from "./db";
import { assessments, categories, questions } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  getCategories(): Promise<Category[]>;
  getQuestions(): Promise<Question[]>;
  getCategoriesWithQuestions(): Promise<(Category & { questions: Question[] })[]>;
}

class DatabaseStorage implements IStorage {
  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async getCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.order));
  }

  async getQuestions(): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.isActive, true))
      .orderBy(asc(questions.order));
  }

  async getCategoriesWithQuestions(): Promise<(Category & { questions: Question[] })[]> {
    const allCategories = await this.getCategories();
    const allQuestions = await this.getQuestions();

    return allCategories.map(category => ({
      ...category,
      questions: allQuestions.filter(q => q.categoryId === category.id)
    }));
  }
}

export const storage = new DatabaseStorage();
