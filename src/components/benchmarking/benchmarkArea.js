/* eslint-disable global-require,react/no-string-refs,no-plusplus */
/**
 * desctiption 横向对标页面

 * created by sunrui

 * date 2019/1/8
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';

import styles from './benchmarkArea.less';

@connect(({ benchmarkArea, benchMarking }) => ({
  templateId: benchMarking.templateId,
  benchmarkSelectorInfo: benchmarkArea.benchmarkSelectorInfo,
  benchmarkProInfo: benchmarkArea.benchmarkProInfo,
  benchmarkResInfo: benchmarkArea.benchmarkResInfo,
  benchmarkProId: benchmarkArea.benchmarkProId,
  benchmarkCityId: benchmarkArea.benchmarkCityId,
  benchmarkName: benchmarkArea.benchmarkName,
}))

class BenchmarkArea extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 切换样式
      bmMenuBody: true,
      bmMenuTopWidth: true,
      bmMenuRight: true,
      bmButtonProColor: true,
      bmButtonProBg: true,
      secMenuClick: true,
      bmHistorySecOption: '',
      bmHistoryThirdOption: '',
      bmFirOption: '',
      bmFirOptionColor: '0',
    };
  }

  // 改变标杆区域名称-省份
  onClickArea = (event, id, name) => {
    const bmAreaName = {
      id,
      name,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'benchmarkArea/changeArea',
      payload: bmAreaName,
    });
    this.onMouseLeaveAreaColor();
    event.stopPropagation();
  };

  // 改变标杆区域名称-城市
  onClickCityArea = (event, id, name, pid) => {
    const bmAreaCityName = {
      id,
      name,
      pid,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'benchmarkArea/changeCityArea',
      payload: bmAreaCityName,
    });
    this.onMouseLeaveAreaColor();
    event.stopPropagation();
  };

  // 点击改变标杆区域样式
  onClickAreaColor = () => {
    this.setState({
      bmMenuBody: false,
    });
  };

  // 划出改变标杆区域样式
  onMouseLeaveAreaColor = () => {
    this.setState({
      bmMenuBody: true,
    });
  };

  /**
   * 切换二级标杆区域
   * */
  changeSecArea = (id, i) => {
    const { bmHistorySecOption, bmFirOption, bmFirOptionColor } = this.state;
    const option = bmHistorySecOption;
    if (option === '') {
      this.setState({
        bmHistorySecOption: id,
      });
      this.refs[id].style.display = 'block';
    } else if (option !== id) {
      this.setState({
        bmHistorySecOption: id,
      });
      this.refs[id].style.display = 'block';
      this.refs[option].style.display = 'none';

    }
    // 改变一级菜单重置三级菜单
    const { benchmarkSelectorInfo } = this.props;
    const firOption = bmFirOption;
    const firOptionColor = bmFirOptionColor;
    const thirdId = `secId-${benchmarkSelectorInfo[i].secondInfo[0].id}`;
    if (firOption === '') {
      this.setState({
        bmFirOption: i,
      });
      this.refs[thirdId].style.display = 'block';
    } else if (firOption !== i) {
      const { secondInfo } = benchmarkSelectorInfo[firOption];
      this.setState({
        bmFirOption: i,
      });
      for (let k = 0; k < secondInfo.length; k++) {
        const thirdId1 = `secId-${secondInfo[k].id}`;
        this.refs[thirdId1].style.display = 'none';
      }
      this.refs[thirdId].style.display = 'block';
    }
    if (firOptionColor !== i) {
      this.setState({
        bmFirOptionColor: i,
      });
      document.getElementById(benchmarkSelectorInfo[firOptionColor].id).style.color = '#333';
      document.getElementById(benchmarkSelectorInfo[i].id).style.color = '#C91717';
    }
  };

  /**
   * 切换三级标杆区域
   * */
  changeThirdArea = (id) => {
    const { bmHistoryThirdOption } = this.state;
    const option = bmHistoryThirdOption;
    if (option === '') {
      this.setState({
        bmHistoryThirdOption: id,
      });
      this.refs[id].style.display = 'block';

    } else if (option !== id) {
      this.setState({
        bmHistoryThirdOption: id,
      });
      this.refs[option].style.display = 'none';
      this.refs[id].style.display = 'block';
    }
    document.getElementById(id).className = styles.itemStyle;
  };

  /**
   * 生成全国菜单
   * */
  generateNationalMenus = (menuObj) => {
    const { secMenuClick } = this.state;
    const vdom = [];
    // 一级菜单
    const firList = menuObj.map((item, i) => {
      let firstMenuList;
      if (i === 0) {
        firstMenuList = (
          <p
            key={`firMenu${item.id}`}
            id={item.id}
            onClick={() => this.changeSecArea(`firId-${item.id}`, i)}
            style={{ color: '#C91717' }}
            className={styles.areaTitle}
          >
            <span>{item.name}</span>
          </p>
        );
      }else {
        firstMenuList = (
          <p
            key={`firMenu${item.id}`}
            id={item.id}
            onClick={() => this.changeSecArea(`firId-${item.id}`, i)}
            className={styles.areaTitle}
          >
            <span>{item.name}</span>
          </p>
        );
      }
      return firstMenuList;
    });
    vdom.push(
      <div className={styles.bmMenuLeft} key="menuBody">
        {firList}
      </div>,
    );
    // 二级菜单
    const secList = menuObj.map((items, index) => {
      const secItem = items.secondInfo;
      const firId = `firId-${items.id}`;
      const sec = secItem.map((item) => {
        const secId = `secId-${item.id}`;
        const secName = item.name;
        return (
          <p
            key={`secMenu${secId}`}
            id={secId}
            onFocus={this.noting}
            onMouseOver={() => this.changeThirdArea(secId)}
            onMouseLeave={() => this.changeThirdAreaOut(secId)}
            onClick={secMenuClick || item.thirdInfo.length === 0 ? (event) => this.onClickArea(event, item.id, secName) : null}
            className={styles.proCityName}
          ><span>{item.name}</span>
          </p>
        );
      });
      return (
        <div
          className={styles.bmMenuMid}
          key={`sec${firId}`}
          ref={firId}
          style={{ display: index === 0 ? 'block' : 'none' }}
        >
          {sec}
        </div>
      );

    });
    let columnWidth =41;
    const wid=window.screen.width;
    if( wid > 700 && wid < 961 ){
      columnWidth=30;
    }
    vdom.push(
      <div style={{ width: `${columnWidth}%`, float: 'left' }} key="proBody">
        {secList}
      </div>,
    );
    // 三级菜单
    const { bmMenuRight } = this.state;
    const bmShowMenuRight = bmMenuRight;
    const thirdList = menuObj.map((item, index) => {
      const secItem = item.secondInfo;
      const sec = secItem.map((secitem, secindex) => {
        const secId = `secId-${secitem.id}`;
        const thirdItem = secitem.thirdInfo;
        let third = null;
        if(thirdItem.length > 0){
          third = thirdItem.map((thritem) => {
            const thirdId = `thirdId-${thritem.id}`;
            const thirdName = thritem.name;
            return (
              <p
                key={`thirdMenu${thirdId}`}
                id={thirdId}
                onFocus={this.noting}
                onMouseOver={() => this.changeThirdAreaIn(thirdId)}
                onMouseLeave={() => this.changeThirdAreaOut(thirdId)}
                onClick={(event) => this.onClickCityArea(event, thritem.id, thirdName, secitem.id)}
                className={styles.proCityName}
              ><span>{thirdName}</span>
              </p>
            );
          });
        }
        return (
          <div
            className={styles.bmMenuRight}
            key={`third${secId}`}
            ref={secId}
            style={{ display: secindex === 0 && index === 0 ? 'block' : 'none' }}
          >
            {third}
          </div>
        );
      });

      return sec;
    });
    vdom.push(
      <div style={{ display: bmShowMenuRight ? 'none' : 'block', width: `${39}%`, float: 'left' }} key="cityBody">
        {thirdList}
      </div>,
    );

    return vdom;
  };

  /**
   * onMouseOver 前的onFoucue占位
   */
  noting = () => {

  };


  /**
   * 切换省市
   * */
  selectPro = () => {
    this.setState({
      bmMenuTopWidth: true,
      bmMenuRight: true,
      bmButtonProColor: true,
      bmButtonProBg: true,
      secMenuClick: true,
    });
  };


  changeThirdAreaIn = (id) => {
    document.getElementById(id).className = styles.itemStyle;
  };

  // 区域划入颜色样式改变
  changeThirdAreaOut = (id) => {
    document.getElementById(id).classList.remove(styles.itemStyle);
  };

  // 切换地市
  selectCity = () => {
    this.setState({
      bmMenuTopWidth: false,
      bmMenuRight: false,
      bmButtonProColor: false,
      bmButtonProBg: false,
      secMenuClick: false,
    });
  };

  /**
   * 生成省市菜单
   * */
  generateProMenus = (menuObj) => {
    const vdom = [];
    // 一级菜单
    const firList = menuObj.map((item, i) => {
      const firId = `firId-${item.id}`;
      return (
        <p
          key={`firMenu${firId}`}
          id={firId}
          onClick={() => this.changeSecArea(firId, i)}
          style={{ color: '#C91717' }}
        ><span>{item.name}</span>
        </p>
      );

    });
    vdom.push(
      <div className={styles.bmMenuLeft} key="allBody">
        {firList}
      </div>,
    );

    // 二级菜单
    const secList = menuObj.map((items) => {
      const secItem = items.secondInfo;
      const firId = `firId-${items.id}`;
      const sec = secItem.map((item) => {
        const secId = `secId-${item.id}`;
        const secName = item.name;
        return (
          <p
            key={`secMenus${secId}`}
            id={secId}
            onFocus={this.noting}
            onMouseOver={() => this.changeThirdAreaIn(secId)}
            onMouseLeave={() => this.changeThirdAreaOut(secId)}
            onClick={(event) => this.onClickCityArea(event, item.id, secName,items.id)}
            className={styles.proCityName}
          ><span>{item.name}</span>
          </p>
        );
      });
      return (
        <div className={styles.bmMenuMid} key={`sec${firId}`} ref={firId} style={{ display: 'block' }}>
          {sec}
        </div>
      );
    });
    vdom.push(
      <div style={{ width: `${41}%`, float: 'left' }} key="proBody">
        {secList}
      </div>,
    );
    return vdom;
  };

  render() {
    const { benchmarkSelectorInfo, benchmarkName } = this.props;
    const { bmMenuBody, bmMenuTopWidth, bmButtonProColor, bmButtonProBg} = this.state;
    let menuProvTopWid;
    let menuCityTopWId;
    const wid = window.screen.width;
    if(wid >= 700 && wid <= 960){
      menuProvTopWid = '250%';
      menuCityTopWId = '460%';
    }else if(wid >= 961 && wid <= 1100) {
      menuProvTopWid = '213%';
      menuCityTopWId = '388%';
    }else if(wid >= 1101 && wid <= 1315) {
      menuProvTopWid = '164%';
      menuCityTopWId = '293%';
    }else if(wid >= 1316 && wid <= 1389) {
      menuProvTopWid = '146%';
      menuCityTopWId = '257%';
    }else if(wid >= 1390){
      menuProvTopWid = '143%';
      menuCityTopWId = '252%';
    }
    let bmAreaMenu;
    if (benchmarkSelectorInfo.length === 1) {
      // 省市用户
      bmAreaMenu =
        <div className={styles.bmAreaMenu} style={{ display: bmMenuBody ? 'none' : 'block' }}>
          <div className={styles.bmMenuTop} style={{ width: menuProvTopWid }}>
            <div className={styles.bmMenuButton}>
              <button
                type="button"
                className={styles.bmButtonPro}
                style={{ color: 'white', background: '#C91717' }}
              >
                {benchmarkSelectorInfo[0].name}
              </button>
            </div>
          </div>
          <div className={styles.bmMenuContent}>
            {this.generateProMenus(benchmarkSelectorInfo)}
          </div>
        </div>;
    } else {
      // 全国用户
      bmAreaMenu =
        <div className={styles.bmAreaMenu} style={{ display: bmMenuBody ? 'none' : 'block' }}>
          <div className={styles.bmMenuTop} style={{ width: bmMenuTopWidth ? menuProvTopWid : menuCityTopWId }}>
            <div className={styles.bmMenuButton}>
              <button
                type="button"
                className={styles.bmButtonPro}
                style={{
                  color: bmButtonProColor ? 'white' : '#6F6E6F',
                  background: bmButtonProBg ? '#C91717' : '#F8F7F8',
                }}
                onClick={this.selectPro}
              >省分
              </button>
              <button
                type="button"
                className={styles.bmButtonCity}
                style={{
                  color: bmButtonProColor ? '#6F6E6F' : 'white',
                  background: bmButtonProBg ? '#F8F7F8' : '#C91717',
                }}
                onClick={this.selectCity}
              >地市
              </button>
            </div>
          </div>
          <div className={styles.bmMenuContent}>
            {this.generateNationalMenus(benchmarkSelectorInfo)}
          </div>
        </div>;
    }
    return (
      <div className={styles.bmArea}>
        <span className={styles.bmAreaTitle}>标杆：</span>
        <div className={styles.bmAreaBody} onClick={this.onClickAreaColor} onMouseLeave={this.onMouseLeaveAreaColor} style={{background: bmMenuBody ? "#FFFFFF" : "#C91717"}}>
          <div className={styles.bmAreaPull}>
            <Icon type="caret-down" className={styles.bmPull} style={{color : bmMenuBody ? "#666666" : "#FFFFFF"}} />
          </div>
          <div className={styles.bmAreaName} style={{color: bmMenuBody ? "#666666" : "#FFFFFF"}}>
            <span>{benchmarkName}</span>
          </div>
          {bmAreaMenu}
        </div>
      </div>
    );
  }
}

export default BenchmarkArea;
