// 引入请求
import { queryCompositeIndex } from '../../services/benchmarking';

/**
 * 利用递归格式化每个节点
 */
const formatTree = function(items, parent) {
  const result = [];
  if (!items[parent]) {
    return result;
  }
  for (let t of items[parent]) {
    t.children = formatTree(items, t.id);
    result.push(t);
  }
  return result;
};

/**
 * 树状的算法
 * @params list     代转化数组
 * @params parent 起始节点
 */
const getTrees = function(list, parent) {
  const items = {};
  // 获取每个节点的直属子节点，记住是直属，不是所有子节点
  for (let i = 0; i < list.length; i++) {
    const key = list[i].parent;
    if (items[key]) {
      items[key].push(list[i]);
    } else {
      items[key] = [];
      items[key].push(list[i]);
    }
  }
  return formatTree(items, parent);
};


export default {
  namespaces: 'compositeIndexList',
  // 数据
  state: {
    markType: '', // 默认为空，从菜单跳转时传入专题id
    tree: [], // 请求回来得数据
    treeData: [], // 处理好的数据
    selected: [],// 选中的指标列表
  },

  // 调用接口请求数据
  effects: {
    * fetchIndexList({ payload }, { put, call }) {
      const result = yield call(queryCompositeIndex, payload);
      yield put({
        type: 'setIndexList',
        payload: result,
      });
      return  result;
    },
  },

  //
  reducers: {
    setIndexList(state, action) {
      /*
   * 处理数据格式
   * */
      function dataHandleFun(list, parent) {
        return getTrees(list, parent);
      }

      const { payload } = action;
      const { indexList, selected } = payload;
      const treeData = dataHandleFun(indexList, 'CKC_ROOT');
      return {
        ...state,
        tree: indexList,
        treeData,
        selected,
      };
    },

    // 保存选中的项
    setSelected(state, action) {
      return {
        ...state,
        selected: action.payload,
      };
    },
  },
};
