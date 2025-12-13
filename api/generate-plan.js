import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userGoal, energyLevel, currentDay } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // DEBUGGING STEP: List available models to find the right name
        /*
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const systemInstruction = ...
        const result = await model.generateContent(systemInstruction);
        */

        // TEMPORARY: Just list models to see what we have access to
        // Note: listModels is invalid on the client instance directly in some versions, 
        // but let's try to just return a simple "Hello" with a safer model if possible,
        // OR try to catch the specific error and return the list if we can.

        // Actually, the most robust fix is to try a model that DEFINITELY exists.
        // gemini-1.0-pro is the legacy name.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const systemInstruction = `You are an elite productivity coach for the "DayZero" app. 
    Your goal is to generate a structured daily schedule in JSON format.
    
    Inputs:
    - User Goal: "${userGoal}"
    - Energy Level: "${energyLevel}" (Low, Medium, High)
    - Current Day: ${currentDay}

    Rules:
    - If Energy is Low: Focus on recovery, light learning, and easy wins.
    - If Energy is High: Schedule "Boss Fights" (hard tasks) and deep work blocks.
    - Output strictly valid JSON. No markdown fencing.
    
    JSON Structure:
    {
      "theme": "String (e.g., 'Deep Dive')",
      "tasks": [
        { "time": "09:00", "task": "String", "type": "work" | "break" | "boss_fight" },
        ...
      ]
    }`;

        const result = await model.generateContent(systemInstruction);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present (Gemini sometimes adds ```json)
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const plan = JSON.parse(cleanedText);

        return res.status(200).json(plan);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({
            error: error.message || "Unknown Error",
            details: error.toString()
        });
    }
}
