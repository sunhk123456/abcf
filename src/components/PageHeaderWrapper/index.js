import React from 'react';
// import { FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
// import PageHeader from '@/components/PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
// import MenuContext from '@/layouts/MenuContext';
import BackTop from '@/components/Common/backTop';

const PageHeaderWrapper = ({ children,  wrapperClassName, top, }) => (
  <div style={{/* margin: '-24px -24px 0' */width: "87%"}} className={wrapperClassName}>
    {top}
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
        <BackTop />
      </div>
    ) : null}
  </div>
);

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
