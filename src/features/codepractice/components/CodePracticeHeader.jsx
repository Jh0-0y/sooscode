import styles from './CodePracticeHeader.module.css';

export default function CodePracticeHeader({title}){
  return(
    <>
      <div className={styles.header}>{title}</div>
    </>
  );
}