# ModeM - Study Companion App 🎓

ModeM is a comprehensive, premium study companion application designed to help students master their productivity. It seamlessly combines task management, smart reminders, and focus tools into a beautiful, gamified experience.

![ModeM Banner](frontend/public/banner-placeholder.png)

## 🚀 Key Features

### ✨ **New! Premium Experience**
-   **Stunning Landing Page**: A visually immersive welcome page with animated backgrounds and glassmorphism design.
-   **One-Click Startup**: Launch the entire ecosystem (Frontend, Backend, WhatsApp Service) with a single script (`start-all.bat`).

### 📱 **WhatsApp Integration (New!)**
-   **Smart Reminders**: Get instant WhatsApp notifications for upcoming exams and deadlines.
-   **Profile Management**: Link and update your WhatsApp number directly from your profile settings.
-   **Automated Alerts**: Never miss a study session with direct mobile alerts.

### ⏱️ **Advanced Focus Timer**
-   **Floating Timer**: A persistent, draggable timer that stays with you as you navigate the app.
-   **Custom Modes**: Pomodoro, Short Break, Long Break, or Custom durations.
-   **Audio Feedback**: Satisfying completion sounds and notifications.
-   **Session Tracking**: Automatically logs study time to your daily progress.

### ✅ **Task & Subject Management**
-   **Organize**: Create tasks, set priorities (High, Medium, Low), and assign due dates.
-   **Course Hub**: Centralized view for all your subjects, notes, and exams.
-   **Visual Filters**: Easily sort and filter tasks to focus on what matters.

### 📊 **Analytics & Gamification**
-   **Real-time Dashboard**: View streaks, focus hours, and task completion rates instantly.
-   **Badges System**: Earn unique badges ("Night Owl", "Focus Master") as you hit milestones.
-   **Progress Charts**: Beautiful interactive charts to visualize your productivity trends.

---

## 🛠️ Tech Stack

### **Frontend**
-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: CSS Modules with a custom Premium Design System (Variables, Glassmorphism, Animations)
-   **State Management**: React Context (`TimerContext`, `AuthContext`)
-   **UI Components**: Lucide React Icons, React Hot Toast, Recharts

### **Backend**
-   **Framework**: [NestJS](https://nestjs.com/)
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Authentication**: JWT (JSON Web Tokens) & Passport

### **Microservices**
-   **WhatsApp Service**: Node.js + [whatsapp-web.js](https://wwebjs.dev/) for real-time messaging.

---

## 🏃‍♂️ Getting Started

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL installed and running
-   A smartphone with WhatsApp (for syncing)

### 🚀 Quick Start (Windows)
We've made it incredibly easy to start!

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SChandrajith/ModeM.git
    cd ModeM
    ```

2.  **Environment Setup**
    *   Create `.env` in `/backend` (see `/backend/.env.example`)
    *   Create `.env.local` in `/frontend` (see `/frontend/.env.local.example`)

3.  **One-Click Launch**
    Double-click the **`start-all.bat`** file in the root directory.
    
    *This will automatically open 3 terminal windows for the Backend, Frontend, and WhatsApp Service.*

### 📦 Manual Installation (Optional)

If you prefer to run services individually:

**1. Backend**
```bash
cd backend
npm install
npx prisma db push
npm run start:dev
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. WhatsApp Service**
```bash
cd whatsapp-service
npm install
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

