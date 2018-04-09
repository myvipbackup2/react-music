import originJsonp from "jsonp"
import queryString from 'query-string'

const jsonp = (url, data, option) => {
  try {
    return new Promise((resolve, reject) => {
      originJsonp(buildUrl(url, data), option, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  } catch (e) {
    console.warn(e)
  }
};

function buildUrl(url, data) {
  if (!data) {
    return url
  }
  return url + '?' + queryString.stringify(data);
}

export default jsonp