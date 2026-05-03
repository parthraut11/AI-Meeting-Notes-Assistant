# AI Meeting Notes Assistant

A full-stack web application designed to automatically summarize meeting notes and extract actionable items using the **Google Gemini API** (`gemini-2.5-flash`). The application supports both raw text input and direct `.mp3`/`.wav` audio file uploads for transcription.

## Features
- **Intelligent Summarization:** Generates concise 3-4 line meeting summaries.
- **Action Item Extraction:** Automatically parses tasks, owners, and priorities (High/Medium/Low).
- **Multimodal Support:** Upload raw notes or actual audio recordings for transcription.
- **History Tracking:** Saves all past meetings into a local SQLite database for easy retrieval.
- **Clean UI:** A minimal, responsive interface built with vanilla CSS.

---

## Architecture & Technology Stack

- **Frontend:** React (scaffolded with Vite) + React Router
- **Backend:** Node.js + Express
- **Database:** SQLite
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`)
- **File Handling:** `multer` for multipart form data

### Why this stack was chosen:
1. **React + Vite:** Chosen for blazing-fast local development and optimized production builds. React's component-based structure makes it easy to encapsulate UI logic (like the Form and Results display).
2. **Node.js + Express:** Perfect for a lightweight backend that handles REST API calls, routes JSON data, and acts as a secure middleware for the Gemini API without exposing sensitive keys to the frontend.
3. **SQLite:** An embedded, zero-configuration SQL database. It's ideal for an MVP to persistently store history locally without requiring external database hosting or complex Docker environments.
4. **Vanilla CSS:** Ensures the UI is lean, performant, and proves core CSS fundamentals without relying on heavy utility frameworks.

---

## Tradeoffs

- **SQLite vs PostgreSQL/MongoDB:** SQLite is great for local prototyping and single-server environments. However, it will not scale horizontally across multiple instances in a cloud environment (e.g., deploying on AWS ECS or Vercel). 
- **Vanilla CSS vs Tailwind/Component Libraries:** Using Vanilla CSS reduces the final bundle size but can increase development time for complex UI components. It's a tradeoff in favor of simplicity, zero dependencies, and granular control.
- **Local File Uploads (Multer) vs Direct-to-Cloud Uploads:** Currently, `multer` temporarily saves audio files to the backend disk before sending them to Gemini. For a high-traffic app, uploading directly to an S3 bucket and processing via signed URLs would be better to prevent backend memory and storage bottlenecks.

---

## What I'd Improve (Future Work)

- **Cloud Storage Integration:** Replace local Multer uploads with AWS S3 / Google Cloud Storage for audio files to support horizontal backend scaling.
- **User Authentication:** Implement JWT-based auth (e.g., Clerk or Auth0) to have isolated, user-specific meeting histories.
- **Database Migration:** Migrate from SQLite to a scalable database like PostgreSQL (using Prisma or Drizzle ORM) when moving to a production environment.
- **Real-Time Streaming:** Add Server-Sent Events (SSE) to stream the AI response chunks to the frontend in real-time, reducing perceived latency for long audio transcriptions.
- **Testing:** Add comprehensive unit and integration tests using Jest and React Testing Library.

---

## How to Run Locally

### 1. Clone & Setup
Clone the repository and install dependencies for both the frontend and backend:
```bash
# Setup Backend
cd backend
npm install

# Setup Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables
In the `backend` folder, create a `.env` file and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Application
Start the backend server:
```bash
cd backend
node --env-file=.env server.js
```
*(The backend runs on `http://localhost:3001`)*

Start the frontend development server:
```bash
cd frontend
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

<img width="1920" height="1080" alt="Screenshot (7)" src="https://github.com/user-attachments/assets/292f2328-9c58-45c3-b97b-92b6ca5a30ac" />
<img width="1920" height="1080" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/ab88da5f-0f07-40fe-a397-7f4a29c558a9" />
<img width="1920" height="1080" alt="Screenshot (8)" src="https://github.com/user-attachments/assets/6ccf0d6d-f63e-4483-85d4-0535dd64bef1" />
<img width="1920" height="1080" alt="Screenshot (11)" src="https://github.com/user-attachments/assets/6a6c36a0-24e2-472e-9700-2a472604cb94" />
<img width="1920" height="1080" alt="Screenshot (12)" src="https://github.com/user-attachments/assets/dd77638f-c03e-40ff-a46d-c57189c12807" />
<img width="1920" height="1080" alt="Screenshot (9)" src="https://github.com/user-attachments/assets/d6644a87-7755-42cc-8072-5cf32ca03d8c" />

