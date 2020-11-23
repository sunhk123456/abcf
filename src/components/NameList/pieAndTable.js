/**
 * @Description: 业务产品 (饼图和表格)
 *
 * @author: liuxiuqian
 *
 * @date: 2020/5/27
 */

import React, { PureComponent } from 'react';
import { Table } from 'antd';
import classNames from "classnames";
import styles from './pieAndTable.less'
import TablePie from './tablePie';


class PieAndTable extends PureComponent {

  static defaultProps = {
    pieBusinessData:{
      "title": "业务产品",
      "chartX": ["移网", "数据网元"],
      "chart": [{
        "unit": "万元",
        "name": "5G终端NR登网情况",
        "type": "pie",
        "value": [
          {
            "data": "456,45",
            "id": "01",
            "percent": "45.23",
            "percentUnit": "%"
          },
          {
            "data": "456,45",
            "id": "02",
            "percent": "45.23",
            "percentUnit": "%"
          },
        ]
      }],
      "thData": [
        {
          "title": "业务",
          "id": "yw",
          "unit": ""
        },
        {
          "title": "类型",
          "id": "leixing",
          "unit": ""
        },
        {
          "title": "收入",
          "id": "sr",
          "unit": "万元"
        },
        {
          "title": "同比增幅",
          "id": "tbzf",
          "unit": ""
        }
      ],
      "tableDataList": {
        "01": [
          {
            "key": "1",
            "yw": "移网",
            "leixing": "移网基础",
            "sr": "75,837",
            "tbzf": "15.49%"
          },
          {
            "key": "2",
            "yw": "移网",
            "leixing": "移网基础业务",
            "sr": "75,837",
            "tbzf": "-"
          },
          {
            "key": "3",
            "yw": "移网",
            "leixing": "移网基础业务",
            "sr": "75,837",
            "tbzf": "-15.49%"
          }
        ],
        "02": [
          {
            "key": "021",
            "yw": "数据网元",
            "leixing": "移网基础业务",
            "sr": "75,837",
            "tbzf": "0"
          },
          {
            "key": "022",
            "yw": "数据网元",
            "leixing": "移网基础业务",
            "sr": "75,837",
            "tbzf": "15.49%"
          },
          {
            "key": "023",
            "yw": "数据网元",
            "leixing": "移网基础业务",
            "sr": "75,837",
            "tbzf": "-15.49%"
          },
          {
            "key": "024",
            "yw": "数据网元",
            "leixing": "移网基础业务",
            "sr": "75,837",
            "tbzf": "15.49%"
          },
          {
            "key": "025",
            "yw": "数据网元",
            "leixing": "移网基础业务",
            "sr": "75,837",
            "tbzf": "-15.49%"
          }
        ],
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      selectType:"", // 选中的业务类型
    };
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  objToArray= (obj)=> {
    const arr = [];
    //  eslint-disable-next-line
    for (const key in obj){
      arr.push(...obj[key])
    }
    return arr;
  };

  callbackPie=(pieId)=>{
    this.setState({selectType:pieId})
  };

  tdWidth=()=>{
    const screenWidth = window.screen.width;
    let tdWidth;
    if(screenWidth > 1800){  // 1920
      tdWidth = 129;
    }else if(screenWidth > 1400 && screenWidth < 1800){ // 1440
      tdWidth = 80;
    }else if(screenWidth > 1300 && screenWidth < 1400){ // 1366
      tdWidth = 75;
    }else {
      tdWidth = 60;
    }
    return tdWidth;
  };

  render() {
    const {pieBusinessData} = this.props;
    const {selectType} = this.state;
    const {thData,tableDataList,chart,title,chartX} = pieBusinessData;
    const thDataCopy = [...thData];
    thDataCopy.unshift({
      "title": "序号",
      "id": "xuhao",
      "unit": ""
    });


    const columns = thDataCopy.map((thItem,thIndex)=>{
      let tdWidth = this.tdWidth();
      const paddingLR = 4;
      if(thIndex === 0){
        tdWidth = 50;
      }if(thIndex === 4){
        tdWidth = 100;
      }
      return {
        title: thItem.unit === "" ? thItem.title : `${thItem.title}(${thItem.unit})`,
        dataIndex: thItem.id,
        key: thItem.id,
        width:tdWidth,
        align:"center",
        render: (text) => {
          const textCopy = text;
          if(thIndex === thDataCopy.length-1){
            let color = "classColorDefault";
            if(text !== "-" && text.search("-") === 0){
              color = "classColorred";
            }else if(text !== "-" && text.search("-") === -1 &&  text.search("0") !== 0){
              color = "classColorgreen";
            }
            return (<div style={{width: `${tdWidth-paddingLR}px`}} className={classNames(styles.tdDiv,styles[color])}>{textCopy}</div>)
          }
          return (<div title={thIndex !== 0 && text} style={{width: `${tdWidth-paddingLR}px`}} className={styles.tdDiv}>{textCopy}</div>)
        }
      }
    });
    const tbodyData = selectType === "" ? this.objToArray(tableDataList) : tableDataList[selectType];
    const data = tbodyData.map((item,index)=>({xuhao: index+1,...item}));
    return (
      <div className={styles.pieAndTable}>
        <div className={styles.pie}>
          <TablePie chartData={{chart,title,chartX}} callbackPie={this.callbackPie} />
        </div>
        <div className={styles.table}>
          <Table
            columns={columns}
            dataSource={data}
            rowClassName={styles.trStyle}
            pagination={false}
            scroll={{y: 265}}
          />
        </div>
      </div>
    );
  }
}

export default PieAndTable;
