'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  StickyNote, 
  Timer, 
  BarChart2,
  LogOut,
  Key,
  Edit2,
  Bell,
  Award,
  Phone
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { useAuth } from './AuthWrapper';
import ChangeNicknameModal from './modals/ChangeNicknameModal';
import ChangePasswordModal from './modals/ChangePasswordModal';
import ChangeMobileNumberModal from './modals/ChangeMobileNumberModal';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Subjects', href: '/subjects', icon: BookOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Reminders', href: '/reminders', icon: Bell },
    { name: 'Notes', href: '/notes', icon: StickyNote },
    { name: 'Timer', href: '/timer', icon: Timer },
    { name: 'Progress', href: '/progress', icon: BarChart2 },
    { name: 'Badges', href: '/badges', icon: Award },
  ];

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>ModeM</h2>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.icon}>
                  <Icon size={20} />
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer} style={{ position: 'relative' }}>
          <div 
            className={styles.user} 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.avatar}>{user?.nickName?.[0]?.toUpperCase() || 'U'}</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.nickName || 'User'}</p>
             
            </div>
          </div>

          {showUserMenu && (
            <div className={styles.menuDropdown}>
              <button 
                onClick={() => { setShowNicknameModal(true); setShowUserMenu(false); }}
                className={styles.menuItem}
              >
                <Edit2 size={16} />
                <span>Change Nickname</span>
              </button>
              <button 
                onClick={() => { setShowPasswordModal(true); setShowUserMenu(false); }}
                className={styles.menuItem}
              >
                <Key size={16} />
                <span>Change Password</span>
              </button>
              <button 
                onClick={() => { setShowMobileModal(true); setShowUserMenu(false); }}
                className={styles.menuItem}
              >
                <Phone size={16} />
                <span>Change WhatsApp Number</span>
              </button>
              <div style={{ height: '1px', background: 'hsl(var(--border) / 0.5)', margin: '0.5rem 0' }} />
              <button 
                onClick={logout}
                className={`${styles.menuItem} ${styles.danger}`}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <ChangeNicknameModal 
        isOpen={showNicknameModal} 
        onClose={() => setShowNicknameModal(false)} 
      />
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      <ChangeMobileNumberModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        onMobileNumberUpdated={() => {
          // Ideally fetch user or update context
        }}
        currentMobileNumber={user?.mobileNumber}
      />
    </>
  );
}
