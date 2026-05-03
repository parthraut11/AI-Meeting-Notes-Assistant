const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./database');
const { transcribeAudio, summarizeNotes } = require('./aiService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for audio file uploads
// Files are saved to a 'uploads/' directory temporarily
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        // Ensure directory exists in production, but multer creates it usually if told so. 
        // Here we just use os tmpdir to be safe or create an uploads folder.
        // Actually, let's use the local 'uploads/' folder. We will create it on start.
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// POST /summarize endpoint
app.post('/summarize', upload.single('audio'), async (req, res) => {
    try {
        const { title, participants, raw_notes } = req.body;
        let textToProcess = raw_notes || "";
        let audioTranscription = null;

        // If an audio file was uploaded, process it
        if (req.file) {
            audioTranscription = await transcribeAudio(req.file.path);
            textToProcess += "\n" + audioTranscription;
        }

        if (!textToProcess || textToProcess.trim() === "") {
            return res.status(400).json({ error: "No input provided for summarization." });
        }

        // Get AI summary and action items
        const { summary, actionItems } = await summarizeNotes(textToProcess, participants);

        // Store in database
        const actionItemsJson = JSON.stringify(actionItems);
        
        db.run(
            `INSERT INTO meetings (title, participants, raw_notes, audio_transcription, summary, action_items) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, participants, raw_notes, audioTranscription, summary, actionItemsJson],
            function (err) {
                if (err) {
                    console.error("Database error:", err.message);
                    return res.status(500).json({ error: "Failed to save to database." });
                }

                // Return successful response
                res.status(200).json({
                    id: this.lastID,
                    title,
                    summary,
                    actionItems
                });
            }
        );

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: error.message || "Internal server error." });
    }
});

// GET /history endpoint
app.get('/history', (req, res) => {
    db.all(`SELECT * FROM meetings ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Failed to fetch history." });
        }
        
        // Parse the JSON string back into objects for the frontend
        const history = rows.map(row => ({
            ...row,
            action_items: JSON.parse(row.action_items)
        }));

        res.status(200).json(history);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
