
var api = {
	test:{
		url:"axiosapi/test",
		method:'POST'
	},
	upload:{
		url:"axiosapi/upload",
		method:"POST"
	}
}

var baseURL = 'http://kv2mra.natappfree.cc/E_Sign/admin/';

function ask(name, opt = {}, id) {
    
    // 取传进来的用户信息
    let {
        headers,
        data,
        params,
        responseType
    } = opt;

    /**
     * 获取接口信息
     * 如果后期涉及到权限
     * 可以在接口信息里面
     * 设定 并取到
     */
    let {
        method,
        url,
    } = api[name];

    // 拼接post form data
    let transformRequest = [];

    headers = Object.assign({}, headers, {
        
    });

    // 非GET方式
    if (method.toUpperCase() !== "GET") {
        data = params;
    }

    // 表单类型的POST请求需要做转换
    if (method.toLowerCase() === 'post' &&headers&& headers['Content-Type'] === 'application/x-www-form-urlencoded; charset=UTF-8') {
      transformRequest = [function (data, headers) {
        // JSON => Formdata
        let result = [];
        for (let key in data) {
          if (data.hasOwnProperty(key) && typeof data[key] !== 'function') {
            result.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
          }
        }
        return result.join('&');
      }]
    }

    let instance = axios.create({
        baseURL,
    });

    // 响应中间处理层
    instance.interceptors.response.use(function (response) {
        // 请求成功后 处理在此
        if(id){
            return response;
        }
        console.log('response',response);
        return response.data;
    }, function (error) {
        // 请求失败 错误在此
        //请求token失效时登出
        if(error.response&&error.response.status === 401) {
            window.ToLogout&&window.ToLogout();
        }
        return Promise.reject(error);
    });

    let promise = instance.request({
        responseType,
        url,
        method,
        headers,
        params,
        data,
        transformRequest
    });

    return promise;
}


