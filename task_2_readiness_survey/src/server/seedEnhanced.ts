import { db } from "./db";
import { categories, questions } from "@shared/schema";

interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  questions: QuestionData[];
}

interface QuestionData {
  id: string;
  text: string;
  type: "slider" | "radio" | "text" | "multiselect";
  options?: { text: string; value: number }[];
  labels?: string[];
  min?: number;
  max?: number;
  conditionalOn?: string;
  conditionalValue?: any;
  scoringGuidance?: string;
}

const enhancedSurveyData: CategoryData[] = [
  {
    id: 'strategy_governance',
    title: 'Strategy & Governance',
    description: 'Leadership buy-in, strategic planning, and ethical governance practices',
    icon: 'account_balance',
    order: 0,
    questions: [
      {
        id: 'sg_digital_strategy',
        text: 'Does your organization have a documented digital transformation or AI strategy that is actively supported by leadership?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['No strategy at all, and leadership has shown little support', 'Clear written digital/AI strategy endorsed by leadership']
      },
      {
        id: 'sg_ethical_policies',
        text: 'Has your leadership (executive team and board) established policies or guidelines for responsible data use and ethical AI (e.g. addressing data privacy, bias, transparency)?',
        type: 'radio',
        options: [
          { text: 'No policies or guidelines at all', value: 0 },
          { text: 'Not yet, but we are developing them', value: 3 },
          { text: 'Yes, we have basic guidelines', value: 7 },
          { text: 'Yes, we have comprehensive written policies', value: 10 }
        ]
      },
      {
        id: 'sg_budget_allocation',
        text: 'Have resources (budget or dedicated funding) been allocated specifically for technology, data, or AI initiatives in your organization?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['No dedicated budget for digital/AI', 'Stable dedicated budget exists for digital innovation']
      },
      {
        id: 'sg_leadership_perception',
        text: 'In your own words, how do organizational leaders perceive the importance of digital transformation and AI? Describe any statements, plans, or actions from leadership regarding adopting new technology or data-driven approaches.',
        type: 'text',
        scoringGuidance: 'High maturity (8-10): Concrete examples of digital vision, goals, innovation committee. Moderate (4-7): General positive attitude but no formal plans. Low (0-3): Leadership uninvolved, skeptical, or unaware.'
      }
    ]
  },
  {
    id: 'data_tech_infrastructure',
    title: 'Data & Technology Infrastructure',
    description: 'Technical backbone for data and AI projects, including data quality and IT infrastructure',
    icon: 'storage',
    order: 1,
    questions: [
      {
        id: 'dti_data_quality',
        text: 'How would you describe the quality and accessibility of your organization\'s data infrastructure? (For example, do you have centralized, clean, and secure data repositories that staff can easily access for analysis?)',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Data is mostly siloed, poor quality, or not stored digitally', 'High-quality, centralized databases with clean, accessible data']
      },
      {
        id: 'dti_tech_tools',
        text: 'What technology tools and platforms are in use to support your programs and operations? (Examples: donor or CRM databases, monitoring & evaluation systems, cloud analytics platforms, etc.)',
        type: 'radio',
        options: [
          { text: 'Mostly basic office software with no specialized data systems', value: 1 },
          { text: 'Some dedicated tools for specific needs (e.g. donor database)', value: 5 },
          { text: 'Multiple integrated platforms (CRM, data analytics tools) in use', value: 7 },
          { text: 'Advanced infrastructure (cloud platforms, AI/ML tools) in place', value: 10 }
        ]
      },
      {
        id: 'dti_staff_access',
        text: 'Do staff have reliable access to the necessary hardware, software, and internet connectivity to effectively use data and digital tools?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Significant gaps (many lack computers or stable internet)', 'All staff have reliable devices, software, and high-speed internet']
      },
      {
        id: 'dti_systems_integration',
        text: 'How well integrated are your data and technology systems across the organization\'s departments/functions?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Not at all – systems are siloed with manual data transfers', 'Highly integrated – seamless data flow across the organization']
      }
    ]
  },
  {
    id: 'people_skills',
    title: 'People & Skills',
    description: 'Staff capacity, skills, and culture for data/AI innovation',
    icon: 'groups',
    order: 2,
    questions: [
      {
        id: 'ps_data_literacy',
        text: 'What is the overall level of data literacy and AI knowledge among your staff and volunteers?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Very low – most unfamiliar with data analysis or AI', 'High – many comfortable with data, some with AI expertise']
      },
      {
        id: 'ps_training_programs',
        text: 'Do you offer (or facilitate access to) training or professional development in data or digital skills for your staff?',
        type: 'radio',
        options: [
          { text: 'No training opportunities in data/tech provided', value: 0 },
          { text: 'Not formally, but we share resources or encourage self-learning', value: 3 },
          { text: 'Some training programs or workshops occasionally', value: 7 },
          { text: 'Regular, structured training/upskilling program for data and AI', value: 10 }
        ]
      },
      {
        id: 'ps_designated_team',
        text: 'Is there a designated person or team responsible for data and technology (e.g. a data analyst, IT lead, or digital innovation champion)?',
        type: 'radio',
        options: [
          { text: 'No, responsibilities are ad-hoc or added to everyone\'s duties', value: 0 },
          { text: 'Not officially, but tech-savvy people informally take the lead', value: 5 },
          { text: 'Yes, at least one staff role focused on data/technology', value: 8 },
          { text: 'Yes, we have a formal team or department for IT/data/analytics', value: 10 }
        ]
      },
      {
        id: 'ps_innovation_culture',
        text: 'How would you characterize your organizational culture when it comes to technology and innovation?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Change-averse – skepticism or fear around new technology', 'Innovation-friendly – encourages experimentation and learning']
      },
      {
        id: 'ps_capacity_building',
        text: 'What steps (if any) has your organization taken to build staff capacity in data or AI, and what gaps remain? Describe any training attended, new hires/volunteers brought on, or internal initiatives to improve data skills.',
        type: 'text',
        scoringGuidance: 'High (8-10): Specific initiatives listed (trainings, experts hired, learning groups). Moderate (4-7): Some efforts but gaps remain. Low (0-3): No significant efforts yet.'
      }
    ]
  },
  {
    id: 'process_data_practices',
    title: 'Process & Data Practices',
    description: 'Integration of digital tools and data into workflows and decision-making',
    icon: 'analytics',
    order: 3,
    questions: [
      {
        id: 'pdp_workflow_digitization',
        text: 'To what extent are your programmatic and operational workflows digitized or managed through software systems (as opposed to being manual/paper-based)?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Not at all – mostly offline or basic spreadsheets', 'Extensively – majority use dedicated software platforms']
      },
      {
        id: 'pdp_data_driven_decisions',
        text: 'Are data and evidence routinely used in management and program decisions, or are decisions mostly based on intuition and experience?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Decisions based on gut instinct or anecdote', 'Data-driven culture – standard to consult data for decisions']
      },
      {
        id: 'pdp_process_standardization',
        text: 'How standardized and well-documented are your key processes (program delivery, data collection, etc.) across the organization?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Processes are mostly ad-hoc and vary widely', 'Most processes standardized with clear guidelines/SOPs']
      }
    ]
  },
  {
    id: 'ai_applications_risks',
    title: 'AI Applications & Risks',
    description: 'Current AI usage, readiness for AI opportunities, and risk awareness',
    icon: 'psychology',
    order: 4,
    questions: [
      {
        id: 'aar_ai_implementation',
        text: 'Has your organization piloted or implemented any AI tools or algorithms in its work? (Examples: AI chatbots, machine learning for predictions, AI-based analysis)',
        type: 'radio',
        options: [
          { text: 'No – we have not tried any AI tools yet', value: 0 },
          { text: 'Not yet, but we\'re exploring – AI is on our radar', value: 3 },
          { text: 'Yes, small pilots – experimented with at least one AI tool', value: 7 },
          { text: 'Yes, multiple or scaled implementations in operations', value: 10 }
        ]
      },
      {
        id: 'aar_ai_scale',
        text: 'If yes, what best describes the scale and outcome of your AI initiatives so far?',
        type: 'radio',
        conditionalOn: 'aar_ai_implementation',
        conditionalValue: [7, 10],
        options: [
          { text: 'Pilot in very early stages (limited scope, just testing)', value: 3 },
          { text: 'Pilot completed, not yet scaled (learned lessons)', value: 5 },
          { text: 'One AI solution integrated into operations', value: 8 },
          { text: 'Multiple AI solutions fully integrated across areas', value: 10 }
        ]
      },
      {
        id: 'aar_ai_ethics',
        text: 'Does your organization have any guidelines or protocols to ensure ethical AI use and manage risks like bias, fairness, or data privacy in AI projects?',
        type: 'radio',
        options: [
          { text: 'No specific guidelines for AI ethics', value: 0 },
          { text: 'Not yet, but we recognize the need and are looking into it', value: 3 },
          { text: 'In progress – some informal guidelines or ongoing development', value: 5 },
          { text: 'Yes, established guidelines or principles for ethical AI use', value: 10 }
        ]
      },
      {
        id: 'aar_ai_awareness',
        text: 'How would you rate your organization\'s overall awareness and knowledge of AI\'s potential (and pitfalls) among key decision-makers?',
        type: 'slider',
        min: 0,
        max: 10,
        labels: ['Very low – little understanding of AI implications', 'High – well-informed about AI opportunities and risks']
      },
      {
        id: 'aar_ai_future',
        text: 'What do you see as the most promising opportunity – or the biggest concern – for using AI in your organization\'s work in the next few years?',
        type: 'text',
        scoringGuidance: 'Categorize as: Opportunity-focused (positive use case), Concern-focused (emphasizes risks), or Uncertain (not sure about AI). Use for tailored recommendations.'
      }
    ]
  }
];

async function seedEnhancedDatabase() {
  console.log("Seeding database with enhanced survey data...");

  try {
    // Clear existing data
    await db.delete(questions);
    await db.delete(categories);

    // Insert categories
    for (const category of enhancedSurveyData) {
      const insertedCategory = await db
        .insert(categories)
        .values({
          id: category.id,
          title: category.title,
          description: category.description,
          icon: category.icon,
          order: category.order,
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
            conditionalOn: question.conditionalOn || null,
            conditionalValue: question.conditionalValue || null,
            scoringGuidance: question.scoringGuidance || null,
          });

        console.log(`  Created question: ${question.text.substring(0, 50)}...`);
      }
    }

    console.log("Enhanced database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

export { seedEnhancedDatabase };

// Run if called directly
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  seedEnhancedDatabase().then(() => process.exit(0));
}