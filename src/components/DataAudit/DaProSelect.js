
import React, { PureComponent } from 'react';
import { connect } from 'dva';


import styles from './DaProSelect.less';

@connect(({ dataAudit}) => ({
  proInfo:dataAudit.proInfo,
  selectorProName:dataAudit.selectorProName
}))

class DaProSelect extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      proShow: false, // 是否显示省下拉
    };

  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataAudit/fetchProInfo',
    });
  }

  /*
   * 处省显示下拉事件
   * */
  handlePro() {
    this.setState({
      proShow: true
    });
  }

  /*
   * 处理选中某个省
   * index 索引
   *
   * */
  handleProList(proId, proName) {
    const { dispatch } = this.props;
    this.setState({
      proShow: false,
    });
    const params = {
      proId,
      proName
    };
    dispatch({
      type: 'dataAudit/getSelectorPro',
      payload: params
    });
  }

  /**
   * 鼠标移出隐藏
   * */
  handleListHide(p) {
    const {proShow} = this.state
    if (p === "pro" && proShow) {
      this.setState({
        proShow: false
      });
    }
  }

  render() {
    const { proInfo,selectorProName } = this.props;
    if (proInfo !== undefined && proInfo.length > 0) {
      const {proShow} = this.state;
      const proList = proInfo.map((data) =>
        <li
          key={data.proId}
          title={data.proName}
          onClick={e => {
            this.handleProList(data.proId, data.proName);
            e.stopPropagation(); // 阻止事件向上传播
          }}
        >
          {data.proName}
        </li>
      );

      return (
        <div className={styles.indexContainer}>
          <div className={styles.proContent}>
            <span className={styles.name}>省分：</span>
            <div
              className={styles.cityFrame}
              onClick={() => {
                this.handlePro();
              }}
              onMouseLeave={() => {
                this.handleListHide("pro");
              }}
            >
              <span className={styles.FrameName}>{selectorProName}</span>
              <i className={styles.triangle} />
              {proShow ? (
                <div className={styles.cityList}>
                  <ul className={styles.cityUl}>{proList}</ul>
                </div>
              ) : null}
            </div>
          </div>

          {/* <div className={styles.proContent}> */}
          {/* <span className={styles.name}>地市：</span> */}
          {/* <div */}
          {/* className={styles.cityFrame} */}
          {/* onClick={() => { */}
          {/* this.handleCity(); */}
          {/* }} */}
          {/* onMouseLeave={() => { */}
          {/* this.handleListHide("city"); */}
          {/* }} */}
          {/* > */}
          {/* <span className={styles.FrameName}>{selectCity.cityName}</span> */}
          {/* <i className={styles.triangle} /> */}
          {/* {cityShow ? ( */}
          {/* <div className={styles.cityList}> */}
          {/* <ul className={styles.cityUl}>{cityList}</ul> */}
          {/* </div> */}
          {/* ) : null} */}
          {/* </div> */}
          {/* </div> */}
        </div>
      );
    }
    return null;
  }
}

export default DaProSelect;
