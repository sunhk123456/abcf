import React, { PureComponent } from 'react';
import { Icon} from 'antd';
// import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import iconFont from '../../icon/Icons/iconfont';
import SearchInput from '@/components/SearchPage/search';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFont,
});

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.logos}>
          <div className={styles.trigger} onClick={this.toggle}>
            <IconFont className={styles.logofont} type="icon-liantonglogo"/>
          </div>
          <div className={styles.logoTitle} >新一代经营分析系统</div>
        </div>
        <div className={styles.searchs}>
          <SearchInput />
        </div>
        <div className={styles.infos}>
          <RightContent {...this.props} />
        </div>
      </div>
    );
  }
}
