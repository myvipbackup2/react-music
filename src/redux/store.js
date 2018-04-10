import { createStore } from 'redux'
import reducer from "./reducers"

// 生产环境是https，且域名没有端口号 不开启redux-dev-tool
const { protocol, host } = window.location;
const isDev = protocol === 'http:' && host.includes(':');

// 创建store
const store = createStore(
  reducer,
  isDev && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store