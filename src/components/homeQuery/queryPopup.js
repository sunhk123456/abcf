/**
 * @Description:  楼宇弹出层容器
 *
 * @author: 风信子
 *
 * @date: 2019/11/29
 */

import React, {PureComponent} from 'react';
import {Button, Icon, Table } from "antd";

import styles from './queryPopup.less';

class QueryPopup extends PureComponent {
  static defaultProps = {
    tableData:{
      tbodyData:[
        {
          key:"1",
          number:"1",
          homeId:"65954888",
          homeAddress:"北京市大兴区经济开发区",
          customerType:"政企",
          townType:"城市",
          iptv:"是"
        },
        {
          key:"2",
          number:"2",
          homeId:"65954888",
          homeAddress:"北京市大兴区经济开发区",
          customerType:"政企",
          townType:"城市",
          iptv:"是"
        },
      ],
      thData: [
        {
          title: "序号",
          id: "number",
          unit: "",
        },
        {
          title: "家庭ID",
          id: "homeId",
          unit: "",
        },
        {
          title: "家庭地址",
          id: "homeAddress",
          unit: "",
        },
        {
          title: "客户类型",
          id: "customerType",
          unit: "",
        },
        {
          title: "城镇类型",
          id: "townType",
          unit: "",
        },
        {
          title: "是否IPTV",
          id: "iptv",
          unit: "",
        },
      ],
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:{}, // 选中的行数据
    }
  }

  componentDidMount() {

  }

  /**
   * @date: 2019/12/2
   * @author 风信子
   * @Description: 关闭弹窗
   */
  closeHandle(){
    const {callBackClose} = this.props;
    callBackClose();
  }

  /**
   * @date: 2020/1/2
   * @author 风信子
   * @Description: 方法描述
   * @method submitClick
   * @param {参数类型} 参数： 参数描述：
   * @return {返回值类型} 返回值说明
  */
  submitClick(){
    const {selectedRowKeys} = this.state;
    const {callBackCondition,callBackClose,tableData:{type}} =  this.props;
    callBackCondition(selectedRowKeys.condition,type);
    callBackClose();
  }

  render() {
    const {tableData:{tbodyData,thData,type}} = this.props;
    const handleThData = thData.map((item)=>({
        title:item.title,
        dataIndex:item.id,
        className:styles.tableItem,
        key:item.id,
        render:(text)=>(<div className={styles.renderText} title={text}>{text}</div>)
      }));
    const rowRadioSelection = {
      type:'radio',
      columnTitle:"选择",
      onSelect: (selectedRowKeys) => {
        this.setState({selectedRowKeys})
      },
    };
    return (
      <div className={styles.queryPopup}>
        <div className={styles.container}>
          <div className={styles.title}>
            {type === "error"?"查询的家庭":"选择查询的家庭"}
            <span className={styles.close} onClick={()=>this.closeHandle()}><Icon type="close-circle" /></span>
          </div>
          <div className={styles.tableContent}>
            <Table
              columns={handleThData}
              dataSource={tbodyData}
              rowClassName={styles.trStyle}
              rowSelection={type === "error"? false : rowRadioSelection}
              // rowKey={(record)=>record.id}
              // bordered
              pagination={false}
            />
          </div>
          <div className={styles.buttonContent}>
            {type === "error" ? (<div className={styles.error}>数据查询异常,可能原因：家庭主账号（home-id)重复,请您核对后重新输入</div>) : (<Button onClick={()=>this.submitClick()}>确定</Button>) }
          </div>
        </div>
      </div>
    )
  }
}

export default QueryPopup;
