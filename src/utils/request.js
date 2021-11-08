import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
// import {VDialog, VMassages} from "vuetify/lib/components";
import VMassages from "vuetify/src/services/icons/presets/fa";
import VDialog from "vuetify/lib/components";

const SERVICE_URL = 'http://127.0.0.1:9939';
const SERVICE_NAME = "/The_Auction";
const BASE_URL = function () {
    if (process.env.NODE_ENV === 'development') {
        return `${SERVICE_URL}${SERVICE_NAME}`;
    } else {
        return `${window.location.origin}${SERVICE_NAME}`;
    }
}();
axios.defaults.withCredentials = true;
const service = axios.create({
    baseURL: BASE_URL,
    timeout: 5000000
    // withCredentials: true, // send cookies when cross-domain requests
});

service.interceptors.request.use(
    config => {
        config.headers['X-APP-ID'] = '3d15c308d18827e4633906e0f05cd11cd'
        config.headers['X-APP-KEY'] = '8026f66436ae7db2fcdead908c79e576'
        //config.headers['swagger'] = 'true'
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
service.interceptors.response.use(
    response => {
        const res = response.data

        if(response.status == 200){
            return response
        }
        if (res.code !== 0) {
            VDialog.VMessages.error(res.message,{
                position: 'top'
            })
            // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
            //     VDialog.warning({
            //         text: 'You have been logged out, you can cancel to stay on this page, or log in again',
            //         title:'Confirm logout',
            //         confirmButtonText: 'Re-Login',
            //         cancelButtonText: 'Cancel',
            //     }).then(() => {
            //         store.dispatch('user/resetToken').then(() => {
            //             location.reload()
            //         })
            //     })
            // }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            if (res.code === 0){
                return res.data
            }else{
                return Promise.reject(new Error(res))
            }
        }
    },
    error => {
        if ((error + '').indexOf('JSON Parse error') !== -1) {
            return Promise.reject('服务异常')
        } else if ((error + '').indexOf('Network request failed') !== -1) {
            return Promise.reject('当前网络不可用,请检查网络')
        } else if ((error + '').indexOf('Network Error') !== -1) {
            return Promise.reject('网络错误,无法连接到服务器')
        } else if ((error + '').indexOf('timeout') !== -1) {
            return Promise.reject('请求超时,请检查网络')
        }else {
            return Promise.reject(JSON.stringify(error.response))
        }
    }
)
export {BASE_URL}
export default service
