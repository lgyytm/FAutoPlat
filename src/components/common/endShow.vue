<template>
    <div>
    <mu-toast v-if="toastAlert" :message="toastMassage" @close="hideToastAlert"/>
        <div class="showTetail">
            <mu-paper :zDepth="1">
                <mu-sub-header><b>提取结果</b></mu-sub-header>
                <mu-divider></mu-divider>
                <mu-table :showCheckbox="false">

                    <mu-tbody>
                        <!-- <mu-tr>
                            <mu-td class="col1">组合名称：</mu-td>
                            <mu-td class="col2">{{takeInfo.name}}</mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td class="col1">组合图示：</mu-td>
                            <mu-td class="col2">
                                <mu-paper class="imgPre" v-for="card in takeInfo.cards" :key="card._id" :zDepth="1">
                                    <img :src="card.img" />
                                </mu-paper>
                            </mu-td>
                        </mu-tr> -->
                        <mu-tr>
                            <mu-td class="col1"></mu-td>
                            <mu-td class="col2"><span class="fontTip">（字体提示：大写L-小写l-数字1 大写I-小写i 字母O-数字0）</span></mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td class="col1">引继码：</mu-td>
                            <mu-td class="col2">
                                <span id="leadcode">
                                    {{takeInfo.migration_code}}
                                    {{takeInfo.inheritId}}
                                    {{takeInfo.transfer_code}}
                                    </span> 
                                <mu-raised-button label="点击复制" :class="'copybtn' + 'leadcode'" secondary @click.native="copyContent('leadcode')"></mu-raised-button>
                                
                            </mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td class="col1">密码：</mu-td>
                            <mu-td class="col2">
                                <span id="pwd">
                                    {{takeInfo.migration_password}}
                                    {{takeInfo.Password}}
                                    {{takeInfo.transfer_pass}}
                                </span>
                                <mu-raised-button label="点击复制" :class="'copybtn' + 'pwd'" secondary @click.native="copyContent('pwd')"></mu-raised-button>
                            </mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </mu-paper>

        </div>
        <div class="userHelp">
            <mu-paper :zDepth="1">
                <mu-content-block>
                    <div v-html="endTutorialHtml"></div>
                </mu-content-block>
            </mu-paper>
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
    export default{
        data(){
            return{
                GetPateConfigUrl: '/pageconfig/get',
                toastAlert: false,
                toastMassage: '',
                endTutorialHtml: ''
            }
        },
        props:{
            compInfo:{
                type: Object,
                default:null
            },
            takeInfo:{
                type: Object,
                default:null
            },
            game: {
                type: String
            }
        },
        created(){
            this.getPageConfig();
        },
        computed:{
            takeTutorialHtml(){
                let htmlStr = '';
                if(this.game === 'SINOALICE'){
                    htmlStr = `<span class="helpAlert">恭喜您成功提货，引继码使用方法：</span>
                    <p>1：请在TOUCH TO START界面，点击右上角的 [サポート]。</p>
                    <p>2：请点击第一行的第二个[データ引继き]按钮，点击[同意する]。</p>
                    <p>3：在弹出的对话框中输入引继码和密码后点OK即可。</p>
                    <p>
                        【注】：您可以随时使用提货码在页面上方的额外功能中查看引继码和密码！请保管好您的提货码！
                    </p>`;
                }
                if(this.game === 'SGXD'){
                    htmlStr = `<span class="helpAlert">恭喜您成功提货，引继码使用方法：</span>
                    <p>直接在开始界面点击右上角的サポート-データ引き継ぎ-输入卖家给您的ID和密码后点黄色按钮确定即可，无需重装游戏。</p>
                    <p>引继码和密码一直有效，请在引继后尽快修改密码并牢记引继码，请妥善保管您的存档。</p>
                    <p>修改密码的方法：左上角的メニュー-その他-機種变更-機種变更コード発行-再点黄色按钮后弹出输入新密码的界面 点OK即可。</p>
                    <p>
                        【注】：您可以随时使用提货码在页面上方的额外功能中查看引继码和密码！请保管好您的提货码！
                    </p>`;
                }
                if(this.game === 'BG'){
                    htmlStr = `<span class="helpAlert">恭喜您成功提货，引继码使用方法：</span>
                    <p>TAP TO STRAT界面，点击右下角的メニユー按钮，然后点击第一个按钮，在弹出的对话框中输入卖家给你的引继码和密码即可~</p>
                    <p>引继码和密码仅一次有效，请在引继后及时设定新的密码（以保证您的帐号安全！），在主界面点右上角菜单-引继发行-输入您设定的新密码后保存即可！</p>
                    <p>
                        【注】：您可以随时使用提货码在页面上方的额外功能中查看引继码和密码！请保管好您的提货码！
                    </p>`;
                }
                if (this.game === 'GUP') {
                    htmlStr = `<span class="helpAlert">恭喜您成功提货，引继码使用方法：</span>
                    <p>安卓/IOS用户 请删除游戏重装后即可在游戏主界面完成引继.</p>
                    <p>
                        安卓用户也可以不用重装，仅把sdcard/android/data/jp.showgate.girlsundpanzer/files/下的data文件夹改名或者移动到其他地方，再重开游戏即可引继~
                    </p>
                    <p>
                        引继码 密码一直有效，请妥善保管，并及时修改为新的密码哦。
                    </p>`;
                }
                if (this.game === 'SAOJP') {
                    htmlStr = `<span class="helpAlert">恭喜您成功提货，引继码使用方法：</span>
                    <p>
                        重要！重要！重要！： 购买本店初始后切勿在同一天同一台设备多帐号频繁引继！极容易导致您高价购买的初始被封停！
                    </p>
                    <p> 引继码使用方法：请点击LINK START界面 右下角的问号按钮，然后点击第一个按钮，在弹出的对话框中输入卖家给你的引继码和密码即可~</p>
                    <p> 输入密码时要注意大小写~如果出错一两次的话就要立刻停下和卖家说哦，连续重复太多次数帐号会被锁至当天23：00！</p>
                    <p> 引继码和密码一直有效，请在引继后及时修改为新的引继密码！！！！（以保证您的帐号安全！）</p>
                    <p> 修改密码方法：MENU-其他-下拉到资料继承-点蓝色按钮-输入新的密码。</p>
                    <p> 修改人物名称：MENU-ステータス-情报变更 打开后输入想改的名字即可。</p>
                    <p>
                        上去发现是人物是初始2星：
                        在PARTY-PARTY EDIT里点人换人即可，您购买的4星还在仓库。
                        下面如果是按钮为锁着的状态就点一下MISSON
                    </p>`;
                }
                if (this.game === 'SAOASIA') {
                    htmlStr = `<span class="helpAlert">恭喜您成功提货，引继码使用方法：</span>
                    <p>
                        重要！重要！重要！： 购买本店初始后切勿在同一天同一台设备多帐号频繁引继！极容易导致您高价购买的初始被封停！
                    </p>
                    <p> 引继码使用方法：请点击LINK START界面 右下角的问号按钮，然后点击第一个按钮，在弹出的对话框中输入卖家给你的引继码和密码即可~ </p>
                    <p> 输入密码时要注意大小写~如果出错一两次的话就要立刻停下和卖家说哦，连续重复太多次数帐号会被锁至当天23：00！</p>
                    <p> 引继码和密码一直有效，请在引继后及时修改为新的引继密码以保证您的帐号安全！！！</p>
                    <p> 修改密码方法：MENU-其他-下拉到引继设定-点蓝色按钮-输入新的密码。</p>
                    <p> 修改人物名称：MENU-状态-变更情报 打开后输入想改的名字即可。</p>
                    <p> 登陆后是英语，需要切换语言：MENU-OTHER-LANGUAGE </p>
                    <p>
                        上去发现是人物是初始2星：
                        在PARTY-PARTY EDIT里点人换人即可，您购买的4星还在仓库。
                        下面如果是按钮为锁着的状态就点一下MISSON
                    </p>`;
                }
                return htmlStr;
            }
        },
        methods: {
            getPageConfig() {
                let self = this;
                this.$axios.get(this.GetPateConfigUrl, {
                    params: {
                        game: self.game
                    }
                }).then((res) => {
                    if (res.data.code === "1") {
                        //获取配置成功
                        this.endTutorialHtml = res.data.data.end_tutorial;

                    }
                })
            },
            copyContent(id) {
                var clipboard = new Clipboard('.copybtn' + id, {
                    // target: function() {
                    //     return document.getElementById(id);
                    // }
                    text: function(trigger) {
                        return document.getElementById(id).innerText.trim();
                    }
                });
                clipboard.on('success', function(e) {
                    // console.info('Action:', e.action);
                    // console.info('Text:', e.text);
                    // console.info('Trigger:', e.trigger);
                    // e.clearSelection();
                    alert('复制成功');
                    clipboard.destroy();
                });

                clipboard.on('error', function(e) {
                    // console.error('Action:', e.action);
                    // console.error('Trigger:', e.trigger);
                });
            },
            showToastAlert(){
                this.toastAlert = true;
                if(this.toastTimer) clearTimeout(this.toastTimer);
                this.toastTimer = setTimeout(() => {this.toastAlert = false; this.toastMassage = ''},1500);
            },
            hideToastAlert(){
                this.toastAlert = false;
                if(this.toastTimer) clearTimeout(this.toastTimer);
            }
        }
    }
</script>

<style scoped>
    /* @font-face {
        font-family: "Source Code Pro";
        src: url("/static/font/SourceCodePro-Regular.eot");
        src: url("/static/font/SourceCodePro-Regular.ttf") format("truetype"),
        url("/static/font/SourceCodePro-Regular.ttf.woff") format("woff"),
        url("/static/font/SourceCodePro-Regular.ttf.woff2") format("woff2"),
    } */
    .showTetail {
        padding: 5px;
        border: 1px solid #ccc;
    }

    .col1 {
        width: 10%;
        /* text-align: center !important; */
    }

    .col2 {
        font-family:"Source Code Pro";
        /* letter-spacing: 2px; */
        font-size: 1.5em;
        text-align: center !important;
        word-break: break-all;
        white-space: normal !important;
    }
    .fontTip {
        font-size: 1.0em;
        color: red;
    }
    .imgPre{
        display:inline-block;
        margin:2px;
    }
    .helpAlert{
        color:red;
    }
</style>