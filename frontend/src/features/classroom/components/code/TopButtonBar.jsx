
import styles from './TopButtonBar.module.css';
import SnapshotSaveFeature from "@/features/classroom/components/snapshot/SnapshotSaveFeature.jsx";
import ModeButton from "./ModeButton.jsx";

const TopButtonBar = () => {
    return (
        <div className={styles.container}>
            <ModeButton/>
            <SnapshotSaveFeature/>

        </div>
    );
};

export default TopButtonBar;