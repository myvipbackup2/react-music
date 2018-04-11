import jsonp from "./jsonp"
import { URL, PARAM, OPTION } from "./config"

export function getHotKey() {
  const data = {
    ...PARAM,
    g_tk: 5381,
    uin: 0,
    platform: "h5",
    needNewCode: 1,
    notice: 0,
  };
  return jsonp(URL.hotkey, data, OPTION);
}

export function search({ w, p = 1, n = 20 }) {
  const data = {
    ...PARAM,
    g_tk: 5381,
    uin: 0,
    platform: "h5",
    needNewCode: 1,
    notice: 0,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: "utf-8",
    sem: 1,
    aggr: 0,
    perpage: 20,
    n,
    p, // 分页第几页
    w, // 联想词
    remoteplace: "txt.mqq.all",
  };
  return jsonp(URL.search, data, OPTION);
}