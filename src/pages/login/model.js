import { history } from 'umi'
import { message } from 'antd'
const { pathToRegexp } = require("path-to-regexp")
import userApi from '../../services/userApi'
import api from 'api'

const { loginUser } = api

export default {
  namespace: 'login',

  state: {},
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen(location => {
  //       if (pathToRegexp('/login').exec(location.pathname)) {
  //       }
  //     })
  //   },
  // },
  effects: {
    *login({ payload }, { put, call, select }) {
      try {
        const data = yield call(userApi.loginApi, payload)
        if (data.code === "200"){
          const { token, refreshToken } = data.data;
          localStorage.setItem("token", token)
          localStorage.setItem("refreshToken", refreshToken)
        } else {
          message.error(data.msg)
        }
        yield put({ type: 'app/query' })
      } catch(e) {
        console.log(e);
      }

    },
  },
}
