import React,{PureComponent,Fragment} from 'react';
import { Input, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import noMessage from '../../assets/image/terminalQuery/u2299.png';
import echartFontSize from '../../components/ProductView/fontSizeEchart';
import styles from './index.less';
import BuildingTop10 from '../../components/building/buildingTop10'; // 互联网行为top10组件
import CutPie from '../../components/BuildingView/cutPie'; // 消费构成饼图组件
import HomeMember from '../../components/homeQuery/homeMember'; // 家庭成员详情
import QueryPopup from '../../components/homeQuery/queryPopup'; // 查询弹窗
import DetailedInfo from '@/components/homeQuery/detailedInfo'; // 家庭基本信息
import TypeComparison from '../../components/terminalQuery/TypeComparison'; // 网络质量小人图
import PhoneEchart from '../../components/homeQuery/stackBar/phoneEchart'; // 语音特征柱状图组件
import CatPie from '../../components/homeQuery/catPie'; // 智能终端饼图
import PopupTable from '../../components/homeQuery/table/popupTable'; // 家庭产品信息表格
import DoubleList from "../../components/homeQuery/doubleList"; // 家庭星级和营销机会组件
import CollectComponent from '../../components/myCollection/collectComponent'

@connect((
  {homeQueryModels}
)=>(
  {
    homeQueryModels,
    specialName:homeQueryModels.specialName, // 专题名称
    markType:homeQueryModels.markType, // 专题id
    dateType:homeQueryModels.dateType, // 日月标识
    detailData:homeQueryModels.detailData, // 家庭基本信息数据
    stackBar:homeQueryModels.stackBar, // 请求语音特征堆叠柱状图数据
    treeMap:homeQueryModels.treeMap, // 请求智能终端树图数据
    queryData:homeQueryModels.queryData, // 查询按钮查询到家庭id表格对象
    top10:homeQueryModels.top10, // top10互联网数据
    networkQuality:homeQueryModels.networkQuality, // 请求网络质量数据
    cutPieData:homeQueryModels.cutPieData, // 消费构成饼图数据
    homeProductTableData:homeQueryModels.homeProductTableData, // 家庭产品信息表格数据
    doubleListData: homeQueryModels.doubleListData, // 家庭星级和营销机会
    isShowTopAndPie:homeQueryModels.isShowTopAndPie, // 判断top10与家庭终端是否显示
  }
))
class HomeQuery extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      condition:{}, // copy的筛选条件
      accountNum:"", // 终端账号
      telNum:"" ,// 手机号
      queryShowPopup:false, // 查询弹出层
      centerData:['50%','40%'], // 饼图圆心位置
      queryDataType:"", // 查询结果类型 empty:未查到信息 one:只有一条数据 many:多条数据error:查询数据异常
    };
  }

  componentDidMount() {
    // 组件卸载时回复默认
    const {dispatch}=this.props;
    dispatch({
      type: `homeQueryModels/setSearchData`,
      payload: {
        tbodyData:[],
        thData:[],
        type:"",
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

  // 设置终端账号
  setImei=(e)=>{
    const {value}=e.currentTarget;
    this.setState({
      accountNum:value
    })
  };

  // 设置成员号码
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
    const {telNum,accountNum}=this.state;
    const {dispatch,markType,dateType} = this.props;
    // 判断手机号和宽带号是否存在
    if(!telNum && !accountNum){
      message.error('手机号和宽带账号不能全部为空！');
      return null
    }
    // 判断手机号位数必须为11或者12位
    if(telNum!==""&&telNum.length>12&&telNum.length<11){
      message.error('手机号位数不对！');
      return null
    }
    const params = {
      markType,
      dateType,
      date:"",
      tel:telNum,
      account:accountNum
    };
    // 请求查询接口
    dispatch({
      type: `homeQueryModels/getSearchData`,
      payload: params,
      callback:(res)=>{
        // 查询到一个家庭时直接请求init数据
        if(res.type === "one"){
          this.initEchart(res.tbodyData[0].condition,res.type);
        // 查询到多个家庭时显示弹出层，选择一个家庭后再请求init数据
        // 查询数据有异常显示弹出层，告知错误信息
        }else if(res.type === "many" || res.type === "error"){
          this.queryPopupShow(true);
        } else {
          this.setState({
            queryDataType:res.type,
          });
        }
      }
    });
    return null
  };

  // init数据 请求页面上的所有图表
  initEchart=(params,type)=>{
    const{markType,dateType}=this.props;
    const condition={
      markType,
      dateType,
      ...params
    };
    // 保存一份查询参数到state中，弹出层和表格组件需要使用
    this.setState({
      condition,
      queryDataType:type
    });
    // 请求家庭基本信息 ，家庭星级 ， 营销机会 接口
    this.getUserInfoDataList(condition);
    // 请求语音特征柱状图
    this.getStackBarData(condition);
    // 请求互联网行为top10 和 智能终端饼图两个echarts图数据
    this.getTop10EchartData(condition);
    // 请求消费构成饼图
    this.getPieEchartsData(condition);
    // 请求网络质量小人图数据
    this.getNetworkQualityData(condition);
    // 请求家庭产品信息表格
    this.getHomeProductTableData(condition);
 
  };

  // 请求家庭产品信息表格
  getHomeProductTableData=(condition,page="1")=>{
    const {dispatch}=this.props;
    const params={
      type:"homeProduct",
      isPaging:"true",
      pageNum:"100",
      num:page,
      ...condition,
    };
    dispatch({
      type: `homeQueryModels/getHomeProductTableData`,
      payload: params,
    });
  };

  // 请求家庭基本信息或家庭成员接口
  getUserInfoDataList=(condition)=>{
    const {dispatch}=this.props;
    const params={
      type:'userInfo',
      ...condition,
    };
    dispatch({
      type: `homeQueryModels/getUserInfoListData`,
      payload: params,
    });

  };

  // 请求语音特征堆叠柱状图数据
  getStackBarData=(condition)=>{
    const {dispatch}=this.props;
    const params={
      ...condition,
    };
    dispatch({
      type: `homeQueryModels/getStackBarData`,
      payload: params,
    });
  };
  
  // 请求互联网行为top10数据和智能终端树图数据
  getTop10EchartData=(condition)=>{
    const {dispatch}=this.props;
    const params={
      ...condition,
    };
    dispatch({
      type: `homeQueryModels/getTop10EchartData`,
      payload: params,
    });
  };

  // 请求网络质量小人图数据
  getNetworkQualityData=(condition)=>{
    const {dispatch}=this.props;
    const params={
      ...condition,
    };
    dispatch({
      type: `homeQueryModels/getNetworkQualityData`,
      payload: params,
    });
  };

  // 请求家庭信息饼图
  getPieEchartsData=(condition)=>{
    const {dispatch}=this.props;
    const params={
      ...condition,
    };
    dispatch({
      type: `homeQueryModels/getPieEchartsData`,
      payload: params,
    });
  };
  
  /**
   * @date: 2020/1/2
   * @author 风信子
   * @Description: 方法描述 查询的弹出层
   * @method queryPopupShow
   * @param {type} 参数： 参数描述：string
   * @return {any} 返回值说明
  */
  queryPopupShow(type){
    this.setState({queryShowPopup:type})
  }


  render() {
    const myFontSize=echartFontSize();
    const {accountNum,telNum,queryShowPopup,centerData,condition,queryDataType}=this.state;
    const {
      detailData,
      queryData,
      stackBar,
      treeMap,
      top10,
      specialName,
      networkQuality,
      cutPieData,
      homeProductTableData,
      doubleListData,
      isShowTopAndPie,
      markType
    }=this.props;
    // 最后一行只展示互联网行为yop10图dom
    const topTenDom=(
      <div className={styles.twoEchartItem} style={{flexBasis: "100%"}}>
        <BuildingTop10
          download={false}
          chartData={top10}
          echartId="HomeQueryTopTenEchart"
        />
      </div>
    );
    // 最后一行只展示智能终端饼图dom
    const homeProductInfoDom=(
      <div className={styles.twoEchartItem} style={{flexBasis: "100%"}}>
        <CatPie
          chartData={treeMap}
          colors={[
            '#5CD5E3',
            '#DC69AB',
            '#61ADDD',
            '#DE9462',
            '#91C7AE',
            '#919BC6',
            '#C391C6',
            '#DC6868',
            '#B6DC6B',
            '#D0C862']}
        />
      </div>
    );
    // 最后一行互联网行为和智能终端饼图都展示dom
    const allDom=(
      <Fragment>
        <div className={styles.twoEchartItem}>
          <BuildingTop10
            download={false}
            chartData={top10}
            echartId="HomeQueryTopTenEchart"
          />
        </div>
        <div className={styles.twoEchartItem}>
          <CatPie
            chartData={treeMap}
            colors={[
              '#5CD5E3',
              '#DC69AB',
              '#61ADDD',
              '#DE9462',
              '#91C7AE',
              '#919BC6',
              '#C391C6',
              '#DC6868',
              '#B6DC6B',
              '#D0C862']}
          />
        </div>
      </Fragment>
    );
    const collectStyle ={
      marginLeft:'1%'
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
          <div className={styles.titleName}>
            {specialName}
            <CollectComponent key={markType} markType={markType} searchType='2' imgStyle={collectStyle} />
          </div>
          <div className={styles.header}>
            <div className={styles.left}>
              <div className={styles.item}>
                <div className={styles.itemName}>宽带账号：</div>
                <div className={styles.itemValue}><Input value={accountNum} onChange={(e)=>this.setImei(e)} type="text" /></div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemName}>成员号码：</div>
                <div className={styles.itemValue}><Input maxLength={12} value={telNum} onChange={(e)=>this.setTel(e)} type="tel" /></div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.query} onClick={this.query}>查询</div>
            </div>
          </div>
          {
            queryDataType === "empty" || queryDataType === "" || queryDataType === "error" ? (
              <div className={styles.imageBox}>
                <img src={noMessage} alt='' className={styles.imageStyle} />
                <p>{queryData && queryData.type === "empty"?'系统中没有您的相关信息，或您的输入有误，请您核对后重新输入!':'请输入您要查询的家庭信息！'}</p>
              </div>
            ) : (
              <div>
                <div className={styles.anotherEchart}>
                  {/* 家庭基本信息 */}
                  <div className={styles.homeInfo}>
                    <DetailedInfo check='0' detailData={detailData} />
                  </div>
                  {/* 家庭星级和营销机会 */}
                  <div className={styles.homeOther}>
                    <DoubleList doubleListData={doubleListData} />
                  </div>
                </div>
                {/* 家庭成员详情 */}
                <div className={styles.oneEchart} style={{ paddingBottom: "10px"}}>
                  <HomeMember condition={condition} callBackClose={()=>this.popupShow(false)} />
                </div>
                {/* 家庭产品信息表格 */}
                <div className={styles.oneEchart} style={{ paddingBottom: "10px"}}>
                  <div
                    className={styles.productInfo}
                    style={{
                      fontSize:myFontSize.titleSize,
                      fontWeight:myFontSize.titleWeight,
                      fontFamily:myFontSize.titleFamily,
                      color:myFontSize.titleColor,
                    }}
                  >
                    {homeProductTableData.title}
                  </div>
                  <div>
                    <PopupTable
                      tableData={homeProductTableData}
                      pageSize={100} // 每页的个数
                      isPaging
                      callBackRequestTable={(page)=>{this.getHomeProductTableData(condition,page)}} // 分页回调函数
                    />
                  </div>
                </div>
                {/* 语音特征俩柱状图 */}
                <div className={styles.oneEchart}>
                  <PhoneEchart
                    color={[
                     "#FA8D94",
                     "#5DB3E0",
                     "#DC69AB",
                     "#91C7AE",
                     "#DE9462",
                     "#909CC5",
                    ]}
                    echartId={["firstEchart","secondEchart"]}
                    specialName={specialName}
                    chartData={stackBar}
                  />
                </div>
                <div className={styles.twoEchart}>
                  {/* 消费构成饼图 */}
                  <div className={styles.twoEchartItem}>
                    <CutPie
                      totalList
                      cutPieData={cutPieData}
                      // colors={rosePieColors}
                      // downloadData={downloadData}
                      centerData={centerData}
                      markType={markType}
                      // hasPercent={false} // 显示是否带有百分比
                      hasPercent // 显示是否带有百分比
                      hasClockWise={false} // 是否顺时针布局
                      hasBorder
                      hasLegend
                      titlePosition="left"
                      echartId='homeQueryCutPie'
                    />
                  </div>
                  {/* 网络质量小人图 */}
                  <div className={styles.twoEchartItem}>
                    <TypeComparison
                      echartId="networkQuality"
                      name="网络质量"
                      color={["#5faddd","#ff7c9e"]}
                      dataList={networkQuality}
                    />
                  </div>
                </div>
                {/* 最后一行 互联网行为top10 和 智能终端饼图 */}
                <div className={styles.twoEchart}>
                  {isShowTopAndPie==="notShow"&&null}
                  {isShowTopAndPie==="top10"&&topTenDom}
                  {isShowTopAndPie==="pie"&&homeProductInfoDom}
                  {isShowTopAndPie==="all"&&allDom}
                </div>
              </div>
            )
          }
          {/* 点查询弹出层 */}
          {queryShowPopup &&
          <QueryPopup
            tableData={queryData}
            callBackCondition={(params,type)=>this.initEchart(params,type)}
            callBackClose={()=>this.queryPopupShow(false)}
          />
          }
        </div>
      </PageHeaderWrapper>
    );
  }
}

export  default  HomeQuery;


