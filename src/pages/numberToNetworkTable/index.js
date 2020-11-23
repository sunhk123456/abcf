/**
 * @Description: 携号转网监控报表（实时） 表格一
 *
 * @author: 风信子
 *
 * @date: 2019/11/13
 */

import React, {PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Websocket from "react-websocket";
import isEqual from "lodash/isEqual";
import Cookie from '@/utils/cookie';
import {APIURL_NUMBERTONETWORKTABLE_NO} from '@/services/webSocketUrl';
import NumToNetworkTable from '../../components/numberToNetworkTable';
import styles from "./index.less";


class NumberToNetworkTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns:[
        {
          title: '省分',
          dataIndex: 'prov',
          key: 'prov',
          width: 100,
          fixed: "left",
          render: (text, record) => (<span title={text} style={{color:record.testMark==="true"?"#91bbe5":"#333"}}>{text}</span>)
        },
        {
          title: '地市',
          dataIndex: 'city',
          key: 'city',
          width: 150,
          fixed: "left",
        },
        {
          title: '携出查询情况',
          children: [
            {
              title: '携出校验查询数量',
              width: 170,
              dataIndex: 'queryCheckout',
              key: 'queryCheckout',
            },
            {
              title: '其中：符合条件数量',
              dataIndex: 'queryMatch',
              key: 'queryMatch',
              width: 170,
            },
            {
              title: '申请携出授权数量',
              dataIndex: 'queryApply',
              key: 'queryApply',
              width: 170,
            },
            {
              title: '其中：授权成功数量',
              dataIndex: 'queryApplySuccess',
              key: 'queryApplySuccess',
              width: 170,
            },
          ],
        },


        {
          title: '联通携出情况',
          children: [
            {
              title: '携出用户数量',
              dataIndex: 'unicomOutNumber',
              key: 'unicomOutNumber',
              width: 170,
            },
            {
              title: '其中：携入移动数量',
              dataIndex: 'unicomOutMobile',
              key: 'unicomOutMobile',
              width: 170,
            },
            {
              title: '其中：携入电信数量',
              dataIndex: 'unicomOutTelecom',
              key: 'unicomOutTelecom',
              width: 170,
            }
          ],
        },

        {
          title: '联通携入情况',
          children: [
            {
              title: '携入用户数量',
              dataIndex: 'unicomJoinNumber',
              key: 'unicomJoinNumber',
              width: 170,
            },
            {
              title: '其中：移动携出数量',
              dataIndex: 'unicomJoinMobile',
              key: 'unicomJoinMobile',
              width: 170,
            },
            {
              title: '其中：电信携出数量',
              dataIndex: 'unicomJoinTelecom',
              key: 'unicomJoinTelecom',
              width: 170,
            }
          ],
        },


        {
          title: '移动携出情况',
          children: [
            {
              title: '携出用户数量',
              dataIndex: 'mobileOutNumber',
              key: 'mobileOutNumber',
              width: 170,
            },
            {
              title: '其中：携入联通数量',
              dataIndex: 'mobileOutUnicom',
              key: 'mobileOutUnicom',
              width: 170,
            },
            {
              title: '其中：携入电信数量',
              dataIndex: 'mobileOutTelecom',
              key: 'mobileOutTelecom',
              width: 170,
            }
          ],
        },

        {
          title: '移动携入情况',
          children: [
            {
              title: '携入用户数量',
              dataIndex: 'mobileJoinNumber',
              key: 'mobileJoinNumber',
              width: 170,
            },
            {
              title: '其中：联通携出数量',
              dataIndex: 'mobileJoinUnicom',
              key: 'mobileJoinUnicom',
              width: 170,
            },
            {
              title: '其中：电信携出数量',
              dataIndex: 'mobileJoinTelecom',
              key: 'mobileJoinTelecom',
              width: 170,
            }
          ],
        },


        {
          title: '电信携出情况',
          children: [
            {
              title: '携出用户数量',
              dataIndex: 'telecomOutNumber',
              key: 'telecomOutNumber',
              width: 170,
            },
            {
              title: '其中：携入联通数量',
              dataIndex: 'telecomOutUnicom',
              key: 'telecomOutUnicom',
              width: 170,
            },
            {
              title: '其中：携入移动数量',
              dataIndex: 'telecomOutMobile',
              key: 'telecomOutMobile',
              width: 170,
            }
          ],
        },

        {
          title: '电信携入情况',
          children: [
            {
              title: '携入用户数量',
              dataIndex: 'telecomJoinNumber',
              key: 'telecomJoinNumber',
              width: 170,
            },
            {
              title: '其中：联通携出数量',
              dataIndex: 'telecomJoinUnicom',
              key: 'telecomJoinUnicom',
              width: 170,
            },
            {
              title: '其中：移动携出数量',
              dataIndex: 'telecomJoinMobile',
              key: 'telecomJoinMobile',
              width: 170,
            }
          ],
        },
      ],
      refresh:"页面实时数据刷新频率:1小时/次",
      fieldOrder:["prov", "city", "queryCheckout", "queryMatch", "queryApply", "queryApplySuccess", "unicomOutNumber", "unicomOutMobile", "unicomOutTelecom", "unicomJoinNumber", "unicomJoinMobile", "unicomJoinTelecom", "mobileOutNumber", "mobileOutUnicom", "mobileOutTelecom", "mobileJoinNumber", "mobileJoinUnicom", "mobileJoinTelecom", "telecomOutNumber", "telecomOutUnicom", "telecomOutMobile", "telecomJoinNumber", "telecomJoinUnicom", "telecomJoinMobile"],
      tBodyData:[],
      titleName:"携号转网监控报表",
      downloadParams:{
        "fileName": "携号转网监控报表-数据表",
        "condition": {
          "name": "数据表",
          "value": []
        },
        "table": {
          "title": [
            [
              "省分",
              "地市",
              "携出查询情况-携出校验查询数量",
              "携出查询情况-其中：符合条件数量",
              "携出查询情况-申请携出授权数量",
              "携出查询情况-其中：授权成功数量",
              "联通携出情况-携出用户数量",
              "联通携出情况-其中：携入移动数量",
              "联通携出情况-其中：携入电信数量",
              "联通携入情况-携入用户数量",
              "联通携入情况-其中：移动携出数量",
              "联通携入情况-其中：电信携出数量",
              "移动携出情况-携出用户数量",
              "移动携出情况-其中：携入联通数量",
              "移动携出情况-其中：携入电信数量",
              "移动携入情况-携入用户数量",
              "移动携入情况-其中：联通携出数量",
              "移动携入情况-其中：电信携出数量",
              "电信携出情况-携出用户数量",
              "电信携出情况-其中：携入联通数量",
              "电信携出情况-其中：携入移动数量",
              "电信携入情况-携入用户数量",
              "电信携入情况-其中：携出联通数量",
              "电信携入情况-其中：携出移动数量",
            ]
          ],
          "value": []
        }
      }
    }
  }

  componentDidMount() {

  }

  handleOpen = () =>{
    console.log("websocket open");
    const {token, userId} = Cookie.getCookie('loginStatus');
    const parames = {
      token,
      userId,
      markType:"XHZW_RT_PA_D",
    }
    this.sendMessage(JSON.stringify(parames))
  }

  handleClose = () =>{
    console.log("websocket close");
  }

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 发送消息
   * @method sendMessage
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
   */
  sendMessage = message => {
    this.refWebSocket.sendMessage(message);
  };

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 接收消息
   * @method handleData
   */
  // eslint-disable-next-line
  handleData(data) {
    const {tBodyData} = this.state;
    const result = JSON.parse(data);
    if(!isEqual(data.tBodyData,tBodyData)){
      this.setState({...result})
    }
  }

  render() {
    const {columns, tBodyData, titleName, downloadParams,fieldOrder,refresh} = this.state;
    return (
      <PageHeaderWrapper>
        <div className={styles.numberToNetworkTable}>
          <div className={styles.title}>
            {titleName}
            <div className={styles.details}>{refresh}</div>
          </div>
          <NumToNetworkTable
            tableType="01"
            thData={columns}
            downloadData={downloadParams}
            tBodyData={tBodyData}
            fieldOrder={fieldOrder}
          />
          <Websocket
            url={APIURL_NUMBERTONETWORKTABLE_NO}
            onMessage={(data)=>this.handleData(data)}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            ref={socket => {
              this.refWebSocket = socket;
            }}
          />
        </div>
      </PageHeaderWrapper>

    )
  }
}

export default NumberToNetworkTable;
