let util = {};

/** * 
 * 深度遍历menu 保存到_menuList，跳转下一级路由使用，将所有有权限的页面code保存到priList
 * @param { Array } dataSource 登录时后端返回的的menu数据
 */
util.setPriMenuList = function (dataSource) {
    //深度遍历menulist，将每一层路由push进数组，保存到_menuList，权限控制跳转路由使用
    let _arr = [];
    let _menuList = [];
    let priList = []; //保存权限list
    if (Array.isArray(dataSource)) {
        // 每一层的数据都 push 进 res
        _arr.push(...dataSource);
        // res 动态增加长度
        for (var i = 0; i < _arr.length; i++) {
            var curData = _arr[i];
            _menuList.push(curData);
            priList.push(curData.priv);
            // 如果有 children 则 push 进 res 中待搜索
            if (curData.children.length > 0) {
                _arr.push(...curData.children);
            }
        }
    }
    localStorage.setItem("menuList",JSON.stringify(dataSource));
    localStorage.setItem("priList", JSON.stringify(priList));
    localStorage.setItem("_menuList", JSON.stringify(_menuList));
}


/**
 * @method 路由跳转时触发，如果是父级路由默认跳转第一个子路由
 * @param {String} name 当前路由的name
 * @param {function} next vue-router的方法
 */
util.toDefaultPage = function (name, next) {
    let _menuList = JSON.parse(localStorage.getItem("_menuList")) ? JSON.parse(localStorage.getItem("_menuList")) : [];
    let currentPageList = _menuList.filter((currentVal, index) => {
        return currentVal.priv == name;
    })
    if (currentPageList.length > 0 && currentPageList[0].children.length > 0) {
        next({
            name: currentPageList[0].children[0].priv
        });
    } else {
        next();
    }
}
export default util
