import React, { Component } from 'react';
import { Icon, Progress } from 'antd';
import ClassName from "classnames";
import DownloadFile from "@/utils/downloadFile";
import styles from './index.less';



class Top5 extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ''));
    return dataA;
  };

  download = (e) => {
    e.stopPropagation();
    DownloadFile(this.jsonHandle(),"top5");
  };

  jsonHandle=()=>{
    const {downloadData, chartData} = this.props;
    if(!chartData){return null}
    const {thData}=chartData;
    const tbodyData=chartData.tbodyData.map((item)=>([item.ranking,item.name,item.value]));
    const {title}=chartData;
    const {unit}=chartData.tbodyData[0];
    const conditionValue=[];
    downloadData.condition.forEach((item)=>{
      conditionValue.push([item.key,...item.value])
    });
    const {specialName}=downloadData;
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName, unit],
        ["筛选条件:"],
        ...conditionValue,
      ],
    };
    const table = {
      title: [
        thData
      ],
      value: [
        ...tbodyData
      ]
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table
    };
  };

  render() {
    const {chartData}=this.props;
    if(!chartData){return null}
    if(!chartData.thData){return null}
    const {downloadData, chartData:{title,thData,tbodyData}}=this.props;

    const thDom = thData.map((item, index)=>(<th key={index}>{item}</th>));
    const trDom = tbodyData.map((item, index)=>{

      let percentValue = 0;
      if(tbodyData[0].value.replace(/,/g,'')>0){
        percentValue=parseFloat(item.value.replace(/,/g,'')/tbodyData[0].value.replace(/,/g,''))*100;
      }
      return(
        <tr key={item.id}>
          <td className={ClassName(styles.column1,index < 3 && styles.redText)}>{item.ranking}</td>
          <td className={styles.column2}><div className={styles.column2Div} title={item.name}>{item.name}</div></td>
          <td>
            <div className={styles.progress}>
              <div className={styles.progressBg}><div className={styles.progressContent} style={{width:`${percentValue}%`}} /></div>
              <div className={styles.redText}>{item.value}{item.unit}</div>
            </div>
            {/*<Progress*/}
            {/*  percent={percentValue}*/}
            {/*  format={() => (<span className={styles.redText}>{item.value+item.unit}</span>)}*/}
            {/*/>*/}
          </td>
        </tr>
      )
    });

    return (
      <div id="top5" className={styles.page}>
        <div className={styles.chart}>
          <div className={styles.title}>
            {title}
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                {thDom}
              </tr>
            </thead>
            <tbody>
            {trDom}
            </tbody>
          </table>
        </div>
        {downloadData?(
          <div className={styles.downLoad} onClick={(e)=>this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
        ):null}
      </div>
    );
  }

}

export default Top5;

