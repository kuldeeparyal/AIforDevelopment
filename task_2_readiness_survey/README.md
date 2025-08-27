# AI & Digital Transformation Readiness Assessment Tool

## Overview

This is a comprehensive web-based assessment tool designed to evaluate non-profit organizations' readiness for AI and digital transformation. The tool provides structured evaluation across six key categories and generates detailed reports with AI-powered insights and personalized recommendations.

## Features

- **Comprehensive Assessment**: 18 questions across 6 critical readiness categories
- **AI-Powered Analysis**: Integration with OpenAI GPT-4 for personalized insights and recommendations
- **Interactive Web Interface**: User-friendly survey with progress tracking
- **Detailed Reporting**: Comprehensive PDF and Markdown reports with scoring breakdowns
- **Real-time Scoring**: Dynamic calculation of readiness levels based on weighted categories
- **Data Visualization**: Charts and visual representations of assessment results

## Technology Stack

- **Frontend**: React 18 with TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL (via Neon) with Drizzle ORM
- **AI Integration**: OpenAI GPT-4 API for intelligent analysis
- **Build Tools**: Vite for frontend, TSX for backend

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- PostgreSQL database (or use Neon cloud database)
- **OpenAI API key** for AI-powered features (get yours at [OpenAI Platform](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   cd task_2_readiness_survey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your:
   - **OpenAI API key** (required for AI-powered analysis and recommendations)
   - **Database connection string** (PostgreSQL via Neon or local database)

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Usage Instructions

### Taking the Assessment

1. **Start Assessment**: Navigate to the home page and click "Start Assessment"
2. **Complete Survey**: Answer questions across all 6 categories:
   - Strategy & Leadership
   - People & Culture
   - Technology & Infrastructure
   - Data & Analytics
   - Processes & Governance
   - Resources & Partnerships
3. **Submit Responses**: Complete all questions and submit the assessment
4. **View Results**: Review your comprehensive readiness report

### Understanding Results

The assessment provides:
- **Overall Readiness Score**: Weighted percentage (0-100%)
- **Readiness Level**: Four levels from "Needs Foundation" to "Advanced"
- **Category Scores**: Individual scores for each assessment category
- **AI Insights**: Personalized analysis of strengths and gaps
- **Recommendations**: Prioritized action items for improvement
- **Export Options**: Download report as PDF or Markdown

### Scoring Methodology

- **Question Scoring**: 0-10 scale for each question
- **Category Weights**: 
  - Technology & Infrastructure: 25%
  - Strategy & Leadership: 20%
  - People & Culture: 20%
  - Data & Analytics: 20%
  - Resources & Partnerships: 20%
  - Processes & Governance: 15%
- **Readiness Levels**:
  - Level 4 - Advanced (86-100%)
  - Level 3 - Developing (61-85%)
  - Level 2 - Emerging (31-60%)
  - Level 1 - Needs Foundation (0-30%)

## Project Structure

```
task_2_readiness_survey/
├── src/
│   ├── client/           # React frontend application
│   │   ├── src/
│   │   │   ├── components/   # UI components
│   │   │   ├── pages/        # Page components
│   │   │   ├── lib/          # Utilities and helpers
│   │   │   └── App.tsx       # Main application component
│   │   └── index.html
│   ├── server/           # Express backend server
│   │   ├── routes.ts         # API endpoints
│   │   ├── openai-service.ts # AI integration
│   │   ├── storage.ts        # Data persistence
│   │   └── index.ts          # Server entry point
│   └── shared/           # Shared types and schemas
│       └── schema.ts         # Database and validation schemas
├── example_reports/      # Sample assessment reports
│   └── sample_assessment_report.md
├── FRAMEWORK.md         # Detailed assessment methodology
├── .env.example         # Environment variables template
└── README.md           # This file
```

## API Endpoints

- `GET /api/survey-config`: Retrieve survey questions and categories
- `POST /api/assessments`: Submit assessment responses
- `GET /api/assessments/:id`: Retrieve assessment results
- `GET /api/assessments/:id/report`: Generate detailed report

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Database Migrations
```bash
npm run db:push     # Push schema changes
npm run db:studio   # Open database studio
```

## Deployment

The application can be deployed on various platforms:
- **Replit**: Built-in deployment with automatic SSL
- **Vercel/Netlify**: Frontend deployment with serverless functions
- **Heroku/Railway**: Full-stack deployment with PostgreSQL
- **Docker**: Containerized deployment

## For GitHub Users

When someone downloads your repository, they'll need to:

1. Run `npm install`
2. Copy `.env.example` to `.env`
3. Add their OpenAI API key to `.env`
4. Run `npm run dev`

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is under MIT licence 

## Support

For questions or issues, please refer to the FRAMEWORK.md for methodology details or create an issue in the repository.