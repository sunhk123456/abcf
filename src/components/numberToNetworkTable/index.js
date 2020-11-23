import React,{PureComponent} from 'react';
import { Table } from 'antd';
import DownloadFile from "@/utils/downloadFile";
import {handleDownloadTableValue} from "@/utils/tool"; // 工具方法
import styles from './index.less';

class NumToNetworkTable extends PureComponent {
  
  static defaultProps = {
    tableType:"02",
    fieldOrder:["prov", "total", "queryNotMatchNumber", "queryNotMatchPercent", "queryMatchNumber", "queryMatchPercent", "queryApplyNumber", "queryApplyPercent", "queryApplySuccess", "unicomOutNumber", "unicomOutPercent", "unicomJoinNumber", "unicomNetJoinNumber", "unicomNetJoinYestodayPercent", "unicomNetJoinTodayPercent", "telecomOutNumber", "telecomJoinNumber", "telecomNetJoinNumber", "telecomNetJoinYestodayPercent", "telecomNetJoinTodayPercent", "mobileOutNumber", "mobileJoinNumber", "mobileNetJoinNumber", "mobileNetJoinYestodayPercent", "mobileNetJoinTodayPercent", "totalNumber", "totalYestodayPercent", "totalTodayPercent"],
    thData:[
      {
        key: 'prov', title: '省分',
        dataIndex: 'prov',
        width: 100,
        fixed: 'left',
        render: (text, record) => (<span title={text} style={{color:record.testMark==="true"?"#91bbe5":"#333"}}>{text}</span>)
      },
      {
        title:"查询资格",
        children:[
          {
            key:"total",
            title:"总量",
            width: 130,
            dataIndex: "total"
          },
          {
            title:"其中，不符合条件",
            children:[
              {
                key:"queryNotMatchNumber",
                dataIndex:"queryNotMatchNumber",
                title:"数量",
                width: 130,
              },
              {
                key:"queryNotMatchPercent",
                dataIndex:"queryNotMatchPercent",
                title:"占比",
                width: 130,
              },
            ]},
          {
            title:"其中，符合条件",
            children:[
              {
                key:"queryMatchNumber",
                dataIndex:"queryMatchNumber",
                title:"数量",
                width: 130,
              },
              {
                key:"queryMatchPercent",
                dataIndex:"queryMatchPercent",
                title:"占比",
                width: 130,
              },
              {
                key:"queryApplyNumber",
                dataIndex:"queryApplyNumber",
                title:"其中，给予授权",
                width: 170,
              },
              {
                key:"queryApplyPercent",
                dataIndex:"queryApplyPercent",
                title:"给予授权占比",
                width: 170,
              },
              {
                key:"queryApplySuccess",
                dataIndex:"queryApplySuccess",
                title:"其中，授权成功",
                width: 170,
              },
            ]
          },
        ]
      },
      {
        title: "中国联通",
        children: [
          {
            title: "携出",
            children: [
              {
                key: 'unicomOutNumber',
                dataIndex: 'unicomOutNumber',
                title: '数量',
                width: 130,
              },
              {
                key: 'unicomOutPercent',
                dataIndex: 'unicomOutPercent',
                title: '占比',
                width: 130,
              },
            ]
          },
          {
            title: "携入",
            key: "unicomJoinNumber",
            dataIndex: "unicomJoinNumber",
            width: 130,
          },
          {
            title: "净携入",
            children: [
              {
                key: "unicomNetJoinNumber",
                dataIndex: "unicomNetJoinNumber",
                title: "数量",
                width: 130,
              },
              {
                key: "unicomNetJoinYestodayPercent",
                dataIndex: "unicomNetJoinYestodayPercent",
                title: "昨日环比",
                width: 130,
              },
              {
                key: "unicomNetJoinTodayPercent",
                dataIndex: "unicomNetJoinTodayPercent",
                title: "本日环比",
                width: 130,
              }
            ]
          },
        ]
      },
      {
        title: "中国电信",
        children: [
          {
            title: "携出",
            key: "telecomOutNumber",
            dataIndex: "telecomOutNumber",
            width: 130,
          },
          {
            title: "携入",
            key: "telecomJoinNumber",
            dataIndex: "telecomJoinNumber",
            width: 130,
          },
          {
            title: "净携入",
            children: [
              {
                key: "telecomNetJoinNumber",
                dataIndex: "telecomNetJoinNumber",
                title: "数量",
                width: 130,
              },
              {
                key: "telecomNetJoinYestodayPercent",
                dataIndex: "telecomNetJoinYestodayPercent",
                title: "昨日环比",
                width: 130,
              },
              {
                key: "telecomNetJoinTodayPercent",
                dataIndex: "telecomNetJoinTodayPercent",
                title: "本日环比",
                width: 130,
              }
            ]
          }
        ]
      },
      {
        title: "中国移动",
        children: [
          {
            title: "携出",
            key: "mobileOutNumber",
            dataIndex: "mobileOutNumber",
            width: 130,
          },
          {
            title: "携入",
            key: "mobileJoinNumber",
            dataIndex: "mobileJoinNumber",
            width: 130,
          },
          {
            title: "净携入",
            children: [
              {
                key: "mobileNetJoinNumber",
                dataIndex: "mobileNetJoinNumber",
                title: "数量",
                width: 130,
              },
              {
                key: "mobileNetJoinYestodayPercent",
                dataIndex: "mobileNetJoinYestodayPercent",
                title: "昨日环比",
                width: 130,
              },
              {
                key: "mobileNetJoinTodayPercent",
                dataIndex: "mobileNetJoinTodayPercent",
                title: "本日环比",
                width: 130,
              }
            ]
          }
        ]
      },
      {
        title: "携转总人数",
        children: [
          {
            key: "totalNumber",
            dataIndex: "totalNumber",
            title: "数量",
            width: 130,
          },
          {
            key: "totalYestodayPercent",
            dataIndex: "totalYestodayPercent",
            title: "昨日环比",
            width: 130,
          },
          {
            key: "totalTodayPercent",
            dataIndex: "totalTodayPercent",
            title: "本日环比",
            width: 130,
          }
        ]
      }
    ],
    tBodyData: [],
    downloadData:{
      "fileName": "日报-携号转网监控报表-数据表",
      "condition": {
        "name": "数据表",
        "value": []
      },
      "table": {
        "title": [
          [
            "省分",
            "查询资格-总量",
            "查询资格-其中，不符合条件-数量",
            "查询资格-其中，不符合条件-占比",
            "查询资格-其中：符合条件-总量",
            "查询资格-其中：符合条件-占比",
            "查询资格-其中：符合条件-给予授权数量",
            "查询资格-其中：符合条件-给予授权-占比",
            "携出查询情况-其中：符合条件-授权成功",
            "中国联通-携出-数量",
            "中国联通-携出-占比",
            "中国联通-携入",
            "中国联通-净携入-数量",
            "中国联通-净携入-昨日环比",
            "中国联通-净携入-本日环比",
            "中国电信-携出",
            "中国电信-携入",
            "中国电信-净携入-数量",
            "中国电信-净携入-昨日环比",
            "中国电信-净携入-本日环比",
            "中国移动-携出",
            "中国移动-携入",
            "中国移动-净携入-数量",
            "中国移动-净携入-昨日环比",
            "中国移动-净携入-本日环比",
            "携转总人数-数量",
            "携转总人数-昨日环比",
            "携转总人数-本日环比"
          ]
        ],
        "value": [],
      }
    }
  };
  
  constructor(props) {
    super(props);
    this.state={};
  }
  
  handleDownloadConditionValue=(info)=>(info.map((item)=>([item])));
  
  download = (e) => {
    e.stopPropagation();
    const {downloadData,fieldOrder,tBodyData,info} = this.props;
    downloadData.table.value = handleDownloadTableValue(tBodyData,fieldOrder);
    if(info){downloadData.condition.value=this.handleDownloadConditionValue(info);}
    DownloadFile(downloadData);
  };
  
  render() {
    const {thData,tBodyData,tableType}=this.props;
    const screenWidth =  window.screen.width;
    let heightW = tableType==="01" ? "70vh": "48vh";
    if(screenWidth > 1400 &&  screenWidth < 1800 ){
      heightW = tableType==="01" ? "70vh" : "50vh"
    }else if(screenWidth > 1800){
      heightW = tableType==="01" ? "75vh" : "60vh"
    }
    return (
      <div className={styles.page}>
        <div className={styles.tableTitle}>
          <div className={styles.line} />
          <div className={styles.title}>数据表</div>
          <div className={styles.download}>
            <div className={styles.text} onClick={(e)=>this.download(e)}>下载</div>
          </div>
        </div>
        <div className={styles.table}>
          <Table
            columns={thData}
            dataSource={tBodyData}
            rowClassName={styles.trStyle}
            bordered
            pagination={false}
            scroll={{ x:( tableType==="02"?3730:3990),y: heightW}}
          />
        </div>
      </div>
     );
  }
  
}
export default NumToNetworkTable;
