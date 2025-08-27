import { db } from "./db";
import { categories, questions } from "@shared/schema";
import { surveyConfig } from "../client/src/lib/survey-config";

async function seedDatabase() {
  console.log("Seeding database with survey data...");

  try {
    // Clear existing data
    await db.delete(questions);
    await db.delete(categories);

    // Insert categories
    for (let index = 0; index < surveyConfig.categories.length; index++) {
      const category = surveyConfig.categories[index];
      const insertedCategory = await db
        .insert(categories)
        .values({
          id: category.id,
          title: category.title,
          description: category.description,
          icon: category.icon,
          order: index,
        })
        .returning();

      console.log(`Created category: ${insertedCategory[0].title}`);

      // Insert questions for this category
      for (let qIndex = 0; qIndex < category.questions.length; qIndex++) {
        const question = category.questions[qIndex];
        await db
          .insert(questions)
          .values({
            id: question.id,
            categoryId: category.id,
            text: question.text,
            type: question.type,
            options: question.options ? question.options : null,
            labels: question.labels ? question.labels : null,
            min: question.min || 0,
            max: question.max || 10,
            order: qIndex,
          });

        console.log(`  Created question: ${question.text.substring(0, 50)}...`);
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

export { seedDatabase };

// Run if called directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  seedDatabase().then(() => process.exit(0));
}