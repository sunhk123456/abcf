/**
 * @date: 2019/9/11
 * @author 风信子
 * @Description:
 */
import {queryFaqs, queryQuestion, queryQuestionType, queryTypeList, queryConversation } from '@/services/xiaozhiApi';


export default {
  namespace:'xiaozhiModels',

  state:{
    chatInfo:[
      {
        isUser: false, // 是否为用户聊天 记录
        isType: "-1", // 如果是小智回答  -2表示询问选择 -1表示常见问题 0表示正常聊天 1指标 2专题 3报告 4报表 6表示指标分析
        chartWord: "常见问题",
        data:[], // 类型对应数据
      }
    ],
    questionTypeData:[],//  问题列表
    chatQuestion:[], // 常见问题
    allQuestionList:[], // 全部的分类列表
    questionList:[],  // 处理后具体的分类列表
    fillerQuestionList:[], // 过虑后的 问题数据
    inputQuestion:"", // 问题组件列表上方的input
    questionListShow: false, // 问题组件列表 是否显示
    selectQuestionList:{
      name: "",
      id: ""
    }, // 问题组件列表 选中
    selectTypeList:{
      typeName: "",
      typeId: "",
    }, // 选中的问题分类
    bottomInput:"", // 底部输入框，
    questionState: 0, // 0表示 输入状态 1表示 常见问题  2表示问题分类选中 3表示聊天问题
    selectChatQuestion: {}, // 选中的常见问题选项
    requestParams:{
      qId:"", // 常见问题id（未选择为空
      qcontent:"", // 常见问题内容（未选择为空）
      typeId:"", // 选择的问题分类id
      typeName:"", // 选择的问题分类名称
      id:"", // 分类列表中id（未选择为空）
      name:"", // 分类列表中名称（未选择为空）
      content:"", // 输入内容（不选择问题时输入内容）
      clarifyCode:"", // 返回内容为其他时澄清内容列表的id
      clarifyContent: "", // 返回内容为其他时澄清内容列表的内容
      isInput: "", // 判断是用户输入的还是从下拉框选择的，输入的为input，选择的为select
    }, // 请求参数
  },


  effects:{
    // 常见问题
    *fetchFaqs({payload={}},{call,put}){
      const res = yield call(queryFaqs,payload);
      yield put({
        type:'setFaqs',
        payload:res
      })
    },

    // 问题分类
    *fetchQuestionType({payload={}},{call,put}){
      const res = yield call(queryQuestionType,payload);
      yield put({
        type:'setQuestionType',
        payload:res
      })
    },

    // 获取问题分类及各分类下的数据列表
    *fetchQueryTypeList({payload={}},{call,put}){
      const res = yield call(queryTypeList,payload);
      yield put({
        type:'setQueryTypeList',
        payload:res
      })
    },

    // 小智请求
    *fetchQueryQuestion({payload},{call,put}){
      const res = yield call(queryQuestion,payload);
      yield put({
        type:'setQueryQuestion',
        payload:res
      })
    },

    // 小智请求
    *fetchQueryConversation({payload},{call}){
      yield call(queryConversation,payload);
    },

  },


  reducers: {
    // 保存常见问题数据
    setFaqs(state, {payload}){
      const chatInfo = [
        {
          isUser: false, // 是否为用户聊天 记录
          isType: "-1", // 如果是小智回答 -2表示聊天问题 -1表示常见问题 0表示正常聊天 1指标 2专题 3报告 4报表 6表示指标分析
          chartWord: "常见问题",
          data:payload, // 类型对应数据
        },
        // {
        //   isUser: false,
        //   isType: "0",
        //   chartWord: "您好我是小智，请点击常见问题或选择分类进行提问。",
        //   data:[],
        // },
        // {
        //   isUser: false,
        //   isType: "6",
        //   chartWord: "小智分析，移动业务计费收入降低原因分析如下：",
        //   data: {
        //     isReasonPage:"true",
        //     "url": "/intelligenceAnalysis",
        //     "dateType": "1",
        //     "date": "2005-01-10",
        //     "markType": "215dd",
        //     "markName": "移动业务出账收入xx分析",
        //     "phenomenon": "移动业务出账收入环比下降",
        //     "upOrDown": "down",
        //     "condition": [
        //       {
        //         "date": [
        //           "2018-15"
        //         ]
        //       },
        //       {
        //         "cityId": [
        //           222
        //         ]
        //       }
        //     ]
        //   }
        // },
        // {
        //   isUser: false,
        //   isType: "6",
        //   chartWord: "经小智分析，移动业务出账收入没有降低，环比值为##huanbiId##,累计值值为##leijiId##",
        //   data: {
        //     isReasonPage:"false",
        //     falseReason:[
        //       {
        //         "id": "huanbiId",
        //         "unit": "%",
        //         "value": "-10.20",
        //         "color": "red"
        //       },
        //       {
        //         "id": "leijiId",
        //         "unit": "万元",
        //         "value": "52,100",
        //         "color": "green"
        //       }
        //     ]
        //   }
        // }
      ];
      return {
        ...state,
        chatQuestion: payload,
        chatInfo,
      }
    },
    // 保存问题分类
    setQuestionType(state, {payload}){
      return {
        ...state,
        questionTypeData: payload,
      }
    },

    // 获取问题分类及各分类下的数据列表
    setQueryTypeList(state, {payload}){
      return {
        ...state,
        allQuestionList: payload,
      }
    },

    // 小智结果返回
    setQueryQuestion(state,{payload}){
      const {chatInfo} = state;
      const chatInfoCopy = [...chatInfo];
      const {chartWord, list, markType,isReasonPage} = payload;
      if(markType === "5"){
        chatInfoCopy.push({
          isUser: false,
          isType: list.length === 0 ? "0" : "-2",
          chartWord,
          data:list,
        })
      }else if(markType === "6" && isReasonPage === "true"){
        const {trueReason} = payload;
        const data = {
          isReasonPage,
          ...trueReason
        };
        chatInfoCopy.push({
          isUser: false,
          isType: markType,
          chartWord,
          data,
        })
      }else{
        chatInfoCopy.push({
          isUser: false,
          isType: markType,
          chartWord,
          data:payload,
        })
      }
      return{
        ...state,
        chatInfo:chatInfoCopy
      }
    },

    // 修改问题组件列表上方的input 过虑后的 问题数据
    updataInputQuestion(state, {payload}) {
      const {questionList} = state;
      let fillerQuestionList = questionList;
      if(payload !== ""){
        fillerQuestionList = questionList.filter((item)=>item.name.indexOf(payload) !== -1)
      }
      return {
        ...state,
        inputQuestion: payload,
        fillerQuestionList
      }
    },

    // 问题组件列表 是否显示
    updataQuestionListShow(state, {payload}) {
      return {
        ...state,
        questionListShow: payload,
      }
    },
    // 修改选中的问题组件列表
    updataSelectQuestionList(state, {payload}){
      return {
        ...state,
        selectQuestionList: payload,
      }
    },

    // user聊天记录添加
    addUserChatInfo(state, {payload}){
      const {chatInfo} = state;
      const chatInfoCopy = [...chatInfo];
      chatInfoCopy.push({
        isUser: true,
        isType: "0",
        chartWord: payload.value,
        data:[],
      });
      return {
        ...state,
        chatInfo:chatInfoCopy,
        questionState: payload.questionState,
      }
    },

    // 更新选中问题分类 并更新分类具体数据
    updataSelectTypeList(state, {payload}){
      const {allQuestionList} = state;
      let questionList = null;
      allQuestionList.forEach((item)=>{
        if(payload.typeId === item.typeId){
          questionList = item.list;
        }
      });
      return {
        ...state,
        selectTypeList:payload,
        questionList,
        fillerQuestionList: questionList,
        inputQuestion:"", // 清空输入框
      }
    },

    // 底部输入框值更新
    updataBottomInput(state,{payload}){
      return {
        ...state,
        bottomInput: payload,
      }
    },

    // 更新常见问题选中列表
    updataSelectChatQuestion(state,{payload}){
      return{
        ...state,
        selectChatQuestion: payload
      }
    }

  }
}
