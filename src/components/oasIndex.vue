<template>
    <div id="app">
        <!-- part of title -->
        <!-- <div class="TopPart">
            <mu-appbar> -->
                <!--  -->
                <!-- <img src="../assets/logo.jpg" slot="left">
                <mu-icon-button icon='shopping_cart' tooltip="欢迎光临我的淘宝店" href="https://sadworld.taobao.com/" slot="left" />
                <tools slot="left"></tools> -->
                
                <!-- <mu-raised-button slot="right" label="选择其他游戏" ref="button" labelPosition="before" icon="expand_more" @click.native="toggle" /> -->
                <!-- <mu-popover :trigger="trigger" :open="open" @close="handleClose">
                    <mu-menu>
                        <mu-menu-item v-for="item in list" :key="item.value" :title="item.label" :to="'/index?game=' + item.value" @click.native="handleItemClick" />
                    </mu-menu>
                </mu-popover>
            </mu-appbar>
        </div> -->

        <label for="locale">lang</label>
        <select v-model="locale">
            <option>en</option>
            <!-- <option>cn</option> -->
            <option>kr</option>
            <option>tc</option>
            <option>jp</option>
        </select>

        <mu-toast v-if="toastAlert" :message="toastMassage" @close="hideToastAlert" />

        <div class="Title">
            <h1>{{ $t('pagetitle') }}</h1>
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
            locale: ''
            
        }
    },
    mounted() {
        // console.log(this.$route);
        //this.trigger = this.$refs.button.$el;
        this.game = this.$route.params.game || this.$route.query.game;
        // this.getPageConfig();
        this.locale = this.$route.params.lang;
    },
    watch:{
        locale(val) {
            this.$i18n.locale = val;
            this.$store.state.locale = val;
        },
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
.Title {
    margin-top: 15px;
    padding: 10px;
    text-align: center;
}
.fulBtn{
    padding: 10px;
    margin-bottom: 10px;
}

.intro {
    min-height: 100px;
    text-align: center;
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