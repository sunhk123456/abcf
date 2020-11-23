/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  指标维度配置弹窗组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/5/8
 */

import React from 'react';
import { Button, Modal, Radio, message  } from 'antd';
import styles from './dimensionConfigurePopup.less';
import { APIURL_MYSPECIALSUBJECT_IMG } from '@/services/webSocketUrl';

class DimensionConfigurePopup extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectId: '', //  选择的维度id
      selectType: '', //  选择的指标类型
    };
  }

  componentDidMount() {
    const { data: { indexType } } =this. props;
    this.setState({
      selectType: indexType[0].id
    })
  }

  //  选择指标类型单选框
  onChange = e => {
    this.setState({
      selectType:  e.target.value
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
    const { selectId, selectType } = this.state
    if(selectId === '') {
      message.error('请选择维度类型!');
    } else {
      handleOk(selectId, selectType);
    }

  }

  //  点击选择维度
  changeSelectId = id => {
    this.setState({
      selectId: id
    })
  }

  render() {
    const { data } = this.props;
    const { selectType, selectId } = this.state
    const radioDom = data.indexType.map(item => (
      <Radio key={item.id} value={item.id}>{item.name}</Radio>
      ))
    const listDom = data.demensionType.map(item => (
      <div
        key={item.id}
        className={`${styles.listItem} ${selectId === item.id ? styles.selectId : null}`}
        onClick={() => this.changeSelectId(item.id)}
      >
        <img src={`${APIURL_MYSPECIALSUBJECT_IMG}${item.imgName}`} alt="" className={styles.itemImg} />
        <span className={styles.itemName}>{item.name}</span>
      </div>
      ));
    return (
      <Modal
        visible
        title={data.title}
        centered
        destroyOnClose
        onCancel={this.handleCancel}
        className={styles.dimensionConfigure}
        footer={[
          <div key="footerDiv">
            <Button onClick={this.handleCancel}>取消</Button>
            <Button key="submit" type="red" onClick={this.handleOk}>确定</Button>
          </div>
        ]}
      >
        <div className={styles.typeTitle}>指标类型</div>
        <Radio.Group onChange={this.onChange} value={selectType}>
          {radioDom}
        </Radio.Group>
        <div className={styles.typeTitle}>维度类型</div>
        <div className={styles.list}>
          {listDom}
        </div>
      </Modal>
    );
  }
}

export default DimensionConfigurePopup;
