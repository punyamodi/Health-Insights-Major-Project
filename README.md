# Health Insights - AI-Powered Medical Diagnostic System

<div align="center">

**A Multidisciplinary AI Swarm for Advanced Medical Diagnosis**

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285f4?logo=google)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Components Guide](#components-guide)
- [Development](#development)
- [Build & Deployment](#build--deployment)

---

## Overview

**Health Insights** is an advanced medical diagnostic system that leverages Google's Gemini 2.0 Flash AI model to provide multidisciplinary medical analysis. The application uses a swarm of 11 specialized AI agents (each representing a different medical specialty) to analyze patient medical reports and histories, generating comprehensive diagnostic insights through consensus.

### Key Capabilities

- 🏥 **Multi-Specialist Analysis**: 11 specialized AI agents provide independent analysis
- 📄 **Medical Report Processing**: Accept text reports and medical images
- 📋 **Patient History Integration**: Comprehensive patient medical background tracking
- 🤖 **AI Consensus Synthesis**: Final integrated diagnosis from lead AI physician
- 💬 **Interactive Chat Interface**: Ask clarifying questions about the diagnosis
- 📊 **Export to PDF**: Download comprehensive diagnostic reports
- ⚡ **Real-time Streaming**: Live analysis updates as agents complete their work

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (React)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Landing Page │  │ Report Input │  │  Analysis View   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│              GEMINI SERVICE LAYER (TypeScript)                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ • analyzeWithSpecialistAgent()                         │  │
│  │ • generateFinalDiagnosis()                             │  │
│  │ • getChatSession()                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬────────────────────────────────┘
                               │
┌──────────────────────────────▼────────────────────────────────┐
│            GOOGLE GEMINI 2.0 FLASH API                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Model: gemini-2.0-flash                                 │ │
│  │ Endpoints:                                              │ │
│  │  • generateContent (specialist analysis)                │ │
│  │  • chats.create (interactive chat)                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Specialist Agents

The system deploys 11 specialized medical AI agents:

| Specialty | Focus Area |
|-----------|-----------|
| 🫀 Cardiologist | Heart and blood vessel conditions |
| 🫁 Pulmonologist | Respiratory system |
| 🧠 Neurologist | Nervous system disorders |
| 🔬 Gastroenterologist | Digestive system |
| ⚕️ Endocrinologist | Hormones and glands |
| 🛡️ Immunologist | Immune system disorders |
| 🫘 Nephrologist | Kidney health |
| 🩸 Hematologist | Blood and blood-forming organs |
| 🎯 Oncologist | Cancer and tumors |
| 🖼️ Radiologist | Medical image interpretation |
| 🧬 Psychologist | Mental and emotional health |

---

## Features

### 1. **Medical Report Input**
- Upload medical reports as `.txt` files
- Paste report text directly
- Support for medical images (up to 5MB)
- Structured patient history form

### 2. **Specialist Analysis**
- Parallel analysis from 11 medical specialists
- JSON-structured responses for each specialist
- Real-time status tracking (Pending → Loading → Complete)
- Error handling and fallback messages

### 3. **Final Diagnosis Synthesis**
- Lead AI physician synthesizes all specialist reports
- Markdown-formatted comprehensive diagnosis
- Integration of patient history and original report
- Priority-ranked health issues with supporting evidence

### 4. **Interactive Chat**
- Ask follow-up questions about the diagnosis
- Context-aware responses based on case data
- System instruction guidance for medical accuracy
- Real-time streaming responses

### 5. **PDF Export**
- Download complete diagnostic case as PDF
- Print-optimized formatting
- Case ID and timestamp tracking
- Professional medical document layout

### 6. **Responsive UI**
- Mobile-first design
- Tailwind CSS styling
- Smooth animations and transitions
- Accessibility-focused components

---

## Prerequisites

Before getting started, ensure you have:

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **Google Gemini API Key** (obtained from [Google AI Studio](https://aistudio.google.com))
- A modern web browser (Chrome, Firefox, Safari, Edge)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Major-Project
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- `react` - UI framework
- `@google/genai` - Google Gemini SDK
- `react-dom` - React DOM rendering
- `marked` - Markdown parser for report formatting
- Dev dependencies: TypeScript, Vite, ESLint, etc.

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important Notes:**
- Never commit `.env.local` to version control
- The API key is loaded by Vite through `vite.config.ts`
- The configuration maps `GEMINI_API_KEY` to `process.env.API_KEY`

### Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key in your Google Cloud project
4. Copy the key and paste it in `.env.local`

---

## Project Structure

```
Major-Project/
├── public/
│   └── index.html              # Main HTML entry point
├── src/
│   ├── components/             # React components
│   │   ├── AgentCard.tsx       # Specialist agent display card
│   │   ├── ChatBot.tsx         # Interactive chat interface
│   │   ├── FinalReport.tsx     # Synthesized diagnosis display
│   │   ├── LandingPage.tsx     # Welcome/hero page
│   │   ├── ReportInput.tsx     # Medical data input form
│   │   └── icons.tsx           # SVG icon components
│   ├── services/
│   │   └── geminiService.ts    # Gemini API integration
│   ├── App.tsx                 # Main application component
│   ├── constants.tsx           # Specialist agents configuration
│   ├── types.ts                # TypeScript type definitions
│   ├── index.tsx               # React DOM root
│   └── index.html              # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

### Key Files Explained

#### `types.ts`
Defines TypeScript interfaces and enums:
- `MedicalSpecialty` enum - 11 specialist types
- `SpecialistAnalysis` - Analysis response structure
- `PatientHistory` - Patient medical background
- `SpecialistReport` - Report with status tracking
- `FinalReport` - Synthesis result

#### `constants.tsx`
Configuration of specialist agents with names and descriptions

#### `services/geminiService.ts` (180 lines)
Core service handling all Gemini API interactions:
- `analyzeWithSpecialistAgent()` - Individual specialist analysis with image support
- `generateFinalDiagnosis()` - Consensus diagnosis generation
- `getChatSession()` - Interactive chat creation with system instruction
- Prompt templates for each analysis type
- JSON parsing and error handling

**Key Functions:**
```typescript
// Analyzes medical report from a specialist perspective
analyzeWithSpecialistAgent(
  specialty: MedicalSpecialty,
  report: string,
  history: PatientHistory,
  image?: { base64: string; mimeType: string }
): Promise<SpecialistAnalysis | string>

// Synthesizes specialist reports into final diagnosis
generateFinalDiagnosis(
  specialistReports: Record<string, SpecialistAnalysis>,
  originalReport: string,
  history: PatientHistory
): Promise<string>

// Creates interactive chat session
getChatSession(context: string): Chat
```

#### `App.tsx` (526 lines)
Main application component managing:
- State for reports, analyses, and patient data
- View switching (landing → main analysis)
- Tab navigation (specialists → consensus → records)
- Specialist analysis orchestration
- PDF export functionality
- Chat interface state
- Case ID generation

**Core State:**
```typescript
- view: 'landing' | 'main'
- activeTab: 'consensus' | 'specialists' | 'records'
- reportText: string
- patientHistory: PatientHistory
- image: base64 image data
- specialistReports: Record<MedicalSpecialty, SpecialistReport>
- finalReport: FinalReport
- caseId: auto-generated 6-digit ID
```

---

## Usage

### 1. Launch the Application

```bash
npm run dev
```

The application opens at `http://localhost:3000`

### 2. Landing Page
- Review system capabilities and specialist information
- Click "Start Diagnostic Case" to begin analysis

### 3. Input Medical Data

**In the Report Input form:**
1. **Medical Report**: Paste text or upload `.txt` file
2. **Upload Medical Image** (optional): Support for PNG, JPG, etc. (up to 5MB)
3. **Patient History** (optional but recommended):
   - Past Diagnoses
   - Chronic Conditions
   - Allergies
   - Current Medications
   - Family History
   - Lifestyle Factors

### 4. Submit and View Analysis

- Click "Analyze Report"
- Watch specialist agents work in real-time (Specialists tab)
- Each agent's card updates from Pending → Loading → Complete
- View detailed findings for each specialty

### 5. Review Consensus Report

- Automatically switches to Consensus tab when synthesis completes
- Read the integrated final diagnosis
- Review recommendations and prioritized health issues

### 6. Interactive Q&A

- Click the chat bubble (bottom-right)
- Ask follow-up questions about the diagnosis
- Context-aware responses from AI assistant

### 7. Export Report

- Click "Export as PDF" button
- Download contains full case data and analysis
- Print-friendly formatting

### 8. Start New Case

- Click "New Case" to reset and analyze another report

---

## API Integration

### Gemini Service Integration

The application communicates with Google Gemini via the `@google/genai` SDK.

#### Authentication Flow
```typescript
// From services/geminiService.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

The API key is injected by Vite at build time from environment variables.

#### Specialist Analysis Request
```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: { parts: parts },
  config: {
    responseMimeType: "application/json",
  },
});
```

**Response Format (JSON):**
```json
{
  "summary": "2-3 sentence overview",
  "keyFindings": ["finding 1", "finding 2"],
  "potentialConditions": ["condition 1", "condition 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}
```

#### Final Diagnosis Generation
Combines all specialist reports using `gemini-2.0-flash` in default mode.

#### Chat Session
Uses `ai.chats.create()` with system instruction providing context for medical Q&A.

---

## Components Guide

### AgentCard.tsx (143 lines)
Displays individual specialist analysis with:
- Status indicator (pending/loading/complete/error)
- Specialty icon with color coding
- Expandable analysis details
- Color-coded findings, conditions, and recommendations
- Summary section with key findings list

**Props:**
```typescript
interface AgentCardProps {
  agent: Agent;
  report: SpecialistReport;
}
```

### ChatBot.tsx (168 lines)
Interactive chat interface featuring:
- Message history with role distinction
- Streaming responses from Gemini
- Loading state indicators
- Floating action button (collapsed/expanded states)
- Auto-scroll to latest messages
- Context-aware system instructions

**Props:**
```typescript
interface ChatBotProps {
  context: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
```

### FinalReport.tsx (101 lines)
Comprehensive diagnosis display:
- Markdown rendering of synthesis
- Professional medical document formatting
- Loading state with animated spinner
- Error handling and display
- Report header with status badge
- Date and report type metadata

**Props:**
```typescript
interface FinalReportProps {
  report: FinalReport;
}
```

### LandingPage.tsx (365 lines)
Welcome page with:
- Animated hero section with gradient text
- Feature highlights with icons
- Specialist showcase grid (11 agents)
- How-it-works architecture explanation
- Smooth scroll navigation
- Responsive navigation bar
- Call-to-action buttons

**Props:**
```typescript
interface LandingPageProps {
  onStart: () => void;
}
```

### ReportInput.tsx (212 lines)
Medical data input form:
- Textarea for direct medical report entry
- File upload (text/image support)
- 6-field patient history form
- Input validation
- Image preview with size checking (5MB limit)
- Error messages and feedback

**Props:**
```typescript
interface ReportInputProps {
  onSubmit: (reportText: string, history: PatientHistory, image: {...} | null) => void;
  isLoading: boolean;
}
```

### icons.tsx
SVG icon components including:
- Specialty icons for each medical field
- Logo icon
- Navigation icons (chevron up/down)
- Status indicators

---

## Development

### Running in Development Mode

```bash
npm run dev
```

Starts Vite dev server with:
- Hot module replacement (HMR)
- TypeScript checking
- Source maps for debugging
- Localhost access at `http://0.0.0.0:3000`
- Port 3000

### Building for Production

```bash
npm run build
```

Generates optimized production build in `dist/` directory with:
- Code minification
- Tree shaking
- Asset optimization
- Source map generation

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

### Development Tools

- **TypeScript**: Full type safety and IDE autocomplete
- **Vite**: Lightning-fast build tool with HMR
- **React DevTools**: Browser extension for React debugging
- **Network Tab**: Monitor API calls to Gemini
- **Console**: View error logs and diagnostics

---

## Build & Deployment

### Build Configuration

The `vite.config.ts` specifies:
- React plugin for JSX support
- Port 3000 for local development
- Path alias `@` for imports
- Environment variable injection (GEMINI_API_KEY → process.env.API_KEY)
- Host 0.0.0.0 for network access

### Production Optimization

- Automatic code splitting
- Image optimization
- CSS minification
- JavaScript compression
- Dead code elimination

### Deployment Options

#### 1. **Vercel** (recommended)
```bash
npm install -g vercel
vercel
```
- Automatic deployment from Git
- Environment variable configuration in dashboard
- Zero-config HTTPS
- Custom domain support

#### 2. **Netlify**
```bash
npm run build
# Configure in Netlify dashboard:
# Build command: npm run build
# Publish directory: dist
# Add GEMINI_API_KEY in environment variables
```

#### 3. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV GEMINI_API_KEY=your_key_here
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### 4. **Traditional Server**
```bash
npm run build
# Upload dist/ contents to web server
# Configure web server for SPA routing (redirect to index.html)
```

---

## Technical Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Frontend Framework** | React | 19.2.0 |
| **Language** | TypeScript | 5.8.2 |
| **Build Tool** | Vite | 6.2.0 |
| **Styling** | Tailwind CSS | (via CDN) |
| **AI API** | Google Gemini 2.0 Flash | Latest |
| **Markdown Parser** | Marked | 16.4.1 |
| **DOM Library** | React DOM | 19.2.0 |
| **Package Manager** | npm | 9+ |

---

## Troubleshooting

### API Key Issues
- **Error: "API_KEY environment variable not set"**
  - Ensure `.env.local` exists with `GEMINI_API_KEY=...`
  - Restart dev server after adding/modifying `.env.local`
  - Check for typos in key value
  - Verify key is active in Google Cloud console

### Analysis Errors
- **Specialist agent returns error string**
  - Check Gemini API quota and rate limits
  - Verify API key has access to `gemini-2.0-flash` model
  - Review error message in browser console
  - Check network tab for API response details

### Image Upload Issues
- **"File is too large" error**
  - Maximum file size is 5MB
  - Compress image before uploading
  - Supported formats: PNG, JPG, WebP, GIF

### Chat Not Responding
- **Chat appears frozen or not responding**
  - Check network connection
  - Verify API key validity
  - Clear browser cache and reload
  - Check browser console for error messages
  - Verify chat context is properly passed

### Build Issues
- **Vite build fails**
  - Clear `node_modules` and run `npm install` again
  - Check for TypeScript errors: `npm run build`
  - Verify all imports are correct

---

## Performance Tips

1. **API Rate Limiting**: Gemini API has rate limits. Consider caching responses.
2. **Image Optimization**: Compress medical images before upload for faster processing.
3. **Chat Context**: Very large case data may slow chat responses. Keep summaries concise.
4. **Browser Caching**: Modern browsers cache assets; use browser DevTools to verify.

---

## Security Considerations

- **API Key**: Never commit `.env.local` to version control
- **HTTPS**: Always use HTTPS in production
- **Medical Data**: Handle patient data according to HIPAA/GDPR requirements
- **Input Validation**: All medical inputs are validated before sending to API
- **Error Messages**: Avoid exposing sensitive system details in error messages

---

## Roadmap

- [ ] Voice input for medical reports
- [ ] Integration with medical record systems (EHR/EMR)
- [ ] Multi-language support
- [ ] Enhanced medical image analysis
- [ ] Detailed audit logging
- [ ] HIPAA compliance features
- [ ] API endpoint for third-party integration
- [ ] Mobile native application
- [ ] Report comparison for follow-up cases
- [ ] Integration with telemedicine platforms

---

## Disclaimer

⚠️ **Medical Disclaimer**: This application is designed for educational and research purposes only. It should NOT be used for actual medical diagnosis or treatment decisions. Always consult qualified healthcare professionals for medical advice, diagnosis, and treatment. The AI-generated analyses are tools to support medical education and understanding, not replacements for professional medical judgment.

---

## License

This project is part of a college major project and is provided as-is for educational purposes.

---

## Support & Contact

For questions, issues, or contributions, please:
- Check existing documentation in this README
- Review component code for implementation details
- Refer to [Google Gemini API Documentation](https://ai.google.dev/)
- Submit issues with detailed reproduction steps
- Include error messages and browser console logs when reporting issues

---

**Last Updated:** November 27, 2025  
**Version:** 1.0.0  
**Model Used:** Google Gemini 2.0 Flash  
**Authors:** Punya Modi
