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

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller'
import { Form, List, Button, message, Row, Col, Input, Radio, Select, DatePicker, Upload, Icon   } from 'antd';
import MyReportCard from '@/components/Report/myReportCard';
import moment from 'moment';

import styles from './myReport.less';
import Cookie from '@/utils/cookie';
import { toFormData } from '@/utils/utils';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;

@connect(({ myReportModel, myReportCardModel, loading }) => ({
  myReportModel,
  myReportCardModel,
  loading: loading.models.myReportModel,
}))
@Form.create()
class myReport extends PureComponent {

  state = {
    // addInputShow: false,
    addTime: "",
  }

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   const params = {
  //     num: 10,
  //     numStart: 1,
  //   }
  //   dispatch({
  //     type: 'myReportModel/fetchMyReport',
  //     payload: params,
  //   });
  // }

  disabledDate = currentDate => currentDate && currentDate > moment().endOf('day');

  /**
   * @date: 2019/2/27
   * @author liuxiuqian
   * @Description: 滚动加载数据
   * @method handleInfiniteOnLoad
   * @param {page} int 页码数
   */
  handleInfiniteOnLoad= (page) =>{
    const { dispatch } = this.props;
    const params = {
      num: 10,
      numStart: page,
    }
    dispatch({
      type: 'myReportModel/fetchMyReport',
      payload: params,
    });
  }

  /**
   * @date: 2019/2/27
   * @author liuxiuqian
   * @Description: 自定义
   * @method validatorFun
   * @param {参数类型} 参数名 参数说明
   */
  validatorFun = (rule, value, callback, msg) =>{
    if(!value){
      callback(message.error(msg));
      return false;
    }
    callback();
    return false;
  }

  check(){
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
            accessory: values.accessory.file,
            reportTime: values.reportTime.format('YYYY-MM-DD'),
            departmentId:"001",
            issubmit: true
          }
          dispatch({
            type: 'myReportCardModel/fetchAddMyReport',
            payload: toFormData(params),
            callback: (res) => {
              if(res.issuccess === "true"){
                const params2 = {
                  num: 10,
                  numStart: 1,
                }
                message.success("提交成功");
                dispatch({
                  type: 'myReportModel/fetchMyReport',
                  payload: params2,
                });
                dispatch({
                  type: 'myReportCardModel/setAddOpen',
                  payload: false,
                });
              }else {
                message.success("提交失败");
              }
            }
          })
        }
      },
    );
  }

  addreport(){
    const { dispatch, myReportCardModel } = this.props;
    const {updateOpen} = myReportCardModel;
    if(!updateOpen){
      const addTime = moment().add(0,'days').format('YYYY-MM-DD HH:mm:ss');
      this.setState({addTime})
      dispatch({
        type: 'myReportCardModel/setAddOpen',
        payload: true,
      });
    }else {
      message.error("请完成修改后再新增报告！");
    }
  }

  cancelHide(){
    const { dispatch } = this.props;
    dispatch({
      type: 'myReportCardModel/setAddOpen',
      payload: false,
    });
    // this.setState({addInputShow:false})
  }

  render() {
    const {loading, myReportModel, myReportCardModel, form} = this.props;
    const { addTime } = this.state;
    const {addOpen} = myReportCardModel;
    const {realName, deptName} = Cookie.getCookie('loginStatus');
    const { getFieldDecorator } = form;
    const {  myReportDatas, mrHasMore } = myReportModel;
    const { data, dataSourcesList, reportCycleList, reportTypesList } = myReportDatas;

    const uploadProps = {
      beforeUpload(){
        return false;
      }
    };

    const radioDom = reportTypesList.map((item)=> <Radio key={item.typeId} value={item.typeId}>{item.typeName}</Radio>);
    const reportCycleListDom = reportCycleList.map((item)=> <Option key={item.cycleId} value={item.cycleId}>{item.cycleName}</Option>);
    const dataSourcesListDom = dataSourcesList.map((item)=> <Option key={item.sourceId} value={item.sourceId}>{item.sourceName}</Option>);

    return (
      <div className={styles.myReportContent}>
        <div className={styles.addBtn}>
          <Button className="button-color-dust" type="primary" onClick={()=>this.addreport()}>新增报告</Button>
        </div>
        {
          addOpen
            ?
            <div className={styles.inputContent}>
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
                        initialValue:deptName,
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
                        initialValue: addTime,
                      })(
                        <Input disabled="true" placeholder="请输入录入时间" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={24} xl={24}>
                    <Form.Item label="报告类型">
                      {getFieldDecorator('typeId',{
                        rules: [
                          {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告类型")}
                        ],
                        validateTrigger: ["onChange", "onClick"]
                      })(
                        <Radio.Group>
                          {radioDom}
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={12} xl={12}>
                    <Form.Item label="报告名称">
                      {getFieldDecorator('title',{
                        rules: [
                          {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告名称")}
                        ],
                      })(
                        <Input placeholder="请输入报告名称" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={12} xl={12}>
                    <Form.Item label="报告周期">
                      {getFieldDecorator('cycleId',{
                        rules: [
                          // {required: true},
                          {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告周期")}
                        ],
                      })(
                        <Select className={styles.selectSt} placeholder="请输入报告周期">
                          {reportCycleListDom}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={12} xl={12}>
                    <Form.Item
                      {...formItemLayout}
                      label="报告时间"
                    >
                      {getFieldDecorator('reportTime', {
                        rules: [
                          // { required: true},
                          {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告时间")}
                        ],
                      })(
                        <DatePicker disabledDate={this.disabledDate} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={12} xl={12}>
                    <Form.Item label="数据来源">
                      {getFieldDecorator('sourceId',{
                        rules: [
                          // {required: true},
                          {required: true, validator: (rule, value, callback)=>this.validatorFun(rule, value, callback, "请输入报告时间")}
                        ],
                      })(
                        <Select className={styles.selectSt} placeholder="请输入数据来源">
                          {dataSourcesListDom}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={24} xl={24}>
                    <Form.Item label="报告附件">
                      {getFieldDecorator('accessory', {
                        rules: [
                          // {required: true},
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

                </Row>
              </Form>
              <div className={styles.btnCon}>
                <Button
                  className={styles.buttonColorDust}
                  onClick={()=>this.check()}
                >
                  提交
                </Button>
                <Button
                  className={styles.buttonColorDust}
                  onClick={()=>this.cancelHide()}
                >
                  取消
                </Button>
              </div>
            </div>
            :
            null
        }
        <InfiniteScroll
          initialLoad={false}
          pageStart={1}
          threshold={-20}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!loading && mrHasMore}
          // useWindow={false}
        >
          <List
            size="large"
            rowKey="id"
            loading={loading}
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <div className={styles.itemContent}><MyReportCard data={item} dataSourcesList={dataSourcesList} reportCycleList={reportCycleList} reportTypesList={reportTypesList} index={index} /></div>
              </List.Item>
            )}
          />
          <div className={styles.wholeTip}>{!mrHasMore && !loading ? "已加载全部" : "加载更多"}</div>
        </InfiniteScroll>
      </div>
    )
  }
}
export default myReport;
