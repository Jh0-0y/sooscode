// common/components/classroom/Sidebar.jsx
import styles from './Sidebar.module.css';

const Sidebar = ({ tabs, activeTab, onTabChange, children }) => {
    return (
        <aside className={styles.container}>
            <nav className={styles.nav}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
            <div className={styles.content}>
                {children}
            </div>
        </aside>
    );
};

export default Sidebar;
