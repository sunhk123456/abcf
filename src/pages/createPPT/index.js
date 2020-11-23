/**
 *
 * <p>Title: BONC - React </p>
 *
 * <p>Description:  </p>
 *
 * <p>Copyright: Copyright BONC(c) 2019 - 2025 </p>
 *
 * <p>Company: 北京东方国信科技股份有限公司 </p>
 *
 * @author  liutong
 * @date 2019/4/18
 */
import React,{PureComponent} from "react"
import {connect} from 'dva';
import isEqual from 'lodash/isEqual';
import styles from './index.less'
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import DownloadUrl from '@/services/downloadUrl.json';


@connect(({createPPT})=>({reportTable:createPPT.reportTable}))
 class CreatePPT extends PureComponent {
  constructor(props){
    super(props);
    this.state= {

    }
  }

  componentDidMount() {
    const {dispatch}= this.props;
    dispatch({
      type:'createPPT/fetchPPTable',
    })
  }

  shouldComponentUpdate(nextProps){
    const nextData=nextProps.reportTable;
    const {reportTable}=this.props;
    return (!isEqual(nextData,reportTable))&&(nextData!==undefined)
  }


  downLoad=(pathName)=>{
    const path = pathName.replace(/\s+/g,"");// 去除空格
    window.open(path,"_self");
  }

  onlineView=(path)=>{
    if(path!==''){
      console.log(path)
      const w =window.open('about:blank');
      w.location.href=`${DownloadUrl.urls[1].url}?file=${path}`;
      // window.open(downLoadUrl.urls[2].url+"/node_modules/pdfjs/web/viewer.html?file="+path)
    }
  }

  render(){
    const {reportTable}=this.props;
    const tableData = reportTable;
    let tableList;
    if (tableData.length!==0){
      tableList =tableData.map((item,index)=>{
        let trStyle
        if(index%2===0){
          trStyle = styles.ppt_buletr;
        }else {
          trStyle = styles.ppt_writetr;
        }
        return(
          <tr className={trStyle}>
            <td className={styles.pptTd}>{index+1}</td>
            <td className={styles.pptTd}>{item.date}</td>
            <td className={styles.pptTd}>{item.reportName}</td>
            <td className={styles.pptAction}>
              <span className={styles.pptDownload} onClick={()=>this.downLoad(item.pptPath)}>下载</span>
              <span className={styles.pptView} onClick={()=>this.onlineView(item.pdfPath)}>预览</span>
            </td>
          </tr>
        )
      })
    }
    return(
      <PageHeaderWrapper>
        <div className={styles.createPPT}>
          <div className={styles.pptTitle}>分析报告生成列表</div>
          <table className={styles.pptTable}>
            <thead>
              <tr>
                <td className={styles.pptTd}>序号</td>
                <td className={styles.pptTd}>日期</td>
                <td className={styles.pptTd}>报告名称</td>
                <td className={styles.pptTd}>操作</td>
              </tr>
            </thead>
            <tbody>
              {tableList}
            </tbody>
          </table>
        </div>
      </PageHeaderWrapper>
    )

  }
}
export default CreatePPT;
