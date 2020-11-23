/**
 *
 * @author Sunhk
 * @date 2020/11/11
 */
import React, {PureComponent} from 'react';
import styles from "./index.less"
// import "element-theme-default"
import Echarts from "@/pages/demojs/echarts/index";

class Timejs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      // 改变时间背景
      // eslint-disable-next-line react/no-unused-state
      timesback:false,
      // eslint-disable-next-line react/no-unused-state
      echartsback:false,
    };
    // 设置ref，操作dom元素
    this.seconds = React.createRef();
    this.minu = React.createRef();
    this.hour = React.createRef();
    this.daydays = React.createRef();
    this.rect = React.createRef();
  }

  componentDidMount() {
    // 设置定时器，一秒钟执行tick
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    this.shijian();
  }

  // 修改css样式==》表的指针进行旋转
  // eslint-disable-next-line react/sort-comp
  shijian = () => {
    const {date} = this.state;
    this.seconds.current.style.cssText = `transform: rotate(${6 * date.getSeconds()}deg); `
    this.minu.current.style.cssText = `transform: rotate(${6 * date.getMinutes()}deg); `
    this.hour.current.style.cssText = `transform: rotate(${30 * date.getHours() + 6 * date.getMinutes() / 12}deg); `
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {timesback} = this.state;
    const {echartsback} = this.state;
    if (timesback === true){
      this.changetimesback();
    }
    if (echartsback === true){
      this.changeechartsback();
    }
    this.shijian();

  }

  changetimesback=()=>{
    this.rect.current.style.cssText=`background:blue;`
    this.setState({
      echartsback:false
    })
  }

  changeechartsback=()=>{
    this.rect.current.style.cssText=``
    this.setState({
      echartsback:true
    })



  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // 设置新的时间
  tick = () => {
    this.setState({
      date: new Date()
    });
  }

  // 周天的选择
  day = () => {
    const {date} = this.state;
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[date.getDay()];
  }

  // 弹出时间
  times = () => {
    const {date} = this.state;
    const hours = date.getHours();
    alert(`${this.zeroize(hours)}:${this.zeroize(date.getMinutes())}:${this.zeroize(date.getSeconds())}`)
  }

  // 给个位数填零
  zeroize = (a) => {
    if (a < 10) {
      return `0${a}`;
    }
    return a;
  }

  // 修改样式
  changesize = () => {
    this.daydays.current.style.cssText = " position:relative;left:-10px;top:-10px;font-size:80px;color:black"
  }

  // 恢复样式
  recover = () => {
    this.daydays.current.style.cssText = ""
  }


  render() {
    const {date} = this.state;
    const {echartsback} = this.state;
    let builddiv = [...new Array(60).keys()];
    // eslint-disable-next-line no-const-assign
    builddiv = builddiv.map(ele => <div key={ele} className={styles.box} />
    )
    return (
      <div>
        <div className={styles.rect} ref={this.rect} onClick={this.changeechartsback}>
          <div className={styles.circle}>
            {builddiv}
            <div className={styles.point} />
            <div className={styles.seconds} ref={this.seconds} />
            <div className={styles.minu} ref={this.minu} />
            <div className={styles.hour} ref={this.hour} />
          </div>
          <div className={styles.times} onClick={() => this.times()}>
            <div className={styles.font}>{this.zeroize(date.getHours())}:{this.zeroize(date.getMinutes())}</div>
            <div className={styles.font1}>{this.zeroize(date.getSeconds())}</div>
          </div>
          {/* eslint-disable-next-line react/void-dom-elements-no-children */}
          <div className={styles.day}>

            {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
            <div
              className={styles.daydays}
              ref={this.daydays}
              onMouseOver={() => this.changesize()}
              onMouseOut={() => this.recover()}
            >星期{this.day()}
            </div>
            <div className={styles.daytime}>
              {date.getFullYear()}年{this.zeroize(date.getMonth() + 1)}月{this.zeroize(date.getDate())}日
            </div>
          </div>
        </div>
        <div className={styles.echarts}>
          <Echarts style={echartsback} changeback={this.changetimesback} />
        </div>
      </div>
    )
  }
}

export default Timejs;
