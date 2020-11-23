/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright BONC(c) 2013 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  zhai_
 * @date 2019/1/17 0017
 */

import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, message, Row, Col, Input, Radio, Select, DatePicker, Upload, Icon } from 'antd';
import Cookie from '@/utils/cookie';
import moment from 'moment';
import { toFormData } from '@/utils/utils';
import styles from './myReportCard.less';

const { confirm } = Modal;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;

@connect(({ myReportCardModel, loading }) => ({
  myReportCardModel,
  loading: loading.models.report,
}))
@Form.create()
class myReportCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  /**
   * @date: 2019/2/27
   * @author liuxiuqian
   * @Description: 账期控制
   * @method disabledDate
   * @param {currentDate} 选中的时间
   */
  disabledDate = currentDate =>  currentDate && currentDate > moment().endOf('day');

  /**
   * @date: 2019/2/27
   * @author liuxiuqian
   * @Description: 自定义
   * @method validatorFun
   * @param {参数类型} 参数名 参数说明
   * @return {返回值类型} 返回值说明
   */
  validatorFun = (rule, value, callback, msg) =>{
    if(!value){
      callback(message.error(msg)); // 校验不通过
      return false;
    }
    callback(); // 校验通过
    return false;
  }

  /**
   * @date: 2019/2/27
   * @author liuxiuqian
   * @Description: 根据名称返回id
   * @method nameReturnId
   * @param {name} string 名称
   * @param {arrData} array 全数据数组
   * @param {str} string key前缀
   * @return {arrData} 返回值说明
   */
  nameReturnId = (name, arrData, str) => {
    let id = "";
    for(let i=0; i< arrData.length; i += 1 ){
      if(arrData[i][`${str}Name`] === name){
        id = arrData[i][`${str}Id`];
      }
    }
    return id;
  }

  /**
   * @date: 2019/2/27
   * @author liuxiuqian
   * @Description: 删除报告
   * @method deleReport
   * @param {reportId}  报告id
   */
  deleReport(reportId){
    const { dispatch } = this.props;
    confirm({
      title: '提示',
      content: '确定是否删除?',
      onOk() {
        dispatch({
          type: 'myReportCardModel/getFetchDeleteMyReport',
          payload: {reportId},
          callback: (res) => {
            if(res.issuccess === "true"){
              message.success("删除成功");
              const params = {
                num: 10,
                numStart: 1,
              }
              dispatch({
                type: 'myReportModel/fetchMyReport',
                payload: params,
              });
            }else {
              message.success("删除失败");
            }
          }
        });
      },
      onCancel() {

      },
    });
  }

  /**
   * @date: 2019/2/28
   * @author liuxiuqian
   * @Description: 修改报告
   * @method deleReport
   * @param {reportId}  报告id
   */
  updateReport(reportId){
    const { dispatch, myReportCardModel } = this.props;
    const {updateOpen, addOpen} = myReportCardModel;
    if(addOpen){
      message.error("请完成新增报告再修改报告！");
    }else if(updateOpen && updateOpen !== reportId) {
      message.error("请完成其他修改！");
    }else {
      dispatch({
        type: 'myReportCardModel/setUpdateOpen',
        payload: reportId,
      });
    }
  }

  /**
   * @date: 2019/2/28
   * @author liuxiuqian
   * @Description: 取消修改
   * @method cancelReport
   */
  cancelReport(){
    const { dispatch } = this.props;
    dispatch({
      type: 'myReportCardModel/setUpdateOpen',
      payload: "",
    });
  }

  /**
   * @date: 2019/2/28
   * @author liuxiuqian
   * @Description: 修改提交方法
   * @method updateCheck
   * @param {reportId} string 报告id
   */
  updateCheck(reportId){
    const { dispatch, form } = this.props;
    // 校验报告 如果不存在重置数据  校验条件生效
    const { getFieldsValue, setFieldsValue, validateFields} = form;
    if(getFieldsValue(["accessory"]).accessory === undefined || getFieldsValue(["accessory"]).accessory.fileList.length === 0){
      setFieldsValue({"accessory":undefined})
    }
    validateFields(
      {force: true,first:true},
      (err, values) => {
        if (!err) {
          const params = {
            ...values,
            reportId,
            accessory: values.accessory.file,
            reportTime: values.reportTime.format('YYYY-MM-DD'),
            issubmit: true
          }
          dispatch({
            type: 'myReportCardModel/getFetchUpdateMyReport',
            payload: toFormData(params),
            callback: (res) => {
              if(res.data !== "false"){
                const params2 = {
                  num: 10,
                  numStart: 1,
                }
                message.success("修改成功");
                dispatch({
                  type: 'myReportModel/fetchMyReport',
                  payload: params2,
                });
                dispatch({
                  type: 'myReportCardModel/setUpdateOpen',
                  payload: "",
                });
              }else {
                message.success("修改失败");
              }
            }
          })
        }
      },
    );
  }

  render() {
    const {data, form, dataSourcesList, reportCycleList, reportTypesList, myReportCardModel} = this.props;
    const { getFieldDecorator } = form;
    const {updateOpen} = myReportCardModel;
    const {realName, deptName} = Cookie.getCookie('loginStatus');

    const uploadProps = {
      beforeUpload(){
        return false;
      }
    };

    const listDom = (
      <Row className={styles.Row}>
        <Col md={4} className={styles.leftContent}>
          <div className={styles.echartPic}>
            <img src={data.img} alt={data.title} />
          </div>
        </Col>
        <Col md={18} className={styles.rightContent}>
          <Row>
            <Col md={24} xl={24}>
              报告名称：{data.title}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              录入人：{realName}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              分析部门：{deptName}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              录入时间：{data.entryTime}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              报告类型：{data.reportType}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              数据来源：{data.dataSource}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              报告时间：{data.reportTime}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              发布状态：<span className={styles.red}>{data.publishStatus}</span>
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              报告周期：{data.reportCycle}
            </Col>
            <Col md={12} xl={7} className={styles.listCol}>
              浏览次数：{data.viewCount}
            </Col>
          </Row>
        </Col>
        <Col md={2} className={styles.colDel}>
          <Row>
            <Col md={24} xl={12} className={styles.btn}>
              <span onClick={()=>this.updateReport(data.reportId)}>修改</span>
            </Col>
            <Col md={24} xl={12} className={styles.btn}>
              <span onClick={()=>this.deleReport(data.reportId)}>删除</span>
            </Col>
          </Row>
        </Col>
      </Row>
    );

    const radioDom = reportTypesList.map((item)=> <Radio key={item.typeId} value={item.typeId}>{item.typeName}</Radio>);
    const reportCycleListDom = reportCycleList.map((item)=> <Option key={item.cycleId} value={item.cycleId}>{item.cycleName}</Option>);
    const dataSourcesListDom = dataSourcesList.map((item)=> <Option key={item.sourceId} value={item.sourceId}>{item.sourceName}</Option>);

    const updateListDom = (
      <Row className={styles.Row}>
        <Col md={4} className={styles.leftContent}>
          <div className={styles.echartPic}>
            <img src={data.img} alt={data.title} />
          </div>
        </Col>
        <Col md={20}>
          <Form layout="inline">
            <Row>
              <Col md={12} xl={8}>
                <Form.Item label="上&ensp;传&ensp;人">
                  {getFieldDecorator('user', {
                    rules: [{
                      required: true,
                    }],
                    initialValue:realName
                  })(
                    <Input disabled="true" placeholder="请输入上传人" />
                  )}
                </Form.Item>
              </Col>

              <Col md={12} xl={8}>
                <Form.Item label="分析部门">
                  {getFieldDecorator('departmentId', {
                    rules: [{
                      required: true,
                    }],
                    initialValue:deptName
                  })(
                    <Input disabled="true" placeholder="请输入分析部门名称" />
                  )}
                </Form.Item>
              </Col>
              <Col md={12} xl={8}>
                <Form.Item label="录入时间">
                  {getFieldDecorator('entryTime', {
                    rules: [{
                      required: true,
                    }],
                    initialValue: data.entryTime,
                  })(
                    <Input disabled="true" placeholder="请输入录入时间" />
                  )}
                </Form.Item>
              </Col>
              <Col md={24} xl={16} xxl={8}>
                <Form.Item label="报告类型">
                  {getFieldDecorator('typeId',{
                    rules: [
                      // {required: true},
                      {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告类型")}
                    ],
                    initialValue: this.nameReturnId(data.reportType, reportTypesList, "type"),
                  })(
                    <Radio.Group>
                      {radioDom}
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col md={12} xl={8}>
                <Form.Item label="报告周期">
                  {getFieldDecorator('cycleId',{
                    rules: [
                      // {required: true},
                      {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告周期")}
                    ],
                    initialValue: this.nameReturnId(data.reportCycle, reportCycleList, "cycle"),
                  })(
                    <Select className={styles.selectSt} placeholder="请输入报告周期">
                      {reportCycleListDom}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={12} xl={8}>
                <Form.Item label="报告名称">
                  {getFieldDecorator('title',{
                    rules: [
                      // {required: true},
                      {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告名称")}
                    ],
                    initialValue: data.title,
                  })(
                    <Input placeholder="请输入报告类型" allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col md={12} xl={8}>
                <Form.Item
                  {...formItemLayout}
                  label="报告时间"
                >
                  {getFieldDecorator('reportTime', {
                    rules: [
                      // {required: true},
                      // { required: true, message: message.error("请输入报告时间") },
                      {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告时间")}
                    ],
                    initialValue: moment(data.reportTime,"YYYY-MM-DD"),
                  })(
                    <DatePicker disabledDate={this.disabledDate} />
                  )}
                </Form.Item>
              </Col>
              <Col md={12} xl={8}>
                <Form.Item label="数据来源">
                  {getFieldDecorator('sourceId',{
                    rules: [
                      // {required: true},
                      // {required: true, message: message.error('请输入数据来源'),},
                      {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入数据来源")}
                    ],
                    initialValue: this.nameReturnId(data.dataSource, dataSourcesList, "source"),
                  })(
                    <Select className={styles.selectSt} placeholder="请输入数据来源">
                      {dataSourcesListDom}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={20} xl={20}>
                <Form.Item label="报告附件">
                  {getFieldDecorator('accessory', {
                    rules: [
                      // {required: true},
                      // {required: true, message: message.error('请输入报告附件'),},
                      {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告附件")}
                    ],
                  })(
                    <Upload accept=".pdf,.ppt,.pptx" {...uploadProps}>
                      <Button>
                        <Icon type="upload" /> 上传文件
                      </Button>
                      <span className={styles.mustText}>仅支持*.pdf，*.ppt文件的提交</span>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
              <Col md={4}>
                <Row>
                  <Col
                    md={12}
                    className={styles.btn}
                    onClick={()=>this.updateCheck(data.reportId)}
                  >
                    提交
                  </Col>
                  <Col md={12} className={styles.btn}>
                    <span onClick={()=>this.cancelReport()}>取消</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
    return (
      <div className={styles.myReportCardContent}>
        { updateOpen === data.reportId ? updateListDom : listDom}
      </div>
    )
  }
}

export default myReportCard
