import React from 'react';
import { connect } from 'dva';
import { Button, Tag, Icon } from 'antd';
import styles from './regionalArea.less';

const { CheckableTag } = Tag;
// const { Group } = Checkbox;

@connect(({ regionalArea, benchMarking }) => ({
  permissions: regionalArea.permissions,
  perType: regionalArea.perType,
  areaData: regionalArea.areaData,
  backDisplay: regionalArea.backDisplay,
  templateId: benchMarking.templateId,
  areaTitle: regionalArea.areaTitle,
}))
class RegionalArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 普通弹出框是否显示
      selectType: 0, // 选择的是全国、北十、南二十一
      provId: '',// 选中的省份id
      checkedList: [],// 选中列表 3个字段         "selectProId":"001","selectAreaId":"-1","areaName":"北京"
      cityVisible: false,// 地市弹出框是否展示
      areaList: [], // 存储areaData的三个子数组中的一个，用于全选遍历
      cityList: [], // 存储areadata中的每个省份的子城市
    };
  }

  /**
   * 展示地域选择弹窗
   */
  showModal = () => {
    const { selectType } = this.state;
    const { areaData, backDisplay } = this.props;
    const checkedList = [];
    backDisplay.forEach((item) => {
      checkedList.push({
        selectProId: item.selectProId,
        selectAreaId: item.selectAreaId,
        areaName: item.selectName,
      });
    })
    this.setState({
      areaList: areaData[selectType],
      visible: true,
      checkedList,
    });
  };

  // 鼠标离开选择区域后隐藏
  leaveAreaChecked = () => {
    this.setState({
      visible: false,
      cityVisible: false
    });
  };


  /**
   * 取消选中的内容，并关闭弹窗
   */
  closeModal = () => {
    this.setState({
      visible: false,
      cityVisible: false,
    });
  };

  // 确定
  isSureModal = () => {
    const { dispatch } = this.props;
    const { checkedList } = this.state;
    // 循环checkList列表，获取每项的areaName拼接起来
    // 如果为空，返回默认值
    const len = checkedList.length;
    let areaTitle = '';
    if (len) {
      for (let i = 0; i < len; i+=1) {
        const { areaName } = checkedList[i];
        areaTitle += areaName;
      }
    } else {
      areaTitle = '请选择';
    }
    const backDisplay =[];
    checkedList.forEach(item =>{
      backDisplay.push({
        selectAreaId: item.selectAreaId,
        selectProId: item.selectProId,
        selectName: item.areaName
      })
    })
    // 通过dispatch发送数据到store去更新
    dispatch({
      type: 'regionalArea/setCheckList',
      payload: { backDisplay, areaTitle },
    });
    this.setState({
      visible: false,
      cityVisible: false,
    });
  };

  /**
   * 切换筛选标签
   * @param checked
   * @param index
   */
  changePermissions = (checked, index) => {
    const { areaData } = this.props;
    if (checked) {
      this.setState({
        // checkedList: [],
        selectType: index,
        areaList: areaData[index],
        cityVisible: false,
      });
    }
  };

  /**
   * 选中或取消选中某个省份或者地市
   * @param event
   * @param data
   */
  handleChangeProChecked = (event, data) => {
    // 当为地市用户时，此时是地市列表，用pertype区分是全国用户或地市用户
    const {perType, permissions} = this.props;
    const { checkedList } = this.state;
    let newCheck=[];
    // 选中某个省
    if(perType === "0"){
      newCheck=event.target.checked?checkedList.concat({
        selectProId: data.areaId,
        selectAreaId: '-1',
        areaName: data.areaName,
      }):checkedList.filter(item=>item.selectProId!==data.areaId)
    }else if(perType === "1"){ // 选中某个市
      newCheck=event.target.checked?checkedList.concat({
        selectProId: permissions[0].perId,
        selectAreaId: data.areaId,
        areaName: data.areaName,
      }):checkedList.filter(item=>item.selectProId!==data.areaId)
    }

    this.setState({
      checkedList:newCheck,
    });
  };

  /**
   * 选中或取消选中某个地市
   * @param checkedValue
   */
  handleChangeCityChecked = (event, data) => {
    const { checkedList, provId } = this.state;
    // 选中某个地市
    this.setState({
      checkedList:event.target.checked?checkedList.concat({
        selectProId: provId,
        selectAreaId: data.areaId,
        areaName: data.areaName,
      }):checkedList.filter(item=>item.selectProId !== provId || item.selectAreaId !== data.areaId),
    });
  };

  /**
   * 取消已选择内容选中的某个地市
   * @param data
   */
  cancelChecked = (data) => {
    const { checkedList } = this.state;
    this.setState({
      checkedList:checkedList.filter(item=>item.selectProId !== data.selectProId || item.selectAreaId !== data.selectAreaId),
    });
  };

  /**
   * 显示地市弹窗
   * @param data
   */
  showCityModal = (data) => {
    if (data.cities !== '') {
      this.setState({
        provId: data.areaId,
        cityList: data.cities,
        cityVisible: true,
      });
    }
  };

  /**
   * 关闭地市弹窗
   */
  closeCityModal = () => {
    this.setState({
      cityVisible: false,
    });
  };

  /**
   * 省份全选或取消全选
   * @param event
   */
  chooseAllArea = (event) => {
    let { checkedList } = this.state;
    const { areaList } = this.state;
    const newCheck=[];
    if (event.target.checked) {
      areaList.map(item=>{
        if(checkedList.every(data=>item.areaId!==data.selectProId)){
          checkedList.push({
            selectProId: item.areaId,
            selectAreaId: '-1',
            areaName: item.areaName,
          })
        }
        return null
      })
    } else {
      checkedList.map(item=>{
        if(areaList.every(data=>item.selectProId!==data.areaId)){
          newCheck.push(item)
        }
        return null
      })
      checkedList = newCheck;
    }
    this.setState({
      checkedList,
    });
  };

  // 清空城市
  clearSelected = () => {
    this.setState({
      checkedList: [],
    });
  };

  render() {
    const { visible, cityVisible, selectType, checkedList, cityList } = this.state;
    const { permissions, areaData, areaTitle } = this.props;
    const showIcon = areaTitle === '请选择';
    // 权限切换标签
    const permissionsOuter = permissionsParam => permissionsParam.map((item, index) => (
      <CheckableTag
        key={item.perId}
        checked={selectType === index}
        onChange={(checked) => this.changePermissions(checked, index)}
      >
        {item.perName}
      </CheckableTag>
    ));
    const loop = loopParam => loopParam[selectType].map((item) => {
      const res = checkedList.find(data => data.selectProId === item.areaId);
      return (
        <div className={styles.provItem} key={`${selectType  }area${  item.areaId}`}>
          <input
            type="checkbox"
            ref={`${selectType  }area${  item.areaId}`}
            checked={!(res === undefined)}
            onChange={(event) => this.handleChangeProChecked(event, item)}
          />
          <span onClick={() => this.showCityModal(item)}>{item.areaName}</span>
        </div>
      );
    });
    // 全国用户：省份列表；省份用户：地市列表
    const areaOuter = areaDataParam => {
      const result = [];
      const idList=checkedList.map(item=>item.selectProId);
      const isAllCheck=areaDataParam[selectType].every(item=>idList.includes(item.areaId))
      const all = (
        <div className={styles.provItem} key={`${selectType}all`}>
          <input checked={isAllCheck} type="checkbox" onChange={(event) => this.chooseAllArea(event)} />
          <span>全选</span>
        </div>
      );
      result.push(all);
      return result.concat(loop(areaDataParam));
    };
    // 全国用户时：展示地市列表
    const cityOuter = () => cityList.map(item => {
      const res = checkedList.find(data => data.selectAreaId === item.areaId);
      return (
        <span key={item.areaId}>
          <input
            type="checkbox"
            className={styles.cityCheckBox}
            checked={!(res === undefined)}
            onChange={(event) => this.handleChangeCityChecked(event, item)}
          />
          <span>{item.areaName}</span>
        </span>
      );
    });
    // 选中内容列表
    const selectedOuter = () => checkedList.map((item) => (
        item.selectAreaId === '-1' ?
          <div className={styles.selectedArea} key={item.selectProId}><span>{item.areaName}</span><Icon onClick={() => this.cancelChecked(item)} type="close" /></div>
          : <div className={styles.selectedArea} key={item.selectAreaId}><span>{item.areaName}</span><Icon onClick={() => this.cancelChecked(item)} type="close" /></div>
      ));
    return (
      <div className={styles.outerArea}>
        <div className={styles.areaTitle}>
          <span className={styles.areaTitleName}>地域：</span>
          <Button type="primary" onClick={this.showModal}>
            <span className={styles.areaName}>
              {areaTitle}
              <Icon type='caret-down' style={{ display: showIcon ? '' : 'none' }} className={styles.iconCaretDown} />
            </span>
          </Button>
        </div>
        <div className={styles.modalOuter} style={{ display: visible ? '' : 'none' }}>
          {/* onMouseLeave={this.leaveAreaChecked} */}
          <div className={styles.modalLeft}>
            <div className={styles.modalLeftTop}>
              <span className={styles.modalTitle}> 地域筛选</span>
              <div className={styles.permissionsOuter}>
                {permissionsOuter(permissions)}
              </div>
            </div>
            <div className={styles.modalLeftBottom}>
              {areaOuter(areaData)}
              <div className={styles.cityOuter} style={{ display: cityVisible ? '' : 'none' }}>
                <div className={styles.closeCityModal}>
                  <Icon type="close" onClick={this.closeCityModal} />
                </div>
                <div className={styles.cityBox}>
                  {cityOuter(cityList)}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modalRight}>
            <div className={styles.modalRightTop}>
              <span>已选择</span>
              <span className={styles.clearBtn} onClick={this.clearSelected}>清空</span>
            </div>
            <div className={styles.modalRightBottom}>
              <div className={styles.selectedContent}>
                {selectedOuter()}
              </div>
              <div className={styles.selectedBtn}>
                <Button className={styles.defineBtn} type="primary" onClick={this.isSureModal}>确定</Button>
                <Button className={styles.cancelBtn} type="primary" onClick={this.closeModal}>取消</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default RegionalArea;
