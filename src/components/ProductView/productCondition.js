/* eslint-disable */
/**
 *
 * title: productOvewView
 *
 * description:  产品总览-筛选条件
 *
 * @author: guoshengxiang
 *
 * @date 2019/06/04
 *
 */
import React, { PureComponent } from 'react';
import { Input,Select,DatePicker,Form,Button,Spin,Icon,message,InputNumber  } from 'antd';
import { connect } from 'dva/index';
import moment from "moment";
import ProCity from "../Until/proCity";

import styles from './productCondition.less';

const { Option } = Select;
const { MonthPicker } = DatePicker;

@connect(({proCityModels,productViewModels}) =>({
  proCityModels,
  productViewModels
}))

@Form.create()
class ProductViewCondition extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      isExpand:false, // 是否展开更多筛选条件
      productClass:[], // 产品分类
      fetching:false, // 产品名称加载状态
      productNameData:[], // 产品名称list
    }
  };

  componentWillUnmount(){
    const {dispatch}=this.props;
    dispatch({
      type:"productViewModels/clearCondition",
    })
  }

  /**
   * 下载
   */
  handleDownload=()=>{
    const {callBackHandleDownload} = this.props;
    callBackHandleDownload();
  };

  /**
   * 展开或收起筛选条件
   */
  handleToggleForm=()=>{
    const {isExpand}=this.state;
    this.setState({
      isExpand:!isExpand
    });
  };

  /**
   * 查询
   * @param e
   */
  handleSearch=e=>{
    e.preventDefault();
    const {productNameData}=this.state;
    const {form,proCityModels:{selectPro, selectCity},dispatch,productViewModels:{date,conditionList,selectList},callBackHandleSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values={
        provId:selectPro.proId,
        cityId:selectCity.cityId,
        date
      };
      let productNameId="";
      for ( const key in fieldsValue){
        if(key==="productId"||key==="productName"){
          values[key]=fieldsValue[key]?fieldsValue[key]:""
        }else if(fieldsValue[key]){
          values[key]=[`${fieldsValue[key]}`]
        }else {
          values[key]=[]
        }
      }
      const conditionName={
        "账期": date,
        "省分": selectPro.proName,
        "地市": selectCity.cityName
      };
      for(const key in values){

        selectList.map(item=>{
          if(key===item.screenTypeId){
            conditionName[item.screenTypeName]=[];
            item.values.map(eve=>{
              if(values[key].includes(eve.sid)){
                conditionName[item.screenTypeName].push(eve.sname);
              }
            })
          }
        });

        conditionList.map(item=>{
          if(key===item.screenTypeId){
            if(item.type==="input"||item.type==="fetch"||item.type==="inputNumber"){
              conditionName[item.screenTypeName]=values[key]
            }
          }
        });

        if(key==="productName"){
          productNameData.map(item=>{
            if(item.sid===values[key]){
              productNameId=item.sid;
              values[key]=item.sname;
              conditionName["产品名称"]=item.sname;
            }
          })
        }
      }
      dispatch({
        type:"productViewModels/fetchVerification",
        payload:{
         params:{
           markType:"productView",
           ...values
         },
          conditionName,
          productNameId,
        },
        callback:res=>{
          if(res.code==="success"){
            callBackHandleSearch(); // 查询回调
          }else if(res.code==="failure"){
            message.error(res.message,2)
          }
        }
      })
    })
  };

  /**
   * 产品名称请求
   * @param value 用户输入的值
   */
  fetchProductName=(value)=>{
    this.setState({
      fetching:true,
    });
    const {dispatch,proCityModels:{selectPro, selectCity}}=this.props;
    dispatch({
      type:"productViewModels/fetchProductNameHint",
      payload:{
        productClass:this.state.productClass,
        value,
        provId:selectPro.proId,
        cityId:selectCity.cityId,
      },
      callback:e=>{
        this.setState({
          fetching:false,
          productNameData:e
        })
      }
    })
  };

  changeConditionDate=(date, dateString)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"productViewModels/fetchDate",
      payload:dateString
    })
  };

  /**
   * 筛选条件渲染
   * @returns {XML}
   */
  renderForm=()=>{
    const {form,productViewModels:{conditionList,selectList,maxDate,date} } = this.props;
    const {isExpand,fetching,productNameData}=this.state;
    let formList=[];
    const size=window.screen.width>1869?"large":"default";
    const marginBottom=window.screen.width>1389?"0.5%":8;
    const triangle = <i className={styles.dateTriangle} />;
    const antIcon = <Icon spin type="loading" style={{color:"#D34141"}} />;
    let disabledDate;
    if(date !== ''){
      disabledDate=(current)=>current && current > moment(maxDate);
    }
    formList.push(
      <div key="date" className={styles.normalList} style={{marginTop:isExpand?"auto":0,marginBottom:isExpand?marginBottom:0}} >
        <div className={styles.dateTitle}>账期：</div>
        <MonthPicker
          size={size}
          showToday={false}
          value={moment(date || null,"YYYY-MM")}
          disabledDate={disabledDate}
          allowClear={false}
          format="YYYY-MM"
          onChange={this.changeConditionDate}
          suffixIcon={triangle}
        />
      </div>);
    formList.push(
      <div key="pro" className={styles.proList} style={{marginTop:"auto",marginBottom:isExpand?marginBottom:0}}>
        <ProCity markType="productView" customInterface="region" hasNanBei="0" />
      </div>);
    conditionList.map(item=>{
        if(item.type==="input"){
          formList.push(
            <div className={styles.normalList} key={item.screenTypeId} style={{display:isExpand?"block":"none",marginBottom:marginBottom}}>
              <Form.Item label={item.screenTypeName}>
                {form.getFieldDecorator(item.screenTypeId)(<Input size={size} placeholder="请输入" />)}
              </Form.Item>
            </div>
          )
        }else if(item.type==="inputNumber"){
        formList.push(
          <div className={styles.normalList} key={item.screenTypeId} style={{display:isExpand?"block":"none",marginBottom:marginBottom}}>
            <Form.Item label={item.screenTypeName}>
              {form.getFieldDecorator(item.screenTypeId)(<InputNumber size={size} placeholder="请输入" />)}
            </Form.Item>
          </div>
        )
      }else if(item.type==="fetch"){
          formList.push(
            <div className={item.screenTypeId !== "productName" ? styles.normalList : styles.productList} key={item.screenTypeId} style={{display:isExpand?"block":"none",marginBottom:marginBottom}}>
              <Form.Item label={item.screenTypeName}>
                {form.getFieldDecorator(item.screenTypeId)(
                  <Select
                    showSearch
                    size={size}
                    style={{ width: '100%' }}
                    placeholder="请输入"
                    notFoundContent={fetching ? <Spin indicator={antIcon} size="small" /> : null}
                    onSearch={this.fetchProductName}
                    filterOption={false}
                    showArrow={false}
                    dropdownClassName={styles.productViewSelectItme}
                  >
                    {productNameData.map(value=>{return (<Option key={value.sid}>{value.sname}</Option>)})}
                  </Select>)}
              </Form.Item>
            </div>
          )
        }else{
          const optionList=[];
          selectList.map(ev=>{
            if(ev.screenTypeId===item.screenTypeId){
              ev.values.map(value=>{optionList.push(<Option key={value.sid}>{value.sname}</Option>)})
            }
          });
          formList.push(
            <div className={styles.normalList} key={item.screenTypeId} style={{display:isExpand?"block":"none",marginBottom:marginBottom}}>
              <Form.Item label={item.screenTypeName}>
                {form.getFieldDecorator(item.screenTypeId)(
                  <Select
                    onChange={(value)=>{
                      if(item.screenTypeId==="productClass"){
                        form.setFieldsValue({productName:undefined});
                        this.setState({productClass:[value],productNameData:[]})
                      }}}
                    placeholder="请选择"
                    size={size}
                    dropdownClassName={styles.productViewSelectItme}
                    style={{ width: '100%' }}
                    suffixIcon={<Icon type="caret-down" />}
                  >
                    {optionList}
                  </Select>)}
              </Form.Item>
            </div>
          )
        }
      });
    return(
      <Form onSubmit={this.handleSearch} layout="inline">
        <div className={styles.conditionList}>
          {formList}
          {/* isExpand?styles.proList:styles.normalList */}
          <div className={styles.normalList} style={{paddingRight:window.screen.width>1300 ? (isExpand ? "3%" :"0") : "0",textAlign:"right"}}>
            <span className={styles.submitButton}>
              <span onClick={this.handleToggleForm}>
                {isExpand?"收起":"展开"} <Icon type={isExpand?"caret-up":"caret-down"} />
              </span>
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
  };

  render(){

    return (
      <div className={styles["productView-condition"]}>
        {this.renderForm()}
      </div>
    )
  }
}

export default ProductViewCondition;
