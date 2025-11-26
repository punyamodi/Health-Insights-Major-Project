
import { GoogleGenAI, Chat } from "@google/genai";
import { MedicalSpecialty, PatientHistory, SpecialistAnalysis } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('API Key Debug:', {
  hasVITE_GEMINI_API_KEY: !!import.meta.env.VITE_GEMINI_API_KEY,
  apiKeyLength: apiKey?.length,
  apiKeyPrefix: apiKey?.substring(0, 10)
});
if (!apiKey) {
  console.error("API_KEY not found. import.meta.env.VITE_GEMINI_API_KEY is missing.");
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

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
  
  Provide your analysis in a structured JSON format. The JSON object must contain four keys: "summary", "keyFindings", "potentialConditions", and "recommendations".
  
  1. "summary": A concise 2-3 sentence overview of your diagnosis and assessment from your specialist perspective.
  2. "keyFindings": An array of strings detailing specific observations.
  3. "potentialConditions": An array of strings listing diagnoses to consider.
  4. "recommendations": An array of strings listing tests, treatments, or referrals.
  
  Example response format:
  {
    "summary": "Based on the cardiac rhythm anomalies, there is a high likelihood of...",
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
      model: 'gemini-2.0-flash',
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
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Error generating final diagnosis:', error);
    return 'An error occurred while generating the final integrated diagnosis. Please check the console for details.';
  }
};

export const getChatSession = (context: string): Chat => {
  return ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: `You are a highly knowledgeable and empathetic medical AI assistant helping a user understand a complex medical diagnosis.
      
      You have access to the following context:
      ${context}

      **Guidelines:**
      1. Answer the user's questions based strictly on the provided context (Patient Data, Specialist Reports, and Final Diagnosis).
      2. If a user asks about something not in the report, answer based on general medical knowledge but explicitly state that it is not part of the specific case file.
      3. Be clear, concise, and avoid overly technical jargon unless you explain it.
      4. Always maintain a professional and supportive tone.
      5. If the user asks for medical advice that requires immediate intervention, advise them to consult a doctor or emergency services immediately.`
    }
  });
};
