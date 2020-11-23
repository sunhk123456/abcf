import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { queryMenuData,queryTitleData,queryHelpData,queryMenuLog,queryReportTableLog,querySpecialReportLog } from '@/services/user';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    allMenuData: {},
    allTitleData:{},
    breadcrumbNameMap: {},
    helpData:{},
    hotTitleData:{}
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority } = payload;
      const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
    },
    *getAllMenuData({ payload }, {call, put }) {
      const response = yield call(queryMenuData, payload);
      yield put({
        type: 'saveMenuData',
        payload: response,
      });
    },
    *getTitleData({ payload }, {call, put }) {
      const response = yield call(queryTitleData, payload);
      yield put({
        type: 'saveTitleData',
        payload: response,
      });
    },
    *getHelpData(_, {call, put }) {
      const response = yield call(queryHelpData);
      yield put({
        type: 'saveHelpData',
        payload: response,
      });
    },
    *menuLog(_, {call}) {
    yield call(queryMenuLog);
    },
    *reportTableLog(_, {call }) {
    yield call(queryReportTableLog);
    },
    *specialReportLog(_, {call}) {
      yield call(querySpecialReportLog);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveMenuData(state, action) {
      return {
        ...state,
        allMenuData:action.payload,
      };
    },
    saveTitleData(state, action) {
      return {
        ...state,
        allTitleData:action.payload,
      };
    },
    saveHelpData(state, action) {
      return {
        ...state,
        helpData:action.payload,
      };
    },
  },
};
