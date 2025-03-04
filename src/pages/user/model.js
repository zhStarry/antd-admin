import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require("path-to-regexp")
import api from 'api'
import { pageModel } from 'utils/model'

const {
  queryUserList,
  createUser,
  removeUser,
  updateUser,
  removeUserList,
} = api

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalOpen: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathToRegexp('/user').exec(location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      try {
        const data = yield call(queryUserList, payload)
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.total,
              },
            },
          })
        }
      } catch (e) {
        console.log(e)
      }

    },

    *delete({ payload }, { call, put, select }) {
      try {
        const data = yield call(removeUser, { id: payload })
        const { selectedRowKeys } = yield select(_ => _.user)
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
            },
          })
        } else {
          throw data
        }
      } catch (e) {
        console.log(e)
      }

    },

    *multiDelete({ payload }, { call, put }) {
      try{
        const data = yield call(removeUserList, payload)
        if (data.success) {
          yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        } else {
          throw data
        }
      } catch(e){
        console.log(e)
      }

    },

    *create({ payload }, { call, put }) {
      try {
        const data = yield call(createUser, payload)
        if (data.success) {
          yield put({ type: 'hideModal' })
        } else {
          throw data
        }
      } catch(e){
        console.log(e)
      }

    },

    *update({ payload }, { select, call, put }) {
      try {
        const id = yield select(({ user }) => user.currentItem.id)
        const newUser = { ...payload, id }
        const data = yield call(updateUser, newUser)
        if (data.success) {
          yield put({ type: 'hideModal' })
        } else {
          throw data
        }
      } catch(e){
        console.log(e)
      }

    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalOpen: true }
    },

    hideModal(state) {
      return { ...state, modalOpen: false }
    },
  },
})
