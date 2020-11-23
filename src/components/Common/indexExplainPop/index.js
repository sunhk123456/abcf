/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description: 公共组件：指标解释弹出层组件/p>
 *
 * <p>Copyright: Copyright BONC(c) 2018 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司</p>
 *
 * @author xingxiaodong
 * @date 2019/3/11
 */
import React, { Fragment, PureComponent } from 'react';
import {Button,Table,Modal } from 'antd';
import { connect } from 'dva/index';
import styles from './index.less'

@connect(({ indexExplainModels }) => ({
  indexExplainModels,
}))
class IndexExplain extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      column:[],  // 详细解释表格列
      dataForTable:[], // 详细解释表格数据
      seeDetail:false // 控制详细解释表格弹窗的可见性
    }

  }

  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    const {show}=nextProps;
    if (show !== prevState.seeDetail) {
      return {
        seeDetail:show
      };
    }
    return null;
  }

  componentDidMount() {
    this.fetchIndexDetail();
  }

  componentDidUpdate(prevProps) {
    const {markId}=this.props;
    if(markId !== prevProps.markId){
      this.fetchIndexDetail();
    }
  }

  fetchIndexDetail =()=>{
    const {dispatch,markId,moduleApi="specialReport",status="",specialType=''}=this.props;
    // 请求指标详细解释弹窗表格数据
    dispatch({
      type: 'indexExplainModels/fetchIndexDetail',
      payload: {
        markType: markId, // 专题ID
        status,
        specialType
      },
      moduleApi,
      callback: e => {
        //  console.log("指标详细解释表格数据请求成功");
        // 当返回数据
        if(e.thData!==undefined && e.tbodyData!==undefined){
          const thTitle=e.thData;
          const tableList=e.tbodyData;
          this.createColumn(thTitle);
          this.createTableList(tableList);
        }
      },
    });
  };

  // 让详细解释表格隔行变色
  changeRowColor = (record,index) => {
    let className = styles.lightRow;
    if (index % 2 === 1) className = styles.darkRow;
    return className;
  };

  notSeeDetail=()=>{
    const {callback}=this.props;
    // console.log("callback")
    // console.log(this.props)
    callback()
  };

  // 创造指标详细解释的列信息
  createColumn=(thTitle)=>{
    const columns=[];
    let currentWidth="160";
    if(thTitle.length>0){
      for(let i=0;i<thTitle.length;i+=1){
        switch (i){
          case 0:
            currentWidth="10%";
            break;
          case 1:
            currentWidth="20%";
            break;
          case 2:
            currentWidth="20%";
            break;
          case 3:
            currentWidth="50%";
            break;
          default:
            break;
        }
        columns.push({
          title: thTitle[i],
          dataIndex:`${i}table`,
          width:currentWidth,
          key:`${i}tableList`,
          align: i<3?'center':null,
          render: text => (
            <span title={text}>
              {text}
            </span>
          ),
        });
      }
    }

    // console.log("columns")
    // console.log(columns)
    this.setState({
      column:columns,
    })
  };

  // 创建指标详细解释表格内的表数据
  createTableList=(tableList)=>{
    // console.log(tableList)
    // console.log("tableList")
    const dataSource=[];
    let test={};
    if(tableList.length>0){
      for(let i=0;i<tableList.length;i+=1){
        // test.uid=`key${i}`
        test.key=`key${i}`;
        for(let j=0;j<tableList[i].length;j+=1){
          test[`${j}table`]=tableList[i][j];
        }
        dataSource.push(test);
        test={};
      }
    }
    // console.log(dataSource)
    this.setState({
      dataForTable:dataSource,
    })
  };

  render(){
    const {seeDetail,column,dataForTable}=this.state;
    // console.log("this.props")
    // console.log(this.props)
    return(
      <Fragment>
        <div className={styles.page}>
          <Modal
            visible={seeDetail}
            onCancel={this.notSeeDetail}
            width="80%"
            title="指标解释"
            wrapClassName={styles.wrapModal}
            closable={false}
            footer={[
              <div className={styles.modalCancelDiv} key="close">
                <Button onClick={this.notSeeDetail}>
                  关闭
                </Button>
              </div>
            ]}
          >
            <div>
              <Table
                // rowKey={record => record.uid}z
                className={styles.tableDiv}
                dataSource={dataForTable}
                bordered
                columns={column}
                pagination={false}
                rowClassName={this.changeRowColor}
              />
            </div>
          </Modal>
        </div>
      </Fragment>
    )
  }
}
export default IndexExplain

// 引用方法如下
// this.state={showIndexExplain:false}
// <IndexExplain show={showIndexExplain} callback={this.callbackIndexExplain} markId="013" />
//  指标解释按钮被点击
// indexExplain=()=>{
//   console.log("指标解释按钮被点击")
//   this.setState({
//     showIndexExplain:true
//   })
// }
//
// // 指标解释回调，关闭弹窗
// callbackIndexExplain=()=>{
//   console.log("指标解释回调")
//   this.setState({
//     showIndexExplain:false,
//   })
// }
