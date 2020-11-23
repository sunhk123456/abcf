/* eslint-disable import/order,import/newline-after-import,react/no-array-index-key,prefer-template,arrow-body-style,prefer-const,prefer-destructuring,react/jsx-boolean-value */
import React, { PureComponent } from 'react';
// import { FormattedMessage, formatMessage } from 'umi/locale';
import {Tag, Menu, Icon,Modal,message, Badge } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
// import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
// import SelectLang from '../SelectLang';
import styles from './index.less';
import CurrentTime from './currentTime'
import iconFont from '../../icon/Icons/iconfont';
import Cookie from '@/utils/cookie';
import router from 'umi/router';
import Urls from '@/services/urls.json';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});


@connect(({ downloadAllModels }) => ({
  downloadAllModels,
  myWorkbench:downloadAllModels.myWorkbench // 我的工作台数据
}))
class GlobalHeaderRight extends PureComponent {
  state = {
    ModalVisible: false,
  };
  
  componentDidMount() {
    this.getMyWorkbenck()
  }
  
  
  // 请求我的工作台数据
  getMyWorkbenck=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'downloadAllModels/getMyWorkbench',
      payload: {},
    });
  };

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  logouts =()=>{
    Cookie.clear();
    router.push('/login')
  };

  // myCollectionFun=()=>{
  //   router.push('/myCollection')
  // };

  showHelp= () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getHelpData',
    });
    this.setState({
      ModalVisible:true
    })
  };

  handleDetailsVisible = () =>{
    this.setState({
      ModalVisible:false
    })
  };

  // 下载
  getDocumentPath=pathName=>{
    let loginStatus=Cookie.getCookie("loginStatus");
    let userId=loginStatus.userId;
    let token=loginStatus.token;
    let reourcesId = "";
    let moudleId = "helpDoc";
    let parameter = "?ticket="+token+"&token="+token+"&userId="+userId+"&moudleId="+moudleId+"&reourcesId="+reourcesId;//
    let path = pathName.replace(/\s+/g,"");// 去除空格
    let url = Urls.urls[6].url;
    fetch(url+parameter, {
      credentials: 'include',// 表示发送请求附带域10.244.4.182:8096下cookie
      mode: 'cors',// 跨域请求auth
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "Cache-control":"no-cache",
        "If-Modified-Since":"0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
      }
    }).then((response) => {
      if(response.status === 403){
        message.warning("权限不够下载失败",2);
      }else if(response.status === 200){
        window.open(path+parameter,"_self");
      }
    })
  };

  render() {
    const {
      // currentUser,
      // fetchingNotices,
      // onNoticeVisibleChange,
      onMenuClick,
      // onNoticeClear,
      menu:{helpData},
      theme,
    } = this.props;
    const {ModalVisible}=this.state;
    const { downloadAllModels } = this.props;
    const { redDot } = downloadAllModels;
    let tbody;
    let tTitle;
    if(helpData.tbodyData!==undefined){
      tbody=helpData.tbodyData.map((item,index) => {
        return (
          <tr className={index%2===0? styles.tableColor:""} key={index+"tbody"}>
            <td>{index+1}</td>
            <td>{item.documentName}</td>
            <td>{item.releaseTime}</td>
            <td><span className={styles.downPdfs} onClick={this.getDocumentPath.bind(this,item.downloadPath)}>下载</span></td>
          </tr>
        )
      })
    }
    if(helpData.thData!==undefined){
      tTitle= helpData.thData.map((item,index) => {
        return (
          <td key={index+"th"}>{item}</td>
        )
      })
    }
    const info = Cookie.getCookie('loginStatus');
    const {myWorkbench}=this.props;
    const menuItem=myWorkbench.map((item)=>{
      if(item.id==="downloadAllList"){
        return (
          <Menu.Item key={`${item.id}&&${item.url}`}>
            <IconFont className={styles.myInfo} type={item.iconName} />
            <Badge className={styles.downloadList} count={redDot} dot={true} showZero={false}>{item.name}</Badge>
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={`${item.id}&&${item.url}`}>
          <IconFont className={styles.myInfo} type={item.iconName} />
          <span>{item.name}</span>
        </Menu.Item>
      )
    });
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {menuItem}
      </Menu>
    );
    // const noticeData = this.getNoticeData();
    // const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    let showName;
    if(info.realName>5){
      showName=info.realName.substring(0,4)+"..."
    }else {
      showName=info.realName
    }
    return (
      <div className={className}>
        <CurrentTime />
        <div className={styles.touxiang}>
          <IconFont className={styles.touxiangIcon} type="icon-wutouxiang" />
        </div>
        <div className={styles.UserNameCon}><span title={info.realName}>{showName}</span></div>
        <div className={styles.touxiang}>|</div>
        {/* <div className={styles.exit} onClick={()=>this.myCollectionFun()}>我的收藏</div> */}
        {/* <div className={styles.touxiang}>|</div> */}
        <HeaderDropdown overlay={menu}>
          <div className={`${styles.action} ${styles.account}`}>
            <span><Badge className={styles.name} count={redDot} showZero={false}>工作台</Badge></span>
            <Icon className={styles.name} type="caret-down" />
          </div>
        </HeaderDropdown>
        <div className={styles.touxiang}>|</div>
        <div className={styles.exit} onClick={()=>this.showHelp()}>帮助</div>
        {/* <div className={styles.touxiang}>|</div> */}
        {/* <div className={styles.exit} onClick={this.logouts}> */}
        {/*  <IconFont type="icon-tuichu" /> */}
        {/*  <span>退出</span> */}
        {/* </div> */}
        <Modal
          wrapClassName={styles.wrapHelp}
          width='70%'
          bodyStyle={{ padding: '5px 40px 8px' }}
          destroyOnClose
          title="帮助文档"
          footer={null}
          visible={ModalVisible}
          onCancel={() => this.handleDetailsVisible()}
        >
          <div className={styles.tableHelpWrapper}>
            <table className={styles.tableHelp}>
              <thead>
                <tr>{tTitle}</tr>
              </thead>
              <tbody>
                {tbody}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    );
  }
}
export default GlobalHeaderRight;
