import React,{PureComponent} from 'react';
import { Input, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import TerminalQueryEchart from '../../components/terminalQuery/basisEchart'
import KnowProduct from '../../components/terminalQuery/KnowProduct';
// import TypeComparison from '../../components/terminalQuery/TypeComparison';
import TerminalTimerShaft from '../../components/terminalQuery/timerShaft';
import noMessage from '../../assets/image/terminalQuery/u2299.png'
import styles from './index.less';
import CollectComponent from '../../components/myCollection/collectComponent';



@connect((
  {terminalQueryModels}
  )=>(
  {
    terminalQueryModels,
    specialName:terminalQueryModels.specialName, // 专题名称
    markType:terminalQueryModels.markType, // 专题id
    dateType:terminalQueryModels.dateType, // 日月标识
    userInfo:terminalQueryModels.userInfo, // 秒懂产品
    userPathway:terminalQueryModels.userPathway, // 终端换机轨迹
    userContributions:terminalQueryModels.userContributions, // 当前用户月度贡献
    userServer:terminalQueryModels.userServer,// 当前用户业务使用情况
    markPrice:terminalQueryModels.markPrice,// 该型号成本价及市场价格对比
    sellNumber:terminalQueryModels.sellNumber,// 该型号库存量及销售量对比
  }
))
class TerminalQuery extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      imeiId:"", // IEMI终端号
      telNum:"" // 手机号
    };
  }

  componentDidMount() {
    // 组件卸载时回复默认
    const {dispatch}=this.props;
    dispatch({
      type: `terminalQueryModels/setUserInfoData`,
      payload: {
        "title":"秒懂产品",
        "list":[
          {"name":"终端名称","value":[""]},
          {"name":"后置摄像头","value":[""]},
          {"name":"前置摄像头","value":[""]},
          {"name":"是否支持AGPS","value":[""]},
          {"name":"品牌","value":[""]},
          {"name":"内存","value":[""]},
          {"name":"支持联通网络制式","value":[""]},
          {"name":"是否双卡","value":[""]},
          {"name":"CPU","value":[""]},
          {"name":"电池","value":[""]},
          {"name":"语音支持类型","value":[""]},
          {"name":"是否支持扩展卡","value":[""]},
          {"name":"操作系统","value":[""]},
          {"name":"屏幕尺寸","value":[""]},
          {"name":"是否支持GPS","value":[""]},
          {"name":"是否支持NFC","value":[""]}
        ]
      }
    });
    dispatch({
      type: `terminalQueryModels/setUserPathwayData`,
      payload: {
        "title":"终端换机轨迹",
        "list":[
          {"name":"","time":"2017-06-01"},
          {"name":"","time":"2018-07-22"},
          {"name":"","time":"2019-01-12"},
          {"name":"","time":"2019-07-10"},
          {"name":"","time":"2019-08-10"}
        ]
      }
    });
    dispatch({
      type: `terminalQueryModels/setUserContributionsData`,
      payload: {
        "title":"当前用户月度贡献",
        "subtitle":"近12个月该用户出账收入时间趋势",
        "chartX":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
        "chart":[
          {
            "name":"月度贡献",
            "value":["350","420","340","110","130","200","330","400","440","480","500","520"],
            "unit":"元",
            "type":"line"
          }
        ]
      }
    });
    dispatch({
      type: `terminalQueryModels/setUserServerData`,
      payload: {
        "title":"当前用户业务使用情况",
        "subtitle":"近12个月该用户流量时间趋势",
        "chartX":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
        "chart":[
          {
            "name":"流量业务使用",
            "value":["220","180","100","70","100","180","180","140","100","250","300","250"],
            "unit":"GB",
            "type":"line"
          }
        ]
      }
    });
  }

  // 验证input是否为数字和空字符串
  isNumber = (value) => {
    if(value===""){return true}
    const patrn = /^(-)?\d+(\.\d+)?$/;
    if(!patrn.exec(value)) {
      return false
    }
    return true
  };

  setImei=(e)=>{
    console.log("setimei");
    const {value}=e.currentTarget;
    this.setState({
      imeiId:value
    })
  };

  setTel=(e)=>{
    const {value}=e.currentTarget;
    if(!this.isNumber(value)){
      message.error('手机号必须为数字！')
    }else{
      this.setState({
        telNum:value
      })
    }
  };

  // 查询按钮被点击
  query=()=>{
    console.log("查询按钮被点击");
    const {telNum,imeiId}=this.state;
    if(telNum===""&& imeiId===""){
      message.error('请输入查询条件！');
      return null
    }
    if(telNum!==""&&telNum.length!==11){
      message.error('手机号必须为11位数字！');
      return null
    }
    this.getUserPathwayData();
    this.getUserContributionsData();
    this.getUserServerData();
    this.getKnowProduct();
    // this.getPrice();
    // this.getSellNum();
    return null
  };

  // 获取终端换机轨迹数据
  getUserPathwayData=()=>{
    const {imeiId,telNum}=this.state;
    const {dispatch,dateType,markType}=this.props;
    const params={
      "IMIE_ID":imeiId,
      "TEL_NUM":telNum,
      date:'',
      dateType,
      markType,
    };
    dispatch({
      type: `terminalQueryModels/getUserPathwayData`,
      payload: params,
    });
  };

  // 请求当前用户月度贡献数据
  getUserContributionsData=()=>{
    const {imeiId,telNum}=this.state;
    const {dispatch,dateType,markType}=this.props;
    const params={
      "IMIE_ID":imeiId,
      "TEL_NUM":telNum,
      date:'',
      dateType,
      markType,
      chartType:"userContributions",
    };
    dispatch({
      type: `terminalQueryModels/getUserContributionsData`,
      payload: params,
    });
  };

  // 请求当前用户业务使用情况数据
  getUserServerData=()=>{
    const {imeiId,telNum}=this.state;
    const {dispatch,dateType,markType}=this.props;
    const params={
      "IMIE_ID":imeiId,
      "TEL_NUM":telNum,
      date:'',
      dateType,
      markType,
      chartType:"userServer",
    };
    dispatch({
      type: `terminalQueryModels/getUserServerData`,
      payload: params,
    });
  };

  // 请求秒懂产品数据
  getKnowProduct = () => {
    const {imeiId,telNum}=this.state;
    const {dispatch,dateType,markType}=this.props;
    const params = {
      "IMIE_ID":imeiId,
      "TEL_NUM":telNum,
      date:'',
      dateType,
      markType,
    };
    dispatch({
      type: `terminalQueryModels/getUserInfoData`,
      payload: params,
    });
  };

  // 请求该型号成本价与市场价格对比
  getPrice = () => {
    const {imeiId,telNum}=this.state;
    const {dispatch,dateType,markType}=this.props;
    const params = {
      "IMIE_ID":imeiId,
      "TEL_NUM":telNum,
      date:'',
      dateType,
      markType,
      chartType:'markPrice'
    };
    dispatch({
      type: `terminalQueryModels/getMarkPriceData`,
      payload: params,
    });
  };

   // 请求该型号库存量及销售量对比数据
   getSellNum = () => {
     const {imeiId,telNum}=this.state;
    const {dispatch,dateType,markType}=this.props;
    const params = {
      "IMIE_ID":imeiId,
      "TEL_NUM":telNum,
      date:'',
      dateType,
      markType,
      chartType:'sellNumber'
    };
    dispatch({
      type: `terminalQueryModels/getSellNumberData`,
      payload: params,
    });
  };

  render() {
    const {imeiId,telNum}=this.state;
    const {
      userInfo, // 秒懂产品
      userPathway, // 终端换机轨迹
      userContributions, // 当前用户月度贡献
      userServer, // 当前用户业务使用情况
      // markPrice, // 该型号成本价及市场价格对比
      // sellNumber, // 该型号库存量及销售量对比
      specialName,
	  markType
    }=this.props;
	const collectStyle ={
      marginLeft:'1%',
      marginBottom:'10px',
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
		  <span>
		    <span className={styles.titleName}>{specialName}</span>
		    <CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
		  </span>
          <div className={styles.header}>
            <div className={styles.left}>
              <div className={styles.item}>
                <div className={styles.itemName}>IMEI查询：</div>
                <div className={styles.itemValue}><Input value={imeiId} onChange={(e)=>this.setImei(e)} type="text" /></div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemName}>手机号：</div>
                <div className={styles.itemValue}><Input maxlength={11} value={telNum} onChange={(e)=>this.setTel(e)} type="tel" /></div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.query} onClick={this.query}>查询</div>
            </div>
          </div>
          {
            !userInfo || userInfo.list.length === 0 ? (
              <div className={styles.imageBox}>
                <img src={noMessage} alt='' className={styles.imageStyle} />
                <p>抱歉!该账号没有匹配信息!</p>
              </div>
            ) : (
              <div>
                <div className={styles.product}>
                  <KnowProduct
                    dataList={userInfo}
                  />
                </div>
                <div className={styles.userPathway}>
                  <TerminalTimerShaft
                    isUse
                    {...userPathway}
                  />
                </div>
                <div className={styles.lineEchart}>
                  <div className={styles.lineEchartItem}>
                    <TerminalQueryEchart
                      color={["#FF719E"]}
                      chartData={userContributions}
                      isUse
                    />
                  </div>
                  <div className={styles.lineEchartItem}>
                    <TerminalQueryEchart
                      color={["#2DA9FA","#C91717"]}
                      chartData={userServer}
                      isUse
                    />
                  </div>
                </div>
                {/* <div className={styles.comparison}> */}
                {/* <div className={styles.comparisonItem}> */}
                {/* <TypeComparison name='price' dataList={markPrice} isUse color={['#E9A23E', '#0BAE97']} /> */}
                {/* </div> */}
                {/* <div className={styles.comparisonItem}> */}
                {/* <TypeComparison name='sellNum' dataList={sellNumber} isUse color={['#E9A23E', '#0BAE97']} /> */}
                {/* </div> */}
                {/* </div> */}
              </div>)
          }
        </div>
      </PageHeaderWrapper>
    );
  }
}

export  default  TerminalQuery;


