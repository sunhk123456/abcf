import React, {Component} from 'react';
import {Icon, Tooltip} from 'antd';
import DownloadFile from "@/utils/downloadFile"; // 下载封装方法
import FontSizeEchart from '../ProductView/fontSizeEchart';
import waSai from "../BuildingView/pic/ganTan.png";
import styles from './buildingTop10.less';

 class BuildingTop10 extends Component {

   static defaultProps = {
     'echartId':"buildingTop10",
     // addRedMark:true 是否加红色叹号
     "download":true, // 是否显示下载按钮
    // "downloadData":{}, // 下载数据
     'chartData': {
       'title': '楼宇总收入TOP10',
       'unit': '万',
       'thData': [],
       'tbodyData': [
         { 'id': '1', 'name': '万霖大厦1', 'value': '230.7' },
         { 'id': '2', 'name': '万霖大厦2', 'value': '210.7' },
         { 'id': '3', 'name': '万霖大厦3', 'value': '200.7' },
         { 'id': '4', 'name': '万霖大厦4', 'value': '180.7' },
         { 'id': '5', 'name': '万霖大厦5', 'value': '150.7' },
         { 'id': '6', 'name': '万霖大厦', 'value': '140.7' },
         { 'id': '7', 'name': '万霖大厦', 'value': '130.7' },
         { 'id': '8', 'name': '万霖大厦', 'value': '120.7' },
         { 'id': '9', 'name': '万霖大厦', 'value': '110.7' },
         { 'id': '10', 'name': '万霖大厦', 'value': '100.7' },
       ],
     },
   };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 处理数据格式
  formatData = (data) => {
    const dataA =
      data.indexOf(",") === -1
        ? parseFloat(data)
        : parseFloat(data.replace(/,/g, ""));
    return dataA;
  };


  jsonHandle=()=>{
    const {specialName,provName,cityName,date,chartData} = this.props;
    const {title,unit,tbodyData}=chartData;
    const downloadValue=tbodyData.map((item)=>([item.id,item.name,item.value]));
    const table = {
      title: [
        ['序号', '楼宇名称', '总数'],
      ],
        value: downloadValue
    };
    const condition = {
      name: `${title}`,
      value: [
        ["专题名称:", specialName, unit],
        ["省份",provName],
        ["地市",cityName],
        ["日期",date]
      ],
    };
    return {
      fileName: `${specialName}--${title}`,
      condition,
      table
    };
  };

  // 下载方法
  download(e) {
    const {echartId,downloadData} = this.props;
    e.stopPropagation();
    if(downloadData){
      const {chartData} = this.props;
      const {tbodyData,title,unit}=chartData;
      const{specialName, conditionValue}=downloadData;
      const downloadValue=tbodyData.map((item)=>([item.id,item.name,item.value]));
      const newDownloadData={
        fileName:`${specialName}--${title}`,
        condition:{
          name: `${title}`,
          value: [
            ["专题名称:", specialName, unit],
            ...conditionValue
          ],
        },
        table:{
          title: [
            ['序号', '名称', '总数'],
          ],
          value: downloadValue
        }
      };
      DownloadFile(newDownloadData, echartId);
    }else {
      DownloadFile(this.jsonHandle(), echartId);
    }
  };

  render() {
    const{titleSize}=FontSizeEchart();
    const myFontSize=FontSizeEchart();
    const {chartData,echartId,download,titlePosition,addRedMark}=this.props;
    const {title,unit,tbodyData,subtitle}=chartData;
    let content=null;
    if(tbodyData&&tbodyData.length>0){
      const totalNumber=this.formatData(tbodyData[0].value)/0.8;
       content=tbodyData.map(
        (item,index)=>{
          const percent=this.formatData(item.value)*100/totalNumber.toFixed(2);
          return (
            <div key={item.id} className={index > 2 ? styles.item : styles[`item${index}`]}>
              <div className={styles.text}>
                <div title={item.tipText||item.name} className={styles.textName}>
                  {
                    item.name.length>12
                      ?`${item.id}.${item.name.slice(0,12)}...`
                      :`${item.id}.${item.name}`
                  }
                </div>
                <div>{`${item.value}${unit}`}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.percent} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        }
      );
    }

    return (
      <div className={styles.page} id={echartId}>
        <div className={styles.title} style={{justifyContent:titlePosition||"flex-start",fontSize:titleSize}}>
          {title}
          {
            addRedMark &&
            <Tooltip
              title='数据取自9月1日开始正式采集的预装客户端上报DM2.0数据'
              trigger='hover'
              placement='bottom'
              overlayClassName={styles.basisBarEchartToolTip}
              // defaultVisible
            >
              <img
                src={waSai}
                alt=''
                style={{height:myFontSize.titleSize,width:myFontSize.titleSize,cursor:'pointer'}}
              />
            </Tooltip>
          }
          {download &&
          <div className={styles.downLoad} onClick={(e) => this.download(e)}>
            <div><Icon type="download" /></div>
            <div>下载</div>
          </div>
          }
        </div>
        {subtitle&&
        <div className={styles.subtitle}>
          {subtitle}
        </div>}
        <div className={styles.content}>{content}</div>
      </div>
    );
  }
}
export default BuildingTop10;
