export default [
  // user
  {
    path: '/login',
    component: './User/Login'
  },
  {
    path: '/timeout',
    component: './Timeout/Timeout'
  },

  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    routes: [
      // exception
      {
        path: '/exception/403',
        name: 'not-permission',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        name: 'not-find',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        name: 'server-error',
        component: './Exception/500',
      },
      {
        path: '/exception/trigger',
        name: 'trigger',
        hideInMenu: true,
        component: './Exception/TriggerException',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [
      // dashboard
      // { path: '/', redirect: '/dashboard/analysis' },
      { path: '/', redirect: '/search' },
      // 搜索页面
      {
        path: '/search',
        name: 'search',
        component: './SearchPage/index',
      },
      {
        path: '/demojs',
        name: 'demojs',
        component: './demojs/index',
      },
      // 客户洞察标签查询
      {
        path: '/labelSearch',
        name: 'labelSearch',
        icon: 'labelSearch',
        routes: [
          {
            path: '/labelSearch',
            name: 'index',
            component: './customerInsight/index',
          },
        ],
      },
      // 客户洞察单用户画像
      {
        path: '/singleUser',
        name: 'singleUser',
        icon: 'singleUser',
        routes: [
          {
            path: '/singleUser',
            name: 'index',
            component: './customerInsight/index',
          },
        ],
      },
      //downloadAllList
      // 全量下载
      {
        path: '/downloadAllList',
        name: 'downloadAllList',
        icon: 'downloadAllList',
        routes: [
          {
            path: '/downloadAllList',
            name: 'index',
            component: './DownloadAllList/index',
          },
        ],
      },
      // 我的收藏
      {
        path: '/myCollection',
        name: 'myCollection',
        icon: 'myCollection',
        routes: [
          {
            path: '/myCollection',
            name: 'index',
            component: './myCollection/index',
          },
        ],
      },
      // 终端产品信息查询专题
      {
        path: '/equipmentInfo',
        name: 'equipmentInfo',
        icon: 'equipmentInfo',
        routes: [
          {
            path: '/equipmentInfo',
            name: 'index',
            component: './equipmentInfo/index',
          },
        ],
      },
      // 数据管理专题
      {
        path: '/dataManagement',
        name: 'dataManagement',
        icon: 'dataManagement',
        routes: [
          {
            path: '/dataManagement',
            name: 'index',
            component: './dataManagement/index',
          },
        ],
      },
      // 我的工作台我的专题
      {
        path: '/mySpecialSubject',
        name: 'mySpecialSubject',
        icon: 'mySpecialSubject',
        routes: [
          {
            path: '/mySpecialSubject',
            name: 'index',
            component: './mySpecialSubject/index',
          },
        ],
      },
      // 智能分析
      {
        path: '/intelligenceAnalysis',
        name: 'intelligenceAnalysis',
        icon: 'intelligenceAnalysis',
        routes: [
          {
            path: '/intelligenceAnalysis',
            name: 'index',
            component: './intelligenceAnalysis/index',
          },
        ],
      },
      // 名单制客户收入分析
      {
        path: '/nameList',
        name: 'nameList',
        icon: 'nameList',
        routes: [
          {
            path: '/nameList',
            name: 'index',
            component: './nameList/index',
          },
        ],
      },
      // 家庭信息查询
      {
        path: '/homeQuery',
        name: 'homeQuery',
        icon: 'homeQuery',
        routes: [
          {
            path: '/homeQuery',
            name: 'index',
            component: './homeQuery/index',
          },
        ],
      },
      // 终端信息查询
      {
        path: '/terminalQuery',
        name: 'terminalQuery',
        icon: 'terminalQuery',
        routes: [
          {
            path: '/terminalQuery',
            name: 'index',
            component: './terminalQuery/index',
          },
        ],
      },
      // 预警配置
      {
        path: '/warningConfig',
        name: 'warningConfig',
        icon: 'warningConfig',
        routes: [
          {
            path: '/warningConfig',
            name: 'index',
            component: './warningConfig/index',
          },
        ],
      },
      // 热门信息呈现
      {
        path: '/hotInfoDisplay',
        name: 'hotInfoDisplay',
        component: './hotInfoDisplay',
      },
      // 楼宇转交
      {
        path: '/building',
        name: 'building',
        component: './building',
      },
      // 政企地图
      {
        path: '/governmentMap',
        name: 'governmentMap',
        component: './governmentMap',
      },
      // 5G实时监控
      {
        path: '/5gRealTimeMonitor',
        name: '5gRealTimeMonitor',
        icon: '5gRealTimeMonitor',
        routes: [
          {
            path: '/5gRealTimeMonitor',
            name: 'index',
            component: './5gRealtimeMonitor/5gRealtimeMonitor',
          },
        ],
      },
      // 携号转网监控报表（实时）echart
      {
        name: 'numberToNetwork',
        icon: 'user',
        path: '/numberToNetwork',
        component: './numberToNetwork/index',
      },
      // 日报-携号转网监控报表（实时）表格二
      {
        name: 'numberToNetworkReport',
        icon: 'user',
        path: '/numberToNetworkReport',
        component: './numberToNetworkReport/index',
      },
      // 携号转网监控报表（实时） 表格一
      {
        name: 'numberToNetworkTable',
        icon: 'user',
        path: '/numberToNetworkTable',
        component: './numberToNetworkTable/index',
      },
      // 政企总览
      {
        name: 'governmentView',
        icon: 'buildingView',
        path: '/governmentView',
        component: './buildingView',
      },
      // 家庭视图
      {
        name: 'homeView',
        icon: 'homeView',
        path: '/homeView',
        component: './homeView',
      },
      // 产品视图专题
      {
        path: '/productView',
        name: 'productView',
        icon: 'productView',
        routes: [
          {
            path: '/productView',
            name: 'index',
            component: './ProductView/index',
          },
        ],
      },
      // 产品特征发展质量页面
      {
        path: '/productFeatures',
        name: 'productFeatures',
        icon: 'productFeatures',
        routes: [
          {
            path: '/productFeatures',
            name: 'index',
            component: './ProductFeatures/index',
          },
        ],
      },
      // 渠道视图
      {
        path: '/channelView',
        name: 'channelView',
        component: './channelView/index',
      },
      // 计费收入专题
      {
        path: '/themeAnalysis',
        name: 'themeAnalysis',
        icon: 'themeAnalysis',
        routes: [
          {
            path: '/themeAnalysis',
            name: 'index',
            component: './themeAnalysis/index',
          },
        ],
      },
      //业务专题区域评价月考核
      {
        path: '/ThemeMonthCheck',
        name: 'ThemeMonthCheck',
        icon: 'ThemeMonthCheck',
        routes: [
          {
            path: '/ThemeMonthCheck',
            name: 'index',
            component: './ThemeMonthCheck/index',
          },
        ],
      },
      // 产品分析表格
      {
        path: '/productAnalysis',
        name: 'ProductAnalysis',
        icon: 'ProductAnalysis',
        routes: [
          {
            path: '/productAnalysis',
            name: 'index',
            component: './ProductAnalysis/index',
          },
        ],
      },
      // 产品分析弹出层
      {
        path: '/ProductAnalysisPop',
        name: 'ProductAnalysisPop',
        icon: 'ProductAnalysisPop',
        routes: [
          {
            path: '/ProductAnalysisPop/index',
            name: 'index',
            component: './ProductAnalysisPop/index',
          },
        ],
      },
      // 移动业务趋势分析专题（单指标）
      {
        path: '/singleIndicators',
        name: 'singleIndicators',
        icon: 'singleIndicators',
        routes: [
          {
            path: '/singleIndicators',
            name: 'index',
            component: './SingleIndicators/index',
          },
        ],
      },
      // 报告
      {
        path: '/report',
        name: 'report',
        icon: 'search',
        component: './Report/index',
      },
      {
        path: '/indexSystem',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA61JREFUeNrs3b1O5EAQhdEZxFttiHhqtOE+V68IkAgIRp7+qVucLyKYxHYdjBi7+z7GuEn6uRenQAJEAkQCRAJEAkQCRAJEAkT6fb0++sGPv/985T6h97c/927H9DUbHY/NHURTcHT9JQqIpuDoigQQTcPREQkgmoqjGxJANB1HJySA6LZy4NORAKLlg56MBBBtGfBUJIBo22AnIgFEWwc6DQkg2j7ISUgA0ZEBTkECiI4NbgISQHR0YKsjAURPD+rnY+7PPOpeGQkgehrHTz93QQIIHFNwdEUCCBzTcHREAggcU3F0QwIIHNNxdEICCBy3lQOfjgQQOJYPejISQOBYOuDpSACBYzmOZCSAwLEFRyoSQODYhiMRCSBwbMWRhgQQOLbjSEICCBxHcKQgAQSOYzgSkAACR4ltC6oiAQSOMnt6VEQCCBylqoYEEDhukAACRwiOakgAgQMSQOBIw1EFCSBwQAIIHOnHfwoJIHBAAggckFw7l4DAAQkgcEBy7dwCYnAcKyC/5+J32Ju80rECAok/QQGBBI5r5xMQSOAABBI4rp0/QCCBAxBIkpGc/E4IEEjgAASSRCQVniYABBI4AIEkCUml59AAgQQOQCBJQFLxCWZAICmBpOrj/YBAchxJ5XdfAIHkKJLqL4YBAskxJAlvTQICyREkKa8UAwLJdiRJ79sDAslWJGmLUQACyTYkiSu1AALJFiSpyxgBAsnyAU9e4wsQSJYOevoCeIBAsmzgO6wOCQgkS5B0WToVEEimI+m0rjAgmoqk26LbgGgako4r0gOiKUi6btcAiI4Oa/XtGgDRsaFN2MsEEB0Z3pSNfgDR9iFO2gULEG0d5rQt4gDRtqFO3D8REG0Z7tTNRe9jDFdfD3fl+47knXfdQbR02NO3pQZEy5B02LMdEC1B0gEHIFqCpAsOQDQdSSccn/kvluQOIgEiASIBIgEiASIBIgEiASLpe6+PfrDShvPJPfsohuuw9zq4g0iASIBIgEiASIBIgEiASIBIgEgCRAJEAkQCRAJEAkQCRAJEAkQCRBIgEiASIBIgEiASIBIgEiASIJIAkQCRAJEAkQCRAJEAkQCRAJEAkQSIBIgEiASIBIgEiASIBIgEiCRAJEAkQCRAJEAkQCRAJEAkQCRAJAEiASIBIgEiASIBIgEiASIBIgkQCRAJEAkQCRAJEAkQCRAJEAkQSYBIgEiASIBIB7uPMZwFyR1EAkQCRAJEAkQCRAJEAkQCRNJX/wUYAGAeZ1fijDbIAAAAAElFTkSuQmCC',
        name: 'indexSystem',
        component: './IndexSystem/index',
      },
      {
        path: '/specialReport',
        icon: 'right',
        name: 'specialReport',
        component: './KeyProduct/index',
      },
      {
        name: 'dayOverview',
        icon: 'user',
        path: '/dayOverview',
        component: './DayOverView/index',
      },
      {
        name: 'monthOverview',
        icon: 'user',
        path: '/monthOverview',
        component: './MonthOverView/index',
      },
      {
        name: 'noticeboard',
        icon: 'user',
        path: '/notes',
        component: './NoticeBoard/index',
      },
      {
        name: 'dataAudit',
        icon: 'user',
        path: '/DataAudit',
        component: './DataAudit/index',
      },
      {
        name: 'consistent',
        icon: 'user',
        path: '/consistent',
        component: './consistent',
      },
      {
        name: 'indexDetails',
        path: '/IndexDetails',
        component: './IndexDetails',
      },
      {
        path: '/systemOperator',
        name: 'systemOperator',
        component: './systemOperator',
      },
      {
        path: '/myReply',
        component: './ProblemFeedback',
      },
      {
        path: '/systemManager/ProblemFeedback',
        component: './ProblemFeedback',
      },
      {
        path: '/DayDateChange',
        name: 'DayDateChange',
        component: './RangeRelease/DayDateChange',
      },
      {
        path: '/DaySpecialChange',
        name: 'DaySpecialChange',
        component: './RangeRelease/DaySpecialChange',
      },
      {
        path: '/MonthDateChange',
        name: 'MonthDateChange',
        component: './RangeRelease/MonthDateChange',
      },
      {
        path: '/MonthSpecialChange',
        name: 'MonthSpecialChange',
        component: './RangeRelease/MonthSpecialChange',
      },
      {
        name: 'DevelopingUser',
        path: '/DevelopingUser',
        component: './DevelopingUser',
      },
      {
        name: 'iceCreamProduction',
        path: '/iceCreamProduction',
        component: './IceCreamRoam/IceCreamRoam',
      },
      {
        name: 'benchmarking',
        path: '/benchmarking',
        component: './benchmarking/index',
      },
      {
        name: 'createPPT',
        path: '/createPPT',
        component: './createPPT/index',
      },
      {
        name: 'analyseSpecial',
        path: '/analyseSpecial',
        component: './analyseSpecial/index',
      },
      // { path: '/customerInsight',
      //   name:"customerInsight",
      //   icon: 'smile',
      //   component: './subAppContainer'
      // },
      {
        name: 'Demo',
        path: '/Demo',
        component: './Demo/index',
      },
      // 在此之上配置路由
      {
        path: '/*',
        redirect: '/exception/404',
      },
      // dashboard
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   icon: 'dashboard',
      //   routes: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'analysis',
      //       component: './Dashboard/Analysis',
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'monitor',
      //       component: './Dashboard/Monitor',
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'workplace',
      //       component: './Dashboard/Workplace',
      //     },
      //   ],
      // },
      // // forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // report
      // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
];
