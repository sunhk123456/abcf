
/**
 *
 * title: mySpecialSubject
 *
 * description:  我的工作台我的专题-表格专题-新增专题-内容检索
 *
 * @author: xingxiaodong
 *
 * @date 2019/04/22
 *
 */
import React, { PureComponent } from 'react';
import { Modal,Icon,Input,Form,Button,message} from 'antd';
import { connect } from 'dva/index';
// import isEqual from 'lodash/isEqual';
import styles from './indexSearch.less';
import DayAndMonth from '../Common/dayAndMonth';

const {Search} = Input;
//
// "allIndex":[
//   {
//     "indexId": "id1",
//     "indexName": "指标名称1"
//   },
//   {
//     "indexId": "id2",
//     "indexName": "指标名称2"
//   }
// ],
//   "selectIndex":[
//   {
//     "indexId": "id3",
//     "indexName": "指标名称3"
//   },
//   {
//     "indexId": "id4",
//     "indexName": "指标名称4"
//   }
// ]

@connect(({mySpecialSubjectModels}) =>({
  mySpecialSubjectModels,
  indexConfigData:mySpecialSubjectModels.indexConfigData,
  allTableIndexData:mySpecialSubjectModels.allTableIndexData,
  selectTableIndexData:mySpecialSubjectModels.selectTableIndexData,
  selectSpecial:mySpecialSubjectModels.selectSpecial,
  moduleId: mySpecialSubjectModels.moduleId,
  status:mySpecialSubjectModels.status,
}))

@Form.create()
class IndexSearch extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      dayAndMonth:[{ id: 'D', name: '日' }, { id: 'M', name: '月' }],
      switchable:"1",
      selectId:"D"
    };
  };

  componentDidMount() {
    console.log("首次加载指标配置弹出层");
    // 请求指标搜索数据
    const {dispatch,selectSpecial,moduleId,status}=this.props;
    const params={
      "markType":selectSpecial.id,
      "dateType":selectSpecial.dateType,
      "specialType":"table",
      "search":"",
      status
    };
    dispatch({
      type:"mySpecialSubjectModels/getSearchData",
      payload:params,
      callback:(response)=>{
        // 首次加载左右两侧指标
        dispatch({
          type:"mySpecialSubjectModels/saveAllTableIndexData",
          payload:response.allIndex
        });
        dispatch({
          type:"mySpecialSubjectModels/saveSelectTableIndexData",
          payload:response.selectIndex
        })
      }
    });
    // 请求日月切换接口
    const params1={
      "markType":selectSpecial.id,
      "specialType":"table",
      moduleId
    };
    dispatch({
      type:"mySpecialSubjectModels/getDayAndMonth",
      payload:params1,
      callback:(response)=>{
        this.setState({
          dayAndMonth:response.list,
          switchable:response.switchable,
          selectId:response.selectId
        })
      }
    })

  }

  componentWillUnmount(){
    // 清空指标搜索的值
    console.log('清空指标');
    const {dispatch}=this.props;
    dispatch({
      type:"mySpecialSubjectModels/saveSelectTableIndexData",
      payload:[]
    });
    dispatch({
      type:"mySpecialSubjectModels/saveAllTableIndexData",
      payload:[]
    });
  }

  // 点击左边指标选中到右边
  handleClickLeft=(params)=>{
    const {selectTableIndexData,dispatch}=this.props;
    const idArray=selectTableIndexData.length>0?selectTableIndexData.map((item)=>(item.indexId)):[];
    const  newArrayData=[...selectTableIndexData];
    if(!idArray.includes(params.indexId)){
      newArrayData.push(params);
      const num = newArrayData.length;
      if(num===30){
        message.error(`你选中了${num}个指标!`);
        dispatch({
          type:"mySpecialSubjectModels/saveSelectTableIndexData",
          payload:newArrayData
        });
      }else if(num <= 50){
        dispatch({
          type:"mySpecialSubjectModels/saveSelectTableIndexData",
          payload:newArrayData
        });
      }else {
        message.error(`你已超出50个指标!`);
      }
    }
  };

  // 删除右边指标
  handleDelete=(indexId)=>{
    const {selectTableIndexData,dispatch}=this.props;
    dispatch({
      type:"mySpecialSubjectModels/saveSelectTableIndexData",
      payload:selectTableIndexData.filter(item=>item.indexId!==indexId)
    })
  };

  // 点击搜索指标
  handleSearch=(value,dateType)=>{
    const {dispatch,selectSpecial,status}=this.props;
    const params={
      "markType":selectSpecial.id,
      "dateType":dateType || selectSpecial.dateType,
      "specialType":"table",
      "search": value,
      "status":status,
    };
    dispatch({
      type:"mySpecialSubjectModels/getSearchData",
      payload:params,
      callback:(response)=>{
        // 搜索以后改变左侧全部列表
        dispatch({
          type:"mySpecialSubjectModels/saveAllTableIndexData",
          payload:response.allIndex
        });
      }
    })
  };

  handleOk=()=>{
    const {dispatch,selectTableIndexData,moduleId,selectSpecial,status}=this.props;
    console.log("selectTableIndexData");
    console.log(selectTableIndexData);
    const selectIndex=selectTableIndexData.map((item)=>(item.indexId));
    const params={
      "markType":selectSpecial.id,
      "dateType":selectSpecial.dateType,
      "specialType":"table",
      moduleId,
      status,
      selectIndex
    };
    if(selectIndex.length<1){
      message.error("必须选择一个指标！")
    }else if(selectIndex.length>50){
      message.error("选择指标不能超过50个！")
    }else {
      dispatch({
        type:"mySpecialSubjectModels/fetchIndexConfigSave",
        payload:params,
        callback:(response)=>{
          if(response.code==="200"){
           //  message.success(response.message);
            this.close("fetchTable");
          }else {
            message.error(response.message)
          }
        }
      });
    }


  };

  close=(fetchTable)=>{
    const {callback}=this.props;
    callback(false,fetchTable);
  };

  dayAndMonth=(id)=>{
    const {switchable}=this.state;
    if(switchable==="0"){
      message.error("此时不可切换日月标识");
      return null
    }
    const {selectTableIndexData}=this.props;
    if(selectTableIndexData.length>0){
      message.error("已经选择指标，此时不可切换日月标识");
      return null
    }
    const {dispatch,selectSpecial}=this.props;
    const params=Object.assign({},selectSpecial,{dateType:id});
    dispatch({
      type:"mySpecialSubjectModels/setSelectSpecialHandle",
      payload:params,
      callback:()=>{
        this.handleSearch("",id);
      }

    });
    this.setState({
      selectId:id
    });
    // 日月切换后 清空搜索
    dispatch({
      type:"mySpecialSubjectModels/saveAllTableIndexData",
      payload:[],
    });

    return null
  };

  render() {
    const {allTableIndexData,selectTableIndexData}=this.props;
    const {dayAndMonth,selectId}=this.state;

    const leftList = allTableIndexData.map(item => (
      <div
        className={styles.listItem}
        key={item.indexId}
        onClick={() => this.handleClickLeft(item)}
      >
        {item.indexName}
      </div>
      ),
    );
    const rightList = selectTableIndexData.map(item => (
      <div className={styles.listItem} key={item.indexId}>
        {item.indexName}
        <Icon
          type="close-circle"
          style={{ position: 'absolute', right: 0 }}
          onClick={() => this.handleDelete(item.indexId)}
        />
      </div>
      ),
    );
    return (
      <div className={styles.indexConfiguration}>
        <Modal
          destroyOnClose
          closable={false}
          centered
          visible
          width={window.screen.width>1869?"50%":"55%"}
          footer={null}
          onCancel={()=>this.close()}
        >
          <div>
            <div className={styles.modalTitle}>
              <div className={styles.leftTitle}>
                <div className={styles.corn} />
                <div className={styles.font}>指标搜索</div>
                <div className={styles.dayAndMonth}>
                  <DayAndMonth
                    arrayData={dayAndMonth}
                    selectIndex={selectId}
                    callback={this.dayAndMonth}
                  />
                </div>
              </div>
              <Search
                onSearch={(value)=>this.handleSearch(value)}
                style={{width:200,marginRight:18,backgroundColor: "rgba(241, 241, 241, 1)"}}
              />
            </div>
            <div className={styles.modalTransfer}>
              <div className={styles.transferList}>
                <div className={styles.transferTitle}>选择指标</div>
                <div className={styles.leftList}>
                  {leftList}
                </div>
              </div>
              <div className={styles.transferList}>
                <div className={styles.transferTitle}>已选指标</div>
                <div className={styles.rightList}>{rightList}</div>
                <div className={styles.bottomButton}>
                  <Button onClick={this.handleOk}>确认</Button>
                  <Button onClick={()=>{this.close()}}>取消</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default IndexSearch;
