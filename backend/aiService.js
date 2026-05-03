const fs = require('fs');
const path = require('path');

/**
 * This service provides integration with the Gemini API for summarization and audio transcription.
 */

// Real transcription using Gemini API
const transcribeAudio = async (audioFilePath) => {
    console.log(`[Gemini API] Transcribing audio file: ${audioFilePath}`);
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const audioData = await fs.promises.readFile(audioFilePath);
    const base64Audio = audioData.toString('base64');
    
    // Determine mimeType based on extension
    const ext = path.extname(audioFilePath).toLowerCase();
    let mimeType = 'audio/mp3';
    if (ext === '.wav') {
        mimeType = 'audio/wav';
    } else if (ext === '.ogg') {
        mimeType = 'audio/ogg';
    }

    const prompt = "Please transcribe this audio accurately.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Audio
                        }
                    }
                ]
            }]
        })
    });

    if (!response.ok) {
        let errorMsg = "Failed to transcribe audio with Gemini API.";
        try {
            const errorData = await response.json();
            if (errorData.error && errorData.error.message) {
                errorMsg = `Gemini API Audio Error: ${errorData.error.message}`;
            }
        } catch (e) {
            // ignore
        }
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
    }
    
    return "No transcription could be generated.";
};

// Summarization using Gemini API
const summarizeNotes = async (text, participants) => {
    console.log(`[Gemini API] Summarizing text...`);
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const prompt = `You are an AI Meeting Notes Assistant. 
Analyze the following meeting notes and generate a JSON response. 
The participants are: ${participants || 'Unknown'}.

Return ONLY a valid JSON object with two fields:
1. "summary": A concise summary (3-4 lines) of the meeting.
2. "actionItems": An array of objects, where each object has:
   - "task": String description of the task.
   - "owner": String name of the owner (infer from participants, or "Unassigned").
   - "priority": String ("High", "Medium", or "Low").

Meeting Notes:
${text}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        let errorMsg = "Failed to generate summary with Gemini API.";
        try {
            const errorData = await response.json();
            if (errorData.error && errorData.error.message) {
                errorMsg = `Gemini API Error: ${errorData.error.message}`;
            }
        } catch (e) {
            // ignore JSON parse error for fallback
        }
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON block returned by Gemini. Sometimes it includes ```json markdown blocks.
    let parsedResult;
    try {
        const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", responseText);
        throw new Error("Received invalid format from AI.");
    }

    return parsedResult;
};

module.exports = {
    transcribeAudio,
    summarizeNotes
};
