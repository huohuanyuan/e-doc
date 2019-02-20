import main from '@/pages/main'



//不作为main组件的子页面展示的页面
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        require(['@/pages/login.vue'], resolve);
    }
};
export const page404 = {
    path: '/404',
    name: 'error404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['@/pages/error-page/404.vue'], resolve);
    }

};

export const helpPage = {
    path: "/help",
    name: "helpPage",
    meta: {
        requireAuth: false,
    },
    component: resolve => {
        require(["@/pages/help.vue"], resolve);
    }

};
export const adminRouter = {
    path: '/admin',
    name: 'admin',
    meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        require(['@/pages/admin.vue'], resolve);
    }
};
export const restPwdRouter = {
    path: '/rest-pwd',
    name: 'restPwd',
    meta: {
        requireAuth: false,
    },
    component: resolve => {
        require(['@/pages/others/rest-pwd.vue'], resolve);
    }
}
export const pdfView = {
    path: '/pdf/:fileId/:fileVersionId',
    name: 'pdf',
    meta: {
        requireAuth: false,
    },
    component: resolve => {
        require(['@/pages/pdf.vue'], resolve);
    }
}

//main组件，左侧菜单
export const appRouter = [{
    //首页
    path: '/',
    name: 'main',
    redirect: '/home',
    meta: {
        requireAuth: true,
    },
    component: main,
    children: [{
            path: 'ownspace', //个人中心
            name: 'ownSpace',
            title: '个人中心',
            meta: {
                requireAuth: false,
            },
            component: resolve => {
                require(['@/pages/own-space/own-space.vue'], resolve);
            },
        },
        {
            path: 'search', //搜索
            name: 'searchView',
            title: '个人中心',
            meta: {
                requireAuth: false,
            },
            component: resolve => {
                require(['@/pages/search/search'], resolve);
            },
        },
        { //首页
            path: 'home',
            redirect: 'home/home-page',
            name: "home",
            meta: {
                requireAuth: true,
            },
            component: resolve => {
                require(['@/pages/home/home.vue'], resolve);
            },
            children: [{
                    path: 'home-page', //主页
                    name: 'homePage',
                    meta: {
                        requireAuth: true,
                        parent: "home",
                    },
                    component: resolve => {
                        require(['@/pages/home/components/home-page.vue'], resolve);
                    },
                },
                {
                    path: 'study', //项目列表
                    name: 'study',
                    meta: {
                        requireAuth: false,
                         parent: "home",
                    },
                    component: resolve => {
                        require(['@/pages/home/components/study.vue'], resolve);
                    },
                },
                {
                    path: 'my-task', // 待接受任务
                    name: 'myStudy',
                    meta: {
                        requireAuth: false,
                         parent: "home",
                    },
                    component: resolve => {
                        require(['@/pages/home/components/my-task.vue'], resolve);
                    },
                },
                {
                    path: 'my-available', // 进行中任务
                    name: 'myAvailable',
                    meta: {
                        requireAuth: false,
                         parent: "home",
                    },
                    component: resolve => {
                        require(['@/pages/home/components/my-available.vue'], resolve);
                    },
                },
            ]
        },
        { //文档
            path: 'document',
            name: 'document',
            meta: {
                requireAuth: true,
            },
            component: resolve => {
                require(['@/pages/document/document.vue'], resolve);
            },
            children: [{
                    path: 'my-document', //我的文档
                    name: 'myDocument',
                    meta: {
                        requireAuth: true,
                        parent: "document",
                    },
                    component: resolve => {
                        require(['@/pages/document/components/my-document.vue'], resolve);
                    }
                },
                {
                    path: 'all-document', //所有文档
                    name: 'allDocument',
                    meta: {
                        requireAuth: true,
                        parent: "document",
                    },
                    component: resolve => {
                        require(['@/pages/document/components/all-document.vue'], resolve);
                    }
                },
                {
                    path: 'recent-document', //最近操作
                    name: 'recentDocument',
                    meta: {
                        requireAuth: true,
                        parent: "document"
                    },
                    component: resolve => {
                        require(['@/pages/document/components/recent-document.vue'], resolve);
                    },
                },
                {
                    path: 'recycle', //回收站
                    name: 'recycle',
                    meta: {
                        requireAuth: true,
                        parent: "document"
                    },
                    component: resolve => {
                        require(['@/pages/document/components/recycle.vue'], resolve);
                    },
                },
                {
                    path: 'new-file', // 新建文件
                    name: 'newFile',
                    meta: {
                        requireAuth: true,
                        parent: "document"
                    },
                    component: resolve => {
                        require(['@/pages/file/new-file.vue'], resolve);
                    },
                },
                {
                    path: 'edit-file', // 修改文件
                    name: 'editFile',
                    meta: {
                        requireAuth: false,
                        parent: "document"
                    },
                    component: resolve => {
                        require(['@/pages/file/edit-file.vue'], resolve);
                    },
                },
            ]
        },
        { //文件库
            path: 'library',
            name: 'library',
            meta: {
                requireAuth: true,
            },
            component: resolve => {
                require(['@/pages/library/library.vue'], resolve);
            },
            children: [{
                    path: 'core', //提交文档
                    name: 'coreLibrary',
                    meta: {
                        requireAuth: true,
                        parent: "library",
                    },
                    component: resolve => {
                        require(['@/pages/library/components/core-library.vue'], resolve);
                    },
                },
                {
                    path: 'uncore', //非提交文档
                    name: 'uncoreLibrary',
                    meta: {
                        requireAuth: true,
                        parent: "library",
                    },
                    component: resolve => {
                        require(['@/pages/library/components/uncore-library.vue'], resolve);
                    },
                }
            ]
        },
        { //报表中心
            path: 'report',
            name: 'report',
            meta: {
                requireAuth: true,
            },
            component: resolve => {
                require(['@/pages/report/report.vue'], resolve);
            },
            children: [{
                    path: 'custom-report', //自定义报表
                    name: 'customReport',
                    meta: {
                        requireAuth: true,
                        parent: "report",
                    },
                    component: resolve => {
                        require(['@/pages/report/components/custom-report.vue'], resolve);
                    },
                },
                {
                    path: 'system-report', // 系统报表
                    name: 'systemReport',
                    meta: {
                        requireAuth: true,
                        parent: "report",
                    },
                    component: resolve => {
                        require(['@/pages/report/components/system-report.vue'], resolve);
                    },
                },
            ]
        },
        { //管理
            path: 'manage',
            name: 'manage',
            meta: {
                requireAuth: true,
            },
            component: resolve => {
                require(['@/pages/manage/manage.vue'], resolve);
            },
            children: [{
                    path: 'download-center', //下载中心
                    name: 'downloadCenter',
                    meta: {
                        requireAuth: true,
                        parent: "manage",
                    },
                    component: resolve => {
                        require(['@/pages/manage/components/download-center.vue'], resolve);
                    },
                    children: [{
                            path: 'all-doc-down', //所有文档下载
                            name: 'allDocDown',
                            meta: {
                                requireAuth: true,
                                parent: "downloadCenter",
                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/all-doc-down.vue'], resolve);
                            }
                        },
                        {
                            path: 'core-doc-down', //提交文档下载
                            name: 'coreDocDown',
                            meta: {
                                requireAuth: true,
                                parent: "downloadCenter",
                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/core-doc-down.vue'], resolve);
                            }
                        },
                        {
                            path: 'uncore-doc-down', //非提交文档下载
                            name: 'uncoreDocDown',
                            meta: {
                                requireAuth: true,
                                parent: "downloadCenter",
                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/uncore-doc-down.vue'], resolve);
                            }
                        },
                        {
                            path: 'down-task', //下载任务列表
                            name: 'downTask',
                            meta: {
                                requireAuth: true,
                                parent: "downloadCenter",
                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/down-task.vue'], resolve);
                            }
                        }
                    ]
                },
                {
                    path: 'study-manage', //项目管理
                    name: 'studyManage',
                    meta: {
                        requireAuth: true,
                        parent: "manage",
                    },
                    component: resolve => {
                        require(['@/pages/manage/components/study-manage.vue'], resolve);
                    },

                },
                {
                    path: 'site-manage', //机构管理
                    name: 'siteManage',
                    meta: {
                        requireAuth: true,
                        parent: "manage",
                    },
                    component: resolve => {
                        require(['@/pages/manage/components/site-manage.vue'], resolve);
                    },
                },
                {
                    path: 'pri-manage', //权限管理
                    name: 'privManage',
                    meta: {
                        requireAuth: true,
                        parent: "manage",
                    },
                    component: resolve => {
                        require(['@/pages/manage/components/pri-manage.vue'], resolve);
                    },
                    children: [{
                            path: 'pri-config', //权限配置
                            name: 'privRoleManage',
                            meta: {
                                requireAuth: true,
                                parent: "privManage",

                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/pri-config.vue'], resolve);
                            }
                        },
                        {
                            path: 'pri-allot', //权限分配
                            name: 'privUserManage',
                            meta: {
                                requireAuth: true,
                                parent: "privManage",

                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/pri-allot.vue'], resolve);
                            }
                        }
                    ]

                },
                {
                    path: 'user-manage', //用户管理
                    name: 'userManage',
                    meta: {
                        requireAuth: true,
                        parent: "manage",
                    },
                    component: resolve => {
                        require(['@/pages/manage/components/user-manage.vue'], resolve);
                    },

                },
                {
                    path: 'dir-manage', //目录管理
                    name: 'dirManage',
                    redirect: 'dir-manage/tmf-dir',
                    meta: {
                        requireAuth: true,
                        parent: "manage",
                    },
                    component: resolve => {
                        require(['@/pages/manage/components/dir-manage.vue'], resolve);
                    },
                    children: [{
                            path: 'tmf-dir', //tmf目录管理
                            name: 'tmfDir',
                            meta: {
                                requireAuth: false,
                                parent: "dirManage",

                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/tmf-dir.vue'], resolve);
                            }
                        },
                        {
                            path: 'custom-dir', //自定义目录管理
                            name: 'customDir',
                            meta: {
                                requireAuth: false,
                                parent: "dirManage",

                            },
                            component: resolve => {
                                require(['@/pages/manage/components/unit-page/custom-dir.vue'], resolve);
                            }
                        }
                    ]

                },
                {
                    path: 'notice-manage', //公告管理
                    name: 'noticeManage',
                    meta: {
                        requireAuth: true,
                        parent: "manage",
                    },
                    component: resolve => {
                        require(['@/pages/manage/components/notice-manage.vue'], resolve);
                    },

                }
            ]
        }
    ]

}]

export const routers = [
    loginRouter,
    adminRouter,
    helpPage,
    restPwdRouter,
    pdfView,
    ...appRouter,
    page404,
]