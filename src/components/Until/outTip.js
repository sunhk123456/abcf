/**
 * @Description:
 *
 * @author: liuxiuqian
 *
 * @date: 2020/4/14
 */

import React, { PureComponent } from 'react';
import {Prompt} from 'react-router-dom';
import router from 'umi/router';
import {Modal} from "antd";

class OutTip extends PureComponent {

  static defaultProps={
    message:"是否确定?"
  };

  constructor(props){
    super(props);
    this.state={
      modalVisible:false
    };
  }

  /**
   * @date: 2020/4/14
   * @author 风信子
   * @Description: 方法说明
   * @method 方法名 handlePrompt
   * @param {参数类型} 参数名 location 参数说明 location对象
   */
  handlePrompt = location => {
    if (!this.isSave) {
      this.showModalSave(location);
      return false;
    }
    return true;
  };

  /**
   * @date: 2020/4/14
   * @author 风信子
   * @Description: 方法说明 显示弹窗
   * @method 方法名 showModalSave
   * @param {参数类型} 参数名 location 参数说明 location对象
   */
  showModalSave = location => {
    this.setState({
      modalVisible: true,
      location,
    });
  };

  /**
   * @date: 2020/4/14
   * @author 风信子
   * @Description: 方法说明 处理取消按钮
   * @method 方法名 handleOnCancel
   */
  handleOnCancel = () => {
    this.setState({
      modalVisible: false,
    });

  };

  /**
   * @date: 2020/4/14
   * @author 风信子 在用户离开页面时触发 提示
   * @Description: 方法说明 处理确定按钮
   * @method 方法名 handleOnOk
   */
  handleOnOk = () => {
    const { location } = this.state;
    const {OnOk} = this.props;
    if(OnOk) OnOk();
    this.isSave = true;
    router.push({
      pathname: location.pathname,
    });
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const {modalVisible} = this.state;
    const {message} = this.props;
    return (
      <div>
        <Prompt message={this.handlePrompt} />
        <Modal
          title="提示"
          visible={modalVisible}
          onCancel={this.handleOnCancel}
          onOk={this.handleOnOk}
        >
          <div style={{"textAlign":"center"}}>{message}</div>
        </Modal>
      </div>
    );
  }
}
export default OutTip
