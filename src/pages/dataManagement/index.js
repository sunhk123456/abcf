/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  数据管理页面</p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author: Yzh
 * @date: 2020/7/17
 */

import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Condition from '../../components/DataManagement/condition'
import DataManagementTable from '../../components/DataManagement/table';

@connect(
  (
    {dataManagementModels}
  )=>(
    {
      markType:dataManagementModels.markType,
      conditionData:dataManagementModels.conditionData,
      tableData:dataManagementModels.tableData,
      conditionSearchData:dataManagementModels.conditionSearchData,
      title:dataManagementModels.title,
    }
  )
)
class DataManagement extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getCondition();
    this.getTableData("1","10","","");
  }

  getCondition = () => {

    const { dispatch, markType } = this.props;
    dispatch({
      type: `dataManagementModels/fetchCondition`,
      payload: {
        markType
      },
    });
  };

  getTableData = (currentPage,pageSize,sortId,order,defaultCondition) => {
    const { dispatch, markType, conditionSearchData } = this.props;
    const condition = {};
    const conditionDefault =  defaultCondition || conditionSearchData;
    conditionDefault.forEach((item)=>{
      condition[item.id] = item.selectId;
    });
    dispatch({
      type: `dataManagementModels/fetchTable`,
      payload: {
        markType,
        currentPage,
        pageSize,
        condition,
        sortId,
        order
      },
    });
  };

  clickSearch = condition => {
    this.getTableData("1","10","","",condition)
  };

  render() {
    const { conditionData, tableData,title } = this.props;
    return (
      <PageHeaderWrapper>
        <div className={styles.dataManagement}>
          <div className={styles.specialName}>{title}</div>
          <div className={styles.condition}>
            <Condition data={conditionData} callbackOnSearch={this.clickSearch} />
          </div>
          <div className={styles.tableWrapperIndex}>
            <DataManagementTable
              pageSize={10}
              tableData={tableData}
              callBackRequestTable={this.getTableData}
            />
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default DataManagement;
