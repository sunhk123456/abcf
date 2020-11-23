/*
*   添加警告弹出层组件
*   2019-11-27
*   xingxiaodong
* */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import { Col, Form, Icon, Input, message, Row,Select  } from 'antd';
import {APIURL_WARNING_NUMBER} from '@/services/webSocketUrl';
import Websocket from 'react-websocket';
import Cookie from '@/utils/cookie';
import styles from './addWarning.less';
import ProCity from '../Until/proCity';


const { Option } = Select;

@connect(
  (
    {
      warningModels,
      proCityModels,
    }
  )=>(
    {
      warningModels,
      proCityModels,
      selectPro:proCityModels.selectPro2,
      selectCity:proCityModels.selectCity2,
      popData:warningModels.addWarning,
      warnId:warningModels.warnId, // 编辑预警的id
      dateType:warningModels.dateType,// 日月标识
      markType:warningModels.markType,// 专题id
      indexId:warningModels.indexId,// 指标Id
      provId:warningModels.provId,
      cityId:warningModels.cityId,
      IsSubKpi:warningModels.IsSubKpi,// 指标专题标识，1：指标；2：专题
      editArea:warningModels.editArea, // 编辑页面传的省份地市
    }
  )
)
@Form.create()
class AddWarning extends PureComponent{

  static defaultProps={
    // onClose:() => {this.handleClick(false)}, //关闭弹出层回调函数
  };

  constructor(props) {
    super(props);
    this.addWarning=React.createRef();
    this.state = {
      selectedIndexData:"" ,// 选中的指标数据
      websocketSign: false, // websocket标记是否挂载
    };
  }

  componentDidMount() {
    const {markType,dateType,indexId,provId,cityId,IsSubKpi,warnId,popData} = this.props;
    const params = {
      dateType,
      markType,
      indexId,
      provId:warnId?provId:"",
      cityId:warnId?cityId:"",
      IsSubKpi,
      warnId,
    };
    this.getAddWarning(params);
    const {indexList}=popData;
    if(indexList.length>0){
      this.setState({
        selectedIndexData:indexList[0].id
      })
    }
  }

  componentDidUpdate(prevProps) {
    const{selectPro,selectCity}=this.props;
    const {selectedIndexData}=this.state;
    if(!isEqual({},prevProps.selectPro)){
      if(!isEqual(selectPro,prevProps.selectPro)||!isEqual(selectCity,prevProps.selectCity)){
        const {markType,dateType,indexId,IsSubKpi,warnId} = this.props;
        const params = {
          dateType,
          markType,
          "indexId":IsSubKpi==="1"?indexId:selectedIndexData,
          provId:selectPro.proId,
          cityId:selectCity.cityId,
          IsSubKpi,
          warnId,
        };
        this.getAddWarning(params);
      }
    }
  }

  componentWillUnmount() {
    // 清空models的值
    const {dispatch} = this.props;
    dispatch({
      type: `warningModels/clearModels`,
      payload: {},
    });
    // 清除编辑的省市
    dispatch({
      type: `warningModels/setEditArea`,
      // payload: {},
    });
  }

  // 请求添加预警接口
  getAddWarning=(params)=>{
    const {dispatch} = this.props;
    dispatch({
      type: `warningModels/getAddWarning`,
      payload: params,
    });
  };

  /**
   * @date: 2019/12/19
   * @author xingxiaodong
   * @Description: 自定义校验规则
   * @method validatorFun
   * @param {rule} pattern匹配规则
   */
  validatorFun = (rule, value, callback, msg) =>{
    const {pattern}=rule;
    if(value){
      if(!pattern.test(value)){
        message.config({
          top: 100,
          duration: 2,
          maxCount: 3,
          getContainer:()=>this.addWarning.current
        });
        message.info(msg)
        return false;
      }
      return true;
    }
    callback();
    return true;
  };

  /**
   * @date: 2019/12/19
   * @author xingxiaodong
   * @Description: 校验小数位数是否正确
   * @method isDigit
   * @param {item} 判断的对象
   */
  isDigit=(item)=>{
    if(item.value===""){return true}
    let reg=new RegExp(`^((-?[1-9]{1}\\d*)|(0{1}))(\\.\\d{${Number(item.digit)}})$`);
    if(item.digit==="0"){
      reg=new RegExp(`^((-?[1-9]{1}\\d*)|(0{1}))$`);
    }
    if(!reg.test(item.value)){
      message.config({
        top: 100,
        duration: 2,
        maxCount: 3,
        getContainer:()=>this.addWarning.current
      });
      if(item.digit==="0"){
        message.error(`${item.name}应该输入整数`)
      }else {
        message.error(`${item.name}应该输入保留${item.digit}位小数的数字`)
      }

    }
    return reg.test(item.value)
  };

  /**
   * @date: 2019/12/19
   * @author xingxiaodong
   * @Description: 校验类型为max值应大于类型为min的值
   * @method isMatch
   * @param {item} 判断的数组
   */
  isMatch=(condition)=>{
    let match=true;
    let hasValue=true;
    const minValue=[];
    condition.forEach((item)=>{
      if(item.value!==""){
        hasValue=false
      }
      if(item.type==="min"){
        minValue.push(item)
      }
    });
    if(hasValue){
      message.config({
        top: 100,
        duration: 2,
        maxCount: 3,
        getContainer:()=>this.addWarning.current
      });
      message.error(`内容至少有一项，全为空无法提交！`);
      match=false;
    }
    minValue.forEach((item)=>{
      condition.forEach((item1)=>{
        if(item1.indexType===item.indexType&&item1.type==="max"){
          const max=item1.value;
          const min=item.value;
          if(max !== ""&&min !== ""&&Number(min)>=Number(max)){
            message.config({
              top: 100,
              duration: 2,
              maxCount: 3,
              getContainer:()=>this.addWarning.current
            });
            message.error(`${item.name}的值应该小于${item1.name}的值`);
            match=false;
          }
        }
      })
    });
    return match;
  };

  /**
   * @date: 2019/12/19
   * @author xingxiaodong
   * @Description: 点击完成按钮回调
   * @method check
   */
  check=()=>{
    const {form}=this.props;
    const { getFieldsValue} = form;
    const formValue=getFieldsValue();
    const {popData,dispatch,selectPro,selectCity,dateType,markType,indexId,IsSubKpi,warnId}=this.props;
    const {selectedIndexData}=this.state;
    const {setting}=popData;
    const {list}=setting;
    const newList=JSON.parse(JSON.stringify(list));
    let isSuccess=true;
    const condition=newList.map((item)=>{
      const newItem=item;
      newItem.value=formValue[item.id];
      if(!this.isDigit(item)){
        isSuccess=false;
      }
      return newItem
    });
    // 小数规则不匹配，不发送请求
    if(!isSuccess){return null}
    if(!this.isMatch(condition)){
      isSuccess=false;
    }
    // max,min规则不匹配，不发送请求。
    if(!isSuccess){return null}
    const params={
      dateType,
      markType,
      "indexId":IsSubKpi==="1"?indexId:selectedIndexData,
      "proId": selectPro.proId,
      "proName": selectPro.proName,
      "cityId": selectCity.cityId,
      "cityName": selectCity.cityName,
      "condition":condition,
      "warnId":warnId,
    };
    // 发送保存预警请求
    dispatch({
      type: 'warningModels/getSaveWarning',
      payload: params,
      callback:(res)=>{
        message.config({
          top: 100,
          duration: 2,
          maxCount: 3,
          getContainer:()=>this.addWarning.current
        });
        //  const {onClose}=this.props;
        if(res.status==="success"){
          message.success(res.message);
          // 保存成功开启WebSocket
          console.log("保存成功开启WebSocket")
          // this.openWebsocket();
          this.setState({websocketSign:true})
        }else if(res.status==="error"){
          message.error(res.message);
        }else {
          console.log("预警保存接口返回字段有误！")
        }
      }
    });
    return null
  };

  // 处理数据（去逗号）
  formatData = (data) => {
    const dataA =
      data.indexOf(',') === -1
        ? data
        : data.replace(/,/g, '');
    return dataA;
  };

  // select选择器选中值改变。
  selectChange=(value)=>{
    this.setState({
      selectedIndexData:value // 指标id
    });
    const {markType,dateType,indexId,provId,cityId,IsSubKpi,warnId} = this.props;
    const params = {
      dateType,
      markType,
      "indexId":IsSubKpi==="1"?indexId:value,
      provId,
      cityId,
      IsSubKpi,
      warnId,
    };
    this.getAddWarning(params);
  };

  /**
   * @date: 2019/12/9
   * @author 喵帕斯
   * @Description: 筛选条件下拉框选项处理
   * @method createSelectOptions
   * @param OptionData,类型为数组 参数描述：包括该筛选条件下的所有选项数据
   * @return {返回值类型：数组} 返回值说明：根据选项数据创造出相应的Option标签下的内容
   */
  createSelectOptions=(OptionData)=>{
    // channelTypeOption，完整的Option信息
    const channelTypeOption = OptionData.map((item)=>(<Option key={item.id} value={item.id}>{item.name}</Option>))
    return channelTypeOption;
  };

  // 自主关闭原先的webSocket并开启新的webSocket
  openWebsocket=()=>{
    console.log("自主关闭原先的webSocket并开启新的webSocket")
    this.warningRefWebSocket.componentWillUnmount();
    this.warningRefWebSocket.setupWebsocket();
  };

  // webSocket
  handleOpen = () =>{
    console.log("websocket open");
    const {token, userId} = Cookie.getCookie('loginStatus');
    const parames = {
      token,
      userId,
    };
    this.sendMessage(JSON.stringify(parames))
  };

  // webSocket
  handleClose = () =>{
    console.log("websocket close");
  };

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 发送消息
   * @method sendMessage
   * @param myMessage 参数：myMessage 参数描述：
   * @return {返回值类型} 返回值说明
   */

  sendMessage = (myMessage) => {
    this.warningRefWebSocket.sendMessage(myMessage);
  };

  /**
   * @date: 2019/11/8
   * @author 风信子
   * @Description: 接收消息
   * @method handleData
   */
  // eslint-disable-next-line
  handleData(data) {
    const result = JSON.parse(data);
    console.log("保存接受websocket返回结果")
    console.log(result)
    // 更新预警数字
    const {dispatch} = this.props;
    dispatch({
      type: `warningModels/setWarningNumber`,
      payload: {number:result},
    });
    this.warningRefWebSocket.componentWillUnmount();
    console.log("关闭了websocket")
  }

  render() {
    const {onClose,form,popData,IsSubKpi,editArea}=this.props;
    const {websocketSign} = this.state;
    const { getFieldDecorator } = form;
    if(!popData){return null}
    const {title,indexData,setting,indexList}=popData;
    const{selectedIndexData}=this.state;

    const {area,list}=setting;
    // 地域组件需要的参数
    let selectData = {}
    if(editArea.proId !== ""){
      selectData = {...editArea}
    }else {
      selectData=isEqual(area,{})?{}:{proId:area.provId,cityId:area.cityId};
    }
    // 指标数据展示列表
    const indexDataList=indexData.list.map((item)=>(
      <div key={item.name} className={styles.indexItem}>
        <div className={styles[item.color]}>{item.value+item.unit}</div>
        <div>{item.name}</div>
      </div>
    ));
    // 预警表单列表
    const warningList=list.map((item)=>
      (
        <Col key={item.id+area.provId+area.cityId} md={12} xl={12}>
          <Form.Item
            label={item.name}
            className={styles.formInputItem}
          >
            {getFieldDecorator(item.id, {
              rules: [{
                // validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入值")
              }, {
                type: 'regexp',
                pattern: item.digit==="0"
                  ?RegExp(`^((-?[1-9]{1}\\d*)|(0{1}))$`)
                  :RegExp(`^((-?[1-9]{1}\\d*)|(0{1}))(\\.\\d{${Number(item.digit)}})$`),
                validator: (rule, value, callback) => this.validatorFun(rule, value, callback, item.digit==="0"
                  ?`请输入整数`
                  :`请输入保留${item.digit}位小数的数字`
                ),
              }],
              initialValue: this.formatData(item.value),
            })(
              <span>
                <Input
                  placeholder="请输入值"
                  defaultValue={this.formatData(item.value)}
                  className={styles.addWarningInput}
                />
                {`  ${item.unit}`}
              </span>,
            )}
          </Form.Item>
        </Col>
      )
    );
    return(
      <div className={styles.addWarning}>
        <div className={styles.popWrapper} ref={this.addWarning}>
          <div className={styles.title}>
            <div className={styles.text}>{title}</div>
            {IsSubKpi==="2"&&
            <div className={styles.indexList}>
              <span>专题指标：</span>
              <Select
                dropdownClassName={styles.addWarningSelect}
                placeholder="请选择"
                value={selectedIndexData}
                style={{ width: 120 }}
                onChange={this.selectChange}
              >
                {this.createSelectOptions(indexList)}
              </Select>
            </div>
            }

            <div className={styles.icon} onClick={onClose}>
              <Icon type="close" />
            </div>
          </div>
          <div className={styles.contentTop}>
            <div className={styles.contentTopTitle}>
              {indexData.title}
            </div>
            <div className={styles.contentTopContent}>
              {indexDataList}
            </div>
          </div>
          <div className={styles.contentBottom}>
            <div className={styles.contentBottomTitle}>
              {setting.title}
            </div>
            <div className={styles.contentBottomContent}>
              <Form className={styles.antdForm}>
                <Row>
                  <Col md={24} xl={24}>
                    <div className={styles.formAreaItem}>
                      <ProCity moreProCity={{selectProName:"selectPro2",selectCityName:"selectCity2"}} selectData={selectData} markType='warningConfig' />
                    </div>
                  </Col>
                  {warningList}
                </Row>
              </Form>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.button} onClick={()=>{this.check()}}>完成</div>
          </div>
        </div>
        {
          websocketSign && (<Websocket
            url={APIURL_WARNING_NUMBER}
            onMessage={(data)=>this.handleData(data)}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            ref={socket => {
              this.warningRefWebSocket = socket;
            }}
          />)
        }
      </div>
    )
  }
}

export default AddWarning;
