import styles from "./spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Spinner;
