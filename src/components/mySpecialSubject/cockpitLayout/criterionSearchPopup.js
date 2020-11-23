/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 指标搜索弹窗组件 </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/7
 */

import React from 'react';
import { Button, Modal, Input, Icon, message  } from 'antd';
import { connect } from 'dva';
import styles from './criterionSearchPopup.less';
import DayAndMonth from '../../Common/dayAndMonth';

@connect(({mySpecialSubjectModels, cockpitLayoutModels}) =>({
  selectSpecial:mySpecialSubjectModels.selectSpecial, // 选中的专题信息
  moduleId:mySpecialSubjectModels.moduleId, //  模块ID
  dayAndMonth:cockpitLayoutModels.dayAndMonth //  日月维度数据
}))
class CriterionSearchPopup extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      value: '',  //  搜索框的值
      selDayMonth: 'D', //  选中的日/月维度
      selectId: '', //  选中的指标ID
      selectName: '', //  选中的指标名称
      hoverId: '',  //  鼠标当前悬浮的指标ID
      switchable: '', //  账期类型是否可切换
    };
  }

  componentDidMount() {
    this.fetchDayAndMonth();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    //  卸载时清空数据
    dispatch({
      type: `cockpitLayoutModels/updateState`,
      payload: {
        criterionPopupData: [],
        dayAndMonth:{},
      }
    });
  }

  fetchDayAndMonth =()=>{
    const { dispatch, moduleId, selectSpecial,handleSearch } = this.props;
    const params = {
      moduleId,
      markType: selectSpecial.id,
      specialType:selectSpecial.specialType
    };
    //  初始化时请求日月类型
    dispatch({
      type: `cockpitLayoutModels/fetchDayAndMonth`,
      payload: params,
      callback:(response)=>{
        this.setState({
          selDayMonth: response.selectId,
          switchable: response.switchable
        },()=>{
          handleSearch("",response.selectId);
        });
      }
    });
  };

  //  点击搜索按钮
  handleSearch = () => {
    const { value,selDayMonth } =this.state;
    const { handleSearch } = this.props;
    handleSearch(value,selDayMonth);
  };

  //  搜索框Value改变
  onChange = e => {
    this.setState({
      value: e.target.value
    })
  };

  //  点击选择指标
  changeSelectId = (id,name) => {
    this.setState({
      selectId: id,
      selectName: name,
    })
  };

  //  鼠标当前悬浮的指标
  changeHoverId = id => {
    this.setState({
      hoverId: id
    })
  };

  //  点击取消
  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  //  点击日/月
  dayAndMonth = id => {
    const { switchable,value } = this.state;
    const { handleSearch } = this.props;
    if(switchable === '0') {
      message.error('账期类型不可切换!');
    } else {
      this.setState({
        selDayMonth: id,
        selectId:"", // 去除选中的指标
      },()=>{
        handleSearch(value,id);
      })
    }
  };

  //  点击确定
  handleOk = () => {
    const { handleOk } = this.props;
    const { selectId, selDayMonth, selectName } = this.state;
    if(selectId === '') {
      message.error('请选择指标!');
    } else {
      handleOk(selectId, selDayMonth, selectName);
    }
  };

  render() {
    const { data, dayAndMonth } = this.props;
    const { selectId, hoverId, selDayMonth } = this.state;
    let itemClassName;
    const listDom = data.map(item => {
      //  若为选中指标ID或鼠标当前悬浮的指标ID 则添加高亮显示样式
      if(selectId === item.indexId || hoverId === item.indexId) {
        itemClassName = styles.selectItem
      } else {
        itemClassName = styles.listItem
      }
      return (
        <div
          className={itemClassName}
          key={item.indexId}
          onClick={() => this.changeSelectId(item.indexId,item.indexName)}
          // onMouseOver={() => this.changeHoverId(item.indexId)}
          onFocus={() => 0}
        >
          {item.indexName}
        </div>
      )
    });
    return (
      <Modal
        visible
        centered
        destroyOnClose
        onCancel={this.handleCancel}
        className={styles.criterionSearch}
        footer={[
          <div key="footerDiv">
            <Button onClick={this.handleCancel}>取消</Button>
            <Button key="submit" type="red" onClick={this.handleOk}>确定</Button>
          </div>
        ]}
      >
        <div className={styles.title}>
          <span>内容检索</span>
          <div className={styles.dayMonth}>
            <DayAndMonth
              arrayData={dayAndMonth.list}
              selectIndex={selDayMonth}
              callback={this.dayAndMonth}
            />
          </div>
        </div>
        <div className={styles.inputSearch}>
          <Input
            placeholder="请输入搜索内容"
            onChange={this.onChange}
            suffix={
              <Icon
                type="search"
                style={{fontSize: 24, color: "#E4797D"}}
                onClick={this.handleSearch}
              />
            }
          />
        </div>
        <div className={styles.list}>
          {listDom}
        </div>
      </Modal>
    );
  }
}

export default CriterionSearchPopup;
