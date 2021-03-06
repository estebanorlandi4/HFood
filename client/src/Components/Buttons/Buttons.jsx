import styles from "./Buttons.module.css";

const types = {
  primary: styles.primary,
  secondary: styles.secondary,
  enfasis: styles.enfasis,
};

function Buttons(props) {
  return (
    <button
      name={props.name || ""}
      type={props.submit ? "submit" : "button"}
      className={`${styles.btn} ${types[props.type]}`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
export default Buttons;
