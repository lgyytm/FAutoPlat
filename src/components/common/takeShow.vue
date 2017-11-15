<template>
    <div>
        <div class="showTetail">
            <mu-paper :zDepth="1">
                <mu-sub-header><b>组合信息预览</b></mu-sub-header>
                <mu-divider></mu-divider>

                <div class="toggleshow">
                    <mu-switch label="展示低稀有度卡牌" v-model="toggleShowIgnoreRate" />
                </div>


                <mu-table :showCheckbox="false">

                    <mu-tbody>
                        <mu-tr>
                            <mu-td class="col1">组合ID：</mu-td>
                            <mu-td class="col2">{{compInfo._id}}</mu-td>
                        </mu-tr> 
                        <mu-tr>
                            <mu-td class="col1">组合卡牌：</mu-td>
                            <mu-td class="col2">

                                <span v-for="card in compInfo.cards" :key="card._id" class="cardname-chip" v-show="rateIgnoreArr.indexOf(card.rate) < 0 || toggleShowIgnoreRate">
                                    [{{card.name}}] X {{card.count}}
                                </span>

                            </mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td class="col1">组合图示：</mu-td>
                            <mu-td class="col2">
                                <mu-paper class="imgPre" v-for="card in compInfo.cards" :key="card._id" :zDepth="1" v-show="rateIgnoreArr.indexOf(card.rate) < 0 || toggleShowIgnoreRate">
                                    <img :src="card.img" />
                                    <span v-if="card.count !== 1">X{{card.count}}</span>
                                </mu-paper>
                            </mu-td>
                        </mu-tr>
                         <mu-tr v-for="gift in giftArr" :key="gift.giftField">
                            <mu-td class="col1">{{gift.giftName}}：</mu-td>
                            <mu-td class="col2">
                                {{compInfo[gift.giftField] - giftCountIgnore > 0 ? compInfo[gift.giftField] - giftCountIgnore : 0}}
                                </mu-td>
                        </mu-tr> 
                        <mu-tr>
                            <mu-td class="col1">价格：</mu-td>
                            <mu-td class="col2">{{price}}</mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </mu-paper>
            
        </div>
        <div class="inputCode">

            <div class="inputLeft">
                
                <mu-paper class="introArea" :zDepth="2">
                    <mu-content-block v-html="takeTutorialHtml"></mu-content-block>
                    <!-- <mu-content-block>以上就是您选择的组合信息，确认无误就把<span class="redAlert">提货码</span><span class="grnAlert">全部复制粘贴</span>到下面的提货码区域吧O∩_∩O</mu-content-block>
                    <mu-content-block> <span class="redAlert">注意是粘贴<span class="grnAlert">全部</span>提货码</span>而不是其他的内容哦，提货码只有购买才能获得，<br> 如还没有提货码请点击输入框下面的图标文字购买吧</mu-content-block>
                    <mu-paper :zDepth="2" class="specialAlert" v-html="takeTutorialHtml"></mu-paper> -->
                    <icon name="key" class="keyIcon" :w="24" :h="24"></icon>
                    <mu-text-field class="textArea" :errorText="errorText" hintText="提货码区域" v-model="deliveryCode" multiLine :rows="2">
                        
                    </mu-text-field>
                    <!-- <Button class="button" type="error" @click="submit">确定提货</Button> -->
                    <!-- <Button class="button" type="ghost" @click="reset">清空提货码</Button> -->
                    <mu-raised-button class="button" label="确定提货"  @click.native="submit" secondary></mu-raised-button>
                    <mu-raised-button class="button clearBtn" label="清空提货码" @click.native="reset" primary ></mu-raised-button>
                    <mu-content-block>
                        <mu-icon-button class="shop-button" tooltip="点我购买提货码" :href="shop_url" target="blank" @click.native="closeCfmDialog" >
                            <icon name="cart" :w="24" :h="24"></icon>
                        </mu-icon-button>
                        <a class="shop-button" :href="shop_url" target="_blank">点我进入提货码购买页面</a>
                    </mu-content-block>
                </mu-paper>
                
            </div>
               
            <!-- <div class="inputRight">
                
                
                
            </div> -->
            <div class="clear"></div>
        </div>
        <div class="cfmDialogArea">
            <mu-dialog :open="cfmDialog" title="请您确认提货信息">
                <mu-paper :zDepth="1">
                    <div class="dialogContent">
                        <span>您提取的组合为:</span>
                        <span v-for="(card,index) in compInfo.cards" :key="card._id" v-show="rateIgnoreArr.indexOf(card.rate) < 0 || toggleShowIgnoreRate">
                            [{{card.name}}] X {{card.count}} <span v-if="index !== compInfo.cards.length -1">+</span> 
                        </span>
                    </div>
                    <mu-divider></mu-divider>
                    <div class="dialogContent">
                        <span>组合所需价格为:</span>{{price}}
                    </div>
                    <mu-divider></mu-divider>
                    <div class="dialogContentAlert" v-html="takeAlertHtml"></div>
                    <!-- <div class="dialogContent">
                        <span>您输入的提货码数量为:</span>{{deliveryCodeArray.length}}
                    </div>
                    <mu-divider></mu-divider>
                    <div class="dialogContent">
                        <span>提货码总价值为:{{deliveryCodeArray.length * 10}}元</span>
                    </div>
                    <mu-divider></mu-divider> -->
                    <!-- <div v-if="(deliveryCodeArray.length * 10) < price" class="dialogContentAlert">
                        温馨提醒：您输入的价格可能不足哦~
                        <mu-icon-button icon='shopping_cart' tooltip="赶快点我购买吧" href="https://item.taobao.com/item.htm?id=522053456859" target="blank" @click.native="closeCfmDialog"/>
                    </div>
                    <div v-if="(deliveryCodeArray.length * 10) > price" class="dialogContentAlert">
                        温馨提醒：您输入的价格可能超出所需价格，为避免您的损失，可能无法提货哦~
                    </div> -->
                </mu-paper>

                <mu-raised-button label="确认提货" slot="actions" secondary @click.native="confirmSubmit"></mu-raised-button>
                <mu-raised-button label="再看看" slot="actions" primary @click.native="closeCfmDialog"></mu-raised-button>
            </mu-dialog>
        </div>
        <div class="errDialogArea" >
            <mu-dialog :open="errDialog" title="提货失败 TΛT~" @close="closeErrDialog">
                <div v-if="errResponseData.detail !== 'takeErr'" class="dialogContentAlert">
                    提货失败--详情如下，请您确认验证码有效情况后重试： 
                    <mu-table :showCheckbox="false">
                        <mu-tbody>
                            <mu-tr>
                                <mu-td class="col1">提交验证码总金额：</mu-td>
                                <mu-td class="col2">{{errResponseData.dcodePrice}}</mu-td>
                            </mu-tr>
                            <!-- <mu-tr>
                                <mu-td class="col1">有效验证码数量：</mu-td>
                                <mu-td class="col2">{{errResponseData.validDetail.valid}}</mu-td>
                            </mu-tr>
                            <mu-tr>
                                <mu-td class="col1">无效验证码数量：</mu-td>
                                <mu-td class="col2">{{errResponseData.validDetail.invalid}}</mu-td>
                            </mu-tr>
                            <mu-tr>
                                <mu-td class="col1">有效金额：</mu-td>
                                <mu-td class="col2">{{errResponseData.validDetail.valid * 10}}元</mu-td>
                            </mu-tr> -->
                            <mu-tr>
                                <mu-td class="col1">所需金额：</mu-td>
                                <mu-td class="col2">{{price}}</mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                </div>
                <div v-if="errResponseData.detail === 'takeErr'" class="dialogContentAlert">
                    提货失败--您下手慢了一步，账号已被提取了T^T~
                </div>
                <mu-content-block v-if="errResponseData.detail !== 'takeErr'">
                    如果您确认提货码无误，则有可能是您已使用过提货码，通过以下入口可以查询历史提货记录哦
                    <mu-flat-button label="查询提货记录" primary @click.native="handleSearchHistory"/>
                        <icon name="magnify" :w="24" :h="24"></icon>
                    </mu-flat-button>
                </mu-content-block>
                <mu-raised-button label="我再看看" slot="actions" primary @click.native="closeErrDialog"></mu-raised-button>
            </mu-dialog>
        </div>
        <mu-popup position="top" :overlay="false" :open="topPopup" popupClass="topPopup">
            提货成功
        </mu-popup>
    </div>
</template>

<script>
import bus from '../../common/bus';
import Button from 'iview/src/components/button';

    export default{
        data(){
            return{
                GetPriceUrl: "/price/get",
                GetRateIgnoreUrl:'/price/rateignore/get',
                GetPateConfigUrl: '/pageconfig/get',
                ValidDCodeUrl:"/dcode/valid",
                rateIgnoreArr: [],
                deliveryCode : "",
                errorText: "",
                deliveryCodeArray:[],
                price:"",
                cfmDialog: false,//提货信息确认框
                errDialog: false,//提货失败提示框
                errResponseData: {},
                topPopup: false,//提货成功提示框
                toggleShowName: false,
                toggleShowIgnoreRate: true,
                shop_url: 'https://sadworld.taobao.com/',
                giftName: '石头数',
                giftField: '',
                giftArr:[],
                giftCountIgnore: 0,
                takeTutorialHtml:'',
                takeAlertHtml:'',
            }
        },
        props: {
            compInfo: {
                type: Object
            },
            game: {
                type: String
            },
            default: null
        },
        components:{
            // Button
        },
        watch:{
            deliveryCode: function (val) {
                if(val === ""){
                    this.errorText = ""
                }
            },
            topPopup(val){
                if(val){
                    setTimeout(()=>{
                        this.topPopup = false;
                    },2000)
                }
            }
        },
        created(){
            this.getRateIgnore();
            this.getPageConfig();
        },
        mounted(){
            let self = this;
            this.$axios.get(this.GetPriceUrl, {
                params: {
                    _id: self.compInfo._id,
                    game: self.game
                }
            }).then(function(res){
                if(res.data.code === "1") {
                    self.price = res.data.data.totalPrice;
                } else {
                    self.price = "价格未定，请联系商家提货";
                }
                
            });

            if (this.game === 'GUP') {
                    this.takeAlertHtml = `<div>注意事项：</div>
                            <div>您购买的初始帐号是[<span style="color:red">日</span>]服 </div>
                            <div>安卓用户：[<span style="color:red">请从TAPTAP 下载 日服版 或者挂日本的梯子去谷歌商店下载</span>] </div>
                            <div>苹果用户：[<span style="color:red">请从日服的APP商店下载</span>]  </div>
                            <div>请确认您购买的初始是否匹配您手机及您的客户端！ </div>
                            `;
                }
                if (this.game === 'SAOJP') {
                    this.takeAlertHtml = `<div>注意事项：</div>
                            <div>您购买的初始帐号是[<span style="color:red">日</span>]服   </div>
                            <div>安卓用户：[<span style="color:red">请从TAPTAP 下载 日服版 或者挂日本的梯子去谷歌商店下载</span>] </div>
                            <div>苹果用户：[<span style="color:red">请从日服的APP商店下载</span>]  </div>
                            <div>请确认您购买的初始是否匹配您手机及您的客户端！ </div>
                            `;
                }
                if (this.game === 'SAOASIA') {
                    this.takeAlertHtml = `<div>注意事项：</div>
                            <div>您购买的初始帐号是[<span style="color:red">亚</span>]服 </div>
                            <div>亚服可用地区为：港澳台、新加坡、澳大利亚、韩国 </div>
                            <div>安卓用户：[<span style="color:red">请从TAPTAP 下载 国际服(后缀为TW) 或者挂可用地区的梯子去谷歌商店下载</span>] </div>
                            <div>苹果用户：[<span style="color:red">请从港澳台、新加坡、澳大利亚、韩国的APP商店下载</span>] </div>
                            `;
                }

                if (this.game === 'AG') {
                    this.toggleShowIgnoreRate = false
                }
                if (this.game === 'ALCH') {
                    this.toggleShowIgnoreRate = false
                }
                if (this.game === 'CGSS') {
                    this.toggleShowIgnoreRate = false
                }
        },
        methods:{
            getPageConfig() {
                let self = this;
                this.$axios.get(this.GetPateConfigUrl, {
                    params: {
                        game: self.game
                    }
                }).then((res) => {
                    if (res.data.code === "1") {
                        //获取配置成功
                        self.shop_url = res.data.data.shop_url;
                        // self.giftName = res.data.data.giftName || '石头数';
                        // self.giftField = res.data.data.giftField;
                        for (let gift of res.data.data.giftArr) {
                            let g = {
                                giftField: '',
                                giftName: '',
                            };
                            if (gift.indexOf('@') > -1) {
                                g.giftField = gift.split('@')[0];
                                g.giftName = gift.split('@')[1];
                            } else {
                                g.giftField = rate;
                                g.giftName = rate;
                            }
                            self.giftArr.push(g);
                        }

                        self.takeTutorialHtml = res.data.data.take_tutorial;
                    }
                })
            },
            submit(){
                //initialize deliveryCodeArray
                this.deliveryCodeArray = [];

                let deliveryCode = this.deliveryCode.replace(/\s/g,"");
                deliveryCode = deliveryCode.replace(/[^a-zA-Z\d]+/g,"");
                if(deliveryCode.length % 32 === 24) {
                    this.errorText = "请不要输入ID，这里请放[购买得到的提货码]";
                } else if(deliveryCode.length % 32 !== 0 || deliveryCode.length ===0){
                    this.errorText = "您输入的提货码不正确，请重新输入";
                }
                else{
                    this.cfmDialog = true;

                    this.errorText = "";

                    while(deliveryCode.length / 32 > 0 ){
                        let oneCode = deliveryCode.slice(0, 32);
                        if(this.deliveryCodeArray.indexOf(oneCode) === -1){
                            this.deliveryCodeArray.push(oneCode);
                        }
                        deliveryCode = deliveryCode.slice(32);
                    }
                    
                }
                

                
            },
            reset(){
                this.deliveryCode = '';
                this.errorText = '';
                this.deliveryCodeArray = [];

            },
            confirmSubmit(){
                //TODO -- add progressbar
                let postData = {
                    "deliveryCodeArray":this.deliveryCodeArray,
                    "compId":this.compInfo._id,
                    "game": this.game
                    };
                let self = this;
                this.$axios.post(self.ValidDCodeUrl,postData).then(function(res){
                    if(res.data.code === "1"){
                        self.topPopup = true;
                        self.$emit('confirmSubmit', res.data.data);
                    }
                    else{
                        self.deliveryCodeArray = [];
                        self.errorText = "提货失败";
                        self.errResponseData = res.data.data;
                        self.errDialog = true;
                    }


                });

                this.cfmDialog = false;
            },
            getRateIgnore() {
                let self = this;
                this.$axios.get(self.GetRateIgnoreUrl, {
                    params: {
                        game: self.game
                    }
                }).then((res) => {
                    if (res.data.code === "1") {
                        self.rateIgnoreArr = res.data.data.rates;
                        self.giftCountIgnore = res.data.data.giftCountIgnore || 0;
                        // console.log(self.rateIgnoreArr);
                    }
                })
            },
            handleSearchHistory(){
                bus.$emit('searchHistory');
            },
            closeCfmDialog(){
                this.cfmDialog = false;
            },
            closeErrDialog(){
                this.errDialog = false;
            },
            closePopup(position){
                this[position+'Popup'] = false;
            },
            openPopup(position){
                this[position+'Popup'] = true;;
            }
        }
    }
</script>

<style scoped>
    .inputCode{
        min-height:100px;
        margin-top:10px;
        border:1px solid #ccc;
        text-align:left;

    }
    .showTetail{
        padding:5px;
        border:1px solid #ccc;

    }
    .col1{
        width:20%;
        /* text-align:center !important; */

    }
    .col2{
        text-align:center !important;
        word-break:break-all;
        white-space:normal !important;
    }
    .imgPre{
        display:inline-block;
        margin:2px;
    }
    .textArea{
        display: inline-block;
        width:90% !important;
        margin-top: 10px;
        margin-bottom: -10px;
        padding: 5px;
        border: 1px dashed #e0e0e0;
    }
    .shop-button{
        color: red;
        font-size: 0.8em;
    }
    .introArea{
        padding:5px;
         /* width:75%; */
         font-size:1.2em;
         margin:5px;
         /* margin: 10px auto; */
         /* color:red !important; */
    }
    .redAlert {
        color: red;
    }
    .grnAlert {
        color: #304ffe;
    }
    .specialAlert {
        padding: 10px;
        margin: 5px 0px 10px 10px;
        width: 80%;
    }
    /* .inputLeft{
         width:55%;
        float:left; 
        
    } */
    /* .inputRight{
        width:35%;
        float:left;
        text-align:center;
        margin-top:80px;
   } */
    .clear{
        clear:both;
    }
    .dialogContent{
        font-size:1.1em;
        
        line-height:1.5em;
        padding-left:15px;
    }
    .dialogContentAlert{
        line-height:1.5em;
        padding-left:15px;
        color:red;
    }
    .topPopup {
        width: 100%;
        opacity: .8;
        height: 48px;
        line-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 375px;
    }
    .bottomPopup{
        width: 100%;
        max-width: 375px;
    }
    .button{
        /* font-size:0.5em; */
        width: 130px;
        float: right;
        margin: 15px 30px 0px 0px !important;
    }
    /* .clearBtn{
         font-size:0.5em;
        width: 100px;
        float: right;
        margin: 15px 30px 0px 0px !important; 
    } */
    .cardname-chip {
        margin: 3px;
        font-size: 15px;
        background-color: #ffccbc;
    }

    .keyIcon{
        vertical-align: top;
        margin-top: 20px;
        margin-left: 30px;
    }
</style>