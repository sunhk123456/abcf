/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/7/26
 */
/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/7/23
 */
import React, { PureComponent,useState } from 'react';
import { Select,DatePicker,Form,Button,Spin,Icon,message,Row,Col } from 'antd';
import { connect } from 'dva/index';
import moment from "moment";
import ProCity from "../Until/proCity";
import TwoLayerSelector from './twoLayerSelector'
import styles from './specialConditions.less'

const { Option } = Select;
const {MonthPicker} = DatePicker;
const {Item} = Form;

@connect(({proCityModels,productViewModels}) =>({
  proCityModels,
}))

@Form.create()
class SpecialCondition extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      conditionList:[
        {"type":"date","ord":"1","name":"账期","id":"date",
          "value":{"hasNanBei":"0"}},
        {"type":"region","ord":"2","name":"地域","id":"region","value":{}},
        {"type":"singleSelect","ord":"3","name":"指标类型","id":"indexType",
          "value":{
            "hasChild":"0",
            "childId":"",
            "childName": "",
            "data":[{"id":"001","name":"本月累计","child":[]},
              {"id":"002","name":"累计环比","child":[]},
              {"id":"003","name":"累计同比","child":[]}
            ]
          }}  ,
        {
          "type": "singleSelect",
          "ord": "6",
          "name": "产品分类",
          "id": "productClass",
          "value": {
            "hasChild": "1",
            "childId": "product",
            "childName": "产品名称",
            "data": [
              {
                "id": "001",
                "name": "冰激凌",
                "child": [
                  {
                    "id": "1",
                    "name": "天津冰激凌"
                  },
                  {
                    "id": "2",
                    "name": "北京冰激凌"
                  }
                ]
              }
            ]
          }
        },
        {
          "type": "singleSelect",
          "ord": "5",
          "name": "渠道分类",
          "id": "channelClass",
          "value": {
            "hasChild": "1",
            "childId": "channel",
            "childName": "产品名称",
            "data": [
              {
                "id": "0001",
                "name": "渠道",
                "child": [
                  {
                    "id": "1",
                    "name": "集团渠道"
                  },
                  {
                    "id": "2",
                    "name": "客户渠道"
                  }
                ]
              }
            ]
          }
        },
        {"type":"singleSelect","ord":"6","name":"手机类型","id":"mobile",
          "value":{
            "hasChild":"0",
            "childId":"",
            "childName": "",
            "data":[{"id":"011","name":"华为","child":[]},
              {"id":"012","name":"小米","child":[]},
              {"id":"013","name":"oppo","child":[]}
            ]
          }}
      ],
      dateType:"1",
      date:"2019-07-22",
      conditionCount: 4 // 用于计算查询及下载的位置
    }
  }

  /**
   * 查询
   * @param e
   */
  handleSearch=e=>{
    e.preventDefault();
    const {date} = this.state;
    const {form,proCityModels:{selectPro,selectCity}} = this.props;
    form.validateFields((err,fieldsValue)=>{
      if(err) return;
      const values = {
        provId:selectPro.proId,
        cityId:selectCity.cityId,
        date
      }
      console.log(fieldsValue)

    })
  }


  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = currentDate => {
    const { maxDate } = this.state;
    return currentDate && currentDate > moment(maxDate);
  };

  /**
   * 下载
   */
  handleDownload=()=>{
    // console.log("specialConditions-back下载按钮被点击")
    const {callBackHandleDownload} = this.props;
    callBackHandleDownload();
  }

  /**
   * 二维筛选框第一层选择
   * @param value
   */
  selectFist=value=>{
    const selected=false;
    // const {selectorData }= this.props;
    // if(selectorData!==undefined&&selectorData.value.data.length!==0){
    //   let childList = [];
    //   for (let index of selectorData.value.data){
    //     if(index.id===value) {
    //       childList = index.child
    //       break;
    //     }
    //   }
    //   this.setState({
    //     childList,
    //     selected:false
    //   })
    // }
  }



  /**
   * 筛选条件Form表单
   */
  conditionForm=()=>{
    const {conditionList,dateType,date,conditionCount}= this.state;
    const {form}= this.props;
    let searchWidth = '25%';
    switch (conditionCount%4){
      case 0:
        searchWidth= "100%"
        break;
      case 1:
        searchWidth = "75%"
        break;
      case 2:
        searchWidth = "50%"
        break;
      default:
        searchWidth = "25%"
    };
    let formList = [];
    if(conditionList.length!==0){
      const size=window.screen.width>1869?"large":"default";
      // const antIcon = <Icon spin type="loading" style={{color:"#D34141"}} />;
      conditionList.map(item =>{
          if(item.type==="date"){
            const triangle = <i className={styles.dateTriangle} />
            const dateComponent=  dateType==='1'?<DatePicker allowClear={false} showToday={false} value={moment(date, 'YYYY-MM-DD')} disabledDate={this.disabledDate} onChange={this.handleChangeDate}  />
              :<MonthPicker value={moment(date, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate} onChange={this.handleChangeDate} />;
            formList.push(
              <div key={item.id} className={styles.normalList}>
                <div className={styles.dateTitle}>{item.name}:</div>
                {dateComponent}
              </div>
            )
          }else if(item.type==="region"){
            formList.push(
              <div key={item.id} className={styles.proList}>
                <ProCity markType="productView" />
              </div>
            )
          }else if(item.type==="singleSelect"){
            if(item.value.hasChild==="0"){
              const optionList = [];
              const optionData = item.value.data;
              if(optionData.length!==0){
                optionData.forEach(selectItem=>{
                  optionList.push(<Option key={selectItem.id}>{selectItem.name}</Option>)
                })
              }
              formList.push(
                <div className={styles.normalList} key={item.id}>
                  <Form.Item label={item.name}>
                    {form.getFieldDecorator(item.id)(
                      <Select
                        showSearch
                        size={size}
                        placeholder="请选择"
                        style={{width:'100%'}}
                        suffixIcon={<Icon type="caret-down" />}
                      >
                        {optionList}
                      </Select>
                    )}
                  </Form.Item>
                </div>
              )
            } else if(item.value.hasChild==="1"){
              formList.push(
                <MakeTwolayerSelector target={item} formItem={form} />
              )
            }
          }else if(item.type==="moreSelect"){
            if(item.value.hasChild==="0"){
              const optionList = [];
              const optionData = item.value.data;
              if(optionData.length!==0){
                optionData.forEach(selectItem=>{
                  optionList.push(<Option key={selectItem.id}>{selectItem.name}</Option>)
                })
              }
              formList.push(
                <div className={styles.normalList} key={item.id}>
                  <Form.Item label={item.name}>
                    {form.getFieldDecorator(item.id)(
                      <Select
                        mode="multiple"
                        showSearch
                        size={size}
                        placeholder="请选择"
                        style={{width:'100%'}}
                        suffixIcon={<Icon type="caret-down" />}
                      >
                        {optionList}
                      </Select>
                    )}
                  </Form.Item>
                </div>
              )
            } else if(item.value.hasChild==="1"){
              formList.push(
                <MakeTwolayerSelector target={item} formItem={form} />
              )
            }
          }
        }
      )

      return(
        <Form onSubmit={this.handleSearch} layout="inline">
          <div className={styles.conditionList}>
            {formList}
            <div style={{paddingRight:"3%",textAlign:"right",width:searchWidth}}>
              <span className={styles.submitButton}>
                <Button size={window.screen.width>1869?"large":window.screen.width>1100?"default":"small"} htmlType="submit">
                  查询
                </Button>
                <Button size={window.screen.width>1869?"large":window.screen.width>1100?"default":"small"} onClick={this.handleDownload}>
                  <Icon type="download" /> 下载
                </Button>
              </span>
            </div>
          </div>
        </Form>
      )
    }
  }
  render(){
    return (
      <div className={styles.specialConditons}>
        {this.conditionForm()}
      </div>
    )
  }
}

export default SpecialCondition

function MakeTwolayerSelector(item){
  console.log(item);
  const form= item.formItem;
  const selectorData= item.target
  const size =window.screen.width>1869?"large":"default";
  const optionList = [];
  const optionData = selectorData.value.data;
  const [selected,fistChange]=useState(true);
  const [childList,changeSelector]=useState([]);
  const childList2=[
    {
      "id": "1",
      "name": "天津冰激凌"
    },
    {
      "id": "2",
      "name": "北京冰激凌"
    }
  ];
  if(optionData.length!==0){
    optionData.forEach(selectItem=>{
      optionList.push(<Option key={selectItem.id}>{selectItem.name}</Option>)
    })
  }
  const secOption=[];
  if(childList.length!==0){
    childList.forEach(secItem=>{
      secOption.push(<Option key={secItem.id}>{secItem.name}</Option>)
    })
  }
  function selectorData(value) {
    if(selectorData!==undefined&&selectorData.value.data.length!==0){
      for (let index of selectorData.value.data){
        if(index.id===value) {
          childList = index.child
          break;
        }
      }
      return childList
    }
  }


  return(
    <div className={styles.normalList} key={selectorData.id}>
      <Form.Item label={selectorData.name}>
        {form.getFieldDecorator(selectorData.id)(
          <Select
            onChange={(value)=>{fistChange(false);changeSelector}}
            showSearch
            size={size}
            placeholder="请选择"
            style={{width:'100%'}}
            suffixIcon={<Icon type="caret-down" />}
          >
            {optionList}
          </Select>
        )}
      </Form.Item>
      <Form.Item label={selectorData.value.childName}>
        {form.getFieldDecorator(selectorData.value.childId)(
          <Select
            // onChange={this.selectSec}
            disabled={selected}
            showSearch
            size={size}
            placeholder="请选择"
            style={{width:'100%'}}
            suffixIcon={<Icon type="caret-down" />}
          >
            {secOption}
          </Select>
        )}
      </Form.Item>
    </div>
  )
}
