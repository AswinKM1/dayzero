import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userGoals, energyLevel, currentDay, availableTime } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Format goals for prompt
        const goalsList = userGoals && userGoals.length > 0
            ? userGoals.map(g => `- [${g.priority} PRIORITY] ${g.title} (${g.category})`).join('\n')
            : "- No specific goals defined.";

        const systemInstruction = `You are an elite productivity coach for the "DayZero" app. 
    Your goal is to generate a structured daily schedule in JSON format.
    
    CONTEXT:
    - Active Missions (Use these to generate tasks):\n${goalsList}
    - User Energy Level: "${energyLevel}" (Low=Recovery, High=Boss Mode)
    - Available Time: ${availableTime} hours available today.
    - Current Day: ${currentDay}

    RULES:
    1. BALANCE: Create tasks that advance the High Priority missions first.
    2. TIMEBOXING: Ensuring the total duration of work tasks does not exceed ${availableTime} hours.
    3. ADAPTABILITY: 
       - If Energy is Low: Focus on easy wins, research, and recovery.
       - If Energy is High: Schedule "Boss Fights" (hard tasks) and deep work blocks.
    4. VARIETY: Mix "Deep Work" with "Quick Wins".
    
    Output strictly valid JSON. No markdown fencing.
    
    JSON Structure:
    {
      "theme": "String (e.g., 'Operation Deep Dive', 'Tactical Rest')",
      "tasks": [
        { "time": "09:00", "task": "Actionable task name", "type": "work" | "break" | "boss_fight", "related_goal_name": "Name of the mission this serves (or 'General')" },
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
