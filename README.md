# 🎓 CampusConnect (Campus-Qonnect)

A modern campus networking platform that connects **students, teachers, mentors, and alumni**.  
Built with **FastAPI + React (Next.js) + MongoDB**, it enables students to interact, form clubs, ask mentors, and stay updated with campus life.

---

## 🚀 Tech Stack
**Frontend:** React (Vite + TailwindCSS)  
**Backend:** FastAPI (Python)  
**Database:** MongoDB  
**Auth:** JWT + Google Sign-In  

---

🌐 Features

🧑‍🎓 Student and teacher dashboards
💬 Interactive feed
⚙️ Club joining system
🤝 Alumni connect
🤖 AI mentor suggestions (coming soon!)


🧠 Step-by-Step: Run Your Project on Another Computer
🧩 1. Install the necessary tools

Make sure the new computer has:
Git
Python 3.10+
Node.js (LTS version, e.g., 18+)
npm (comes with Node.js)
To check, run in terminal:
git --version
python --version
node --version
npm --version

Clone your GitHub repository

⚙️ Backend Setup (FastAPI)
Step 4 — Go inside backend folder:
cd backend

Step 5 — Create a virtual environment:
python -m venv venv

Step 6 — Activate it:
Windows:

venv\Scripts\activate

Step 7 — Install all packages:
pip install -r requirements.txt

Step 8 — Run the backend server:
uvicorn main:app --reload


✅ Your backend should now run (usually at http://127.0.0.1:8000).


⚛️ Frontend Setup (React/Vite)
Step 9 — In another terminal:
Go to your frontend folder:
cd ../frontend/campusconnect-frontend
Step 10 — Install dependencies:
npm install
Step 11 — Run the frontend:
npm run dev


✅ You’ll see a link like http://localhost:5173/ — open it in the browser.
