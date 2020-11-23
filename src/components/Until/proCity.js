/**
 * @Description: 地域组件
 *
 * @author: liuxiuqian
 *
 * @date: 2019/01/16
 */
// 使用方法
// selectData={proId:"111",cityId:"-1"}  选中的省市 没有可以不传  默认选第一个
// markType 专题id
// moreProCity={selectProName:"selectPro2",selectCityName"selectCity2"} 默认是false 同一页面有多个组价地域组件的时候 开启 避免 选中地域冲突

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import classnames from "classnames";
import Cookie from '@/utils/cookie';
import styles from './proCity.less';


@connect(({ proCityModels, loading }) => ({
  proCityModels,
  loading: loading.models.proCityModels,
}))

class ProCity extends PureComponent {

  static defaultProps = {
    hasCity: true, // 是否有省分组件
    hasNanBei: false, // 是否南北省
  };

  constructor(props) {
    super(props);

    this.state = {
      proShow: false, // 是否显示省下拉
      cityShow: false, // 是否显示地市下拉
    };
  }

  componentDidMount() {
    const {hasNanBei=false,markType} = this.props;
    // 非模板专题的请求
    if(!hasNanBei){
      this.init();
    }else if(markType === "productView" ) { // 产品总览使用模板专题
      this.init();
    }
    document.onclick = this.onblur;
  }

  componentDidUpdate(prevProps){
    const { selectData, markType,overview,hasNanBei=false} = this.props;
    if(overview){
      if(!isEqual(prevProps.selectData,selectData)){
        this.init();
      }
    }
    // 模板专题的请求
    if(hasNanBei && hasNanBei !== prevProps.hasNanBei){
      this.init();
    }
    // 指标页切换指标不更新问题
    if(markType && markType !== prevProps.markType){
      // 切换指标时将上次选择的地市信息，置为默认
      this.init();
    }
  }

  componentWillUnmount(){
    const {dispatch,proCityModels,moreProCity}=this.props;
    const {power} = Cookie.getCookie('loginStatus');
    const {areaDate} = proCityModels;
    if(areaDate.length > 0){
      const selectPro = {
        proId: areaDate[0].proId,
        proName: areaDate[0].proName
      };
      let selectCity = {};
      if(power === "city"){
        selectCity = {
          cityId: areaDate[0].city[0].cityId,
          cityName: areaDate[0].city[0].cityName
        }
      }else {
        selectCity = {
          cityId: "-1",
          cityName: areaDate[0].proName
        }
      }

      dispatch({
        type:"proCityModels/setSelectData",
        payload:{
          selectPro,// 选中省数据
          selectCity,
        },
        moreProCity
      })
    }
  }

  onblur =()=>{
    this.setState({
      proShow: false,
      cityShow: false
    });

  };

  init(){
    const { dispatch, selectData,markType,hasNanBei=false, dateType, moreProCity=false,customInterface } = this.props;
    if(selectData&&JSON.stringify(selectData)!=="{}"){
      dispatch({
        type: 'proCityModels/proCityFetch2',
        payload: {markType, selectData,hasNanBei,dateType},
        moreProCity,
        customInterface
      });
    }else {
      dispatch({
        type: 'proCityModels/proCityFetch',
        payload:{
          markType,
          hasNanBei,
          dateType,
        },
        moreProCity,
        customInterface
      });
    }
  }

  /*
   * 处省显示下拉事件
   * */
  handlePro() {
    this.setState({
      proShow: true,
      cityShow: false,
    });
  }

  /*
   * 处理选中某个省
   * index 索引
   *
   * */
  handleProList(index, proId, proName) {
    const { dispatch,moreProCity=false,proCityModels } = this.props;
    const {areaDate} = proCityModels;
    const {power} = Cookie.getCookie('loginStatus');
    const selectPro = {
      proId,
      proName
    };
    let selectCity = {};
    if(power === "city"){
      selectCity = {
        cityId: areaDate[index].city[0].cityId,
        cityName: areaDate[index].city[0].cityName
      };
    }else {
      selectCity = {
        cityId: "-1",
        cityName: proName
      };
    }
    this.setState({
      proShow: false,
    });
    const params = {
      selectPro,
      selectCity
    };
    dispatch({
      type: 'proCityModels/selectProCity',
      payload: params,
      moreProCity
    });
  }

  /*
   * 处地市显示下拉事件
   * */
  handleCity() {
    this.setState({
      cityShow: true,
      proShow: false,
    });
  }

  /*
   * 处理选中地市个省
   * index 索引
   *
   * */
  handleCityList(index, cityId, cityName) {
    const { dispatch, proCityModels,moreProCity=false } = this.props;
    const selectCity = {
      cityId,
      cityName
    };
    this.setState({
      cityShow: false,
    });
    const {selectPro} = proCityModels;
    let params = {
      selectPro,
      selectCity
    };
    if(moreProCity){
      params = {
        selectPro:proCityModels[moreProCity.selectProName],
        selectCity
      };
    }
    dispatch({
      type: 'proCityModels/selectProCity',
      payload: params,
      moreProCity
    });
  }

  /*
   * 鼠标移出隐藏
   * p 判断省  地市
   * */
  // handleListHide(p) {
  //   const {proShow, cityShow} = this.state
  //   if (p === "pro" && proShow) {
  //     this.setState({
  //       proShow: false
  //     });
  //   } else if (cityShow) {
  //     this.setState({
  //       cityShow: false
  //     });
  //   }
  // }

  render() {
    const { proCityModels,moreProCity=false,hasCity } = this.props;
    const { areaDate } = proCityModels;
    let {selectPro, selectCity } = proCityModels;
    const dataCityList = areaDate;
    if(moreProCity && proCityModels[moreProCity.selectProName]){
      selectPro = proCityModels[moreProCity.selectProName];
      selectCity = proCityModels[moreProCity.selectCityName];
    }
    if (dataCityList !== undefined && dataCityList.length > 0) {
      const {proShow, cityShow} = this.state;
      const proList = dataCityList.map((data, index) =>
        <li
          key={data.proId}
          title={data.proName}
          onClick={e => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation(); // 阻止事件向上传播
            this.handleProList(index, data.proId, data.proName);
          }}
        >
          {data.proName}
        </li>
      );
      const dataCity = dataCityList.find(item=> selectPro.proId === item.proId);
      const cityList = dataCity.city.map((data, index) =>
        <li
          key={data.cityId}
          title={data.cityName}
          onClick={e => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation(); // 阻止事件向上传播
            this.handleCityList(index, data.cityId, data.cityName);
          }}
        >
          {data.cityName}
        </li>
      );

      return (
        <div className={styles.indexContainer}>
          <div className={styles.proContent} style={hasCity ? null : {width : "100%"}}>
            <span className={styles.name}>省分：</span>
            <div
              className={styles.cityFrame}
              onClick={(e) => {
                e.nativeEvent.stopImmediatePropagation();
                e.stopPropagation(); // 阻止事件向上传播
                this.handlePro();
              }}
              // onMouseLeave={() => {
              //   this.handleListHide("pro");
              // }}
            >
              <span className={classnames(styles.FrameName,proShow?styles.FrameNameActive:styles.FrameNameNoActive)}>{selectPro.proName}</span>
              <i className={classnames(styles.triangle,proShow?styles.triangleActive:styles.triangleNoActive)} />
              <div className={classnames(styles.cityList,!proShow && styles.cityListNone)}>
                <ul className={styles.cityUl}>{proList}</ul>
              </div>
            </div>
          </div>

          <div className={styles.proContent} style={hasCity ? null : {display : "none"}}>
            <span className={styles.name}>地市：</span>
            <div
              className={styles.cityFrame}
              onClick={(e) => {
                e.nativeEvent.stopImmediatePropagation();
                e.stopPropagation(); // 阻止事件向上传播
                this.handleCity();
              }}
              // onMouseLeave={() => {
              //   this.handleListHide("city");
              // }}
            >
              <span className={classnames(styles.FrameName,cityShow?styles.FrameNameActive:styles.FrameNameNoActive)}>{selectCity.cityName}</span>
              <i className={classnames(styles.triangle,cityShow?styles.triangleActive:styles.triangleNoActive)} />
              <div className={classnames(styles.cityList,!cityShow && styles.cityListNone)}>
                <ul className={styles.cityUl}>{cityList}</ul>
              </div>
            </div>
          </div>

        </div>
      );
    }
    return null;
  }
}

export default ProCity;
