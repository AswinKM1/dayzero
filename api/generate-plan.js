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
        // DIAGNOSTIC MODE: List all available models for this API Key
        // We use direct fetch to bypass SDK versioning issues
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`ListModels Failed: ${response.status} - ${error}`);
        }

        const data = await response.json();

        // Return the list of models to the user so we can pick a valid one
        return res.status(200).json({
            message: "DIAGNOSTIC SUCCESS: Models Found",
            models: data.models || []
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({
            error: error.message || "Unknown Error",
            details: error.toString()
        });
    }
}
