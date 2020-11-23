/**
 * @Description:  楼宇弹出层容器
 *
 * @author: 风信子
 *
 * @date: 2019/11/29
 */

import React, {PureComponent} from 'react';
import {connect} from "dva";
import {Radio} from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './homeMember.less';
import PopupTable from './table/popupTable';
import FontSizeEchart from '../ProductView/fontSizeEchart';
import mobile from "../../assets/image/homeQuery/mobile.png";
import unicom from "../../assets/image/homeQuery/unicom.png";
import telecom from "../../assets/image/homeQuery/telecom.png";
import users from "../../assets/image/homeQuery/users.png";
import percent from "../../assets/image/homeQuery/percent.png";

@connect(
  ({
     homeQueryModels,
   }) => ({
    homeQueryModels,
    RegionTableData:homeQueryModels.RegionTableData,
    secondDetail:homeQueryModels.secondDetail
  })
)
class HomeMember extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      clickTypeData:[
        {id:"fusionTrue",name:"本网融合成员"},
        {id:"fusionFalse",name:"本网非融合成员"},
        {id:"anotherNetWork",name:"异网成员"}
      ],
      selectRegion:"fusionTrue",
    }
  }

  componentDidMount() {
    const {condition} = this.props;
    if(!isEqual(condition,{})){
      this.setState({
        selectRegion:"fusionTrue"
      },()=>{
        this.requestTable();
        this.getUpDataList();
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {condition} = this.props;
    const that=this;
    if(!isEqual(condition,{}) && !isEqual(condition,prevProps.condition)){
      that.setState({
        selectRegion:"fusionTrue"
      },()=>{
        this.requestTable();
        this.getUpDataList();
      });
    }
  }
  
  // 获取上方数据
  getUpDataList(){
    const{condition,dispatch}=this.props;
    const params={
      ...condition,
      type:'peopleInfo',
    };
    dispatch({
      type: `homeQueryModels/getUserInfoDetailData`,
      payload: params,
    });
  }

  /**
   * @date: 2020/1/1
   * @author 风信子
   * @Description: 方法描述 请求表格
   * @method requestTable
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  requestTable(page="1"){
    const{selectRegion}=this.state;
    const{condition,dispatch}=this.props;
    const params={
      ...condition,
      type:selectRegion,
      "pageNum":"100",
      isPaging:"true",
      "num":page,
    };
    dispatch({
      type: `homeQueryModels/getRegionData`,
      payload: params,
    });
  }


  /**
   * @date: 2020/1/1
   * @author 风信子
   * @Description: 方法描述 选中的类型
   * @method selectRegionFun
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  selectRegionFun(selectRegion){
    this.setState({selectRegion},()=>{
      this.requestTable();
    })
  }

  render() {
    const {RegionTableData,secondDetail} = this.props;
    const {title,list} = secondDetail[0];
    const {clickTypeData,selectRegion} = this.state;
    const{titleSize}=FontSizeEchart();
    const regionDom = clickTypeData.map((item)=>(<Radio value={item.id}>{item.name}</Radio>));
    const listDom = list.map((item,index)=>(
      <div key={item.name} className={styles.item}>
        <div className={styles.itemImg}>
          {index===0&&<img src={users} alt="mobile" />}
          {index===1&&<img src={percent} alt="percent" />}
          {index===2&&<img src={telecom} alt="telecom" />}
          {index===3&&<img src={mobile} alt="mobile" />}
          {index===4&&<img src={unicom} alt="unicom" />}
        </div>
        <div>{item.name}：{item.value}</div>
      </div>
    ));
   //  console.log(RegionTableData);
    return (
      <div className={styles.homeQueryPopup}>
        <div className={styles.container}>
          <div className={styles.title} style={{fontSize:titleSize}}>
            {title}
          </div>
          <div className={styles.list}>
            {listDom}
          </div>
          <div className={styles.selectContainer}>
            <Radio.Group onChange={(e)=>this.selectRegionFun(e.target.value)} value={selectRegion}>
              {regionDom}
            </Radio.Group>
          </div>
          <div className={styles.tableContainer}>
            <PopupTable
              tableData={RegionTableData}
              pageSize={100} // 每页的个数
              isPaging
              callBackRequestTable={(page)=>this.requestTable(page)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default HomeMember;
