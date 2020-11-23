/**
 * @Description: 地域省份组件
 *
 * @author: wangxue
 *
 * @date: 2019/03/05
 */
import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import styles from './ProSelect.less';

@connect(({ proSelectModels, loading }) => ({
  proSelectModels,
  loading: loading.models.proSelectModels,
}))

class ProSelect extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      proShow: false, // 是否显示省下拉
      cityShow: false, // 是否显示地市下拉
    };

  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'proSelectModels/proCityFetch',
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
   * */
  handleProList(index, proId, proName) {
    const { dispatch,callback } = this.props;
    const selectPro = {
      proId,
      proName
    };
   callback(selectPro)
    const selectCity = {
      cityId: "-1",
      cityName: proName
    };
    this.setState({
      proShow: false,
    });
    const params = {
      selectPro,
      selectCity,
      selectIndex: index
    };
    dispatch({
      type: 'proSelectModels/selectProCity',
      payload: params
    });
  }

  /*
   * 处理选中地市个省
   * index 索引
   *
   * */
  handleCityList(index, cityId, cityName) {
    const { dispatch, proSelectModels } = this.props;
    const selectCity = {
      cityId,
      cityName
    };
    this.setState({
      cityShow: false,
    });
    const {selectPro, selectIndex} = proSelectModels;
    const params = {
      selectPro,
      selectCity,
      selectIndex
    };
    dispatch({
      type: 'proSelectModels/selectProCity',
      payload: params
    });
  }

  /*
   * 鼠标移出隐藏
   * p 判断省  地市
   * */
  handleListHide(p) {
    const {proShow, cityShow} = this.state
    if (p === "pro" && proShow) {
      this.setState({
        proShow: false
      });
    } else if (cityShow) {
      this.setState({
        cityShow: false
      });
    }
  }

  render() {
    const { proSelectModels } = this.props;
    const { areaDate, selectPro } = proSelectModels;
    const dataCityList = areaDate;
    if (dataCityList !== undefined && dataCityList.length > 0) {
      const {proShow} = this.state;
      const proList = dataCityList.map((data, index) =>
        <li
          key={data.proId}
          title={data.proName}
          onClick={e => {
            this.handleProList(index, data.proId, data.proName);
            e.stopPropagation(); // 阻止事件向上传播
          }}
        >
          {data.proName}
        </li>
      );
      return (
        <Fragment>
          <div className={styles.proContent}>
            <span className={styles.name}>省分</span>
            <div
              className={styles.cityFrame}
              onClick={() => {
                this.handlePro();
              }}
              onMouseLeave={() => {
                this.handleListHide("pro");
              }}
            >
              <span className={styles.FrameName}>{selectPro.proName}</span>
              <i className={styles.triangle} />
              {proShow ? (
                <div className={styles.cityList}>
                  <ul className={styles.cityUl}>{proList}</ul>
                </div>
              ) : null}
            </div>
          </div>
        </Fragment>
      );
    }
    return null;
  }
}

export default ProSelect;
