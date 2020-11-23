import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, getReChecklogin, fakeAccountSsoLogin } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';


export default {
  namespace: 'login',

  state: {
    status: undefined,
    info:{}
  },

  effects: {
    *login({ payload,callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      console.info(response)
      if (response !== undefined) {
        if(callback)callback(response)
        // router.push('/search/index')
        // yield put(routerRedux.replace( '/search/index'))
        // reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        // yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },

    // 云门户登录
    *GetCloud({ payload,callback }, { call, put }){
      console.log("66666")
      const response = yield call(getReChecklogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response !== undefined) {
        callback(response)
      }
    },

    // 单点登录
    *GetSsoLogin({ payload,callback }, { call, put }){
      const response = yield call(fakeAccountSsoLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response !== undefined) {
        callback(response)
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        // status: payload.status,
        info:payload,
      };
    },
  },
};
