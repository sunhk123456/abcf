/**
 * @Description:  模块日志文件
 *
 * @author: liuxiuqian
 *
 * @date: 2020/4/8
 */
// moduleLogParams 的参数格式
// moduleLogParams={
//   "makeId": "专题id",
//   "makeName": "专题名称",
//   "moduleId": "模块id",
//   "moduleName": "模块name",
// }


import{ useState, useEffect } from "react";
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';


const ModuleLog = (props) => {
  const {moduleLogParams,dispatch} = props;
  const [moduleLogParamsState,setModuleLogParamsState ] = useState(moduleLogParams);
  if(!moduleLogParams) throw new Error("moduleLogParams is not undefined (moduleLogParams 参数未传递)");
  const handleRequest = () =>{
    console.log("handleRequest");
    console.log(props);
    dispatch({
      type:"moduleLogModels/moduleLogRequest",
      payload:moduleLogParams
    })
  };

  if(!isEqual(moduleLogParamsState,moduleLogParams)){
    setModuleLogParamsState(moduleLogParams);
    handleRequest();
  }

  useEffect(() => {
    handleRequest();
  },[]);

  return  null;
};
// 数据格式类型检测
ModuleLog.propTypes = {
  moduleLogParams:PropTypes.shape({
    makeId:PropTypes.string.isRequired,
    makeName:PropTypes.string.isRequired,
    moduleId: PropTypes.string.isRequired,
    moduleName: PropTypes.string.isRequired,
  })
};
const moduleLog = connect(({ moduleLogModels }) => ({
  moduleLogModels,
}))((ModuleLog));
export default moduleLog
