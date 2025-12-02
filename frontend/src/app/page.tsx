import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="animate-fade-in">Welcome back, User! 👋</h1>
        <p className={styles.subtitle}>Here's what's happening with your studies today.</p>
      </header>

      <div className={styles.grid}>
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3>Tasks Due Soon</h3>
          <div className={styles.stat}>
            <span className={styles.number}>5</span>
            <span className={styles.label}>Tasks</span>
          </div>
        </div>
        
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3>Study Time</h3>
          <div className={styles.stat}>
            <span className={styles.number}>2.5</span>
            <span className={styles.label}>Hours</span>
          </div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3>Active Subjects</h3>
          <div className={styles.stat}>
            <span className={styles.number}>3</span>
            <span className={styles.label}>Subjects</span>
          </div>
        </div>
      </div>
    </div>
  );
}
