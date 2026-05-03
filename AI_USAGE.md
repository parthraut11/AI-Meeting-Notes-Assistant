# AI Usage Report

This document outlines how AI assistance was leveraged during the development of the AI Meeting Notes Assistant. It highlights the prompts used, the quality of the AI's output, necessary modifications, and key learnings from the process.

---

## Example 1: Initial Architecture and Mocking

**Prompt:**  
> *"Build a full-stack web application called AI Meeting Notes Assistant. Frontend React, Backend Node.js Express, Storage SQLite. Logic: if audio file, convert speech to text, else use raw notes. Generate summary and action items in JSON."*

**AI Output:**  
The AI successfully scaffolded the entire directory structure, Vite frontend, and Express backend. However, for the AI integration, it initially provided a **mocked** `aiService.js` that used `setTimeout` to simulate latency and returned hardcoded JSON responses.  
**Rating:** Good (for rapid prototyping).

**What I Changed:**  
I later instructed the AI to replace the hardcoded mock functions with actual REST API calls to the Google Gemini service.

**Why:**  
Mocking is excellent for unblocking UI development and verifying that the database schema works. However, the core requirement of the project was a functional AI backend, so the mocks had to be swapped out for real production logic once the foundation was solid.

**What I Learned:**  
Building the application in phases—scaffolding and mocking first, then integrating real 3rd-party APIs—prevents getting stuck on API rate limits or authentication errors early in the development cycle.

---

## Example 2: API Integration and Error Propagation

**Prompt:**  
> *"Use gemini API and get the key from .env... the API key is [KEY]."* followed by *"I am getting this site cant be reached / internal server error"*

**AI Output:**  
The AI wrote the `fetch` logic to call `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`.  
**Rating:** Bad (Contextually). 

**What I Changed:**  
The `gemini-1.5-flash` model endpoint threw a 404/429 error. The AI's initial backend code caught the error but blindly returned a generic `500 Internal Server Error` to the frontend. I had the AI rewrite the `catch` block to explicitly parse the `error.message` from Google's JSON response and pass that specific message (e.g., "Quota Exhausted" or "Model not found") to the frontend UI. I also updated the model string to `gemini-2.0-flash`.

**Why:**  
Silent failures or generic 500 errors in backend API integrations make debugging impossible. The frontend UI must be able to display exactly *why* a 3rd-party service failed.

**What I Learned:**  
Always parse the error object from external API responses. Furthermore, I learned that LLM model names iterate rapidly (`1.5` vs `2.0` vs `2.5`), and hardcoding them requires maintaining awareness of deprecation schedules to avoid 404 errors.

---

## Example 3: Multimodal Audio Transcription

**Prompt:**  
> *"The audio part is giving the same output"* (Referring to the fact that the audio was still being mocked).

**AI Output:**  
The AI rewrote the `transcribeAudio` function. Instead of pulling in a heavy, local speech-to-text library like OpenAI Whisper (which requires local Python/FFmpeg binaries), it leveraged Gemini's native multimodal capabilities. It read the uploaded `.mp3` file, converted it to a `base64` string, and sent it as `inline_data` alongside the prompt.  
**Rating:** Very Good.

**What I Changed:**  
I asked the AI to bump the model version from `2.0-flash` to the newly released `gemini-2.5-flash` to ensure the highest quality multimodal transcription.

**Why:**  
Deploying local machine learning binaries in a standard Node.js Express server is historically complex and resource-intensive. Using a multimodal cloud API drastically simplifies the architecture.

**What I Learned:**  
Modern LLMs are truly natively multimodal. You no longer need a dedicated, separate Speech-to-Text API pipeline (like Google Speech API or Whisper); you can simply pass raw audio encoded as base64 directly into the standard text-generation endpoint and ask the LLM to transcribe it.
