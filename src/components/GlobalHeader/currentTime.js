/**
 *
 * title: Header/currentTime.js
 *
 * description: 获取当前时间
 *
 * @author: liutong
 *
 * @date 2017/5/16
 *
 */

import React from 'react';
import styles from './currentTime.less';
import moment from 'moment'

export default class CurrentTime extends React.Component{
    //初始化状态机
    constructor(props){
        super(props);
        this.state = {
            date:'',
        };
    }
    componentWillMount() {
        let time = function () {
            this.setState({
                date: moment().format("YYYY年MM月DD日 HH:mm:ss"),
            })
        }.bind(this)
        time()
        setInterval(time, 1000) //事件绑定，使函数每秒刷新一次
    }
    //渲染DOM
    render() {
        return (
            <div className={styles.HomePagediv}>
                <span  className={styles.HomePagespan}>{this.state.date}</span>
            </div>
        )
    }

}
