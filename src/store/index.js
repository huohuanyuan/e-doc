/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 11:05:46 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-30 14:44:24
 */
import Vue from 'vue';
import Vuex from 'vuex';

import docDocument from "./modules/doc-document";
import docLibrary from "./modules/doc-library";


// vuex
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        studyName:"",
        siteName:""
    },
    mutations: {
        setStudyName(state,studyName){
            state.studyName = studyName
        },
        setSiteName(state,siteName){
            state.siteName = siteName;
        }
    },
    actions: {

    },
    modules: {
        docLibrary,
        docDocument

    }
})

export default store;