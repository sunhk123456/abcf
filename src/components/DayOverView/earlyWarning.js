/* eslint-disable no-undef,react/prefer-stateless-function */
/**
 * desctiption 智能预警组件

 * created by sunrui

 * date 2018/11/22
 */

import React,{Component,Fragment} from 'react';
import { Icon } from 'antd'
import iconFont from '../../icon/Icons/iconfont';
import styles from './earlyWarning.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl:iconFont
});

class EarlyWarning extends Component {
    render(){
        const {desc,warningLevel} = this.props;
        const warningDesception = desc === " " || desc === "-" ? null: <span className={styles.warningDesc}>详情：{desc}</span>
        const warningBody = (
          <div className={styles.warningBody}>
            <IconFont className={styles.warnIcon} type="icon-yujing" />
            <span className={styles.warningLevel}>预警等级：</span>&nbsp;<span className={styles.warningLevel}>{warningLevel}</span> <br />
            {warningDesception}
          </div>
        );
        return(
          <Fragment>
            {warningBody}
          </Fragment>
        )
    }
}
export default EarlyWarning;
