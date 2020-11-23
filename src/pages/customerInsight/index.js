import React, { PureComponent } from 'react';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Cookie from '@/utils/cookie';
import {APIURL_CUSTOMER_INSIGHT_TEST} from '@/services/webSocketUrl';
import styles from './index.less'

class CostomerInsight extends PureComponent {
  constructor(props){
    super(props);
    this.state={};
  }
  
  componentDidMount() {}
  
  render() {
    const {token,userId} = Cookie.getCookie('loginStatus');
    console.log("window.document.location");
    console.log(window.document.location);
    const {origin,pathname} = window.document.location;
    const customerInsightUrl = `${APIURL_CUSTOMER_INSIGHT_TEST}${pathname}?userId=${userId}&token=${token}&address=${origin}/timeout`;
    console.log(customerInsightUrl);
    return (
      <PageHeaderWrapper>
        <div className={styles.page}>
          <iframe className={styles.iframe} title="customerInsight" height="100%" width="100%" src={customerInsightUrl} />
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default CostomerInsight
