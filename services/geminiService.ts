
import { GoogleGenAI } from "@google/genai";
import { MedicalSpecialty, PatientHistory, SpecialistAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatPatientHistory = (history: PatientHistory): string => {
  if (Object.values(history).every(val => !val.trim())) {
    return "No patient history provided.";
  }
  return `
- **Past Diagnoses:** ${history.pastDiagnoses || 'N/A'}
- **Chronic Conditions:** ${history.chronicConditions || 'N/A'}
- **Allergies:** ${history.allergies || 'N/A'}
- **Current Medications:** ${history.currentMedications || 'N/A'}
- **Family History:** ${history.familyHistory || 'N/A'}
- **Lifestyle Factors:** ${history.lifestyleFactors || 'N/A'}
  `.trim();
};

const getSpecialistPromptTemplate = (specialty: MedicalSpecialty, report: string, history: string): string => `
  You are a world-class ${specialty}. Your task is to analyze the following medical data from your specific field of expertise. Consider all available information, including the current report, attached images (if any), and the patient's history.
  
  Focus ONLY on aspects relevant to ${specialty}.
  
  Provide your analysis in a structured JSON format. The JSON object must contain three keys: "keyFindings", "potentialConditions", and "recommendations". Each key should have an array of strings as its value.
  
  Example response format:
  {
    "keyFindings": ["Finding 1", "Finding 2"],
    "potentialConditions": ["Condition 1", "Condition 2"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  }

  Do not include any other text or markdown formatting outside of the JSON object.

  **Patient History:**
  ---
  ${history}
  ---

  **Medical Report:**
  ---
  ${report}
  ---
`;

const getFinalDiagnosisPromptTemplate = (specialistReports: string, originalReport: string, history: string): string => `
  You are the lead physician of a Multidisciplinary Team (MDT). You have received analyses from various specialists regarding a patient's medical report and history. Your task is to synthesize these reports into a single, integrated final diagnosis.

  **Instructions:**
  1.  **Review the patient's history and the original report.**
  2.  **Review all specialist reports** provided below. Note that they are in JSON format.
  3.  **Synthesize the findings** into a cohesive summary, taking the full patient context into account.
  4.  **Identify and prioritize the top 3 most critical health issues.** For each issue, provide supporting evidence from the specialist reports and patient history.
  5.  **Provide an overall assessment and a coordinated action plan.**
  
  Format your response using markdown.

  **Patient History:**
  ---
  ${history}
  ---

  **Original Medical Report:**
  ---
  ${originalReport}
  ---

  **Specialist Analyses (JSON format):**
  ---
  ${specialistReports}
  ---
`;

export const analyzeWithSpecialistAgent = async (
  specialty: MedicalSpecialty, 
  report: string, 
  history: PatientHistory,
  image?: { base64: string; mimeType: string } | null
): Promise<SpecialistAnalysis | string> => {
  try {
    const formattedHistory = formatPatientHistory(history);
    const prompt = getSpecialistPromptTemplate(specialty, report, formattedHistory);

    const textPart = { text: prompt };
    const parts: any[] = [textPart];

    if (image?.base64 && image?.mimeType) {
      const imagePart = {
        inlineData: {
          data: image.base64,
          mimeType: image.mimeType,
        },
      };
      parts.unshift(imagePart);
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    // Clean the response text to ensure it's valid JSON
    const jsonString = response.text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(jsonString) as SpecialistAnalysis;
    } catch (jsonError) {
      console.error(`Error parsing JSON from ${specialty} agent:`, jsonError);
      console.log("Malformed JSON string:", jsonString);
      return `Failed to parse analysis from ${specialty}. Raw output: ${jsonString}`;
    }

  } catch (error) {
    console.error(`Error with ${specialty} agent:`, error);
    return `An error occurred while getting analysis from the ${specialty} agent. Please check the console for details.`;
  }
};

export const generateFinalDiagnosis = async (
  specialistReports: Record<string, SpecialistAnalysis>, 
  originalReport: string,
  history: PatientHistory
): Promise<string> => {
  try {
    const combinedReports = Object.entries(specialistReports)
      .map(([specialty, analysis]) => `**${specialty} Report:**\n${JSON.stringify(analysis, null, 2)}\n\n`)
      .join('');
    
    const formattedHistory = formatPatientHistory(history);
    const prompt = getFinalDiagnosisPromptTemplate(combinedReports, originalReport, formattedHistory);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating final diagnosis:', error);
    return 'An error occurred while generating the final integrated diagnosis. Please check the console for details.';
  }
};
