import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:9090';
axios.defaults.baseURL = 'http://192.168.1.7:9090/edoc';
// axios.defaults.baseURL = '/edoc';
// axios.defaults.headers.common['lang'] = 'zh';
// axios.defaults.withCredentials = true;

// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (sessionStorage['token']) {
            config.headers.common['Authorization'] = sessionStorage['token'];
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)
// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    sessionStorage['token'] = "";
                    location.replace("/login");
            }
        }
        return Promise.reject(error) // 返回接口返回的错误信息
    });

export default axios;