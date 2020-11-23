import React from 'react';
import styles from "./Timeout.less";
import timeoutImg from "../../assets/image/timeout.png";

const Timeout=() => (<div className={styles.page}><img className={styles.img} src={timeoutImg} alt="登录超时" /></div>);
export default Timeout
