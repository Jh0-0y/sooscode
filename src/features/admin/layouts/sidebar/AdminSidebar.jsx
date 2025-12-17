import styles from './AdminSidebar.module.css';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield
} from 'lucide-react';
import useLogout from "@/features/auth/hooks/useLogout.js";

const AdminSidebar = ({ activeMenu, onMenuChange, collapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: 'users', label: '사용자 관리', icon: Users },
    { id: 'classes', label: '클래스 관리', icon: GraduationCap },
  ];
  const { logout } = useLogout();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
          <div className="logo" />
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${styles.menuItem} ${activeMenu === item.id ? styles.active : ''}`}
              onClick={() => onMenuChange(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={styles.menuIcon} />
              {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.logoutBtn} title={collapsed ? '로그아웃' : undefined}
        onClick={logout}>
          <LogOut className={styles.menuIcon} />
          {!collapsed && <span>로그아웃</span>}
        </button>

        <button className={styles.collapseBtn} onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
