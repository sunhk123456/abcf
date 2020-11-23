/**
 * @Description: 日报-携号转网监控报表（实时） 表格二
 *
 * @author: 风信子
 *
 * @date: 2019/11/13
 */

import React, {PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import isEqual from 'lodash/isEqual';
import Websocket from 'react-websocket';
import {APIURL_NETTOWORK_TABLE} from '@/services/webSocketUrl';
import Cookie from '@/utils/cookie';
import styles from "./index.less";
import NumToNetworkTable from '../../components/numberToNetworkTable';

class NumberToNetworkReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      titleName:"日报-携号转网监控报表（实时）",
      // tableType:"02",
      // thData:[
      //   {key:"prov",title:"省份",dataIndex:"prov",width:100,  fixed: 'left'},
      //   {
      //     title:"查询资格", children:[
      //       {key:"total",title:"总量",dataIndex: "total"},
      //       {title:"其中，不符合条件",children:[
      //           {key:"queryNotMatchNumber",dataIndex:"queryNotMatchNumber",title:"数量"},
      //           {key:"queryNotMatchPercent",dataIndex:"queryNotMatchPercent",title:"占比"},
      //         ]},
      //       {title:"其中，符合条件",children:[
      //           {key:"queryMatchNumber",dataIndex:"queryMatchNumber",title:"数量"},
      //           {key:"queryMatchPercent",dataIndex:"queryMatchPercent",title:"占比"},
      //           {key:"queryApplyNumber",dataIndex:"queryApplyNumber",title:"其中，给予授权"},
      //           {key:"queryApplyPercent",dataIndex:"queryApplyPercent",title:"给予授权占比"},
      //           {key:"queryApplySuccess",dataIndex:"queryApplySuccess",title:"其中，授权成功"},
      //         ]},
      //     ]
      //   },
      //   {
      //     title:"中国联通",children:[
      //       {title:"携出",children:[
      //           { key: 'unicomOutNumber', dataIndex: 'unicomOutNumber', title: '数量' },
      //           { key: 'unicomOutPercent', dataIndex: 'unicomOutPercent', title: '占比' },
      //         ]
      //       },
      //       {title:"携入",key:"unicomJoinNumber",dataIndex:"unicomJoinNumber"},
      //       {title:"净携入",children:[
      //           {key:"unicomNetJoinNumber",dataIndex:"unicomNetJoinNumber",title:"数量"},
      //           {key:"unicomNetJoinYestodayPercent",dataIndex:"unicomNetJoinYestodayPercent",title:"昨日环比"},
      //           {key:"unicomNetJoinTodayPercent",dataIndex:"unicomNetJoinTodayPercent",title:"本日环比"}
      //         ]},
      //     ]
      //   },
      //   {
      //     title:"中国电信",children:[
      //       {title:"携出",key:"telecomOutNumber",dataIndex:"telecomOutNumber"},
      //       {title:"携入",key:"telecomJoinNumber",dataIndex:"telecomJoinNumber"},
      //       {title:"净携入",children:[
      //           {key:"telecomNetJoinNumber",dataIndex:"telecomNetJoinNumber",title:"数量"},
      //           {key:"telecomNetJoinYestodayPercent",dataIndex:"telecomNetJoinYestodayPercent",title:"昨日环比"},
      //           {key:"telecomNetJoinTodayPercent",dataIndex:"telecomNetJoinTodayPercent",title:"本日环比"}
      //         ]}
      //     ]
      //   },
      //   {
      //     title:"中国移动",children:[
      //       {title:"携出",key:"mobileOutNumber",dataIndex:"mobileOutNumber"},
      //       {title:"携入",key:"mobileJoinNumber",dataIndex:"mobileJoinNumber"},
      //       {title:"净携入",children:[
      //           {key:"mobileNetJoinNumber",dataIndex:"mobileNetJoinNumber",title:"数量"},
      //           {key:"mobileNetJoinYestodayPercent",dataIndex:"mobileNetJoinYestodayPercent",title:"昨日环比"},
      //           {key:"mobileNetJoinTodayPercent",dataIndex:"mobileNetJoinTodayPercent",title:"本日环比"}
      //         ]}
      //     ]
      //   },
      //   {
      //     title:"携转总人数",children:[
      //       {key:"totalNumber",dataIndex:"totalNumber",title:"数量"},
      //       {key:"totalYestodayPercent",dataIndex:"totalYestodayPercent",title:"昨日环比"},
      //       {key:"totalTodayPercent",dataIndex:"totalTodayPercent",title:"本日环比"}
      //     ]
      //   }
      // ],
      refresh:"页面实时数据刷新频率:1小时/次",
      tBodyData: [],
      info:[
        "截止到xx月xx日xx点：",
        "1）对于非试验26省，联通净携入xx人次，电信净携入xx人次，移动净携入xx人次。",
        "2）全国31省，联通净携入xx人次，电信净携入xx人次，移动净携入xx人次。",
        "3）联通全国携出xx人次，携入xx人次；其中，非试验26省携出xx人次，携入xx人次，试验5省携出xx人次，携入xx人次。"
      ],
    }
  }

  componentDidMount() {
   //  this.initRequest();
  }
  
  // initRequest = () => {
  //   const { dispatch } = this.props;
  //   const { markType } = this.state;
  //   const params = {
  //     markType,
  //   };
  //   dispatch({
  //     type: `NumberToNetworkReportModel/fetchReportData`,
  //     payload: params,
  //     callback:(res)=>{
  //         this.setState({
  //           'info':res.info,
  //           'titleName':res.titleName,
  //           'tBodyData':res.tBodyData,
  //         })
  //     }
  //   });
  // };
  
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
  
  handleOpen = () =>{
    console.log("websocket open");
    const {token, userId} = Cookie.getCookie('loginStatus');
    const parames = {
      token,
      userId,
      markType:"XHZW_RT_DAILY_D",
    };
    this.sendMessage(JSON.stringify(parames))
  };
  
  handleClose = () =>{
    console.log("websocket close");
  };
  
  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 接收消息
   * @method handleData
   */
  // eslint-disable-next-line
  handleData(data) {
    const {tBodyData, info, titleName} = this.state;
    const result = JSON.parse(data);
    if(!isEqual(data.tBodyData,tBodyData) || !isEqual(data.info,info) || !isEqual(data.titleName,titleName)){
      this.setState({...result})
    }
  }

  render() {
    const {tBodyData,info,titleName,refresh}=this.state;
    const information=info.map((item)=>(<p>{item}</p>));
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
          <div className={styles.title}>
            {titleName}
            <div className={styles.details}>{refresh}</div>
          </div>
          <div className={styles.list}>
            {information}
          </div>
          <div className={styles.numberToNetworkReport}>
            <NumToNetworkTable tBodyData={tBodyData} info={info} />
          </div>
        </div>
        <Websocket
          url={APIURL_NETTOWORK_TABLE}
          onMessage={(data)=>this.handleData(data)}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          ref={socket => {
            this.refWebSocket = socket;
          }}
        />
      </PageHeaderWrapper>

    )
  }
}

export default NumberToNetworkReport;
