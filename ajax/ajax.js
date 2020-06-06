function ajax(options) {
    let opts = Object.assign({
        url: "",//api地址
        method: "get",//方法
        data: "",//传递的数据
        dataType:"json",//返回的数据要什么格式的
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        success(res) { },
        fail() {}
    }, options)
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    if (opts.method === "get") {
        opts.url = opts.url + "?" + o2u(opts.data);
        xhr.open(opts.method, opts.url, true);
        xhr.send();
    } else {
        xhr.open(opts.method, opts.url, true);

        for (let key in opts.headers) {
            xhr.setRequestHeader(key, opts.headers[key]);
        }
        let sendData;
        switch (opts.headers['content-type']) {
            case 'application/x-www-form-urlencoded':
                sendData = o2u(opts.data);
                break;
            case 'application/json':
                sendData = JSON.stringify(opts.data);
                break;
        }
        xhr.send(sendData);
    }
    // 这样也可以，就是比较暴力
    
    // xhr.onload = function () {
    //     opts.success(JSON.parse(xhr.responseText));
    // }

    xhr.onreadystatechange = function () {
        /* 
            0: 请求未初始化
            1: 服务器连接已建立
            2: 请求已接收
            3: 请求处理中
            4: 请求已完成，且响应已就绪
        */
        if (xhr.readyState == 4) {
            /* 
                200: "OK"
                404: 未找到页面
            */
            if (xhr.status == 200) {
                var result;
                switch (opts.dataType) {
                    case "text":
                        result = xhr.responseText;
                        break;
                    case "json":
                        result = JSON.parse(xhr.response)
                        break;
                    case "xml":
                        result = xhr.responseXML;
                        break;
                }
                if (opts.success) {
                    opts.success(result)
                }else if(opts.fail){
                    opts.fail(result)
                }
            } else if (xhr.status == 404) {
                // alert("页面未找到");
            } else {
                // alert("获取错误");
            }
        }
    }


    /* 
        把对象变成查询字符串的形式 
        传入  { hello: "你好", height: "178cm"}
        返回 hello=还好&height=178cm
    */
    function o2u(obj) {
        let keys = Object.keys(obj);
        let values = Object.values(obj);
        return keys.map((v, k) => {
            return `${v}=${values[k]}`;
        }).join("&");
    }
}