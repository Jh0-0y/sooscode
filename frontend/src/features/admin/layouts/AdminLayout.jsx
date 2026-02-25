import {useEffect, useState} from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import AdminSidebar from './sidebar/AdminSidebar';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
            navigate('/admin/users', { replace: true });
        }
    }, [location.pathname, navigate]);

  // 현재 활성 메뉴 파악
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/classes')) return 'classes';
    return 'users';
  };

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuId) => {
    switch (menuId) {
      case 'users':
        navigate('/admin/users');
        break;
      case 'classes':
        navigate('/admin/classes');
        break;
      default:
        navigate('/admin/users');
    }
  };

  return (
    <div className={styles.adminPage}>
      <AdminSidebar
        activeMenu={getActiveMenu()}
        onMenuChange={handleMenuChange}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <main className={`${styles.mainContent} ${collapsed ? styles.collapsed : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
