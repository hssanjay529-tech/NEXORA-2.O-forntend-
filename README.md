# NEXORA — Frontend Portal

Modern, responsive web frontend for the **NEXORA College Management System**, built with React 19, TypeScript, Tailwind CSS, and Vite.

## 🚀 Features
- **Student Dashboard**: Attendance tracking, GPA/grades, timetables, fee receipts, course registration.
- **Faculty & Admin Portals**: Mark grading, schedule updates, workflow approvals.
- **Modern UI/UX**: Glassmorphism aesthetic, responsive navigation, dark/light themes, and animated widgets.

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: [Vercel](https://vercel.com/)

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your running FastAPI backend (e.g. `http://localhost:8000` or your deployed backend URL).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel
1. Push this repository to GitHub (`https://github.com/hssanjay529-tech/NEXORA-2.O-forntend-.git`).
2. Log into [Vercel](https://vercel.com).
3. Click **"Add New..."** -> **"Project"** and select the `NEXORA-2.O-forntend-` repository.
4. Set Framework Preset: **Vite** (detected automatically).
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (Render / Railway).
6. Click **Deploy**.
