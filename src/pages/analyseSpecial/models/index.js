import { specailDesc,requestFoldTableData,specialConditions,requestSpecialMaxDate} from "../../../services/analyseSpecial/analyseSpecial";

export default {
  namespace:"analyseSpecialModel",
  state: {
    maxDate:"", // 最大账期
    date:"",// 账期
    conditionList:[],
    conditionValue:[],// 查询时，用户输入筛选条件
    conditionName:[], // 模板筛选条件用于下载
    conditionNameList:[], // 中文筛选条件用于下载
    conditionCount:4, // 用于计算查询及下载位置
    analyseSpecialTitle: {},// 标题和描述
    isIndexDispose: false, // 是否显示指标配置
    foldTableData:{
      tBodyData: [],
      thData:[],
    }, // 表格一与表格二数据
  },
  effects:{
    //  专题描述
    *getSpecailDesc({payload={},callback},{call, put}){
      const response = yield call(specailDesc,payload);
      yield put({
        type:'setSpecailDesc',
        payload:response[0]
      });
      if(callback){callback(response[0])}
    },
    // 表格一与表格二接口
    *getFoldTableData({payload={}},{call, put}){
      const response = yield call(requestFoldTableData,payload);
      if(Object.keys(response).includes("tBodyData")){
        yield put({
          type:'setFoldTableData',
          payload:response
        })
      }else {
        yield put({
          type:'setFoldTableData',
          payload:{
            tBodyData: [],
            thData:[],
          }
        })
      }

    },
    //  获取筛选条件
    *getSpecailConditions({payload,callback},{call, put}){
      const response = yield call(specialConditions,payload);
      if(!("errorCode" in response)){
        yield put({
          type:'setConditionList',
          payload:response
        })
        if(callback)callback(response)
      }

    },
    // 最大账期
    *fetchMaxDate({ payload}, { call, put }) {
      const response = yield call(requestSpecialMaxDate,payload);
      yield put({
        type: 'saveMaxDate',
        payload: response.date,
      });
    },
    // 更改账期
    *fetchDate({ payload}, { put }) {
      yield put({
        type: 'saveDate',
        payload,
      });
    },
    // 更改查询参数
    *getSearchCondition({ payload}, { put }) {
      yield put({
        type: 'saveConditions',
        payload,
      });
    },
    // 清除已输入的筛选条件值
    // eslint-disable-next-line
    *clearCondition({},{put}){
      yield  put({
        type:"saveVerification",
        payload:{
          params:{},
          conditionName:{}
        },
      })
    }
  },
  reducers:{
    setSpecailDesc(state,action){
      return {
        ...state,
        analyseSpecialTitle:action.payload
      }
    },
    setConditionList(state,action){
      let count=0;
      let isIndexDispose = false;
      const conditionName=[];
      const conditionValue=[];
      const conditionNameList=[];
      const arrId = [];
      action.payload.forEach((data)=>{
        if(data.type==="date"||data.type==="input"||(data.type==="singleSelect"&&data.value.hasChild==="0")||(data.type==="moreSelect"&&data.value.hasChild==="0")){
          count += 1;
          conditionName.push({"key": data.name,"value":[],"id":data.id,"type":data.type,"idMold": data.idMold,"list":data.value.data});
          conditionNameList.push({"key": data.name,"value":[],"id":data.id,"type":data.type,"idMold": data.idMold});
          const valueList={};
          const key = data.id;
          valueList[key]=[];
          arrId.push(data.id);
          conditionValue.push(valueList);
        }else if(data.type==="region"){
          const keyPro = data.id;
          const keyCity = data.cityId;
          const proList = {};
          const cityList ={};
          proList[keyPro]=[];
          cityList[keyCity]=[];
          count += 2;
          conditionName.push({"key": "省分","value":[],"id":data.id,"type":"provId","idMold": data.idMold});
          conditionNameList.push({"key": "省分","value":[],"id":data.id,"type":"provId","idMold": data.idMold})
          conditionValue.push(proList)
          conditionName.push({"key": "地市","value":[],"id":data.cityId,"type":"cityId","idMold": data.idMold});
          conditionNameList.push({"key": "地市","value":[],"id":data.cityId,"type":"cityId","idMold": data.idMold})
          conditionValue.push(cityList);
          arrId.push(data.id);
          arrId.push(data.cityId);
        }else if(data.type==="singleSelect"&&data.value.hasChild==="1"){
          const valueList={};
          const childList={};
          const key1=data.id;
          const key2=data.value.childId;
          valueList[key1]=[];
          childList[key2]=[];
          conditionValue.push(valueList);
          conditionValue.push(childList);
          count += 2;
          arrId.push(data.id);
          arrId.push(data.value.childId);
          conditionName.push({"key": data.name,"value":[],"id":data.id,"list":data.value.data,"type":"parent","idMold": data.idMold,"childId":data.value.childId,"childName":data.value.childName});
          conditionNameList.push({"key":data.name,"value":[],"id":data.id,"type":"parent","idMold": data.idMold});
          conditionNameList.push({"key":data.value.childName,"value":[],"id":data.value.childId,"type":"child","idMold": data.idMold});
        }else if(data.type==="moreSelect"&&data.value.hasChild==="1"){
          const valueList={};
          const childList={};
          const key1=data.id;
          const key2=data.value.childId;
          valueList[key1]=[];
          childList[key2]=[];
          conditionValue.push(valueList);
          conditionValue.push(childList);
          count += 2;
          arrId.push(data.id);
          arrId.push(data.value.childId);
          conditionName.push({"key": data.name,"value":[],"id":data.id,"list":data.value.data,"type":"parent","idMold": data.idMold,"childId":data.value.childId,"childName":data.value.childName});
          conditionNameList.push({"key":data.name,"value":[],"id":data.id,"type":"parent","idMold": data.idMold});
          conditionNameList.push({"key":data.value.childName,"value":[],"id":data.value.childId,"type":"child","idMold": data.idMold});
        }else if(data.type==="indexConfig"){
          isIndexDispose = true;
          arrId.push(data.id);
          conditionName.push({"key": data.name,"value":[],"id":data.id,"type":data.type,"idMold": data.idMold,"list":data.value.data});
          conditionNameList.push({"key": data.name,"value":[],"id":data.id,"type":data.type,"idMold": data.idMold});
          conditionValue.push({[data.id]:[]});
        }else if(data.type==="singleRegion" || data.type==="singleProvince"){
          count += 1;
          conditionName.push({"key": data.name,"value":[],"id":data.id,"type":data.type,"idMold": data.idMold,"list":data.value.data});
          conditionNameList.push({"key": data.name,"value":[],"id":data.id,"type":data.type,"idMold": data.idMold});
          conditionValue.push({[data.id]:[]});
        }else if(data.type==="other" ||data.type==="area"){
          if(!arrId.includes(data.id)){
            conditionName.push({"key": data.name,"value":[],"id":data.id,"type":data.type,"idMold": data.idMold});
            conditionValue.push({[data.id]:[]});
            arrId.push(data.id);
          }
        }
      });
      return {
        ...state,
        conditionName,
        conditionValue,
        conditionNameList,
        conditionCount:count,
        isIndexDispose,
        conditionList:action.payload
      }
    },
    saveDate(state,{payload}){
      return{
        ...state,
        date:payload
      }
    },
    saveConditions(state,{payload}){
      return{
        ...state,
        conditionNameList:payload.conditionNameList,
        conditionValue:payload.values
      }
    },
    // 保存表格一表格二数据
    setFoldTableData(state,{payload}){
      return {
        ...state,
        foldTableData:payload
      }
    },

    // 最大账期保存
    saveMaxDate(state,{payload}){
      return {
        ...state,
        maxDate:payload, // 最大账期
        date:payload,// 账期:
      }
    },
  }
}
