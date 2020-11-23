/**
 * @Description:  ppt 模板
 *
 * @author: liuxiuqian
 *
 * @date: 2020/4/8
 */

import React, { PureComponent } from 'react';
import styles from "./pptEdit.less";
import Cookie from '@/utils/cookie';
import {APIURL_REPORT_PPT} from '@/services/webSocketUrl';

class PptEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {

  }

  componentDidMount() {

  }
  
  render() {
    const {token,userId,deptName,realName,deptId} = Cookie.getCookie('loginStatus');
    const {origin} = window.document.location;
    const reportCreateUrl = `${APIURL_REPORT_PPT}?userId=${userId}&token=${token}&deptName=${encodeURI(deptName)}&realName=${encodeURI(realName)}&deptId=${deptId}&address=${origin}/timeout`;
    return (
      <div className={styles.PptEdit}>
        <iframe className={styles.iframe} title="ppt" height="100%" width="100%" src={reportCreateUrl} />
      </div>
    );
  }
}
export default PptEdit;
