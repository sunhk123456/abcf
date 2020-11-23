import React ,{ Component, Fragment } from 'react';
import { Icon, Table } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import styles from './nameListPop.less'



@connect(({nameListModels})=>({
  incomeTableData:nameListModels.incomeTableData,
}))
class NameListPopup extends Component {
  static defaultProps={
    visible:false,
    close:(item)=>{
      console.log(item)
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  
  componentDidMount() {
    this.getTableData()
  }
  
  getTableData=()=>{
    const {dispatch}=this.props;
    const params={};
    dispatch({
      type:`nameListModels/getNameListTableData`,
      payload:params
    })
  };
  
  handleCancel=()=>{
    const {close} = this.props;
    close(false)
  };
  
  
  render() {
    const {incomeTableData}=this.props;
    const tableData={
      "title":"互联网客户拓展部收入情况",
      "thData": [        {
        "title": "业务",
        "id": "yw",
        "unit": ""
      },
        {
          "title": "类型",
          "id": "leixing",
          "unit": ""
        },
        {
          "title": "收入",
          "id": "sr",
          "unit": "万元"
        },
        {
          "title": "同比增幅",
          "id": "tbzf",
          "unit": ""
        }
      ],
      "tbodyData": [
        {
          "key": "1",
          "yw": "移网",
          "leixing": "移网基础",
          "sr": "75,837",
          "tbzf": "15.49%"
        },
        {
          "key": "2",
          "yw": "移网",
          "leixing": "移网基础业务",
          "sr": "75,837",
          "tbzf": "-"
        },
        {
          "key": "3",
          "yw": "移网",
          "leixing": "移网基础业务",
          "sr": "75,837",
          "tbzf": "-15.49%"
        },
        {
          "key": "021",
          "yw": "数据网元",
          "leixing": "移网基础业务",
          "sr": "75,837",
          "tbzf": "0"
        },
        {
          "key": "022",
          "yw": "数据网元",
          "leixing": "移网基础业务",
          "sr": "75,837",
          "tbzf": "15.49%"
        },
        {
          "key": "023",
          "yw": "数据网元",
          "leixing": "移网基础业务",
          "sr": "75,837",
          "tbzf": "-15.49%"
        },
        {
          "key": "024",
          "yw": "数据网元",
          "leixing": "移网基础业务",
          "sr": "75,837",
          "tbzf": "15.49%"
        },
        {
          "key": "025",
          "yw": "数据网元",
          "leixing": "移网基础业务",
          "sr": "75,837",
          "tbzf": "-15.49%"
        }
      ],
      "total": "15",
      "currentPage": "1",
      "totalPage": "3",
    };
    const {thData,tbodyData,currentPage}=incomeTableData;
    const thDataCopy = [...thData];
    thDataCopy.unshift({
      "title": "序号",
      "id": "xuhao",
      "unit": ""
    });
    const columns = thDataCopy.map((thItem,thIndex)=>{
      let tdWidth = 150;
      const paddingLR = 4;
      if(thIndex === 0){
        tdWidth = 50;
      }if(thIndex === 4){
        tdWidth = 100;
      }
      return {
        title: thItem.unit === "" ? thItem.title : `${thItem.title}(${thItem.unit})`,
        dataIndex: thItem.id,
        key: thItem.id,
        width:tdWidth,
        align:"center",
        render: (text) => {
          const textCopy = text;
          if(thIndex === thDataCopy.length-1){
            let color = "classColorDefault";
            if(text !== "-" && text.search("-") === 0){
              color = "classColorred";
            }else if(text !== "-" && text.search("-") === -1 &&  text.search("0") !== 0){
              color = "classColorgreen";
            }
            return (<div style={{width: `${tdWidth-paddingLR}px`}} className={classNames(styles.tdDiv,styles[color])}>{textCopy}</div>)
          }
          return (<div title={thIndex !== 0 && text} style={{width: `${tdWidth-paddingLR}px`}} className={styles.tdDiv}>{textCopy}</div>)
        }
      }
    });
    const data = tbodyData.map((item,index)=>({xuhao: (currentPage-1)*5+index+1,...item}));
    return (
      <Fragment>
        <div className={styles.page}>
          <div className={styles.modelWrapper}>
            <div className={styles.modelHeader}>
              <div className={styles.title}>{tableData.title}</div>
              <div className={styles.icon} onClick={this.handleCancel}>
                <Icon type="close" />
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <div className={styles.table}>
                <Table
                  columns={columns}
                  dataSource={data}
                  rowClassName={styles.trStyle}
                  pagination={false}
                  scroll={{y: 265}}
                />
              </div>
              <div className={styles.pageNationWrapper}>xx</div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default NameListPopup;
