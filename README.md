# ModeM - Study Companion App 🎓

ModeM is a comprehensive study companion application designed to help students manage their time, tasks, and subjects effectively. It combines productivity tools with gamification to keep users motivated and focused.

## 🚀 Features

### 1. **Dashboard**
-   **Real-time Overview**: View your total focus time, tasks completed, and current streak at a glance.
-   **Upcoming Events**: See your next 5 reminders or exams.
-   **Today's Tasks**: Quick access to tasks due today.
-   **Quick Actions**: Instantly create tasks or start a focus session.

### 2. **Study Timer** ⏱️
-   **Focus Modes**: Choose between Focus (Pomodoro), Short Break, Long Break, or Custom duration.
-   **Subject Tracking**: Link study sessions to specific subjects to track time distribution.
-   **Visual Progress**: Circular progress indicator with a floating timer that stays with you across the app.
-   **Finish Early**: Option to save sessions even if you stop before the timer ends.

### 3. **Task Management** ✅
-   **Organize**: Create, edit, and delete tasks.
-   **Prioritize**: Set priority levels (High, Medium, Low) and due dates.
-   **Filter**: Sort tasks by subject, priority, or completion status.
-   **Subject Integration**: Link tasks directly to your courses.

### 4. **Subject Management** 📚
-   **Course Hub**: Manage all your subjects in one place.
-   **Exam Tracking**: Set and track upcoming exam dates.
-   **Progress**: View tasks and study time specific to each subject.

### 5. **Notes** 📝
-   **Quick Capture**: Jot down ideas or lecture notes.
-   **Subject Linking**: Organize notes by subject for easy retrieval.
-   **Search**: Quickly find notes by title or content.

### 6. **Reminders** ⏰
-   **Custom Alerts**: Set one-time or recurring reminders for study sessions or deadlines.
-   **Notifications**: Visual alerts to keep you on track.

### 7. **Gamification (Badges)** 🏆
-   **Earn Rewards**: Unlock badges for milestones like "First Steps", "Focus Master", and "Night Owl".
-   **Motivation**: Track your achievements and strive for consistency.

### 8. **Progress Analytics** 📊
-   **Visual Charts**: Weekly activity bar charts and subject distribution pie charts.
-   **Stats**: Detailed breakdown of total study time and task completion rates.

---

## 🛠️ Tech Stack

### **Frontend**
-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: CSS Modules / Global CSS
-   **State Management**: React Context (TimerContext, AuthContext)
-   **Icons**: Lucide React
-   **Charts**: Recharts

### **Backend**
-   **Framework**: [NestJS](https://nestjs.com/)
-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Authentication**: JWT (JSON Web Tokens) with Passport strategy

---

## 🏃‍♂️ Getting Started

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL installed and running

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd ModeM
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    
    # Configure Environment Variables
    # Create a .env file in /backend and add:
    # DATABASE_URL="postgresql://user:password@localhost:5432/modem_db"
    # JWT_SECRET="your-secret-key"
    
    # Run Database Migrations
    npx prisma db push
    
    # Start the Server
    npm run start:dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    
    # Configure Environment Variables
    # Create a .env.local file in /frontend and add:
    # NEXT_PUBLIC_API_URL="http://localhost:3000"
    
    # Start the Development Server
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
