/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  菜单组件</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/7/16
 */

import React from 'react';
import styles from './systemMenu.less';
import { connect } from 'dva';
import { routerState } from '@/utils/tool';
import { Menu } from 'antd';
import openBtn from '@/assets/image/systemMenu/menuBtn.png';

@connect(
  ({ newMenuModel }) => (
    {
      systemMenuData: newMenuModel.firstMenuData,
    }),
)
class SystemMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false, //  切换小菜单 or 大菜单
      selectFirstId: '', //  选中的一级菜单的ID,仅用来做样式改变，不涉及逻辑
      secondMenuShow: false, //  是否展示点击小菜单时弹出的子类菜单
      allOpenKeys: [], //  大菜单展开的key
      allSelectKeys: [], //  大菜单选中的项key
      currentOpenKey: '', //  当前打开的key
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newMenuModel/getFirstMenuData',
      payload: {},
    });
  }

  //  点击展开/收起一级菜单
  clickOpen = () => {
    const { openMenu } = this.state;
    this.setState({
      openMenu: !openMenu,
      secondMenuShow: false,
    });
  };

  //  创建小菜单
  creatFoldMenuDom = data => {
    if (!data || data.length === 0) return;
    const { selectFirstId, secondMenuShow, allSelectKeys } = this.state;
    // eslint-disable-next-line consistent-return
    return data.map((item) => {
      const secondMenuDom = [];
      if (item.children.length) {
        item.children.forEach(secendItem => {
          secondMenuDom.push(
            <div
              className={`${styles.secondMenuItem} ${
                allSelectKeys[0] === secendItem.menuId
                  ? styles.selSecondMenuItem
                  : null
              }`}
              key={secendItem.menuId}
              onClick={() => this.clickSecondMenu(secendItem)}
            >
              {secendItem.menuName}
            </div>,
          );
        });
      }
      return (
        <div
          className={`${styles.foldMenuItem} ${
            selectFirstId === item.menuId ? styles.selectFoldItem : null
          }`}
          onClick={() => {
            this.clickFoldMenu(item);
          }}
          key={`systemMenu${item.menuId}`}
        >
          <img
            src={this.matchImgUrl(item, selectFirstId)}
            alt=""
            key={item.menuId}
            className={styles.foldImg}
          />
          { /* 必须为 此项有子类（item.children.length）且 当前选中的一级id等于此项的id  且展示状态为真 */ }
          {item.children.length !== 0 &&
          selectFirstId === item.menuId &&
          secondMenuShow && (
            <div className={styles.secondMenu}>{secondMenuDom}</div>
          )}
        </div>
      );
    });
  };

  //  点击小菜单时的回调
  clickFoldMenu = data => {
    const { secondMenuShow, selectFirstId } = this.state;
    const { systemMenuData } = this.props;
    const show = data.menuId === selectFirstId && secondMenuShow;
    let clickData = null;
    //  拿到点击的菜单的全部数据
    systemMenuData.forEach(item => {
      if (item.menuId === data.menuId) {
        clickData = item;
      }
    });
    //  如果点击的是有子菜单的。则展开子菜单，否则 选中点击的大菜单并关闭展开的大菜单
    if (clickData.children.length) {
      this.setState({
        allOpenKeys: [data.menuId],
        currentOpenKey: data.menuId,
      });
    } else {
      this.setState({
        allSelectKeys: [data.menuId],
        allOpenKeys: [],
      });
    }
    //  改变选中ID， 显示浮窗小菜单
    this.setState({
      selectFirstId: data.menuId,
      secondMenuShow: !show,
    });
  };

  //  点击小菜单后 再点击弹出二级菜单时的回调
  clickSecondMenu = secondItem => {
    this.setState({
      allSelectKeys: [secondItem.menuId],
    });
  };

  //  点击大菜单时的回调
  onOpenChange = openKey => {
    const clickKey = openKey.pop();
    const { currentOpenKey } = this.state;
    //  如果点击的不是当前展开的菜单，则展开点击菜单，关闭当前展开的菜单  否则 关闭当前点击菜单
    if (clickKey && currentOpenKey !== clickKey) {
      this.setState({
        allOpenKeys: [clickKey],
        currentOpenKey: clickKey,
      });
    } else {
      this.setState({
        allOpenKeys: [],
        currentOpenKey: '',
      });
    }
  };

  /**
   *  选中一级或二级菜单时触发
   *  菜单只能同时展开一个一级菜单，不能展开多个
   *  可选中的一级或二级菜单一定不会被展开，但可展开的一级菜单可以被置为selectFirstId，因为需要在小菜单里被选中
   *
   *  逻辑：不论选中的是一级菜单还是二级菜单，都把selectFirstId置为当前展开的一级菜单id
   *  回调：判断当前选中的是否为一级菜单，若不是，则说明当前选中的是二级菜单，并且  有且仅有有一个展开的一级菜单，以上逻辑正确，
   *       若是，则说明当前不应该有展开的菜单，则把allOpenKeys置为空
   */
  onSelect = selectKey => {
    const { systemMenuData } = this.props;
    const { allOpenKeys } = this.state;
    this.setState({
      selectFirstId: allOpenKeys[0],
      allSelectKeys: [selectKey.key],
    },()=>{
      systemMenuData.forEach(item => {
        //  判断当前选中是否为一级菜单
        if (item.menuId === selectKey.key) {
          this.setState({
            allOpenKeys: [],
            selectFirstId: selectKey.key,
          });
        }
      });
    });
  };

  //  创建大菜单Dom
  creatOpenMenuDom = data => {
    if (!data || data.length === 0) return;
    const { selectFirstId } = this.state;
    const { SubMenu } = Menu;
    // eslint-disable-next-line consistent-return
    return data.map(item => {
      const optionDom = item.children.map(childrenItem => (
        <Menu.Item key={childrenItem.menuId}>
          {childrenItem.menuName}
        </Menu.Item>
        ));
      if (item.children.length) {
        return (
          <SubMenu
            key={item.menuId}
            title={
              <div className={styles.firstMenuItem}>
                <img
                  src={this.matchImgUrl(item, 'false')}
                  alt=""
                  key={item.menuId}
                  className={styles.foldImg}
                />
                <span className={styles.submenuItemText}>{item.menuName}</span>
              </div>
            }
          >
            {optionDom}
          </SubMenu>
        );
      }
        return (
          <Menu.Item
            key={item.menuId}
          >
            <div className={styles.firstMenuItem}>
              <img
                src={this.matchImgUrl(item, selectFirstId)}
                alt=""
                key={item.menuId}
                className={styles.foldImg}
              />
              <span className={styles.submenuItemText}>{item.menuName}</span>
            </div>
          </Menu.Item>
        );

    });
  };

  matchImgUrl = (item, selectFirstId) => {
    let img;
    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      img = require(`@/assets/image/systemMenu/${
        selectFirstId === item.menuId ? `${item.menuIcon}Sel` : item.menuIcon
      }.png`);
    } catch (e) {
      // eslint-disable-next-line global-require
      img = require(`@/assets/image/systemMenu/specialSel.png`);

    }
    return img;
  };

  render() {
    const { openMenu, allOpenKeys, allSelectKeys } = this.state;
    console.log('Open', allOpenKeys);
    console.log('Select', allSelectKeys);
    console.log('selectFirstId', this.state.selectFirstId);
    const { systemMenuData } = this.props;
    return (
      <div className={styles.systemMenu}>
        {!openMenu && (
          <div className={styles.fold}>
            <img
              src={openBtn}
              alt=""
              className={styles.foldBtn}
              onClick={this.clickOpen}
            />
            {this.creatFoldMenuDom(systemMenuData)}
          </div>
        )}
        {openMenu && (
          <div className={styles.open}>
            <img
              src={openBtn}
              alt=""
              className={styles.closeBtn}
              onClick={this.clickOpen}
            />
            <Menu
              mode="inline"
              openKeys={allOpenKeys}
              selectedKeys={allSelectKeys}
              onOpenChange={this.onOpenChange}
              onSelect={this.onSelect}
            >
              {this.creatOpenMenuDom(systemMenuData)}
            </Menu>
          </div>
        )}
      </div>
    );
  }
}

export default SystemMenu;
