import { message } from 'antd';
import axios from 'axios';
import { history } from 'umi';
import store from 'store';
import userApi from '../services/userApi';

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // 你的 API 地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 刷新 token 标志
let isRefreshing = false;
// 存储等待刷新 token 后重试的请求
let requests = [];

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如：添加 token
    const token = localStorage.getItem('token');
    console.log(token);
    if (token !== "null" && token !== "undefined") {
      config.headers['token'] = token;
    } else {
      history.push({
        pathname: '/login'
      });
      store.set('isInit', false);
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    // 根据你的后端返回结构修改
    console.log(response, 34);
    if (response.status === 200) {
      const { code, msg } = response.data;
      switch (Number(code)) {
        case 401:
          history.push({
            pathname: '/login'
          });
          localStorage.setItem("token", null);
          localStorage.setItem("refreshToken", null);
          store.set('isInit', false);
          message.error(msg);
          break;
        case 402:
          const originalConfig = response.config;
          if (!isRefreshing) {
            isRefreshing = true;
            const refreshToken = localStorage.getItem("refreshToken");
            console.log(refreshToken, 53);
            return service({
              url: "/user/token-refresh",
              method: "GET",
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'refreshToken': refreshToken
              }
            }).then(res => {
              const { token, refreshToken } = res.data;
              localStorage.setItem("token", token);
              localStorage.setItem("refreshToken", refreshToken);
              // 重试所有等待的请求
              requests.forEach(cb => cb(token));
              requests = [];
              // 重试原请求
              originalConfig.headers['token'] = token;
              return service(originalConfig);
            }).catch(err => {
              console.error('刷新 token 失败:', err);
              localStorage.setItem("token", null);
              localStorage.setItem("refreshToken", null);
              history.push({
                pathname: '/login'
              });
              store.set('isInit', false);
              return Promise.reject(err);
            }).finally(() => {
              isRefreshing = false;
            });
          } else {
            // 正在刷新 token，将请求加入队列
            return new Promise(resolve => {
              requests.push(token => {
                originalConfig.headers['token'] = token;
                resolve(service(originalConfig));
              });
            });
          }
        case 400:
          message.error(msg);
        default:
          break;
      }
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    // 对响应错误做点什么
    let messageText = '';
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          messageText = '请求错误';
          break;
        case 401:
          messageText = '未授权，请登录';
          // 这里可以跳转到登录页面
          break;
        case 403:
          messageText = '拒绝访问';
          break;
        case 404:
          messageText = `请求地址出错: ${error.response.config.url}`;
          break;
        case 500:
          messageText = '服务器内部错误';
          break;
        default:
          messageText = `连接错误 ${error.response.status}`;
      }
    } else if (error.message.includes('timeout')) {
      messageText = '请求超时';
    } else {
      messageText = '网络连接失败';
    }

    // 返回统一错误格式
    return Promise.reject({
      code: error.response?.status || 0,
      message: messageText,
      error: error.response?.data || error.message
    });
  }
);

// 封装通用请求方法
const request = {
  get(url, params, config = {}) {
    return service.get(url, { params, ...config });
  },

  post(url, data, config = {}) {
    return service.post(url, data, config);
  },

  put(url, data, config = {}) {
    return service.put(url, data, config);
  },

  delete(url, params, config = {}) {
    return service.delete(url, { params, ...config });
  },

  // 其他请求方法...
};

// 导出实例和方法
export default service;
export { request };