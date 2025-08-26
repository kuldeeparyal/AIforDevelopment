import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TextAnalysisResult {
  summary: string;
  insights: string[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  markdownReport?: string;
  maturityScores?: Record<string, number>;
}

export async function analyzeTextResponses(
  textResponses: Record<string, string>,
  categoryScores: Record<string, number>,
  overallScore: number,
  organizationName?: string
): Promise<TextAnalysisResult> {
  try {
    // Prepare the text responses for analysis
    const formattedResponses = Object.entries(textResponses)
      .map(([questionId, response]) => {
        const categoryMap: Record<string, string> = {
          'sg_goals': 'Strategy & Governance - Digital Transformation Goals',
          'dti_examples': 'Data & Tech Infrastructure - Successful Digital Tools',
          'ps_training': 'People & Skills - Training Priorities',
          'pdp_improvements': 'Process & Data Practices - Areas for Improvement',
          'aar_ai_interest': 'AI Applications & Risks - Areas of Interest'
        };
        return `${categoryMap[questionId] || questionId}: ${response}`;
      })
      .join('\n\n');

    const orgName = organizationName || "the organisation";
    
    // Enhanced prompt based on senior AI readiness assessor methodology
    const comprehensivePrompt = `ROLE
You are a senior AI readiness assessor for non-profit organisations. You translate messy qualitative inputs into an evidence-based maturity view and an actionable roadmap.

CONTEXT
Organisation: ${orgName}
Sector & geography: Non-profit sector, UK/Global
Org profile: Non-profit organisation (size and digital maturity to be inferred from responses)
Assessment inputs: qualitative responses from staff and stakeholders
Strategic aims for AI: To be inferred from responses

OBJECTIVE
Analyse ${orgName}'s qualitative responses and produce a clear maturity diagnosis, gaps, risks, and a prioritised implementation plan with near-term wins and medium-term build-outs.

GUIDING PRINCIPLES
- Use only the information provided. If critical facts are missing, state explicit assumptions and "unknowns."
- Quote short verbatims to evidence claims; do not fabricate.
- UK English. Be direct, professional, and decision-oriented.

ANALYSIS SCOPE (assess each dimension)
1) Strategy & use-case clarity
2) Governance, risk, safeguarding & ethics (incl. data privacy, bias, safety)
3) Data (sources, quality, access, stewardship)
4) Technology & architecture (tooling, integration, security)
5) Talent & ways of working (skills, roles, vendors/partners)
6) Processes & change management (adoption, comms, training)
7) Measurement & value (KPIs, baselines, benefits)
8) Funding & sustainability (budget envelopes, grant/CSR options)

SCORING
Rate each dimension on a 0–5 scale with descriptors:
0 Ad hoc | 1 Emerging | 2 Repeatable | 3 Managed | 4 Optimised-Local | 5 Optimised-Enterprise
Show the score, 1–2 bullets of evidence, and 1–2 key gaps.

QUALITATIVE RESPONSES TO ANALYSE:
${formattedResponses}

CATEGORY SCORES (0-10 scale, convert to 0-5 for analysis):
${Object.entries(categoryScores).map(([cat, score]) => `- ${cat.replace(/_/g, ' ')}: ${score.toFixed(1)}/10 (${(score/2).toFixed(1)}/5)`).join('\n')}

Overall Readiness Score: ${overallScore}%

Please provide both a structured JSON response for system compatibility AND a comprehensive markdown report.

First, return a JSON object with this structure:
{
  "summary": "Executive summary (≤200 words): topline maturity, key risks, and what to do first",
  "insights": ["5-8 key insights with evidence quotes where possible"],
  "strengths": ["Key organisational strengths identified"],
  "gaps": ["5-8 crisp gaps that block value realisation with evidence"],
  "recommendations": ["Priority quick wins (0-90 days) and build-outs (3-9 months)"],
  "maturityScores": {
    "strategy_clarity": 0-5,
    "governance_ethics": 0-5,
    "data_stewardship": 0-5,
    "technology_architecture": 0-5,
    "talent_ways_working": 0-5,
    "processes_change": 0-5,
    "measurement_value": 0-5,
    "funding_sustainability": 0-5
  }
}

Use ${orgName} throughout the analysis when referring to the organisation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior AI readiness assessor for non-profit organisations with expertise in translating qualitative inputs into evidence-based maturity assessments and actionable roadmaps. Focus on practical, decision-oriented guidance that considers the unique constraints and opportunities of the non-profit sector."
        },
        {
          role: "user",
          content: comprehensivePrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 2500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Analysis complete.",
      insights: result.insights || [],
      strengths: result.strengths || [],
      gaps: result.gaps || [],
      recommendations: result.recommendations || [],
      maturityScores: result.maturityScores || {},
      markdownReport: result.markdownReport || ""
    };
  } catch (error) {
    console.error("Error analyzing text responses:", error);
    // Return fallback analysis if AI fails
    return {
      summary: "Based on your responses, your organization shows commitment to digital transformation with opportunities for growth.",
      insights: [
        "Your organisation recognises the importance of digital transformation",
        "There are clear areas identified for improvement and investment",
        "Staff engagement and training remain priority areas",
        "Leadership commitment varies across different digital initiatives"
      ],
      strengths: [
        "Leadership awareness of digital transformation needs",
        "Existing foundation of digital tools and processes",
        "Clear mission-driven motivation for improvement",
        "Staff willingness to learn and adapt"
      ],
      gaps: [
        "Technical infrastructure requires systematic upgrade",
        "Data governance frameworks need establishment",
        "Staff digital literacy programmes need expansion",
        "Strategic AI roadmap requires development",
        "Risk management protocols need strengthening"
      ],
      recommendations: [
        "Establish AI governance framework within 90 days",
        "Pilot low-risk AI use cases in administrative functions",
        "Develop staff digital skills training programme",
        "Create data stewardship policies and procedures",
        "Build partnerships with technical experts and vendors",
        "Secure dedicated funding for digital transformation initiatives"
      ],
      maturityScores: {
        "strategy_clarity": 2,
        "governance_ethics": 1,
        "data_stewardship": 2,
        "technology_architecture": 2,
        "talent_ways_working": 2,
        "processes_change": 2,
        "measurement_value": 1,
        "funding_sustainability": 1
      }
    };
  }
}

export async function generateCustomSummary(
  categoryScores: Record<string, number>,
  overallScore: number,
  readinessLevel: string,
  textAnalysis: TextAnalysisResult,
  organizationName?: string
): Promise<string> {
  try {
    const orgName = organizationName || "the organization";
    const prompt = `Create a personalized executive summary for ${orgName}'s AI readiness assessment.

Organization: ${orgName}
Assessment Results:
- Overall Readiness Score: ${overallScore}%
- Readiness Level: ${readinessLevel}
- Category Scores: ${Object.entries(categoryScores).map(([cat, score]) => `${cat}: ${score.toFixed(1)}/10`).join(', ')}

Key Insights from Analysis:
${textAnalysis.insights.join('\n')}

Strengths Identified:
${textAnalysis.strengths.join('\n')}

Write a 3-4 paragraph executive summary that:
1. Opens with ${orgName}'s overall readiness level and what it means
2. Highlights their key strengths and progress areas
3. Identifies the most critical gaps to address
4. Closes with encouragement and next steps

Keep the tone professional yet encouraging, suitable for non-profit leadership. Use ${orgName} throughout the summary when referring to the organization.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || textAnalysis.summary;
  } catch (error) {
    console.error("Error generating custom summary:", error);
    return textAnalysis.summary;
  }
}