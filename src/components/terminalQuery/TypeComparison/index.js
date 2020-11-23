/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: DW3.0终端信息查询-型号对比公共组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  ls
 * @date 2019/12/09
 */

import React, { PureComponent } from 'react'
import {Icon} from 'antd';
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import styles from './index.less'

export default class TypeComparison extends PureComponent {
  
  static defaultProps = {
    'echartId': 'defaultId',
    'isUse': false,
    'isCenter': false,
    'name:': 'price',
    'color': ['#E9A23E', '#0BAE97'],
    'dataList': {
      // 'subtitle': { 'name': '成本价占比', 'value': '50', 'unit': '%' },
      'title': '-',
      'list': [
        // { 'name': '成本价占比', 'value': '50', 'unit': '%' },
        // { 'name': '成本价占比', 'value': '50', 'unit': '%' },
      ],
    },
  };

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    // 获取到左右两个小人标志DOM
    getMarkDOM = (color, name) => (
        color.map((item, index) => (
          <div className={index === 0 ? styles.firstMark : styles.secondMark} key={`${Math.random() * 100}${name}`}>
            <div className={styles.circle} style={{ background: `${item}` }} />
            <div className={styles.triangle} style={{ borderColor: `${item} transparent transparent transparent` }} />
          </div>
        ))
    )

  // 处理数据格式例如:（12,524 => 12524)
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1 ?
        parseFloat(data.replace(/-/g, 0)):
        parseFloat(data.replace(/,/g, "").replace(/-/g, 0));
    return dataA;
  };

  // 下载方法
  download(e) {
    const {echartId, downloadData, dataList} = this.props;
    e.stopPropagation();
    const{specialName, conditionValue}=downloadData;
    const {list, title} = dataList;
    const downloadValue=list.map(item=>([item.name,`${item.value}`]));
    const newDownloadData={
      fileName:`${specialName}--${title}`,
      condition:{
        name: `${title}`,
        value: [
          ["专题名称:", specialName,list.length > 0 ? list[0].unit : ''],
          ...conditionValue
        ],
      },
      table:{
        title: [
          [ '信息统计', '数值'],
        ],
        value: downloadValue
      }
    };
    DownloadFile(newDownloadData, echartId);

  };

    render() {
      const {color, name, dataList, isCenter, downloadData, echartId, isUse} = this.props;
      const {title, list,subtitle} = dataList;
      let defaultColor = ['#E9A23E', '#0BAE97']; // 默认颜色，判断传入的颜色长度必须等于二
      let newColor = ''; // 哪个型号多就显示哪个颜色
      let newLeft = 0; // 分割线距离左侧多远
      if (color&&list&&color.length === 2 && list.length > 0){
        defaultColor = color;
        const firstValue = this.formatData(list[0].value); // 第一种型号的值
        const secondValue = this.formatData(list[1].value); // 第二种型号的值
        newColor = firstValue > secondValue ? defaultColor[0] : defaultColor[1];
        const total = firstValue + secondValue; // 计算两种型号共有多少值
        newLeft = Math.ceil(firstValue / total * 100);
        if(total === 0)newLeft = 50;
    }
        return (
          <div className={styles.wrapper} id={echartId}>
            { downloadData &&
            <div className={styles.downLoad} onClick={(e) => this.download(e)}>
              <div><Icon type="download" /></div>
              <div>下载</div>
            </div>
            }
            <div className={styles.title} style={{textAlign:`${isCenter === true? 'center':'left'}`}}>
              {title}
            </div>
            {subtitle&&subtitle.name&&
              <div className={styles.subtitle}>
                <div>{subtitle.name}</div>
                <div className={styles.subtitlePercent}>{subtitle.value+subtitle.unit}</div>
              </div>
            }
            {list && list.length > 0 &&
            <div className={styles.contain}>
              <div className={styles.mark}>
                {this.getMarkDOM(defaultColor, name)}
              </div>
              <div className={styles.bar}>
                <div className={styles.bottomColor} />
                <div
                  className={styles.leftUpperColor}
                  style={{background: `${defaultColor[0]}`, width: `${newLeft}%`}}
                />
                <div
                  className={styles.rightUpperColor}
                  style={{background: `${defaultColor[1]}`, width: `${100 - newLeft}%`}}
                />
                <div className={styles.rule} style={{left: `${newLeft}%`}}>
                  <div className={styles.ruleColor} style={{background: newColor}} />
                </div>
              </div>
              {list && list.length > 0 &&
              <div className={styles.percent}>
                <span>{list[0].name}</span>
                <span>{list[1].name}</span>
              </div>
              }
              {list && list.length > 0 &&
              <div className={styles.percent}>
                <span style={{ color: `${defaultColor[0]}` }}>{list[0].value + list[0].unit}</span>
                <span style={{ color: `${defaultColor[1]}` }}>{list[1].value + list[1].unit}</span>
              </div>
              }
            </div>
            }
            {
              isUse && list.length === 0 &&
              <p className={styles.welcome}>抱歉!该账号没有匹配信息</p>
            }
          </div>
        )
    }
}
