# Research Website

A simple research survey web app that simulates a study involving a brief chatbot interaction and two short surveys. Built using **Next.js** for the frontend, **FastAPI** (or equivalent) for the backend, **PostgreSQL** for persistent storage, and a small Llama model via **LM Studio** for local LLM simulation.

## 🌐 Webpages & Functionality

### **Collapsible Sidebar Navigation**
- Starts collapsed by default
- Available on both desktop and mobile
- Navigation is only enabled for pages the user has already completed, allowing them to revisit previous answers

### **Landing Page**
- Introduces the research project with placeholder explanatory text
- Outlines the process for participation
- Provides a clear call-to-action to begin the study

### **Initial Survey**
- Prompts the user with: “What is your favorite source of news?”
- Offers options: CNN, FOX, Twitter, TikTok, or Other (with a text input)
- Stores the response in the PostgreSQL database (formerly stored in localStorage)

### **Chat Interface**
- Engages the user in a brief simulated conversation with a local LLM
- Incorporates the user’s news source into the dialogue
- Automatically initiates conversation and continues for 3–5 turns
- Stores all user messages and LLM responses in the database
- Advances automatically to the next section after the final turn

### **Follow-Up Survey**
- Collects a satisfaction rating and user feedback
- Simple form interface with radio buttons and a text area
- Feedback is stored in the database

### **Thank You Page**
- Displays a final message of appreciation
- Includes placeholder text for optional closing remarks

## 🛠 Scripts and Usage

### `start-all.ps1`
Starts the project in a local development mode:
- Launches the **LM Studio/Ollama** model (e.g., `ollama run qwen:0.5b`)
- Starts the **FastAPI** backend using `uvicorn`
- Saves process IDs to `.pids` for process tracking and cleanup

### `start-all-host.ps1`
Hosts the app publicly via **ngrok**, allowing access from other devices or remote users:
- Also starts the LM model and backend
- Makes the frontend accessible via an externally visible URL
- Ideal for demos and testing with external users

### `runsql.ps1`
Initializes or resets the PostgreSQL database schema using predefined SQL scripts and the `psql` CLI.

## 🚀 Getting Started

1. **Install Prerequisites**
   - Node.js
   - Python 3.11+
   - PostgreSQL
   - LM Studio or Ollama (`ollama run qwen:0.5b`)
   - Python dependencies via `pip install -r requirements.txt`

2. **Set Up the Database**
   - Ensure PostgreSQL is running
   - Run `runsql.ps1` to set up required tables

3. **Launch the App**
   - Use `start-all.ps1` for local development
   - Use `start-all-host.ps1` to make the app publicly accessible via ngrok
   - Run `npm run dev` in the frontend directory to start the UI

4. **Access the App**
   - Local: Visit `http://localhost:3000`
   - Hosted: Use the ngrok URL printed in the terminal

## 📅 Last Updated
April 16, 2025
