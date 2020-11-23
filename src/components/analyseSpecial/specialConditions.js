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
/* eslint-disable */
import React, { PureComponent } from 'react';
import { Select,DatePicker,Form,Button,Input,Icon,message,Row,Col } from 'antd';
import { connect } from 'dva/index';
import moment from "moment";
import ProCity from "../Until/proCity";
import SingleRegion from "../Until/singleRegion";
import TwoLayerSelector from './twoLayerSelector'
import styles from './specialConditions.less'

const { Option } = Select;
const {MonthPicker} = DatePicker;

@connect(({proCityModels,analyseSpecialModel,singleRegionModel,IndexConfigModels}) =>({
  proCityModels,
  analyseSpecialModel,
  singleRegionModel,
  saveIndexConfig:IndexConfigModels.saveIndexConfig, // 选中指标数据
}))

@Form.create()
class SpecialCondition extends PureComponent{
  constructor(props){
    super(props);
    this.state={

    }
  }

  componentDidUpdate(prevProps) {
    const {form,markType} = this.props;
    if(prevProps.markType !== markType){
      // 重置筛选条件的默认值
      form.resetFields();
    }
  }

  componentWillUnmount(){
    const {dispatch}=this.props;
    dispatch({
      payload:{},
      type:"analyseSpecialModel/clearCondition",
    });
  }

  /**
   * 查询
   * @param e
   */
  handleSearch=e=>{
    e.preventDefault();
    const {form,proCityModels:{selectPro,selectCity},singleRegionModel,dispatch,analyseSpecialModel:{conditionName,date},saveIndexConfig ,callBackQuery} = this.props;
    const { selectData } = singleRegionModel;
    const modelConditions=conditionName; // 获取筛选条件模板
    const conditionNameList=[]; // 初始化下载所用筛选条件
    const values=[]; // 点击查询展示选中的
    form.validateFields((err,fieldsValue)=>{
      // if(err) return; //
      if(modelConditions.length!==0){
        modelConditions.forEach(item=>{
          // 日期组件
          if(item.type==="date"){
            const valueList={};
            valueList[item.id]=[date];
            values.push(valueList);
            item.value=[date];
            conditionNameList.push(item);
          }else if(item.type==="provId"){
            // 地域组件
            let valueList={};
            valueList[item.id]=[selectPro.proId];
            values.push(valueList);
            item.value=[selectPro.proName];
            conditionNameList.push(item);
          }else if(item.type==="cityId"){
            let valueList={};
            valueList[item.id]=[selectCity.cityId];
            values.push(valueList);
            item.value=[selectCity.cityName];
            conditionNameList.push(item);
          }else if(item.type==="singleRegion"){
            values.push({[item.id]:[selectData.id]});
            conditionNameList.push({...item,value:[selectData.name]});
          }else if(item.type==="singleProvince"){
            values.push({[item.id]:[selectPro.proId]});
            conditionNameList.push({...item,value:[selectPro.proName]});
          }else if(item.type==="input"){
            let valueList={};
            // 输入框组件
            if(fieldsValue[item.id]){
              valueList[item.id]=[fieldsValue[item.id]];
              item.value=[fieldsValue[item.id]]
            }else {
              valueList[item.id]=[];
              item.value=[]
            }
            values.push(valueList);
            conditionNameList.push(item);
          }else if(item.type==='singleSelect'){
            // 单级单选框
            let valueList = {};
            if(fieldsValue[item.id]){
              valueList[item.id]=[fieldsValue[item.id]];
              item.value=[];
              item.list.map(selector=>{
                if(fieldsValue[item.id].includes(selector.id)){
                  item.value.push(selector.name)
                }
              })
            }else {
              valueList[item.id]=[];
              item.value=[];
            }
            values.push(valueList);
            conditionNameList.push(item);
          }else if(item.type==='moreSelect'){
            // 单级多选框
            let valueList = {};
            if(fieldsValue[item.id]){
              valueList[item.id]=fieldsValue[item.id];
              item.value=[];
              item.list.map(selector=>{
                if(fieldsValue[item.id].includes(selector.id)){
                  item.value.push(selector.name)
                }
              })
            }else {
              valueList[item.id]=[];
              item.value=[];
            }
            values.push(valueList);
            conditionNameList.push(item);
          }else if(item.type==="parent"){
            // 二级单选框 // 多选框二级下拉框此功能目前没开发，一下代码是单选框联动的例子。
            let valueList1={};
            let valueList2={};
            if(fieldsValue[item.id]){
              valueList1[item.id]=[fieldsValue[item.id]];
              valueList2[item.childId]=[fieldsValue[item.childId]];
              for (let options of item.list){
                if(options.id===fieldsValue[item.id]){
                  item.value=[options.name];
                  const childList=[];
                  options.child.map(children=>{
                    if(fieldsValue[item.childId].includes(children.id)){
                      childList.push(children.name)
                    }
                  });
                  conditionNameList.push({"key": item.childName,"value":childList,"id":item.childId,"type":"child"});
                  break;
                }
              }
            }else {
              valueList1[item.id]=[];
              valueList2[item.childId]=[];
              item.value=[];
              conditionNameList.push({"key": item.childName,"value":[],"id":item.childId,"type":"child"})
            }
            conditionNameList.push(item);
            values.push(valueList1);
            values.push(valueList2);
          }else if(item.type==="indexConfig"){
            const indexId = [];
            const indexName = [];
            saveIndexConfig.forEach((itemIndex)=>{
              indexId.push(itemIndex.indexId);
              indexName.push(itemIndex.indexName);
            });
            values.push({[item.id]:indexId});
            conditionNameList.push({...item,value:indexName})
          }else if(item.type === "other" || item.type === "area"){
            values.push({[item.id]:item.value});
          }
        })
      }
    });
    dispatch({
      type: `analyseSpecialModel/getSearchCondition`,
      payload:{
        conditionNameList,
        values
      },
    });
    callBackQuery(values);
  };

  /**
   * 最大账期限制
   * @param currentDate
   * @returns {*|boolean}
   */
  disabledDate = (currentDate) => {
    const { analyseSpecialModel:{maxDate} } = this.props;
    return currentDate && currentDate > moment(maxDate);
  };

  /**
   * 下载
   */
  handleDownload=()=>{
    // console.log("specialConditions下载按钮被点击")
    const {callBackHandleDownload} = this.props;
    callBackHandleDownload();
  };

  /**
   * 选择账期
   */
  handleChangeDate=(date,dateString)=>{
    const {dispatch}=this.props;
    dispatch({
      type:"analyseSpecialModel/fetchDate",
      payload:dateString
    })
  };

  /**
   * @date: 2020/4/24
   * @author 风信子
   * @Description: 方法说明 处理多选中的全部问题  全部的时候取消其他选中 点击其他的时候取消全部选中
   * @method 方法名 moreSelectOnChange
   * @param {string} 参数名 id 参数说明 fieldNames
   * @param {array} 参数名 value 参数说明 选中的数据
   */
  moreSelectOnChange=(id,rule, value, callback)=>{
    const {setFieldsValue} = this.props.form;
    if(value.length > 0 && value.indexOf("-1") === value.length-1){
      setFieldsValue({
        [id]: ["-1"]
      });
      callback();
    }else {
      setFieldsValue({
        [id]: value.filter(item => item !== "-1")
      });
      callback();
    }
  };

  /**
   * 筛选条件Form表单
   */
  conditionForm=()=>{
    const {form,analyseSpecialModel,markType,hasNanBei,dateType}=this.props;
    const {conditionList,conditionCount,date}=analyseSpecialModel;
    let searchWidth = '25%';
    switch (conditionCount%4){
      case 0:
        searchWidth= "100%";
            break;
      case 1:
        searchWidth = "75%";
            break;
      case 2:
        searchWidth = "50%";
            break;
      default:
        searchWidth = "25%"
    }
    let formList = [];
    if(conditionList.length!==0){
      const size=window.screen.width>1869?"large":"default";
      const marginBottom=window.screen.width>1389?"0.5%":8;
      // const antIcon = <Icon spin type="loading" style={{color:"#D34141"}} />;
      conditionList.map(item =>{
        if(item.type==="date"){
          const dateComponent= dateType==='1'?<DatePicker allowClear={false} showToday={false} value={moment(date, 'YYYY-MM-DD')} disabledDate={this.disabledDate} onChange={this.handleChangeDate}  />
          :<MonthPicker value={moment(date, 'YYYY-MM')} allowClear={false} disabledDate={this.disabledDate} onChange={this.handleChangeDate} />;
          formList.push(
            <div key={item.id} className={styles.normalList}>
              <div className={styles.dateTitle}>{item.name}</div>
              {dateComponent}
            </div>
          )
        }else if(item.type==="region"){
          formList.push(
            <div key={item.id} className={styles.proList}>
              <ProCity customInterface={item.type} markType={markType} hasNanBei={hasNanBei} />
            </div>
          )
        }else if(item.type==="singleProvince"){
          formList.push(
            <div key={item.id} className={styles.singleRegion}>
              <ProCity customInterface={item.type} markType={markType} hasCity={false}/>
            </div>
          )
        }else if(item.type==="singleRegion"){
          formList.push(
            <div key={item.id} className={styles.singleRegion}>
              <SingleRegion dateType={dateType} markType={markType} titleName={item.name} />
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
              <TwoLayerSelector selectorData={item} form={form} />
            )
          }
        }else if(item.type==="moreSelect"){
          if(item.value.hasChild==="0"){
            const optionList = [];
            const optionData = item.value.data;
            if(optionData.length!==0){
              optionData.forEach(selectItem=>{
                optionList.push(<Option key={selectItem.id} value={selectItem.id}>{selectItem.name}</Option>)
              })
            }
            formList.push(
              <div className={styles.normalList} key={item.id}>
                <Form.Item label={item.name}>
                  {form.getFieldDecorator(item.id,{
                    initialValue:[],
                    rules:[{
                      validator : (rule, value, callback)=>this.moreSelectOnChange(item.id,rule, value, callback)
                    }],
                    validateTrigger : 'onChange',
                    })(
                    <Select
                      // labelInValue
                      mode="multiple"
                      maxTagCount={1}
                      maxTagTextLength={2}
                      style={{width:'100%',top:"3px"}}
                      className={styles.moreSelect}
                      showSearch
                      showArrow
                      size={size}
                      // onChange={(value)=>this.moreSelectOnChange(item.id,value)}
                      placeholder="请选择"
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
              <TwoLayerSelector selectorData={item} form={form} />
            )
          }
        }else if(item.type==="input"){
          formList.push(
            <div className={styles.normalList} key={item.id} style={{display:"block",marginBottom:marginBottom}}>
              <Form.Item label={item.name}>
                {form.getFieldDecorator(item.id)(<Input size={size} placeholder="请输入" />)}
              </Form.Item>
            </div>
          )
        }
        }
      );

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
  };

  render(){
    return (
      <div className={styles.specialConditons}>
        {this.conditionForm()}
      </div>
    )
  }
}

export default SpecialCondition
