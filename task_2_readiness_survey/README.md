# AI & Digital Transformation Readiness Assessment Tool

## Overview

This is a comprehensive web-based assessment tool designed to evaluate non-profit organizations' readiness for AI and digital transformation. The tool provides structured evaluation across six key categories and generates detailed reports with AI-powered insights and personalized recommendations.

## Features

- **Comprehensive Assessment**: 15 questions across 6 critical readiness categories
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

3. **Configure project files**
   ```bash
   # Option 1: Manual setup
   cp env.example .env
   cp gitignore .gitignore
   
   # Option 2: Automatic setup
   ./setup.sh
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
   - Strategy & Leadership (3 questions)
   - People & Culture (3 questions) 
   - Technology & Infrastructure (3 questions)
   - Data & Analytics (3 questions)
   - Processes & Governance (3 questions)
   - Resources & Partnerships (3 questions)
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
  - Data & Tech Infrastructure: 25%
  - Strategy & Governance: 20%
  - People & Skills: 20%
  - AI Applications & Risks: 20%
  - Process & Data Practices: 15%
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
│   ├── sample_assessment_report.md
│   ├── example_nonprofit_assessment.md
│   ├── green_valley_food_bank_assessment.md
│   └── urban_youth_mentorship_assessment.md
├── FRAMEWORK.md         # Detailed assessment methodology
├── env.example          # Environment variables template
├── gitignore            # Git ignore rules template  
├── setup.sh             # Automated project setup script
└── README.md            # This file
```

## API Endpoints

- `GET /api/survey-config`: Retrieve survey questions and categories
- `POST /api/assessments`: Submit assessment responses
- `GET /api/assessments/:id`: Retrieve assessment results
- `GET /api/assessments/:id/export`: Export assessment as Markdown

## Development

### Building for Production
```bash
npm run build
```

### Database Migrations
```bash
npm run db:push     # Push schema changes
```

## Deployment

The application can be deployed on various platforms:
- **Replit**: Built-in deployment with automatic SSL
- **Vercel/Netlify**: Frontend deployment with serverless functions
- **Heroku/Railway**: Full-stack deployment with PostgreSQL
- **Docker**: Containerized deployment

## For GitHub Users

When someone downloads your repository from GitHub, the template files (`env.example` and `gitignore`) will download correctly. To set up the project:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up configuration files**
   ```bash
   # Option A: Automatic setup (recommended)
   chmod +x setup.sh  # Make script executable (GitHub doesn't preserve permissions)
   ./setup.sh
   
   # Option B: Manual setup
   cp env.example .env
   cp gitignore .gitignore
   ```

3. **Configure your API key**
   - Edit `.env` file and add your OpenAI API key
   - For local development, keep the placeholder `DATABASE_URL` (SQLite will be used automatically)
   - For production, replace with your actual PostgreSQL connection string

4. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Troubleshooting

### Common Setup Issues

#### 1. Permission Denied Error (./setup.sh)
```bash
zsh: permission denied: ./setup.sh
```
**Solution**: GitHub doesn't preserve execute permissions. Run:
```bash
chmod +x setup.sh
./setup.sh
```

#### 2. Database Connection Error
```bash
Error: DATABASE_URL must be set. Did you forget to provision a database?
```
**Solutions**: 
- **Local Development**: The app automatically falls back to SQLite when no real database is configured. Make sure you have a placeholder `DATABASE_URL=postgresql://user:password@host/database` in your `.env` file.
- **Production**: Get a free PostgreSQL database from [Neon](https://neon.tech) or [Supabase](https://supabase.com) and update your `DATABASE_URL`.

#### 3. Module Not Found Errors
**Solution**: Ensure all dependencies are installed:
```bash
npm install
```

#### 4. Port Already in Use
**Solution**: Stop other applications using port 5000 or change the port:
```bash
PORT=3000 npm run dev
```

#### 5. OpenAI API Errors
**Solution**: Make sure you have a valid OpenAI API key in your `.env` file:
```bash
OPENAI_API_KEY=your_actual_api_key_here
```

### Database Options

- **Local Development**: Uses SQLite automatically (no setup required)
- **Production**: Use PostgreSQL from Neon, Supabase, or your preferred provider
- **Local PostgreSQL**: Install PostgreSQL locally and update `DATABASE_URL`

### Getting Help

- Check the console logs for detailed error messages
- Verify your `.env` file has the correct format
- Try deleting `node_modules` and running `npm install` again

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 

## Support

For questions or issues, please refer to the FRAMEWORK.md for methodology details or create an issue in the repository.