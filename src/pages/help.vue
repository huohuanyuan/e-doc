<template>
    <div>
        <Layout>
            <Header :style="{position: 'fixed', width: '100%',background:'#fff','z-index':'1000'}">
                <h1>
                    m-eDoc 医文档用户说明书</h1>
            </Header>
            <Content :style="{margin: '65px 20px 0', background: '#fff', minHeight: '500px'}">
                <Sider :style="{position: 'fixed', height: 'calc(100vh - 65px)', left:'20px', overflow: 'auto',background:'#fff'}">
                    <div class='md-toc' mdtype='toc'>

                        <p class="md-toc-content">
                            <span class="md-toc-item md-toc-h2" data-ref="n6">
                                <a class="md-toc-inner" style="" href="#header-n6">用户账号</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n11">
                                <a class="md-toc-inner" style="" href="#header-n11">用户登陆</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n23">
                                <a class="md-toc-inner" style="" href="#header-n23">忘记密码</a>
                            </span>
                            <span class="md-toc-item md-toc-h2" data-ref="n26">
                                <a class="md-toc-inner" style="" href="#header-n26">基础概念</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n27">
                                <a class="md-toc-inner" style="" href="#header-n27">文档</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n28">
                                <a class="md-toc-inner" style="" href="#header-n28">文档属性</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n68">
                                <a class="md-toc-inner" style="" href="#header-n68">文档状态</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n86">
                                <a class="md-toc-inner" style="" href="#header-n86">文档任务</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n94">
                                <a class="md-toc-inner" style="" href="#header-n94">文档工作区</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n105">
                                <a class="md-toc-inner" style="" href="#header-n105">项目/机构</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n106">
                                <a class="md-toc-inner" style="" href="#header-n106">文档隔离</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n111">
                                <a class="md-toc-inner" style="" href="#header-n111">权限隔离</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n114">
                                <a class="md-toc-inner" style="" href="#header-n114">权限/角色</a>
                            </span>
                            <span class="md-toc-item md-toc-h2" data-ref="n199">
                                <a class="md-toc-inner" style="" href="#header-n199">系统界面</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n200">
                                <a class="md-toc-inner" style="" href="#header-n200">首页</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n213">
                                <a class="md-toc-inner" style="" href="#header-n213">文档</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n215">
                                <a class="md-toc-inner" style="" href="#header-n215">新建文档</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n229">
                                <a class="md-toc-inner" style="" href="#header-n229">我的文档</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n234">
                                <a class="md-toc-inner" style="" href="#header-n234">文档操作</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n265">
                                <a class="md-toc-inner" style="" href="#header-n265">文档查看</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n280">
                                <a class="md-toc-inner" style="" href="#header-n280">所有文档</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n287">
                                <a class="md-toc-inner" style="" href="#header-n287">最近操作</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n291">
                                <a class="md-toc-inner" style="" href="#header-n291">回收站</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n296">
                                <a class="md-toc-inner" style="" href="#header-n296">文档库</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n306">
                                <a class="md-toc-inner" style="" href="#header-n306">报表中心</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n308">
                                <a class="md-toc-inner" style="" href="#header-n308">系统报表</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n314">
                                <a class="md-toc-inner" style="" href="#header-n314">自定义报表</a>
                            </span>
                            <span class="md-toc-item md-toc-h3" data-ref="n322">
                                <a class="md-toc-inner" style="" href="#header-n322">管理</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n324">
                                <a class="md-toc-inner" style="" href="#header-n324">下载中心</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n338">
                                <a class="md-toc-inner" style="" href="#header-n338">项目管理</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n353">
                                <a class="md-toc-inner" style="" href="#header-n353">用户管理</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n360">
                                <a class="md-toc-inner" style="" href="#header-n360">机构管理</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n364">
                                <a class="md-toc-inner" style="" href="#header-n364">添加机构</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n376">
                                <a class="md-toc-inner" style="" href="#header-n376">修改机构</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n381">
                                <a class="md-toc-inner" style="" href="#header-n381">公告管理</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n387">
                                <a class="md-toc-inner" style="" href="#header-n387">权限管理</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n394">
                                <a class="md-toc-inner" style="" href="#header-n394">权限分配</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n401">
                                <a class="md-toc-inner" style="" href="#header-n401">用户权限</a>
                            </span>
                            <span class="md-toc-item md-toc-h4" data-ref="n405">
                                <a class="md-toc-inner" style="" href="#header-n405">目录管理</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n413">
                                <a class="md-toc-inner" style="" href="#header-n413">TMF模版目录</a>
                            </span>
                            <span class="md-toc-item md-toc-h5" data-ref="n417">
                                <a class="md-toc-inner" style="" href="#header-n417">自定义目录</a>
                            </span>
                            <span class="md-toc-item md-toc-h2" data-ref="n422">
                                <a class="md-toc-inner" style="" href="#header-n422">联系我们</a>
                            </span>
                        </p>
                    </div>
                </Sider>
                <Layout :style="{marginLeft: '200px',padding:'0 20px'}">
                    <h2>
                        <a name='header-n6' class='md-header-anchor '></a>用户账号</h2>
                    <p>
                        <span> </span>m-eDoc系统用户账号不支持在线注册，用户账号的新建是由项目管理员在项目管理人员界面手动添加新用户姓名和邮箱生成。系统会为新用户发送新用户邮件，邮件中会包含账号名以及账号密码信息。</p>
                    <blockquote>
                        <p>注意： m-eDoc系统中用户账号以邮箱为唯一标识 </p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h3>
                        <a name='header-n11' class='md-header-anchor '></a>用户登陆</h3>
                    <p> m-eDoc 系统网址为
                        <a href='https://www.m-edoc.com' target='_blank' class='url'>https://www.m-edoc.com</a> 用户通过在浏览器地址框中输入此地址即可访问。登陆界面如下：​
                        <span> </span><img src='https://ws1.sinaimg.cn/large/0069RVTdly1fv7wr5danzj30n10d9q43.jpg' alt='屏幕快照 2018-09-13 14.37.28' referrerPolicy='no-referrer' /></p>
                    <p>输入用户名和密码即可登陆。</p>
                    <p>m-eDoc为保证账号的安全性，有以下密码规定：</p>
                    <ul>
                        <li>用户初次登陆会要求强制更改用户密码</li>
                        <li>用户一个月未登陆系统会要求更改密码</li>
                        <li>三个月会强制要求用户更改密码</li>
                    </ul>
                    <h3>
                        <a name='header-n23' class='md-header-anchor '></a>忘记密码</h3>
                    <p>如用户忘记登陆密码，可以通过在登陆页点击
                        <code>忘记密码</code> 按钮，根据界面提示输入用户账号邮箱，系统会为该邮箱发送临时密码进行系统登陆。通过临时密码登陆系统时，系统会强制要求用户更改密码。</p>
                    <p>&nbsp;</p>
                    <h2>
                        <a name='header-n26' class='md-header-anchor '></a>基础概念</h2>
                    <h3>
                        <a name='header-n27' class='md-header-anchor '></a>文档</h3>
                    <h4>
                        <a name='header-n28' class='md-header-anchor '></a>
                        <span id="meta">文档属性</span>
                    </h4>
                    <p>m-eDoc系统根据医学文档管理的要求，定制文档元数据属性如下：</p>
                    <ul>
                        <li>
                            <p>文档名称
                                <sup>
                                    <mark>*</mark>
                                </sup>
                            </p>
                            <p>文档名称接收，在上传文档成功后系统会自动填写</p>
                        </li>
                        <li>
                            <p>文档编号 </p>
                            <p>文档编号用于定义文档记录使用，各项目可根据具体情况使用</p>
                        </li>
                        <li>
                            <p>目录
                                <sup>
                                    <mark>*</mark>
                                </sup>
                            </p>
                            <p>文档存储目录</p>
                        </li>
                        <li>
                            <p>生效日期 </p>
                            <p>文档生效日期，仅展示使用</p>
                        </li>
                        <li>
                            <p>失效日期</p>
                            <p>文档失效日期，仅展示使用 </p>
                        </li>
                        <li>
                            <p>备注</p>
                            <p>文档备注信息</p>
                        </li>
                        <li>
                            <p>版本类型
                                <sup>
                                    <mark>*</mark>
                                </sup>
                            </p>
                            <p>文档生命周期版本管理，版本类型目前系统支持三种类型，分别为：</p>
                            <ul>
                                <li>
                                    <p>标准</p>
                                    <p>此版本格式由系统自动控制生成和更改，以{A.B}的格式定义。其中A为大版本号码，当文档归档后自动加1；B为小版本号码，每一次更改文档实体文件自动加0.1， 如初始为0.1，修改文档实体文件后为0.2，文件发布后为1.0，再次修改文件实体则变为1.1，以此类推。</p>
                                </li>
                                <li>
                                    <p>自定义版本</p>
                                    <p>此版本完全由用户输入，不会随文件的修改和发布进行更改。</p>
                                </li>
                                <li>
                                    <p>内置格式</p>
                                    <p>此版本格式由系统自动控制生成和更改，以{AB}的格式定义，A为字母，B为数字。其中A为大版本号码，当文档归档后自动按字母顺序延后一位；B为小版本号码，每一次更改文档实体文件自定加1. 如初始为A1，修改文档实体文件后为A2，文件发布后为B0，再次修改文件实体则变为B1，以此类推。</p>
                                    <blockquote>
                                        <p>m-eDoc系统可以根据用户的特殊需求，定制符合客户要求的版本策略 </p>
                                    </blockquote>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <blockquote>
                        <p>符号
                            <sup>
                                <mark>*</mark>
                            </sup>表示必须填写属性 </p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n68' class='md-header-anchor '></a>文档状态</h4>
                    <p>m-eDoc系统根据文档在系统中的生命周期，分为以下六种状态：</p>
                    <ul>
                        <li>进行中： 文档目前处于作者工作区，作者可对文档进行文档属性编辑、任务流程发起</li>
                        <li>审阅中： 文档处于审阅阶段，由指定审阅人员进行审阅</li>
                        <li>QC中： 文档处于QC阶段，由指定QC人员进行QC</li>
                        <li>审批中： 文档处于审批阶段，由审批人员进行审批</li>
                        <li>待接收： 文档处于任务发出后，需要相应操作人员接收状态（如文档需要审阅人员配置多名人员，但只要一名审阅人员审阅通过后就可以进入下一步流程。此时文件作者将文件发送至审阅，需要多名审阅人员中的其中一名进行接收此任务）</li>
                        <li>已归档： 文档处于已归档状态，存在于文件库中</li>
                        <li>待激活： 文档没有上传文件实体，或是属于文档从回收站恢复后的状态</li>
                    </ul>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n86' class='md-header-anchor '></a>文档任务</h4>
                    <p>m-eDoc系统文档任务分为三种：审阅、QC、审批。其中审阅、QC是可选
                        <mark>可配置</mark>任务，审批为必须配置任务。</p>
                    <p>系统采用交互式流程发起模式，由作者操作文档发送文件流程。审阅和QC的顺序可以进行调整。如果配置了文档审阅、QC流程，则只有在文档审阅、QC都通过后才能发起最终的审批流程。交互模式如下图</p>
                    <div class="md-diagram-panel">
                        <p>
                            <img src='https://ws1.sinaimg.cn/large/006tNbRwly1fvco0n8bvsj30lh0aq3z3.jpg' alt='屏幕快照 2018-09-14 11.13.10' referrerPolicy='no-referrer' />
                        </p>

                    </div>
                    <p>其中文档任务引起的文件状态的转移如下图</p>
                    <div class="md-diagram-panel">
                        <p>
                            <img src='https://ws2.sinaimg.cn/large/006tNbRwly1fvco0p2b2yj30lr0gh0tl.jpg' alt='屏幕快照 2018-09-14 11.13.10' referrerPolicy='no-referrer' />
                        </p>
                    </div>
                    <p>其中审阅、QC顺序可以调整。在审阅、QC如果失败后，可以重新发起请求。如果更改文档元数据(名称、编码、目录等)系统会自动抹去其QC认证。如果更改文档实体文件，系统会自动抹去其审阅认证。</p>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n94' class='md-header-anchor '></a>文档工作区
                        <span id='fileLibrary' />
                    </h4>
                    <p>m-eDoc将文档存储空间分为
                        <code>工作区</code>
                        <code>文件库</code>:</p>
                    <ul>
                        <li>
                            <p>工作区：项目文档的编辑，流程操作区域。所有文件的新建都会出现的工作区，工作区用于文档定稿前的修改流程操作等。</p>
                            <p>
                                <span> </span>
                            </p>
                        </li>
                        <li>
                            <p>文件库：文档审核归档后会将文档复制一份存放在文件库中，用于对外展示、文档定稿后的长久保存。</p>
                        </li>
                    </ul>
                    <blockquote>
                        <p>工作区文档和文件库中的文档在逻辑上是相互独立的，如文档归档后，在工作区修改文档，文件库中的文档不会立刻同步更新。只有重新将文档归档后，文件库中的文档才会更新。</p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h3>
                        <a name='header-n105' class='md-header-anchor '></a>项目/机构</h3>
                    <h4>
                        <a name='header-n106' class='md-header-anchor '></a>文档隔离</h4>
                    <p>m-eDoc系统按项目/机构的组织形式进行文档的安全隔离，所有项目人员共用一套项目目录。项目下划分为机构/组织结构。如人员甲是项目下A机构的人员，乙是项目下B机构的人员，虽然A和B在同一个项目下看到的文件目录结构一致，但甲乙人员看不到对方机构/组织的文件。系统在机构/组织层有文档隔离机制。</p>
                    <blockquote>
                        <p>每个项目有默认
                            <mark>--</mark> 机构，代表项目下所有机构层面。</p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n111' class='md-header-anchor '></a>权限隔离</h4>
                    <p>m-eDoc系统项目人员权限配置是最小单位按照项目下机构/组织配置。如甲人员在&#39;测试项目下A,B结构中角色不同。只有进入该项目下机构环境才能起作用。(切换环境请参考后续操作部分)</p>
                    <p>### </p>
                    <h3>
                        <a name='header-n114' class='md-header-anchor '></a>权限/角色</h3>
                    <p>m-eDoc系统的操作权限配置，分为两类：</p>
                    <ul>
                        <li>用户与角色绑定，给角色配置权限（适合一类人员）</li>
                        <li>用户与权限直接绑定，给用户直接配置特殊权限（适合特定用户）</li>
                    </ul>
                    <p>系统内置六大内置角色：</p>
                    <ol start=''>
                        <li>普通人员</li>
                        <li>审阅人员</li>
                        <li>QC人员</li>
                        <li>批准人员</li>
                        <li>内部稽查人员</li>
                        <li>外部稽查人员</li>
                    </ol>
                    <p>相应人员的初始角色权限可在系统中
                        <code>管理-&gt;权限管理</code> 中可以查看更改。用户也可以自定义添加角色。</p>
                    <p>系统内置权限如下表：</p>
                    <figure>
                        <table>
                            <thead>
                                <tr>
                                    <th style='text-align:center;'>新建文件</th>
                                    <th>新建文件</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style='text-align:center;'>编辑文件</td>
                                    <td>修改文件的基本信息</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>工作区单文件下载</td>
                                    <td>下载工作区单个文件（包括历史版本）</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>删除文件</td>
                                    <td>删除文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>查看工作区</td>
                                    <td>查看工作区（目录和文件）</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>阅读工作区文件</td>
                                    <td>阅读工作区文件、历史版本和查看操作记录</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>审阅文件</td>
                                    <td>审阅文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>QC文件</td>
                                    <td>QC文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>批准文件</td>
                                    <td>批准文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>查看提交库文件</td>
                                    <td>查看提交库文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>查看非提交库文件</td>
                                    <td>查看非提交库文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>阅读提交库文件</td>
                                    <td>阅读提交库文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>阅读非提交库文件</td>
                                    <td>阅读非提交库文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>下载提交库文件</td>
                                    <td>下载提交库文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>下载非提交库文件</td>
                                    <td>下载非提交库文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>撤销归档文件</td>
                                    <td>撤销归档文件</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>查看报表中心</td>
                                    <td>查看报表中心</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>报表下载</td>
                                    <td>下载报表中心导出的报表</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>发通告</td>
                                    <td>项目内发送通告</td>
                                </tr>
                                <tr>
                                    <td style='text-align:center;'>工作区批量下载</td>
                                    <td>批量下载工作区文件</td>
                                </tr>
                            </tbody>
                        </table>
                    </figure>
                    <p>&nbsp;</p>
                    <h2>
                        <a name='header-n199' class='md-header-anchor '></a>系统界面</h2>
                    <h3>
                        <a name='header-n200' class='md-header-anchor '></a>首页</h3>
                    <p>
                        <img src='https://ws3.sinaimg.cn/large/0069RVTdly1fv8wcogozgj31el0mpq75.jpg' alt='屏幕快照 2018-09-14 11.13.10' referrerPolicy='no-referrer' />
                    </p>
                    <p>如上图所示，m-eDoc首页分为四大区域（
                        <mark>系统会根据用户角色的不同展示不同的区域</mark>）:</p>
                    <ol start=''>
                        <li>左侧操作导航栏：对应五大模块</li>
                        <li>中间上部项目切换导航栏：对于多项目用户、在此界面进行项目切换</li>
                        <li>中间下部任务文档展示区域：将用户需要操作的任务文档快速展示</li>
                        <li>右侧用户任务统计区域：将用户的任务按类型进行统计，点击任务数字将跳转到详细界面</li>
                    </ol>
                    <p>&nbsp;</p>
                    <h3>
                        <a name='header-n213' class='md-header-anchor '></a>文档</h3>
                    <p>文档模块分为四大部门分别为
                        <code>新建文档</code>
                        <code>我的文档</code>
                        <code>所有文档</code>
                        <code>最近操作</code>
                        <code>回收站</code>
                    </p>
                    <h4>
                        <a name='header-n215' class='md-header-anchor '></a>新建文档</h4>
                    <p><img src='https://ws2.sinaimg.cn/large/006tNbRwly1fvcdogw9w3j31cz0lfn04.jpg' alt='屏幕快照 2018-09-17 11.30.48' referrerPolicy='no-referrer' /></p>
                    <p>如图所示新建文件界面，为了更方便用户上传指定目录的文件，系统设置了
                        <code>自定义目录</code>
                        <code>TMF模版目录</code>两类新建模式，该模式的区别在于文档目录的显示方式不同。</p>
                    <p>用户在文档上传处单击/拖拽文档后上传文档，文档大小不能大于10M，</p>
                    <p>文档支持格式：pdf doc docx xls xlsx ppt pptx xpt sas rtf bmp gif pic tif jpn png jpg zip rar txt xml r jpep jpeg eml msg。 其中：PDF，ODC、DOCX、XLS、XLSX、PPT、PPTX格式文档支持在线查看。</p>
                    <p>文档数据分为两部分，元数据和流程数据：</p>
                    <ul>
                        <li>元数据：文档基本数据。详情介绍可查看
                            <a href='#meta'>文档属性</a>
                        </li>
                        <li>流程数据：文档流程需要配置数据包含审阅者、QC者、审批者(通过下拉框的模式选择，系统会检索有相应权限的用户，可多选)<br/>​ </li>
                    </ul>
                    <blockquote>
                        <p>流程模版 将常用的流程信息存入流程模版，下次上传文件后。可直接使用已保存的流程模版，省去用户再次选择流程数据。每个项目每个用户可以保存五个模版。</p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n229' class='md-header-anchor '></a>我的文档</h4>
                    <p>我的文档模块展示用户自己的所有文档信息</p>
                    <p><img src='https://ws4.sinaimg.cn/large/0069RVTdly1fv9568mfkej31cq05rwf7.jpg' alt='屏幕快照 2018-09-14 16.19.24' referrerPolicy='no-referrer' /></p>
                    <p>如图所示，界面展示文档名称、文档编号、版本号、更新时间、文件状态、操作</p>
                    <p>其中可以按照文件名称、更新时间、文件状态进行排序增降序进行排列</p>
                    <h5>
                        <a name='header-n234' class='md-header-anchor '></a>文档操作
                        <span id="fileOperation" />
                    </h5>
                    <p>m-eDoc系统中文件操作的模式都是一样的，都是以列表形式展示，通过操作按钮进行操纵</p>
                    <ul>
                        <li>
                            <p>查看文件，直接点击文件名称。可以跳转到
                                <a href='#fileView'>文件查看界面</a>
                            </p>
                        </li>
                        <li>
                            <p>操作文件，点击操作图标 <img src='https://ws4.sinaimg.cn/large/0069RVTdly1fv95ba1rcvj301k00ydfn.jpg' alt='123' referrerPolicy='no-referrer' /> 进行操作。操作方法有：</p>
                            <ul>
                                <li>修改 修改文件</li>
                                <li>删除 删除文件</li>
                                <li>操作记录 查看文件操作记录</li>
                                <li>历史版本 查看文件历史版本</li>
                                <li>发送至审阅 将文件发送至审阅</li>
                                <li>发送至QC 将文件发送至QC</li>
                                <li>发送至审批 将文件发送至审批</li>
                                <li>去审阅 去文件查看界面审阅</li>
                                <li>去QC 去文件查看界面QC</li>
                                <li>去审批 去文件查看界面审批</li>
                            </ul>
                        </li>
                    </ul>
                    <blockquote>
                        <p>用户可对文件进行的操作，会随文件的状态和用户权限进行变化</p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h5>
                        <a name='header-n265' class='md-header-anchor '></a>文档查看
                        <span id="fileView" />
                    </h5>
                    <p>m-eDoc系统支持PDF、Office文件的在线查看。有相应权限的用户通过点击文件名称将进入文件查看页面。如图：</p>
                    <p><img src='https://ws3.sinaimg.cn/large/0069RVTdly1fv96q68y3lj31h40qi0zx.jpg' alt='屏幕快照 2018-09-14 16.32.50' referrerPolicy='no-referrer' /></p>
                    <p>文档查看界面分为两部分：左侧文档展示区域、右侧文档评论操作区域</p>
                    <p>右侧的文档评论操作区域分为上下两部分：</p>
                    <ul>
                        <li>上部分流程操作区域： 只有拥有文件相应操作权限的人员可以进行此区域的操作<img src='ipic/屏幕快照 2018-09-14 16.37.47.png' alt='屏幕快照 2018-09-14 16.37.47' referrerPolicy='no-referrer' /></li>
                    </ul>
                    <p> 如图进行相应操作，如配置签名要求，在点击通过操作时会弹出电子签名框：</p>
                    <p>
                        <span> </span><img src='https://ws3.sinaimg.cn/large/0069RVTdly1fv96qfpd0pj30ir0bk3z3.jpg' alt='屏幕快照 2018-09-14 16.37.53' referrerPolicy='no-referrer' /></p>
                    <p> 用户需要输入密码，勾选用户须知进行保存。</p>
                    <ul>
                        <li>下部分文件评论区域： 用户可以对当前版本的文件进行留言评论。当文件版本更新后，评论将清空。评论作者本人可以删除自己的评论</li>
                    </ul>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n280' class='md-header-anchor '></a>所有文档</h4>
                    <p>进入所有文档模块如下图</p>
                    <p><img src='https://ws1.sinaimg.cn/large/0069RVTdly1fv96q25yf3j31cx0n0gp6.jpg' alt='屏幕快照 2018-09-14 16.41.55' referrerPolicy='no-referrer' /></p>
                    <p>左侧是文件目录区域，展示整个项目的文档目录信息。每个目录后面的数字代表该目录下存在多少文档。点击目录名称，右侧文档列表展示区域将展示该目录下的文档列表信息。对文档的操作，请查看
                        <a href='#fileOperation'>文档操作</a>
                    </p>
                    <blockquote>
                        <p>切换项目机构环境后，文档的统计数量不同。只会统计当前机构下的文档数量。如果是
                            <mark>--</mark>机构，将会统计项目下所有文档。 </p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n287' class='md-header-anchor '></a>最近操作</h4>
                    <p>最近操作模块展示用户最近操作过的文档，方便用户快速定位文档。展示如下</p>
                    <p><img src='https://ws1.sinaimg.cn/large/0069RVTdly1fv96qlojayj31cn0kadjs.jpg' alt='屏幕快照 2018-09-14 16.46.31' referrerPolicy='no-referrer' /></p>
                    <p>对文档的操作，请查看
                        <a href='#fileOperation'>文档操作</a>
                    </p>
                    <h4>
                        <a name='header-n291' class='md-header-anchor '></a>回收站</h4>
                    <p>用户将文档删除后，文档将移动至回收站</p>
                    <p><img src='https://ws1.sinaimg.cn/large/0069RVTdly1fv96qnk91sj31d10alq48.jpg' alt='屏幕快照 2018-09-14 16.48.02' referrerPolicy='no-referrer' /></p>
                    <p>若想从回收站恢复文档。请点击文档前的选择框，文档列表上将出现
                        <code>恢复</code>按钮，点击恢复按钮文档将进行恢复。</p>
                    <p>&nbsp;</p>
                    <h3>
                        <a name='header-n296' class='md-header-anchor '></a>文档库</h3>
                    <p>归档后文件展示模块，可查看
                        <a href='#fileLibrary'>文档工作区</a> 区分其概念。文档库又分为
                        <code>提交文档</code>&nbsp;
                        <code>非提交文档</code>
                    </p>
                    <ul>
                        <li>提交文档： 用于客户提交药监局或提交第三方稽查等文档存储区域</li>
                        <li>非提交文档： 用于客户保存自有非重要度高的文档区域</li>
                    </ul>
                    <blockquote>
                        <p>提交文档、非提交文档只是概念上的划分，可以将其看作为文档库的两个区域。具体的使用情况请结合自己项目的情况来使用</p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h3>
                        <a name='header-n306' class='md-header-anchor '></a>报表中心</h3>
                    <p>报表中心用于展示项目数据，提供用户查看、下载项目数据</p>
                    <h4>
                        <a name='header-n308' class='md-header-anchor '></a>系统报表</h4>
                    <p><img src='https://ws1.sinaimg.cn/large/0069RVTdly1fv96qqd598j31ce0loac8.jpg' alt='屏幕快照 2018-09-14 17.10.50' referrerPolicy='no-referrer' />
                        <span> </span>
                    </p>
                    <p>系统默认展示：归档文件统计图、文件数量统计图、文件状态分布图</p>
                    <blockquote>
                        <p>可以根据用户特殊需求进行图标定制</p>
                    </blockquote>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n314' class='md-header-anchor '></a>自定义报表</h4>
                    <p>自定义报表用于用户在系统中提供文档属性进行个性化定制查询、展示、导出报表。</p>
                    <p><img src='https://ws2.sinaimg.cn/large/0069RVTdly1fv96qrs8m5j31cq0f0jso.jpg' alt='屏幕快照 2018-09-14 17.12.23' referrerPolicy='no-referrer' /></p>
                    <p>如图所有用户可选择导出哪个机构的文档信息，可以多选。然后选择文档需要导出的基本属性后点击
                        <code>查看</code>按钮</p>
                    <p>&nbsp;</p>
                    <p><img src='https://ws2.sinaimg.cn/large/0069RVTdly1fv96su5tl6j31d70iw76z.jpg' alt='屏幕快照 2018-09-14 17.15.47' referrerPolicy='no-referrer' /></p>
                    <p>待文档展示出来后，可以使用左上角
                        <code>下载</code>按钮进行报表下载。目前支持CSV、PDF两种格式的报表下载</p>
                    <p>&nbsp;</p>
                    <h3>
                        <a name='header-n322' class='md-header-anchor '></a>管理</h3>
                    <p>管理模块分为：
                        <code>下载中心</code>&nbsp;
                        <code>项目管理</code>&nbsp;
                        <code>用户管理</code>&nbsp;
                        <code>机构管理</code>&nbsp;
                        <code>公告管理</code>&nbsp;
                        <code>权限管理</code>&nbsp;
                        <code>目录管理</code>六大部分</p>
                    <h4>
                        <a name='header-n324' class='md-header-anchor '></a>下载中心</h4>
                    <p>下载中心用于用户集中下载项目文档、可以单个下载或者多选下载、或者按目录下载</p>
                    <p><img src='https://ws4.sinaimg.cn/large/0069RVTdly1fv96xxg6hpj31cu0njwhn.jpg' alt='屏幕快照 2018-09-14 17.20.52' referrerPolicy='no-referrer' /></p>
                    <p>如图所有下载中心分为</p>
                    <ul>
                        <li>所有文档 工作区所有文档</li>
                        <li>非提交文档 文件库非提交库文档</li>
                        <li>提交文档 文件库提交文档</li>
                    </ul>
                    <p>三个部门的下载管理，三个部门的权限可以分别配置</p>
                    <p>目录下载，可以选择相应目录的选择框后，出现下载按钮进行下载</p>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n338' class='md-header-anchor '></a>项目管理</h4>
                    <p>项目管理指管理修改项目的基本信息，如图</p>
                    <p><img src='https://ws3.sinaimg.cn/large/0069RVTdly1fv970sfb6rj30pf0bjwf8.jpg' alt='屏幕快照 2018-09-14 17.23.43' referrerPolicy='no-referrer' /></p>
                    <ul>
                        <li>项目编号：不能进行修改，该编号是在建立项目时生成。如必须修改请联系系统管理员进行操作，用户无权限操作</li>
                        <li>项目名称</li>
                        <li>项目阶段</li>
                        <li>目录类型： 该项目的使用类型有两种模式可供选择
                            <code>TMF模版目录</code>&nbsp;
                            <code>自定义目录</code>可以多选。如需去除某类目录，必须将相应类型下的文件都删除。</li>
                        <li>项目描述</li>
                    </ul>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n353' class='md-header-anchor '></a>用户管理</h4>
                    <p>用于建立用户，配置用户角色</p>
                    <p><img src='https://ws1.sinaimg.cn/large/0069RVTdly1fv9763fsinj30xb08qwev.jpg' alt='屏幕快照 2018-09-14 17.28.27' referrerPolicy='no-referrer' /></p>
                    <p>点击添加用户弹出添加用户框</p>
                    <p><img src='https://ws4.sinaimg.cn/large/0069RVTdly1fv9772kw6mj30mz09rq3i.jpg' alt='屏幕快照 2018-09-14 17.29.47' referrerPolicy='no-referrer' /></p>
                    <p>如上图，需要添加用户名称、用户邮箱、机构信息、和角色。 一个用户可以存在多个角色，所以添加时需要选择机构和角色后先点击角色右侧的确认按钮，生成角色信息条。最后点击最下方绿色背景确认按钮。</p>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n360' class='md-header-anchor '></a>机构管理</h4>
                    <p>管理机构/组织信息，将项目下划分为几个机构/组织之间的文件是逻辑隔离的。</p>
                    <p><img src='https://ws4.sinaimg.cn/large/006tNbRwly1fvc9dsz5r2j31710a5ab8.jpg' alt='屏幕快照 2018-09-17 09.01.55' referrerPolicy='no-referrer' /></p>
                    <p>如上图为机构列表界面</p>
                    <h5>
                        <a name='header-n364' class='md-header-anchor '></a>添加机构</h5>
                    <p>点击左上角
                        <code>添加</code>按钮，弹出机构添加信息框</p>
                    <p><img src='https://ws3.sinaimg.cn/large/006tNbRwly1fvc9f7woxfj30de08m3yp.jpg' alt='屏幕快照 2018-09-17 09.03.34' referrerPolicy='no-referrer' /></p>
                    <p>机构收集需要基本信息：</p>
                    <ol start=''>
                        <li>机构名称</li>
                        <li>机构简称</li>
                        <li>机构编码 在同一个项目下，不同机构的机构编码需要唯一</li>
                    </ol>
                    <p>&nbsp;</p>
                    <h5>
                        <a name='header-n376' class='md-header-anchor '></a>修改机构</h5>
                    <p>在机构列表界面，点击待修改机构项</p>
                    <p><img src='https://ws4.sinaimg.cn/large/006tNbRwly1fvc9iu9s3dj317m09m3zu.jpg' alt='屏幕快照 2018-09-17 09.06.59' referrerPolicy='no-referrer' /></p>
                    <p>左上角操作框将出现
                        <code>修改</code>&nbsp;
                        <code>删除</code>按钮，点击相应按钮进行操作即可</p>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n381' class='md-header-anchor '></a>公告管理</h4>
                    <p>公告功能指在项目中发布一条消息提醒，用户通知所有项目下用户的消息。</p>
                    <p><img src='https://ws4.sinaimg.cn/large/006tNbRwly1fvc9l7cu28j31630c874s.jpg' alt='屏幕快照 2018-09-17 09.09.20' referrerPolicy='no-referrer' /></p>
                    <p>公告分为：公告主题、公告详情。公告不能添加多条，每次修改都是对上一次信息的覆盖。项目公告展示处只会展示一条公告。查看项目公告在主页的左上角点击<img src='https://ws2.sinaimg.cn/large/006tNbRwly1fvc9nvtnm3j3017011t8j.jpg' alt='屏幕快照 2018-09-17 09.11.51' referrerPolicy='no-referrer' />后弹出公告：</p>
                    <p><img src='https://ws3.sinaimg.cn/large/006tNbRwly1fvc9o8evu7j308t040q31.jpg' alt='屏幕快照 2018-09-17 09.11.46' referrerPolicy='no-referrer' /></p>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n387' class='md-header-anchor '></a>权限管理</h4>
                    <p>m-eDoc权限管理分为
                        <code>权限分配</code>
                        <code>用户权限</code>两部分</p>
                    <ul>
                        <li>权限分配 用于配置角色和权限的管理</li>
                        <li>用户权限 用于配置单个用户的权限</li>
                    </ul>
                    <h5>
                        <a name='header-n394' class='md-header-anchor '></a>权限分配</h5>
                    <p>m-eDoc系统内置了7大角色，项目建立时将自动生成相应角色权限模版。用户可以在此基础上进行修改。也可以建立自定义角色，配置相应权限。</p>
                    <blockquote>
                        <p>系统是按项目进行权限配置，不同项目的角色权限不通用。需要重新配置</p>
                    </blockquote>
                    <p><img src='https://ws2.sinaimg.cn/large/006tNbRwly1fvcafsa42cj316q0hvdhl.jpg' alt='屏幕快照 2018-09-17 09.38.42' referrerPolicy='no-referrer' /></p>
                    <p>若要修改角色的权限，只需要在选择框中选择权限，点击右下角保存按钮即可。</p>
                    <p>&nbsp;</p>
                    <h5>
                        <a name='header-n401' class='md-header-anchor '></a>用户权限</h5>
                    <p>用户权限用于给单用户配置单独权限</p>
                    <p><img src='https://ws1.sinaimg.cn/large/006tNbRwly1fvcahsshrqj310n07sdgj.jpg' alt='屏幕快照 2018-09-17 09.40.32' referrerPolicy='no-referrer' /></p>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n405' class='md-header-anchor '></a>目录管理</h4>
                    <p>m-eDoc系统中目录分为两大类型：</p>
                    <ul>
                        <li>TMF模版目录 TMF V3.0版本目录</li>
                        <li>用户自定义目录 也会为用户提供一些目录的模版，方便用户选择使用</li>
                    </ul>
                    <p>&nbsp;</p>
                    <h5>
                        <a name='header-n413' class='md-header-anchor '></a>TMF模版目录</h5>
                    <p><img src='https://ws3.sinaimg.cn/large/006tNbRwly1fvcautyuy0j316x0el3zu.jpg' alt='屏幕快照 2018-09-17 09.53.01' referrerPolicy='no-referrer' /></p>
                    <p>用户可以根据自己项目的使用需求，在TMF模版目录上屏蔽一些目录。只需要在相应目录前进行点击<img src='https://ws1.sinaimg.cn/large/006tNbRwly1fvcay1jj3kj300s00na9v.jpg' alt='屏幕快照 2018-09-17 09.56.16' referrerPolicy='no-referrer' />代表使用，否则为不使用</p>
                    <p>&nbsp;</p>
                    <h5>
                        <a name='header-n417' class='md-header-anchor '></a>自定义目录</h5>
                    <p><img src='https://ws2.sinaimg.cn/large/006tNbRwly1fvcaysbayij316w0j6n0k.jpg' alt='屏幕快照 2018-09-17 09.56.51' referrerPolicy='no-referrer' /></p>
                    <p>左侧为模板使用区域，系统内会提供业内专家总结的不同情况下的目录模版，用户可以选择进行使用。</p>
                    <p>右侧为用户项目中的自定义目录，可以进行添加修改删除。</p>
                    <p>&nbsp;</p>
                    <h3>
                        <a name='header-n1426' class='md-header-anchor '></a>个人中心</h3>
                    <p>登陆成功后在界面右上角用户名称下拉列表，点击
                        <code>个人中心</code> 进入管理</p>
                    <h4>
                        <a name='header-n1428' class='md-header-anchor '></a>基本信息</h4>
                    <p><img src='https://ws3.sinaimg.cn/large/006tNbRwly1fvcmhpb6mlj312e0ce0tk.jpg' alt='屏幕快照 2018-09-17 16.35.38' referrerPolicy='no-referrer' /></p>
                    <p>基本信息可以更改用户名称、点击用户头像可以更改用户头像</p>
                    <p>&nbsp;</p>
                    <h4>
                        <a name='header-n1435' class='md-header-anchor '></a>邮件通知</h4>
                    <p>每次文件的状态更改，相应的人员都会有邮件通知。如果想关闭通知，在此处设置</p>
                    <p><img src='https://ws4.sinaimg.cn/large/006tNbRwly1fvcmlcgu0bj312d0cm3zt.jpg' alt='屏幕快照 2018-09-17 16.39.13' referrerPolicy='no-referrer' /></p>
                    <p>在操作处，点击开关按钮即可</p>
                    <p>&nbsp;</p>
                    <h2>
                        <a name='header-n422' class='md-header-anchor '></a>联系我们</h2>
                    <p>如您有任何问题或建议，可以通过以下方式联系我们 </p>
                    <ul>
                        <li>电话： +86 15891447976</li>
                        <li>邮件：
                            <a href='mailto:itlibo@m-clinical.cn' target='_blank' class='url'>itlibo@m-clinical.cn</a>
                        </li>
                    </ul>
                    <p>非常感谢使用m-eDoc系统，您的建议是我们进步的动力！ 摩亦医药技术有限公司</p>
                    <p><img src='https://ws1.sinaimg.cn/large/006tNbRwly1fvcb5ssmsaj30by0bywf1.jpg' alt='QRcode' referrerPolicy='no-referrer' /></p>
                </Layout>
            </Content>
        </Layout>
        <BackTop></BackTop>
    </div>

</template>
<style  lang="scss" scoped>
@import "https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,700,400&subset=latin,latin-ext";
html {
  overflow-x: initial !important;
}
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --select-text-bg-color: #b5d6fc;
  --select-text-font-color: auto;
  --monospace: "Lucida Console", Consolas, "Courier", monospace;
}
html {
  font-size: 14px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
body {
  margin: 0px;
  padding: 0px;
  height: auto;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  font-size: 1rem;
  line-height: 1.42857143;
  overflow-x: hidden;
  background-image: inherit;
  background-size: inherit;
  background-attachment: inherit;
  background-origin: inherit;
  background-clip: inherit;
  background-color: inherit;
  background-position: inherit inherit;
  background-repeat: inherit inherit;
}
iframe {
  margin: auto;
}
a.url {
  word-break: break-all;
}
a:active,
a:hover {
  outline: 0px;
}
.in-text-selection,
::selection {
  text-shadow: none;
  background: var(--select-text-bg-color);
  color: var(--select-text-font-color);
}
#write {
  margin: 0px auto;
  height: auto;
  width: inherit;
  word-break: normal;
  word-wrap: break-word;
  position: relative;
  white-space: normal;
  padding-bottom: 70px;
  overflow-x: visible;
}
.first-line-indent #write div,
.first-line-indent #write li,
.first-line-indent #write p {
  text-indent: 2em;
}
.first-line-indent #write div :not(p):not(div),
.first-line-indent #write div.md-htmlblock-container,
.first-line-indent #write p *,
.first-line-indent pre {
  text-indent: 0px;
}
.for-image #write {
  padding-left: 8px;
  padding-right: 8px;
}
body.typora-export {
  padding-left: 30px;
  padding-right: 30px;
}
@media screen and (max-width: 500px) {
  body.typora-export {
    padding-left: 0px;
    padding-right: 0px;
  }
  .CodeMirror-sizer {
    margin-left: 0px !important;
  }
  .CodeMirror-gutters {
    display: none !important;
  }
}
#write > blockquote:first-child,
#write > div:first-child,
#write > figure:first-child,
#write > ol:first-child,
#write > p:first-child,
#write > pre:first-child,
#write > ul:first-child {
  margin-top: 30px;
}
#write li > figure:first-child {
  margin-top: -20px;
}
#write ol,
#write ul {
  position: relative;
}
img {
  max-width: 100%;
  vertical-align: middle;
}
button,
input,
select,
textarea {
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-variant-caps: inherit;
  font-weight: inherit;
  font-stretch: inherit;
  line-height: inherit;
}
input[type="checkbox"],
input[type="radio"] {
  line-height: normal;
  padding: 0px;
}
*,
::after,
::before {
  box-sizing: border-box;
}
#write h1,
#write h2,
#write h3,
#write h4,
#write h5,
#write h6,
#write p,
#write pre {
  width: inherit;
}
#write h1,
#write h2,
#write h3,
#write h4,
#write h5,
#write h6,
#write p {
  position: relative;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  break-after: avoid-page;
  break-inside: avoid;
  orphans: 2;
}
p {
  orphans: 4;
}
h1 {
  font-size: 2rem;
}
h2 {
  font-size: 1.8rem;
}
h3 {
  font-size: 1.6rem;
}
h4 {
  font-size: 1.4rem;
}
h5 {
  font-size: 1.2rem;
}
h6 {
  font-size: 1rem;
}
.md-math-block,
.md-rawblock,
h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.hidden {
  display: none;
}
.md-blockmeta {
  color: rgb(204, 204, 204);
  font-weight: 700;
  font-style: italic;
}
a {
  cursor: pointer;
}
sup.md-footnote {
  padding: 2px 4px;
  background-color: rgba(238, 238, 238, 0.701961);
  color: rgb(85, 85, 85);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  cursor: pointer;
}
sup.md-footnote a,
sup.md-footnote a:hover {
  color: inherit;
  text-transform: inherit;
  text-decoration: inherit;
}
#write input[type="checkbox"] {
  cursor: pointer;
  width: inherit;
  height: inherit;
}
figure {
  overflow-x: auto;
  margin: 1.2em 0px;
  max-width: calc(100% + 16px);
  padding: 0px;
}
figure > table {
  margin: 0px !important;
}
tr {
  break-inside: avoid;
  break-after: auto;
}
thead {
  display: table-header-group;
}
table {
  border-collapse: collapse;
  border-spacing: 0px;
  width: 100%;
  overflow: auto;
  break-inside: auto;
  text-align: left;
}
table.md-table td {
  min-width: 80px;
}
.CodeMirror-gutters {
  border-right-width: 0px;
  background-color: inherit;
}
.CodeMirror {
  text-align: left;
}
.CodeMirror-placeholder {
  opacity: 0.3;
}
.CodeMirror pre {
  padding: 0px 4px;
}
.CodeMirror-lines {
  padding: 0px;
}
div.hr:focus {
  cursor: none;
}
#write pre {
  white-space: pre-wrap;
}
#write.fences-no-line-wrapping pre {
  white-space: pre;
}
#write pre.ty-contain-cm {
  white-space: normal;
}
.CodeMirror-gutters {
  margin-right: 4px;
}
.md-fences {
  font-size: 0.9rem;
  display: block;
  break-inside: avoid;
  text-align: left;
  overflow: visible;
  white-space: pre;
  background-image: inherit;
  background-size: inherit;
  background-attachment: inherit;
  background-origin: inherit;
  background-clip: inherit;
  background-color: inherit;
  position: relative !important;
  background-position: inherit inherit;
  background-repeat: inherit inherit;
}
.md-diagram-panel {
  width: 100%;
  margin-top: 10px;
  text-align: center;
  padding-top: 0px;
  padding-bottom: 8px;
  overflow-x: auto;
}
#write .md-fences.mock-cm {
  white-space: pre-wrap;
}
.md-fences.md-fences-with-lineno {
  padding-left: 0px;
}
#write.fences-no-line-wrapping .md-fences.mock-cm {
  white-space: pre;
  overflow-x: auto;
}
.md-fences.mock-cm.md-fences-with-lineno {
  padding-left: 8px;
}
.CodeMirror-line,
twitterwidget {
  break-inside: avoid;
}
.footnotes {
  opacity: 0.8;
  font-size: 0.9rem;
  margin-top: 1em;
  margin-bottom: 1em;
}
.footnotes + .footnotes {
  margin-top: 0px;
}
.md-reset {
  margin: 0px;
  padding: 0px;
  border: 0px;
  outline: 0px;
  vertical-align: top;
  text-decoration: none;
  text-shadow: none;
  float: none;
  position: static;
  width: auto;
  height: auto;
  white-space: nowrap;
  cursor: inherit;
  line-height: normal;
  font-weight: 400;
  text-align: left;
  box-sizing: content-box;
  direction: ltr;
  background-position: 0px 0px;
  background-repeat: initial initial;
}
li div {
  padding-top: 0px;
}
blockquote {
  margin: 1rem 0px;
}
li .mathjax-block,
li p {
  margin: 0.5rem 0px;
}
li {
  margin: 0px;
  position: relative;
}
blockquote > :last-child {
  margin-bottom: 0px;
}
blockquote > :first-child,
li > :first-child {
  margin-top: 0px;
}
.footnotes-area {
  color: rgb(136, 136, 136);
  margin-top: 0.714rem;
  padding-bottom: 0.143rem;
  white-space: normal;
}
#write .footnote-line {
  white-space: pre-wrap;
}
@media print {
  body,
  html {
    border: 1px solid transparent;
    height: 99%;
    break-after: avoid-page;
    break-before: avoid-page;
  }
  #write {
    margin-top: 0px;
    border-color: transparent !important;
  }
  .typora-export * {
    -webkit-print-color-adjust: exact;
  }
  html.blink-to-pdf {
    font-size: 13px;
  }
  .typora-export #write {
    padding-left: 1cm;
    padding-right: 1cm;
    padding-bottom: 0px;
    break-after: avoid-page;
  }
  .typora-export #write::after {
    height: 0px;
  }
  @page {
    margin: 20mm 0px;
  }
}
.footnote-line {
  margin-top: 0.714em;
  font-size: 0.7em;
}
a img,
img a {
  cursor: pointer;
}
pre.md-meta-block {
  font-size: 0.8rem;
  min-height: 0.8rem;
  white-space: pre-wrap;
  background-color: rgb(204, 204, 204);
  display: block;
  overflow-x: hidden;
  background-position: initial initial;
  background-repeat: initial initial;
}
p > img:only-child {
  display: block;
  margin: auto;
}
p > .md-image:only-child {
  display: inline-block;
  width: 100%;
  text-align: center;
}
#write .MathJax_Display {
  margin: 0.8em 0px 0px;
}
.md-math-block {
  width: 100%;
}
.md-math-block:not(:empty)::after {
  display: none;
}
[contenteditable="true"]:active,
[contenteditable="true"]:focus {
  outline: 0px;
  box-shadow: none;
}
.md-task-list-item {
  position: relative;
  list-style-type: none;
}
.task-list-item.md-task-list-item {
  padding-left: 0px;
}
.md-task-list-item > input {
  position: absolute;
  top: 0px;
  left: 0px;
  margin-left: -1.2em;
  margin-top: calc(1em - 10px);
}
.math {
  font-size: 1rem;
}
.md-toc {
  min-height: 3.58rem;
  position: relative;
  font-size: 0.9rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.md-toc-content {
  position: relative;
  margin-left: 0px;
}
.md-toc-content::after,
.md-toc::after {
  display: none;
}
.md-toc-item {
  display: block;
  color: rgb(65, 131, 196);
}
.md-toc-item a {
  text-decoration: none;
}
.md-toc-inner:hover {
}
.md-toc-inner {
  display: inline-block;
  cursor: pointer;
}
.md-toc-h1 .md-toc-inner {
  margin-left: 0px;
  font-weight: 700;
}
.md-toc-h2 .md-toc-inner {
  margin-left: 2em;
}
.md-toc-h3 .md-toc-inner {
  margin-left: 4em;
}
.md-toc-h4 .md-toc-inner {
  margin-left: 6em;
}
.md-toc-h5 .md-toc-inner {
  margin-left: 8em;
}
.md-toc-h6 .md-toc-inner {
  margin-left: 10em;
}
@media screen and (max-width: 48em) {
  .md-toc-h3 .md-toc-inner {
    margin-left: 3.5em;
  }
  .md-toc-h4 .md-toc-inner {
    margin-left: 5em;
  }
  .md-toc-h5 .md-toc-inner {
    margin-left: 6.5em;
  }
  .md-toc-h6 .md-toc-inner {
    margin-left: 8em;
  }
}
a.md-toc-inner {
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
}
.footnote-line a:not(.reversefootnote) {
  color: inherit;
}
.md-attr {
  display: none;
}
.md-fn-count::after {
  content: ".";
}
code,
pre,
samp,
tt {
  font-family: var(--monospace);
}
kbd {
  margin: 0px 0.1em;
  padding: 0.1em 0.6em;
  font-size: 0.8em;
  color: rgb(36, 39, 41);
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(173, 179, 185);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  box-shadow: rgba(12, 13, 14, 0.2) 0px 1px 0px,
    rgb(255, 255, 255) 0px 0px 0px 2px inset;
  white-space: nowrap;
  vertical-align: middle;
  background-position: initial initial;
  background-repeat: initial initial;
}
.md-comment {
  color: rgb(162, 127, 3);
  opacity: 0.8;
  font-family: var(--monospace);
}
code {
  text-align: left;
}
a.md-print-anchor {
  white-space: pre !important;
  border: none !important;
  display: inline-block !important;
  position: absolute !important;
  width: 1px !important;
  right: 0px !important;
  outline: 0px !important;
  text-shadow: initial !important;
  background-position: 0px 0px !important;
  background-repeat: initial initial !important;
}
.md-inline-math .MathJax_SVG .noError {
  display: none !important;
}
.md-math-block .MathJax_SVG_Display {
  text-align: center;
  margin: 0px;
  position: relative;
  text-indent: 0px;
  max-width: none;
  max-height: none;
  min-height: 0px;
  min-width: 100%;
  width: auto;
  overflow-y: hidden;
  display: block !important;
}
.MathJax_SVG_Display,
.md-inline-math .MathJax_SVG_Display {
  width: auto;
  margin: inherit;
  display: inline-block !important;
}
.MathJax_SVG .MJX-monospace {
  font-family: var(--monospace);
}
.MathJax_SVG .MJX-sans-serif {
  font-family: sans-serif;
}
.MathJax_SVG {
  display: inline;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  zoom: 90%;
  text-indent: 0px;
  text-align: left;
  text-transform: none;
  letter-spacing: normal;
  word-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  float: none;
  direction: ltr;
  max-width: none;
  max-height: none;
  min-width: 0px;
  min-height: 0px;
  border: 0px;
  padding: 0px;
  margin: 0px;
}
.MathJax_SVG * {
  transition: none;
}
.MathJax_SVG_Display svg {
  vertical-align: middle !important;
  margin-bottom: 0px !important;
}
.os-windows.monocolor-emoji .md-emoji {
  font-family: "Segoe UI Symbol", sans-serif;
}
.md-diagram-panel > svg {
  max-width: 100%;
}
[lang="mermaid"] svg,
[lang="flow"] svg {
  max-width: 100%;
}
[lang="mermaid"] .node text {
  font-size: 1rem;
}
table tr th {
  border-bottom-width: 0px;
}
video {
  max-width: 100%;
  display: block;
  margin: 0px auto;
}
iframe {
  max-width: 100%;
  width: 100%;
  border: none;
}
.highlight td,
.highlight tr {
  border: 0px;
}

.CodeMirror {
  height: auto;
}
.CodeMirror.cm-s-inner {
  background-image: inherit;
  background-size: inherit;
  background-attachment: inherit;
  background-origin: inherit;
  background-clip: inherit;
  background-color: inherit;
  background-position: inherit inherit;
  background-repeat: inherit inherit;
}
.CodeMirror-scroll {
  overflow-y: hidden;
  overflow-x: auto;
  z-index: 3;
}
.CodeMirror-gutter-filler,
.CodeMirror-scrollbar-filler {
  background-color: rgb(255, 255, 255);
}
.CodeMirror-gutters {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: rgb(221, 221, 221);
  background-image: inherit;
  background-size: inherit;
  background-attachment: inherit;
  background-origin: inherit;
  background-clip: inherit;
  background-color: inherit;
  white-space: nowrap;
  background-position: inherit inherit;
  background-repeat: inherit inherit;
}
.CodeMirror-linenumber {
  padding: 0px 3px 0px 5px;
  text-align: right;
  color: rgb(153, 153, 153);
}
.cm-s-inner .cm-keyword {
  color: rgb(119, 0, 136);
}
.cm-s-inner .cm-atom,
.cm-s-inner.cm-atom {
  color: rgb(34, 17, 153);
}
.cm-s-inner .cm-number {
  color: rgb(17, 102, 68);
}
.cm-s-inner .cm-def {
  color: rgb(0, 0, 255);
}
.cm-s-inner .cm-variable {
  color: rgb(0, 0, 0);
}
.cm-s-inner .cm-variable-2 {
  color: rgb(0, 85, 170);
}
.cm-s-inner .cm-variable-3 {
  color: rgb(0, 136, 85);
}
.cm-s-inner .cm-string {
  color: rgb(170, 17, 17);
}
.cm-s-inner .cm-property {
  color: rgb(0, 0, 0);
}
.cm-s-inner .cm-operator {
  color: rgb(152, 26, 26);
}
.cm-s-inner .cm-comment,
.cm-s-inner.cm-comment {
  color: rgb(170, 85, 0);
}
.cm-s-inner .cm-string-2 {
  color: rgb(255, 85, 0);
}
.cm-s-inner .cm-meta {
  color: rgb(85, 85, 85);
}
.cm-s-inner .cm-qualifier {
  color: rgb(85, 85, 85);
}
.cm-s-inner .cm-builtin {
  color: rgb(51, 0, 170);
}
.cm-s-inner .cm-bracket {
  color: rgb(153, 153, 119);
}
.cm-s-inner .cm-tag {
  color: rgb(17, 119, 0);
}
.cm-s-inner .cm-attribute {
  color: rgb(0, 0, 204);
}
.cm-s-inner .cm-header,
.cm-s-inner.cm-header {
  color: rgb(0, 0, 255);
}
.cm-s-inner .cm-quote,
.cm-s-inner.cm-quote {
  color: rgb(0, 153, 0);
}
.cm-s-inner .cm-hr,
.cm-s-inner.cm-hr {
  color: rgb(153, 153, 153);
}
.cm-s-inner .cm-link,
.cm-s-inner.cm-link {
  color: rgb(0, 0, 204);
}
.cm-negative {
  color: rgb(221, 68, 68);
}
.cm-positive {
  color: rgb(34, 153, 34);
}
.cm-header,
.cm-strong {
  font-weight: 700;
}
.cm-del {
  text-decoration: line-through;
}
.cm-em {
  font-style: italic;
}
.cm-link {
  text-decoration: underline;
}
.cm-error {
  color: red;
}
.cm-invalidchar {
  color: red;
}
.cm-constant {
  color: rgb(38, 139, 210);
}
.cm-defined {
  color: rgb(181, 137, 0);
}
div.CodeMirror span.CodeMirror-matchingbracket {
  color: rgb(0, 255, 0);
}
div.CodeMirror span.CodeMirror-nonmatchingbracket {
  color: rgb(255, 34, 34);
}
.cm-s-inner .CodeMirror-activeline-background {
  background-image: inherit;
  background-size: inherit;
  background-attachment: inherit;
  background-origin: inherit;
  background-clip: inherit;
  background-color: inherit;
  background-position: inherit inherit;
  background-repeat: inherit inherit;
}
.CodeMirror {
  position: relative;
  overflow: hidden;
}
.CodeMirror-scroll {
  height: 100%;
  outline: 0px;
  position: relative;
  box-sizing: content-box;
  background-image: inherit;
  background-size: inherit;
  background-attachment: inherit;
  background-origin: inherit;
  background-clip: inherit;
  background-color: inherit;
  background-position: inherit inherit;
  background-repeat: inherit inherit;
}
.CodeMirror-sizer {
  position: relative;
}
.CodeMirror-gutter-filler,
.CodeMirror-hscrollbar,
.CodeMirror-scrollbar-filler,
.CodeMirror-vscrollbar {
  position: absolute;
  z-index: 6;
  display: none;
}
.CodeMirror-vscrollbar {
  right: 0px;
  top: 0px;
  overflow: hidden;
}
.CodeMirror-hscrollbar {
  bottom: 0px;
  left: 0px;
  overflow: hidden;
}
.CodeMirror-scrollbar-filler {
  right: 0px;
  bottom: 0px;
}
.CodeMirror-gutter-filler {
  left: 0px;
  bottom: 0px;
}
.CodeMirror-gutters {
  position: absolute;
  left: 0px;
  top: 0px;
  padding-bottom: 30px;
  z-index: 3;
}
.CodeMirror-gutter {
  white-space: normal;
  height: 100%;
  box-sizing: content-box;
  padding-bottom: 30px;
  margin-bottom: -32px;
  display: inline-block;
}
.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  border: none !important;
  background-position: 0px 0px !important;
  background-repeat: initial initial !important;
}
.CodeMirror-gutter-background {
  position: absolute;
  top: 0px;
  bottom: 0px;
  z-index: 4;
}
.CodeMirror-gutter-elt {
  position: absolute;
  cursor: default;
  z-index: 4;
}
.CodeMirror-lines {
  cursor: text;
}
.CodeMirror pre {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-width: 0px;
  font-family: inherit;
  font-size: inherit;
  margin: 0px;
  white-space: pre;
  word-wrap: normal;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
  background-position: 0px 0px;
  background-repeat: initial initial;
}
.CodeMirror-wrap pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
}
.CodeMirror-code pre {
  border-right-width: 30px;
  border-right-style: solid;
  border-right-color: transparent;
  width: fit-content;
}
.CodeMirror-wrap .CodeMirror-code pre {
  border-right-style: none;
  width: auto;
}
.CodeMirror-linebackground {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 0;
}
.CodeMirror-linewidget {
  position: relative;
  z-index: 2;
  overflow: auto;
}
.CodeMirror-wrap .CodeMirror-scroll {
  overflow-x: hidden;
}
.CodeMirror-measure {
  position: absolute;
  width: 100%;
  height: 0px;
  overflow: hidden;
  visibility: hidden;
}
.CodeMirror-measure pre {
  position: static;
}
.CodeMirror div.CodeMirror-cursor {
  position: absolute;
  visibility: hidden;
  border-right-style: none;
  width: 0px;
}
.CodeMirror div.CodeMirror-cursor {
  visibility: hidden;
}
.CodeMirror-focused div.CodeMirror-cursor {
  visibility: inherit;
}
.cm-searching {
  background-color: rgba(255, 255, 0, 0.4);
  background-position: initial initial;
  background-repeat: initial initial;
}
@media print {
  .CodeMirror div.CodeMirror-cursor {
    visibility: hidden;
  }
}

:root {
  --side-bar-bg-color: #fafafa;
  --control-text-color: #777;
}

// @include-when-export url(https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,700,400&subset=latin,latin-ext);

// @font-face {
//     font-family: 'Open Sans';
//     font-style: normal;
//     font-weight: normal;
//     src: local('Open Sans Regular'),url('file:///Users/bob/Library/Application%20Support/abnerworks.Typora/themes/github/400.woff') format('woff')
// }

// @font-face {
//     font-family: 'Open Sans';
//     font-style: italic;
//     font-weight: normal;
//     src: local('Open Sans Italic'),url('file:///Users/bob/Library/Application%20Support/abnerworks.Typora/themes/github/400i.woff') format('woff')
// }

// @font-face {
//     font-family: 'Open Sans';
//     font-style: normal;
//     font-weight: bold;
//     src: local('Open Sans Bold'),url('file:///Users/bob/Library/Application%20Support/abnerworks.Typora/themes/github/700.woff') format('woff')
// }

// @font-face {
//     font-family: 'Open Sans';
//     font-style: italic;
//     font-weight: bold;
//     src: local('Open Sans Bold Italic'),url('file:///Users/bob/Library/Application%20Support/abnerworks.Typora/themes/github/700i.woff') format('woff')
// }

html {
  font-size: 16px;
}

body {
  font-family: "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  color: rgb(51, 51, 51);
  line-height: 1.6;
}

#write {
  //   max-width: 860px;
  margin: 0 auto;
  padding: 20px 30px 40px 30px;
  padding-top: 20px;
  padding-bottom: 100px;
}
#write > ul:first-child,
#write > ol:first-child {
  margin-top: 30px;
}

body > *:first-child {
  margin-top: 0 !important;
}
body > *:last-child {
  margin-bottom: 0 !important;
}
a {
  color: #4183c4;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  line-height: 1.4;
  cursor: text;
}
h1:hover a.anchor,
h2:hover a.anchor,
h3:hover a.anchor,
h4:hover a.anchor,
h5:hover a.anchor,
h6:hover a.anchor {
  /*background: url("file:///Users/bob/Library/Application%20Support/images/modules/styleguide/para.png") no-repeat 10px center;*/
  text-decoration: none;
}
h1 tt,
h1 code {
  font-size: inherit;
}
h2 tt,
h2 code {
  font-size: inherit;
}
h3 tt,
h3 code {
  font-size: inherit;
}
h4 tt,
h4 code {
  font-size: inherit;
}
h5 tt,
h5 code {
  font-size: inherit;
}
h6 tt,
h6 code {
  font-size: inherit;
}
h1 {
  padding-bottom: 0.3em;
  font-size: 2.25em;
  line-height: 1.2;
  border-bottom: 1px solid #eee;
}
h2 {
  padding-bottom: 0.3em;
  font-size: 1.75em;
  line-height: 1.225;
  border-bottom: 1px solid #eee;
}
h3 {
  font-size: 1.5em;
  line-height: 1.43;
}
h4 {
  font-size: 1.25em;
}
h5 {
  font-size: 1em;
}
h6 {
  font-size: 1em;
  color: #777;
}
p,
blockquote,
ul,
ol,
dl,
table {
  margin: 0.8em 0;
}
li > ol,
li > ul {
  margin: 0 0;
}
hr {
  height: 2px;
  padding: 0;
  margin: 16px 0;
  background-color: #e7e7e7;
  border: 0 none;
  overflow: hidden;
  box-sizing: content-box;
}

body > h2:first-child {
  margin-top: 0;
  padding-top: 0;
}
body > h1:first-child {
  margin-top: 0;
  padding-top: 0;
}
body > h1:first-child + h2 {
  margin-top: 0;
  padding-top: 0;
}
body > h3:first-child,
body > h4:first-child,
body > h5:first-child,
body > h6:first-child {
  margin-top: 0;
  padding-top: 0;
}
a:first-child h1,
a:first-child h2,
a:first-child h3,
a:first-child h4,
a:first-child h5,
a:first-child h6 {
  margin-top: 0;
  padding-top: 0;
}
h1 p,
h2 p,
h3 p,
h4 p,
h5 p,
h6 p {
  margin-top: 0;
}
li p.first {
  display: inline-block;
}
ul,
ol {
  padding-left: 30px;
}
ul:first-child,
ol:first-child {
  margin-top: 0;
}
ul:last-child,
ol:last-child {
  margin-bottom: 0;
}
blockquote {
  border-left: 4px solid #dfe2e5;
  padding: 0 15px;
  color: #777777;
}
blockquote blockquote {
  padding-right: 0;
}
table {
  padding: 0;
  word-break: initial;
}
table tr {
  border-top: 1px solid #dfe2e5;
  margin: 0;
  padding: 0;
}
table tr:nth-child(2n),
thead {
  background-color: #f8f8f8;
}
table tr th {
  font-weight: bold;
  border: 1px solid #dfe2e5;
  border-bottom: 0;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
}
table tr td {
  border: 1px solid #dfe2e5;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
}
table tr th:first-child,
table tr td:first-child {
  margin-top: 0;
}
table tr th:last-child,
table tr td:last-child {
  margin-bottom: 0;
}

.CodeMirror-lines {
  padding-left: 4px;
}

.code-tooltip {
  box-shadow: 0 1px 1px 0 rgba(0, 28, 36, 0.3);
  border-top: 1px solid #eef2f2;
}

.md-fences,
code,
tt {
  border: 1px solid #e7eaed;
  background-color: #f8f8f8;
  border-radius: 3px;
  padding: 0;
  padding: 2px 4px 0px 4px;
  font-size: 0.9em;
}

code {
  background-color: #f3f4f4;
  padding: 0 4px 2px 4px;
}

.md-fences {
  margin-bottom: 15px;
  margin-top: 15px;
  padding: 0.2em 1em;
  padding-top: 8px;
  padding-bottom: 6px;
}

.md-task-list-item > input {
  margin-left: -1.3em;
}

@media screen and (min-width: 914px) {
  /*body {
        width: 854px;
        margin: 0 auto;
    }*/
}
@media print {
  html {
    font-size: 13px;
  }
  table,
  pre {
    page-break-inside: avoid;
  }
  pre {
    word-wrap: break-word;
  }
}

.md-fences {
  background-color: #f8f8f8;
}
#write pre.md-meta-block {
  padding: 1rem;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f7f7f7;
  border: 0;
  border-radius: 3px;
  color: #777777;
  margin-top: 0 !important;
}

.mathjax-block > .code-tooltip {
  bottom: 0.375rem;
}

.md-mathjax-midline {
  background: #fafafa;
}

#write > h3.md-focus:before {
  left: -1.5625rem;
  top: 0.375rem;
}
#write > h4.md-focus:before {
  left: -1.5625rem;
  top: 0.285714286rem;
}
#write > h5.md-focus:before {
  left: -1.5625rem;
  top: 0.285714286rem;
}
#write > h6.md-focus:before {
  left: -1.5625rem;
  top: 0.285714286rem;
}
.md-image > .md-meta {
  /*border: 1px solid #ddd;*/
  border-radius: 3px;
  padding: 2px 0px 0px 4px;
  font-size: 0.9em;
  color: inherit;
}

.md-tag {
  color: #a7a7a7;
  opacity: 1;
}

.md-toc {
  margin-top: 20px;
  padding-bottom: 20px;
}

.sidebar-tabs {
  border-bottom: none;
}

#typora-quick-open {
  border: 1px solid #ddd;
  background-color: #f8f8f8;
}

#typora-quick-open-item {
  background-color: #fafafa;
  border-color: #fefefe #e5e5e5 #e5e5e5 #eee;
  border-style: solid;
  border-width: 1px;
}

/** focus mode */
.on-focus-mode blockquote {
  border-left-color: rgba(85, 85, 85, 0.12);
}

header,
.context-menu,
.megamenu-content,
footer {
  font-family: "Segoe UI", "Arial", sans-serif;
}

.file-node-content:hover .file-node-icon,
.file-node-content:hover .file-node-open-state {
  visibility: visible;
}

.mac-seamless-mode #typora-sidebar {
  background-color: #fafafa;
  background-color: var(--side-bar-bg-color);
}

.md-lang {
  color: #b4654d;
}

.html-for-mac .context-menu {
  --item-hover-bg-color: #e6f0fe;
}

.typora-export p,
.typora-export .footnote-line {
  white-space: normal;
}
</style>

