/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  模板选择弹框</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/9
 */

import React from 'react';
import { Button, Modal, Radio, message  } from 'antd';
import styles from './templatePopup.less';
import { APIURL_MYSPECIALSUBJECT_IMG } from '@/services/webSocketUrl';

class TemplatePopup extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectId: '', //  选择的模板ID
    };
  }


  /**
   *一般用于绑定事件，发送数据请求，在组件挂载时执行一次
   */
  componentDidMount() {
  }

//  选择指标类型单选框
  onChange = e => {
    this.setState({
      selectId:  e.target.value
    })
  }

  //  点击取消
  handleCancel = () => {
    const { handleCancel } = this.props
    handleCancel();
  }

  //  点击确定
  handleOk = () => {
    const { handleOk } = this.props
    const { selectId } = this.state
    if(selectId === '') {
      message.error('请选择模板类型!');
    } else {
      handleOk(selectId);
    }
  }

  render() {
    const { data } = this.props;
    const { selectId } = this.state;
    const radioDom = data.map(item => {
      const itemValue = item.replace('.jpg','')
      return(
        <Radio value={itemValue} key={item}>
          <img src={`${APIURL_MYSPECIALSUBJECT_IMG}${item}`} alt="" className={styles.img} />
        </Radio>
      )
    })
    return (
      <Modal
        visible
        centered
        destroyOnClose
        onCancel={this.handleCancel}
        className={styles.templatePopup}
        footer={[
          <div key="footerDiv">
            <Button onClick={this.handleCancel}>取消</Button>
            <Button key="submit" type="red" onClick={this.handleOk}>确定</Button>
          </div>
        ]}
      >
        <div className={styles.title}>模板选择</div>
        <Radio.Group onChange={this.onChange} value={selectId}>
          {radioDom}
        </Radio.Group>
      </Modal>
    );
  }
}

export default TemplatePopup;
