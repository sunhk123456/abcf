import React, { PureComponent } from 'react';
import isEqual from 'lodash/isEqual';
import styles from './TableEchart.less';




class ProductViewTableEchart extends PureComponent {

  constructor(props){
    super(props);
    this.state={
      chartData:null,
    }
  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {chartData}=nextProps;
    if (!isEqual(chartData,prevState.chartData)) {
      console.log(chartData)
      return {
        chartData,
      };
    }
    return null;
  }

  render() {
    const {chartData}=this.state;
    if(!chartData){return null}
    if(!chartData.tbodyData){return null}
    // console.log("APP使用偏好-top10render");
    // console.log(chartData);
    // const thData=['序号','APP类别','APP名称','点击量'];
    // const tbodyData=[
    //   {
    //     "id": "1",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "2",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "3",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "4",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "5",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "6",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "7",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "8",
    //     "values": ['NO.1','社交','微信','2.1']
    //   },
    //   {
    //     "id": "9",
    //     "values": ['NO.1','社交','微信','1.1']
    //   },
    //   {
    //     "id": "10",
    //     "values": ['NO.1','社交','微信','1.1']
    //   },
    // ];
    const {thData,tbodyData,title}=chartData;
    let maxLine=0;
    if(tbodyData[0]){
      maxLine=parseFloat(tbodyData[0].values[3].replace(/,/g,''))*1.3;
    }
    const tbody=tbodyData.map((item,index)=>{
      const {values,id,unit}=item;
      const lineWidth=parseFloat(values[3].replace(/,/g,''))*100/maxLine;
      return(
        <ul key={id} style={{height:"10%"}}>
          <li style={{width: "10%",}}>
            <span className={index<3?styles.liColor:null}>{values[0]}</span>
          </li>
          <li style={{width: "16%",}}>{values[1]}</li>
          <li style={{width: "20%",textAlign:"right"}}>{values[2]}</li>
          <li style={{width: "58%"}}>
            <span className={styles.line}>
              <div className={styles.linePercent} style={{width:`${lineWidth}%`}} />
            </span>
            <span className={styles.text}>
              {values[3]}{unit}
            </span>
          </li>
        </ul>
      )
    });
    return(
      <div className={styles.page}>
        <div className={styles.title}>{title}</div>
        <div className={styles.table}>
          <div className={styles.thead}>
            <ul>
              <li style={{width: "10%",}}>{thData[0]}</li>
              <li style={{width: "16%",}}>{thData[1]}</li>
              <li style={{width: "20%",textAlign:"right"}}>{thData[2]}</li>
              <li style={{width: "58%",}}>{thData[3]}</li>
            </ul>
          </div>
          <div className={styles.tbody}>
            {tbody}
          </div>
        </div>
      </div>
    )
  }

}
export default ProductViewTableEchart
