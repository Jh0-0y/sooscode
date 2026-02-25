import styles from './HCJCodePanelHeader.module.css'

export default function HCJCodePanelHeader({HCJtitle}){
  return(
    <div className={styles.header}>
      {HCJtitle}
    </div>
  )
}