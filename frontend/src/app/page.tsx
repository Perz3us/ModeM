import Link from 'next/link';
import styles from './page.module.css';
import { BookOpen, Bell, Clock, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Abstract Background Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />

      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Master Your Studies<br />With ModeM
        </h1>
        <p className={styles.subtitle}>
          The all-in-one companion for modern students. Track subjects, set smart reminders, 
          manage tasks, and time your focus sessions effortlessly.
        </p>

        <div className={styles.buttonGroup}>
          <Link href="/login" className={styles.primaryBtn}>
            Login to Dashboard
          </Link>
          <Link href="/register" className={styles.secondaryBtn}>
            Create Account
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard} style={{ animationDelay: '0.1s' }}>
            <div className={styles.featureIcon}>
              <BookOpen size={24} />
            </div>
            <h3 className={styles.featureTitle}>Subject Management</h3>
            <p className={styles.featureDesc}>
              Keep all your notes and progress organized by subject in one central hub.
            </p>
          </div>

          <div className={styles.featureCard} style={{ animationDelay: '0.2s' }}>
            <div className={styles.featureIcon}>
              <Bell size={24} />
            </div>
            <h3 className={styles.featureTitle}>Smart Reminders</h3>
            <p className={styles.featureDesc}>
              Get notified about upcoming exams and deadlines via WhatsApp instantly.
            </p>
          </div>

          <div className={styles.featureCard} style={{ animationDelay: '0.3s' }}>
            <div className={styles.featureIcon}>
              <Clock size={24} />
            </div>
            <h3 className={styles.featureTitle}>Focus Timer</h3>
            <p className={styles.featureDesc}>
              Boost productivity with a built-in Pomodoro timer tailored for students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
