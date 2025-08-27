export interface QuestionOption {
  text: string;
  value: number;
}

export interface Question {
  id: string;
  text: string;
  type: "slider" | "radio";
  min?: number;
  max?: number;
  labels?: string[];
  options?: QuestionOption[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  questions: Question[];
}

export const surveyConfig = {
  categories: [
    {
      id: 'strategy',
      title: 'Strategy & Leadership',
      icon: 'business_center',
      description: 'Assess leadership commitment and strategic planning for digital transformation',
      questions: [
        {
          id: 'leadership_support',
          text: 'On a scale of 0–10, how strongly do your organization\'s leaders (executive team/board) support and champion digital transformation and AI initiatives?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Not at all supportive (0)', 'Extremely supportive (10)']
        },
        {
          id: 'digital_strategy',
          text: 'Does your organization have a clear digital transformation or AI strategy/roadmap in place?',
          type: 'radio',
          options: [
            { text: 'No strategy in place', value: 0 },
            { text: 'Informal or in development', value: 5 },
            { text: 'Well-defined and documented strategy aligned with mission', value: 10 }
          ]
        },
        {
          id: 'change_management',
          text: 'How would you rate your organization\'s change management planning for digital initiatives?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['No planning (0)', 'Comprehensive planning (10)']
        }
      ]
    },
    {
      id: 'people',
      title: 'People & Culture',
      icon: 'people',
      description: 'Evaluate staff skills and organizational culture readiness',
      questions: [
        {
          id: 'staff_skills',
          text: 'How would you rate your staff\'s overall digital skills and literacy?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Very low skills (0)', 'Very high skills (10)']
        },
        {
          id: 'training_programs',
          text: 'Does the organization provide training or capacity-building on digital tools and AI for employees?',
          type: 'radio',
          options: [
            { text: 'No training provided', value: 0 },
            { text: 'Occasional or ad-hoc training', value: 5 },
            { text: 'Regular, structured training programs', value: 10 }
          ]
        },
        {
          id: 'innovation_culture',
          text: 'Rate your organization\'s culture of innovation and openness to new technologies',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Resistant to change (0)', 'Highly innovative (10)']
        }
      ]
    },
    {
      id: 'technology',
      title: 'Technology & Infrastructure',
      icon: 'computer',
      description: 'Assess IT systems, infrastructure, and digital tools',
      questions: [
        {
          id: 'it_infrastructure',
          text: 'Rate the reliability and adequacy of your IT infrastructure for supporting digital initiatives',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Inadequate/unreliable (0)', 'Excellent/reliable (10)']
        },
        {
          id: 'digital_tools',
          text: 'Does your organization have necessary software platforms or tools to support your work?',
          type: 'radio',
          options: [
            { text: 'Very few or outdated tools', value: 0 },
            { text: 'Some modern tools, gaps exist', value: 5 },
            { text: 'Comprehensive, modern toolset', value: 10 }
          ]
        },
        {
          id: 'cybersecurity',
          text: 'How would you rate your organization\'s cybersecurity measures and practices?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Very weak security (0)', 'Very strong security (10)']
        }
      ]
    },
    {
      id: 'data',
      title: 'Data & Analytics',
      icon: 'analytics',
      description: 'Evaluate data management and analysis capabilities',
      questions: [
        {
          id: 'data_collection',
          text: 'How well does your organization collect and maintain data relevant to your programs and operations?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Very little useful data (0)', 'Extensive, well-maintained datasets (10)']
        },
        {
          id: 'data_quality',
          text: 'Rate the quality of your data management practices',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Poor quality/management (0)', 'Excellent quality/management (10)']
        },
        {
          id: 'analytics_capability',
          text: 'Does the organization have capability to analyze data and draw insights?',
          type: 'radio',
          options: [
            { text: 'Little to no analytics capability', value: 0 },
            { text: 'Basic reporting and analysis', value: 5 },
            { text: 'Advanced analytics and insights', value: 10 }
          ]
        }
      ]
    },
    {
      id: 'processes',
      title: 'Processes & Governance',
      icon: 'settings',
      description: 'Review operational processes and governance structures',
      questions: [
        {
          id: 'process_digitization',
          text: 'To what extent are your key business processes digitized or supported by digital systems?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Predominantly manual (0)', 'Highly automated/digital (10)']
        },
        {
          id: 'governance_policies',
          text: 'Does your organization have governance structures or policies for digital initiatives?',
          type: 'radio',
          options: [
            { text: 'No governance structures', value: 0 },
            { text: 'Informal or developing policies', value: 5 },
            { text: 'Formal governance and comprehensive policies', value: 10 }
          ]
        },
        {
          id: 'agile_processes',
          text: 'How agile and adaptable are your organizational processes for implementing new technologies?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['Very rigid/slow (0)', 'Very agile/adaptable (10)']
        }
      ]
    },
    {
      id: 'resources',
      title: 'Resources & Partnerships',
      icon: 'account_balance',
      description: 'Assess budget allocation and external support systems',
      questions: [
        {
          id: 'budget_allocation',
          text: 'What portion of the organization\'s budget is dedicated to technology and digital initiatives?',
          type: 'radio',
          options: [
            { text: 'Essentially none', value: 0 },
            { text: 'Some ad-hoc funding', value: 5 },
            { text: 'Significant and sustained investment', value: 10 }
          ]
        },
        {
          id: 'technical_expertise',
          text: 'Do you have personnel or access to experts dedicated to IT/AI projects?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['No dedicated IT/data staff (0)', 'Dedicated skilled personnel (10)']
        },
        {
          id: 'external_partnerships',
          text: 'How would you rate your organization\'s partnerships and external support for digital initiatives?',
          type: 'slider',
          min: 0,
          max: 10,
          labels: ['No partnerships (0)', 'Strong partnership network (10)']
        }
      ]
    }
  ] as Category[]
};
