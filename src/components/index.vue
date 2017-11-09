<template>
    <div id="app">
        <!-- part of title -->
        <div class="TopPart">
            <mu-appbar>
                <!--  -->
                <a href="https://sadworld.taobao.com/" target="_blank" title="欢迎光临我的淘宝店" slot="left"><img src="../assets/logo.jpg" slot="left"></a>
                <!-- <mu-icon-button icon='shopping_cart' tooltip="欢迎光临我的淘宝店" href="https://sadworld.taobao.com/" slot="left" /> -->
                <tools slot="left"></tools>
                <mu-raised-button slot="right" class="selectGameBtn" label="选择其他游戏" ref="button" labelPosition="before" icon="expand_more" @click.native="toggle" />
                <mu-popover :trigger="trigger" :open="open" @close="handleClose">
                    <mu-menu :autoWidth="false">
                        <mu-sub-header>自动发货游戏</mu-sub-header>
                        <mu-menu-item v-for="item in list" :title="item.label" :key="item.value" v-if="item.type === 'auto'"  :to="'/tbpgames/' + item.value" @click.native="handleItemClick"> 
                            <img :src="`/static/img/gameicon/${item.value}.jpg`" slot="after">
                        </mu-menu-item>
                        <mu-divider />
                        <mu-sub-header>人工提货游戏</mu-sub-header>
                        <mu-menu-item v-for="item in list" :title="item.label" :key="item.value" v-if="item.type === 'normal'"  :to="'/tbpgames/' + item.value" @click.native="handleItemClick"> 
                            <img :src="`/static/img/gameicon/${item.value}.jpg`" slot="after">
                        </mu-menu-item>
                    </mu-menu>
                </mu-popover>
            </mu-appbar>
        </div>
        <mu-toast v-if="toastAlert" :message="toastMassage" @close="hideToastAlert" />

        <div class="Title">
            <h1>失乐园杂货铺-自助查询购买系统 </h1>
        </div>

        <div class="fulBtn" v-if="!(!this.game || $route.path == '/index' || showHelp)">
            <mu-row :gutter="false">
                <mu-col width="100" tablet="10" desktop="10"></mu-col>
                <mu-col width="100" tablet="80" desktop="80">
                    <mu-raised-button label="没看懂怎么用？点这里显示提货教程" fullWidth @click.native="handleBacktoIndex" secondary />
                </mu-col>
                <mu-col width="100" tablet="10" desktop="10"></mu-col>
            </mu-row>
        </div>


        <div class="help" v-if="!this.game || $route.path == '/index' || showHelp">
            <div class="fulBtn" v-if="this.game">
                <mu-raised-button label="开始寻找心仪的帐号啦~点我~~~" fullWidth @click.native="handleGoTake" primary />
            </div>
            <mu-divider />
            
            <!-- 提货教程区 -->
            <div class="intro" v-html="searchTutorialHtml" v-if="!is_step_tutorial">
            </div>
            <div class="step-intro" v-if="is_step_tutorial">
                <mu-stepper :activeStep="tutorialActiveStep" :linear="false">
                    <mu-step v-for="stepone in step_search_tutorial" :key="stepone.step">
                    <mu-step-button @click.native="tutorialActiveStep = stepone.step">
                        {{stepone.title}}
                    </mu-step-button>
                    </mu-step>
                </mu-stepper>
                <mu-content-block v-for="stepone in step_search_tutorial" :key="stepone.step" v-if="tutorialActiveStep === stepone.step" v-html="stepone.content">
                </mu-content-block>
                <div class="center">
                        <mu-raised-button class="step-button" label="上一步" :disabled="tutorialActiveStep === 0" primary @click.native="tutorialActiveStep--"/>
                        <mu-raised-button class="step-button" label="下一步" :disabled="tutorialActiveStep >= step_search_tutorial.length" primary @click.native="tutorialActiveStep++"/>
                    </div>
            </div>
            <mu-divider />
            <div class="fulBtn" v-if="this.game">
                <mu-raised-button label="开始寻找心仪的帐号啦~点我~~~" fullWidth @click.native="handleGoTake" primary />
            </div>
        </div>
        

        <!-- part of content -->
        <div class="content">
			<transition name="move" mode="out-in"><router-view></router-view></transition>
		</div>
        <!-- part of foot -->
        <mu-content-block v-if="footerShow" class="FootPart">
            <!-- <div class="footContent">技术支持：KC-Casey</div>
            <mu-content-block>问题反馈：kc-kaima0515@163.com</mu-content-block> -->
        </mu-content-block>
    </div>
</template>

<script>
import tools from './common/tools.vue'
import config from '../common/config.js'

export default {
    name: 'app',
    data() {
        return {
            GetPateConfigUrl: '/pageconfig/get',
            tutorialActiveStep: 0,
            open: false,
            //in this
            trigger: null,
            game:'',
            gameName:'',
            list : config.selectGameOptions,
            toastAlert: false,
            toastMassage: '',
            footerShow: true,
            showHelp: false,
            locale: 'cn',
            searchTutorialHtml:'',
            is_step_tutorial: false,
            step_search_tutorial: []
            
        }
    },
    mounted() {
        // console.log(this.$route);
        this.trigger = this.$refs.button.$el;
        this.game = this.$route.params.game || this.$route.query.game;
        this.getPageConfig();
        this.$i18n.locale = this.locale;
        this.$store.state.locale = this.locale;
    },
    watch:{
        game(val){
            switch (val){
                case "AG" : {
                    this.gameName = "AlternativeGirls";
                    break;
                }
                case "ALCH" : {
                    this.gameName = "为谁炼金";
                    break;
                }
                case "BG" : {
                    this.gameName = "BanG Dream !";
                    break;
                }
                case "CGSS" : {
                    this.gameName = "偶像大师灰姑娘女孩";
                    break;
                }
                case "GUP" : {
                    this.gameName = "少女与战车";
                    break;
                }
                case "MLTD" : {
                    this.gameName = "偶像大师百万现场";
                    break;
                }
                case "RRMG" : {
                    this.gameName = "不确定魔法";
                    break;
                }
                case "SAOASIA" : {
                    this.gameName = "刀剑神域【国际/台】";
                    break;
                }
                case "SAOJP" : {
                    this.gameName = "刀剑神域【日】";
                    break;
                }
                case "SGXD" : {
                    this.gameName = "战姬绝唱";
                    break;
                }
                case "SINOALICE" : {
                    this.gameName = "死亡爱丽丝";
                    break;
                }
                default : {
                    break;
                }
            }
        }
    },
    methods: {
         getPageConfig(){
            let self = this;
            this.$axios.get(this.GetPateConfigUrl, {
                params: {
                    game: self.game
                }
            }).then((res) => {
                if(res.data.code === "1"){
                    //获取配置成功
                    this.is_step_tutorial = res.data.data.is_step_tutorial;//是否启用分步教程
                    this.step_search_tutorial = res.data.data.step_search_tutorial;
                    this.searchTutorialHtml = res.data.data.search_tutorial;

                }
            })
        },
        toggle() {
            this.open = !this.open
        },
        // in this
        handleClose(e) {
            this.open = false
        },
        handleItemClick(){
            window.location.reload();
        },
        handleGoTake(){
            if(!this.game){
                this.showToastAlert('还未选择游戏，无法去提货哟~');
            } else {
                this.showHelp = false;
                this.$router.replace('/tbpgames/' + this.game);
            }
        },
        handleBacktoIndex(){
            this.$router.push('/index?game=' + this.game);
        },
        showToastAlert(msg) {
            this.toastMassage = msg;
            this.toastAlert = true;
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => { this.toastAlert = false; this.toastMassage = '' }, 3000);
        },
        hideToastAlert(msg) {
            this.toastAlert = false;
            this.toastMassage = '';
            if (this.toastTimer) clearTimeout(this.toastTimer);
        }
    },
    components: {
        tools
    }
}
</script>

<style>
html {
    margin: 0px;
}

h1,
h2 {
    font-weight: normal;
    font-size: 1.5em;
    line-height: 1.4;
    padding-bottom: .3em;
    border-bottom: 1px solid #eee;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
.logo-img {
    width: 35px;
    height: 35px;
    margin-left: 10px;
}
.Title {
    margin-top: 15px;
    padding: 10px;
}
.selectGameBtn{
    width: 224px;
    font-size: 16px;
}
.fulBtn{
    padding: 10px;
    margin-bottom: 10px;
}

.intro {
    width: 100%;
}
.step-intro {
    width: 98%;
    padding: 10px;
}
.center {
    text-align: center;
}
.step-button {
    margin: 5px;
}
.imageContent {
    padding: 10px;
}
.image {
    width: 100%;
}
.FootPart {

    min-height: 100px;
    /* color: #eee;
    background-color: #333333;
    text-align: center; */
}

.footContent {
    padding-top: 20px;
}
</style>