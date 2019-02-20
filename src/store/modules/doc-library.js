/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 11:05:40 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-17 10:36:10
 */




const docLibrary = {
    state: {
        //文档页面文件操作按钮控制
        libBtns: false,

    },
    mutations: {
        /** 
        * 文档库中下载撤销按钮显示/隐藏，      
        */
        setLibOperateBtn(state, value) {
            state.libBtns = value
        },

    }
}
export default docLibrary;