<template>
    <div>
        <div class="titleArea">
            <h2>
                <b>{{showTitle}}  {{ $t('storetitle') }}</b>
            </h2>
        </div>

        <mu-content-block v-if="noticeCollapse.length > 0 && locale === 'cn'" class="searchFilter">
                <mu-sub-header>最新公告与咨询~</mu-sub-header>
                <Collapse v-model="collapseValue" accordion>
                    <Panel v-for="(item,index) in noticeCollapse" :key="item._id" :name="index.toString()" class="collapseTitle">
                        {{item.title}}
                        <div slot="content" class="collapseContent" v-html="item.content"></div>
                        <mu-paper slot="content" v-for="card in item.cardobjs" :key="card.name" class="unitCard collapseCard" :zDepth="1" :title="card.name">
                            <img :src="card.img" @click="clickUnitCard(card)" />
                            <div class="unitCardName" @click="clickUnitCard(card)">
                                <b>{{card.name}}</b>
                            </div>
                            <mu-divider />
                            <div class="checkboxLayerContainer">
                                <div class="checkboxLayer" @click="clickUnitCard(card)"></div>
                                <span v-if="everyCardCountFilter">点击选择卡牌数量</span>
                                <!-- <div v-if="!everyCardCountFilter" label="GET" class="cusCheckBox" :nativeValue="card.name" @change="changeChoiceObj(card)">
                                    <input type="checkbox" v-model="userChoiceName" />
                                    <icon name="heart" class="checked" :w="24" :h="24"></icon>
                                    <icon name="heart-outline" class="unchecked" :w="24" :h="24"></icon>
                                </div> -->
                                <checkbox v-if="!everyCardCountFilter" label="GET" class="cusCheckBox" uncheckIcon="heart-outline" checkedIcon="heart" v-model="userChoiceName" :nativeValue="card.name" @change="changeChoiceObj(card)"/>
                                <!-- <mu-checkbox v-if="!everyCardCountFilter" label="GET" class="cusCheckBox" :nativeValue="card.name" @change="changeChoiceObj(card)" v-model="userChoiceName" uncheckIcon="favorite_border" checkedIcon="favorite"></mu-checkbox> -->
                            </div>
                        </mu-paper>
                    </Panel>
                </Collapse>
        </mu-content-block>
        


        <!-- <transition name="fade"> -->
            <mu-content-block v-show="showSearchFilter" class="searchFilter">
                <mu-sub-header>{{ $t('querysetlabel') }}</mu-sub-header>

                <mu-switch :label="$t('gifttotallabel')+$t('giftcountquerysetlabel')" v-model="giftSearchFilter" class="filter-switch" />
                <mu-content-block v-if="giftSearchFilter">
                    <div v-for="gift in giftArr" :key="gift.giftField">
                        <span>{{ $t('gifttotallabel') }}：{{gift.giftName}}</span>

                        <mu-switch :label="$t('filterenabled')" v-model="giftquery[gift.giftField].enable" @change="handleGiftRangeEnableToggle(gift.giftField)" class="filter-switch" />
                        <span v-if="giftquery[gift.giftField].enable" class="rate-select">
                            <InputNumber size="small" :min="0" :max="99999" v-model.number="giftquery[gift.giftField].min"></InputNumber> ~
                            <InputNumber size="small" :min="0" :max="99999" v-model.number="giftquery[gift.giftField].max"></InputNumber>
                        </span>

                        <mu-divider/>
                    </div>
                </mu-content-block>

                <mu-divider/>

                <mu-switch :label="$t('cardratequerysetlabel')" v-model="rateSearchFilter" class="filter-switch" />
                <mu-content-block v-if="rateSearchFilter">
                    <!-- 高级稀有度总数过滤 -->
                    <div>
                        <span>{{ $t('ratelabel') }}：{{rateHighName}}</span>

                        <mu-switch :label="$t('filterenabled')" v-model="rateHighQuery.enable" class="filter-switch" /> 
                        <span v-if="rateHighQuery.enable" class="rate-select">
                            <InputNumber size="small" :min="0" :max="99999" v-model.number="rateHighQuery.min"></InputNumber> ~
                            <InputNumber size="small" :min="0" :max="99999" v-model.number="rateHighQuery.max"></InputNumber>
                        </span>
                        <!-- <mu-select-field v-if="rateHighQuery.enable" v-model="rateHighQuery.min" :label="$t('rateminlabel')" class="rate-select">
                            <mu-menu-item :value="0" title="0" />
                            <mu-menu-item v-for="range in rateRange" :key="range" :value="range" :title="range.toString()" />
                        </mu-select-field>
                        <mu-select-field v-if="rateHighQuery.enable" v-model="rateHighQuery.max" :label="$t('ratemaxlabel')" class="rate-select">
                            <mu-menu-item :value="0" title="0" />
                            <mu-menu-item v-for="range in rateRange" :key="range" :value="range" :title="range.toString()" />
                        </mu-select-field> -->
                        <mu-divider/>
                    </div>
                    <!-- 其他稀有度过滤 -->
                    <div v-for="rate in rateArr" :key="rate.rateField">
                        <span>{{ $t('ratelabel') }}：{{rate.rateName}}</span>
                        <!-- <mu-select-field v-model="rateName" label="请选择稀有度名称" class="rate-select">
                                <mu-menu-item :value="rate" :title="rate" />
                            </mu-select-field> -->
                        <mu-switch :label="$t('filterenabled')" v-model="ratequery[rate.rateField].enable" @change="handleRateRangeEnableToggle(rate.rateField)" class="filter-switch" />
                        <span v-if="ratequery[rate.rateField].enable" class="rate-select">
                            <InputNumber size="small" :min="1" :max="99999" v-model.number="ratequery[rate.rateField].min"></InputNumber> ~
                            <InputNumber size="small" :min="1" :max="99999" v-model.number="ratequery[rate.rateField].max"></InputNumber>
                        </span>
                        <!-- <mu-select-field v-if="showRateRange" v-model="ratequery[rate.rateField].min" :label="$t('rateminlabel')" class="rate-select">
                            <mu-menu-item v-for="range in rateRange" :key="range" :value="range" :title="range.toString()" />
                        </mu-select-field>
                        <mu-select-field v-if="showRateRange" v-model="ratequery[rate.rateField].max" :label="$t('ratemaxlabel')" class="rate-select">
                            <mu-menu-item v-for="range in rateRange" :key="range" :value="range" :title="range.toString()" />
                        </mu-select-field> -->
                        <mu-divider/>
                    </div>
                </mu-content-block>
                <mu-divider/>
                
                

                <!-- 单卡数量设置条件 -->
                <mu-switch :label="$t('everycardcountsetlabel')" v-model="everyCardCountFilter" class="filter-switch" />
                <!-- 单卡查询条件输入框 -->
                <mu-dialog :open="singleCardDialog" :title="$t('carddialogtitle')" @close="singleCardDialogClose">
                    <div class="singleCardDialog" >
                        <span>{{$t('carddialogchoicedlabel')}}：</span>
                        <mu-paper class="unitCard" :zDepth="1" :title="tempcard.card.name">
                        <img :src="tempcard.card.img" />
                        <div class="unitCardName">
                            <b>{{tempcard.card.name}}</b>
                        </div>
                        </mu-paper>
                        <span>{{$t('carddialogmincount')}}：</span>
                        <InputNumber :min="1" v-model="tempcard.min"></InputNumber>
                        <span>{{$t('carddialogmaxcount')}}：</span>
                        <InputNumber :min="1" v-model="tempcard.max"></InputNumber>
                    </div>
                    
                    <mu-flat-button slot="actions" @click="singleCardDialogClose" primary :label="$t('carddialogcancel')" />
                    <mu-flat-button slot="actions" primary @click="singleCardSubmit" :label="$t('carddialogsubmit')" />
                </mu-dialog>
            </mu-content-block>
        <!-- </transition> -->
        <div class="searchFilterControlArea">
            <mu-flat-button v-show="showSearchFilter" :label="$t('collapselabel')" class="demo-flat-button" @click="showSearchFilter = !showSearchFilter" secondary>
                <icon name="chevron-up" :w="24" :h="24"></icon>
            </mu-flat-button>
            <mu-flat-button v-show="!showSearchFilter" :label="$t('expandlabel')" class="demo-flat-button" @click="showSearchFilter = !showSearchFilter" secondary>
                <icon name="chevron-down" :w="24" :h="24"></icon>
            </mu-flat-button>
        </div>
        
         <!-- 价格条件设定区域 单独展示 -->
        <mu-content-block class="searchFilter" v-if="locale ==='cn'">
            <mu-switch v-if="locale ==='cn'" :label="$t('pricesetlabel')" v-model="priceSearchFilter" class="filter-switch" />
            <span v-if="priceSearchFilter && locale ==='cn'" class="rate-select">
                <InputNumber size="small" :min="1" :max="99999" v-model.number="pricequery.min"></InputNumber> ~
                <InputNumber size="small" :min="1" :max="99999" v-model.number="pricequery.max"></InputNumber>
            </span>

        </mu-content-block>

       
        <!-- 预设条件区 -->
        <mu-content-block class="searchFilter" v-if="presetFilter.length > 0 && locale === 'cn'">
            <mu-sub-header>搜索条件太复杂？试试推荐搜索设置~</mu-sub-header>
            <div class="presetFilterContent">
                <Poptip v-for="item in presetFilter" :key="item._id" trigger="hover" :content="item.describe">
                    <mu-raised-button class="presetBtn" :style="`color:${item.fontcolor};background-color:${item.backgroudcolor}`" :label="item.title" @click="handlePreset(item)"/>
                </Poptip>
            </div>
        </mu-content-block>
        <!-- <div class="presetFilterArea">
            
        </div> -->

        <mu-tabs v-if="locale === 'cn'" :value="activeNavTab" @change="handleNavTabChange">
            <mu-tab class="tabNav" :value="0" title="分类展示"></mu-tab>
            <mu-tab class="tabNav" :value="1" title="全部展示"></mu-tab>
            
        </mu-tabs>
        <div class="tabCardShow" v-if="activeNavTab === 0 && locale ==='cn'">
            <!--分类区-->

            <div class="tabsArea">
                <mu-chip class="tabBtn" v-for="tab in tabs" :key="tab._id" :class="{tabBtnClicked: activeCardTab===tab._id}" @click.native="handleTabClick(tab)">
                    {{tab.name}}
                </mu-chip>
            </div>
            <mu-divider></mu-divider>
            <div class="cardArea" v-for="tab in tabs" :key="tab._id" v-if="activeCardTab === tab._id">
                <mu-paper v-for="card in tab.cards" :key="card.name" class="unitCard" :zDepth="1" :title="card.name">
                    
                    <img :src="card.img" @click="clickUnitCard(card)" />
                    <div class="unitCardName" @click="clickUnitCard(card)">
                        <b>{{card.name}}</b>
                    </div>
                    <mu-divider />
                    <!-- 由于checkbox change事件在各个浏览器表现不同，故使用自制方法加遮罩层覆盖原有元素 -->
                    <div class="checkboxLayerContainer">
                        <div class="checkboxLayer" @click="clickUnitCard(card)"></div>
                        <span v-if="everyCardCountFilter">{{$t('clicktoselectcardcountlabel')}}</span>
                        <checkbox v-if="!everyCardCountFilter" label="GET" class="cusCheckBox" uncheckIcon="heart-outline" checkedIcon="heart" v-model="userChoiceName" :nativeValue="card.name" @change="changeChoiceObj(card)"/>
                        <!-- <mu-checkbox v-if="!everyCardCountFilter" label="GET" class="cusCheckBox" :nativeValue="card.name" @change="changeChoiceObj(card)" v-model="userChoiceName" uncheckIcon="favorite_border" checkedIcon="favorite"></mu-checkbox> -->
                    </div>

                </mu-paper>
            </div>
        </div>
        <div class="tabCardShow" v-if="activeNavTab === 1 || locale !== 'cn'">
            <!--全部区-->
            <mu-paper v-for="card in allTabCards" :key="card.name" class="unitCard" :zDepth="1" :title="card.name">
                <img :src="card.img" @click="clickUnitCard(card)" />
                <div class="unitCardName" @click="clickUnitCard(card)">
                    <b>{{card.name}}</b>
                </div>
                <mu-divider />
                <div class="checkboxLayerContainer">
                        <div class="checkboxLayer" @click="clickUnitCard(card)"></div>
                        <span v-if="everyCardCountFilter">{{$t('clicktoselectcardcountlabel')}}</span>
                        <checkbox v-if="!everyCardCountFilter" label="GET" class="cusCheckBox" uncheckIcon="heart-outline" checkedIcon="heart" v-model="userChoiceName" :nativeValue="card.name" @change="changeChoiceObj(card)"/>
                        <!-- <mu-checkbox v-if="!everyCardCountFilter" label="GET" class="cusCheckBox" :nativeValue="card.name" @change="changeChoiceObj(card)" v-model="userChoiceName" uncheckIcon="favorite_border" checkedIcon="favorite"></mu-checkbox> -->
                    </div>
            </mu-paper>
    
        </div>
        <!--<mu-tabs lineClass="tabsNavLine" :value="activeTab" @change="handleTabChange">
                <mu-tab class="tabNav" v-for="tab in tabs" :key="tab" :value="tab._id" :title="tab.name" />
            </mu-tabs>
            <div class="tabCardShow" v-for="tab in tabs" v-if="activeTab === tab._id">
                <mu-paper v-for="card in tab.cards" :key="card.name" class="unitCard" :zDepth="1" :title="card.name">
                    <img :src="card.img" @click.native="checkUserChoice(card)"/>
                    <div class="unitCardName" @click.native="checkUserChoice(card)"><b>{{card.name}}</b></div>
                    <mu-divider />
                    <mu-checkbox label="GET" class="cusCheckBox" :nativeValue="card.name" @change="checkUserChoice(card)"
                                 v-model="userChoiceName" uncheckIcon="favorite_border" checkedIcon="favorite"></mu-checkbox>
                </mu-paper>
            </div>-->
        <div class="choicedCard">
            <mu-sub-header>{{ $t('selectedlabel') }}</mu-sub-header>
            <div v-if="everyCardCountFilter === false">
                <mu-paper  v-for="card in userChoiceObj" :key="card.name" class="unitCard" :zDepth="1">
                    <div @click="removeChoiced(card)" :title="card.name">
                        <img :src="card.img" />
                        <div class="unitCardName">
                            <b>{{card.name}}</b>
                        </div>
                    </div>
                </mu-paper>
            </div>
            <div v-if="everyCardCountFilter === true">
                <mu-paper  v-for="singlecard in userChoiceNameWithCount" :key="singlecard.card.name" class="unitCard" :zDepth="1">
                    <div @click="removeChoiced(singlecard)" :title="singlecard.card.name">
                        <img :src="singlecard.card.img" />
                        <div class="unitCardName">
                            <b>{{ $t('choicedcardcountlabel')}}: {{singlecard.min}} ~ {{singlecard.max}}</b>
                        </div>
                    </div>
                </mu-paper>
            </div>
        </div>
        <div class="submitFind">
            <mu-raised-button class="submitButton" :label="$t('searchbtn')" labelPosition="before" secondary @click.native="handleSearch(null)" :disabled="disabledButton">
                <icon name="magnify" :w="24" :h="24"></icon>
            </mu-raised-button>
            <mu-raised-button class="submitButton" :label="$t('resetbtn')" labelPosition="before" primary @click.native="reset">
                <icon name="replay" :w="24" :h="24"></icon>
            </mu-raised-button>
        </div>
        <div v-if="showAlert">
            <mu-content-block>
                <mu-paper :zDepth="1">
                    <span class="alertContent">{{showAlertMsg}}</span>
                </mu-paper>
            </mu-content-block>
        </div>
        <div class="processArea">
            <mu-circular-progress :size="40" v-if="processCursor"></mu-circular-progress>
        </div>
    <Spin fix v-show="finishGetPageConfig === false || finishGetPresetFilter === false || finishGetNoticeCollapse === false || finishGetData === false || finishGetFirstChoiceGroup === false || finishGetRateIgnore === false">
        <!-- <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon> -->
        <mu-circular-progress :size="30"></mu-circular-progress>
        <div>页面配置加载中，请稍后...</div>
    </Spin>
    </div>
</template>

<script>
import bus from '../../common/bus';
import checkbox from '../smallcomps/checkbox.vue';
import InputNumber from 'iview/src/components/input-number';
import Poptip from 'iview/src/components/poptip';
import Spin from 'iview/src/components/spin';
import Collapse from 'iview/src/components/collapse';

const Panel = Collapse.Panel;

export default {
    data() {
        return {
            GetPageConfigUrl: '/pageconfig/get',
            GetPresetFilterUrl: '/presetfilter/get',
            GetNoticeCollapseUrl: '/noticecollapse/get',
            GetTabsUrl: '/cardtabs/get',
            GetStoreBySearchUrl: '/store/search/get',
            GetPreferenceGroupUrl: '/cardtabs/preference/get',
            GetRateIgnoreUrl:'/price/rateignore/get',
            tabs: [],
            collapseValue: '0',
            activeNavTab: 0,
            activeCardTab: 1,
            //pageconfig-area
            showTitle:'',
            showSearchFilter: false, //折叠展开搜索区
            
            everyCardCountFilter: false, //单卡数量设定
            
            giftSearchFilter: true,
            giftName:'附加物',
            giftField:'',
            giftArr:[], //后台页面配置 礼物部分
            giftCountIgnore: 0,//后台差额配置
            adSearchValue: 'other',
            adSearchMin: 0,
            adSearchMax: 99999,
            giftquery:{},
            // giftquery = {
            //  enable: false,
            //  min: 0,
            //  max: 0
            // }
            rateSearchFilter: true,
            rateArr:[],
            rateRangeMax:0,
            rateRangeMin:0,
            rateRange:[],
            rateMin:'',
            rateMax: '',
            showRateRange:false,
            showGiftRange:true,
            // ratequery = {
            //  enable: false,
            //  min: 0,
            //  max: 0
            // }
            ratequery:{},
            //高稀有度相关配置
            rateHighName:'SSR总数',
            rateHighField:'rate_sort',
            rateHighQuery:{
                enable: true,
                min:0,
                max:0
            },
            //价格筛选
            priceSearchFilter: true,
            pricequery:{
                min:1,
                max:99999
            },
            //折叠公告板
            noticeCollapse:[],
            //搜索预设
            presetFilter:[],

            userChoiceName: [], //send data
            userChoiceObj: [], //pre card
            userChoiceNameWithCount:[], //send data
            singleCardDialog: false,
            tempcard:{
                card:{},
                min:1,
                max:1
            },
            processCursor: false,
            disabledButton: false,
            showAlert: false,
            showAlertMsg: '',
            showSpin: false,
            
            //加载状态部分
            finishGetPageConfig: '',
            finishGetPresetFilter: '',
            finishGetData: '',
            finishGetFirstChoiceGroup: '',
            finishGetRateIgnore: '',
            finishGetNoticeCollapse:'',            
        }
    },
    components:{
        InputNumber,
        Poptip,
        Spin,
        Collapse,
        Panel,
        checkbox,
    },
    props: {
        game: {
            type: String
        }
    },
    watch: {
        // disabledButton(val) {
        //     if (val) {
        //         setTimeout(() => { this.disabledButton = false; }, 1000);
        //     }
        // },
        showAlert(val) {
            if (val) {
                setTimeout(() => { this.showAlert = false; this.showAlertMsg = '' }, 3000);
            }
        },
        giftCountIgnore(val){
            if(val > 0) {

            }
        },
        allTabCards(cards) {
            if(cards) {
                // console.log("数据加载完成，数量: " + cards.length);
                this.getNoticeCollapse();
            }
        },
        locale(val) {
            if(val) {
                this.getPageConfig();
            }
        }
        // adSearchMin(val) {
        //     if(val){
        //         this.adSearchMin = val.replace(/\D+/, '');
        //     }
            
        // },
        // adSearchMax(val) {
        //     if(val){
        //         this.adSearchMax = val.replace(/\D+/, '');
        //     }
        // }
    },
    computed: {
        allTabCards() {
            var cards = [];
            if (this.tabs) {
                for (let tab of this.tabs) {
                    for (let card of tab.cards) {
                        cards.push(card);
                    }

                }
            }
            return cards;
        },
        locale(){
            return this.$store.state.locale
        }
    },
    created() {
        // console.log("game is :" + this.game);
        this.getPageConfig();
        this.getPresetFilter();
        this.getData();
        this.getFirstChoiceGroup();
        this.getRateIgnore();
        bus.$on('searchById', (id) => {
            this.handleSearch(id);
        })
        
    },
    methods: {
        getRateIgnore() {
            this.finishGetRateIgnore = false;
            let self = this;
            this.$axios.get(self.GetRateIgnoreUrl, {
                params:{
                    game: self.game
                }
            }).then((res) => {
                if(res.data.code === "1") {
                    self.giftCountIgnore = res.data.data.giftCountIgnore || 0;
                    // console.log(self.rateIgnoreArr);
                }
                this.finishGetRateIgnore = true;
            })
        },
        getPresetFilter() {
            this.finishGetPresetFilter = false;
            let self = this;
            this.$axios.get(self.GetPresetFilterUrl, {
                params:{
                    game: self.game
                }
            }).then((res) => {
                if(res.data.code === "1") {
                    self.presetFilter = res.data.data;
                }
                this.finishGetPresetFilter = true;
            })
        },
        getNoticeCollapse() {
            this.finishGetNoticeCollapse = false;
            let self = this;
            this.$axios.get(self.GetNoticeCollapseUrl, {
                params:{
                    game: self.game
                }
            }).then((res) => {
                if(res.data.code === "1") {
                    let dataArr = res.data.data;
                    //查询配置id对应的卡牌obj，以便直接让用户选择
                    dataArr.map((value) => {
                        let cardobjs = [];
                        if(value.cardids && value.cardids.length > 0) {
                            for (let cardid of value.cardids) {
                                //查询所有卡牌与id匹配，匹配成功后获取卡牌obj
                                for (let i = 0; i < this.allTabCards.length; i++) {
                                    let tabCardOne = this.allTabCards[i];
                                    if (tabCardOne._id == cardid) {
                                        cardobjs.push(tabCardOne);
                                        break;
                                    }
                                }
                            }
                        }
                        value.cardobjs = cardobjs;
                        return value;
                    })
                    self.noticeCollapse = dataArr;
                }
                this.finishGetNoticeCollapse = true;
            })
        },
        getPageConfig(){
            // console.log("location: " + this.locale);
            this.finishGetPageConfig = false;
            let self = this;
            this.$axios.get(this.GetPageConfigUrl, {
                params: {
                    game: self.game,
                    location: self.locale
                }
            }).then((res) => {
                if(res.data.code === "1"){
                    //初始化数据
                    self.giftArr = [];
                    self.giftquery = {};
                    self.rateArr = [];
                    self.ratequery = {};
                    //获取配置成功
                    self.showTitle = res.data.data.showTitle;
                    self.giftName = res.data.data.giftName;
                    self.giftField = res.data.data.giftField;

                    for(let gift of res.data.data.giftArr){
                        let g = {
                            giftField: '',
                            giftName: '',
                        };
                        if(gift.indexOf('@') > -1){
                            g.giftField = gift.split('@')[0];
                            g.giftName = gift.split('@')[1];
                        } else {
                            g.giftField = rate;
                            g.giftName = rate;
                        }
                        self.giftArr.push(g);
                    }
                    // console.log(self.giftArr)
                    self.giftArr.forEach(function(gift) {
                        self.giftquery[gift.giftField] = {
                            enable: true,
                            min: 0,
                            max: 99999
                        }
                    });

                    //增加高等级稀有度过滤选项
                    self.rateHighField = 'rate_sort';
                    self.rateHighName = res.data.data.rate_sort || 'SSR总数';

                    for(let rate of res.data.data.rateArr){
                        let r = {
                            rateField: '',
                            rateName: '',
                        };
                        if(rate.indexOf('@') > -1){
                            r.rateField = rate.split('@')[0];
                            r.rateName = rate.split('@')[1];
                        } else {
                            r.rateField = rate;
                            r.rateName = rate;
                        }
                        self.rateArr.push(r);
                    }
                    
                    let rate_min = res.data.data.rate_range_min;//稀有度最低数量
                    self.rateRangeMin = rate_min;
                    let rate_max = res.data.data.rate_range_max;//稀有度最高数量
                    self.rateRangeMax = rate_max;
                    self.rateHighQuery.min = rate_min - 1 >= 0 ? rate_min - 1 : 0;
                    self.rateHighQuery.max = rate_max;

                    self.rateArr.forEach(function(rate) {
                        // self.showRateRange[rate.rateField] = false;
                        self.ratequery[rate.rateField] = {
                            enable: false,
                            min: rate_min,
                            max: rate_max
                        }
                    });

                    // for(;rate_max-rate_min >= 0; rate_min++){
                    //     self.rateRange.push(rate_min);
                    // }
                }
                this.finishGetPageConfig = true;
            })
        },
        getData() {
            this.finishGetData = false;
            let self = this;
            this.$axios.get(this.GetTabsUrl, {
                params: {
                    game: self.game,
                }
            }).then((res) => {
                if (res.data.code === "1") {
                    // console.log( res)
                    self.tabs = res.data.data.cardTabs;
                    
                } else {
                    // console.log(res.data.status);
                }
                this.finishGetData = true;
            });
        },
        getFirstChoiceGroup() {
            this.finishGetFirstChoiceGroup = false;
            let self = this;
            this.$axios.get(this.GetPreferenceGroupUrl, {
                params: {
                    game: self.game,
                }
            }).then((res) => {
                if (res.data.code === "1") {
                    
                    self.activeCardTab = res.data.data.preferenceId;

                } else {
                    // console.log(res.data.status);
                }
                this.finishGetFirstChoiceGroup = true;
            });
        },
        handleNavTabChange(val) {
            this.activeNavTab = val;
        },
        handleActive() {
            // console.log('tab active');
        },
        handleTabClick(tab) {
            this.activeCardTab = tab._id;
        },
        singleCardDialogClose() {
            this.tempcard={
                card:{},
                min:1,
                max:1
            };
            this.singleCardDialog = false;
        },
        singleCardSubmit() {
            if(this.tempcard.max < this.tempcard.min) {
                //交换大小值
                let temp = this.tempcard.max;
                this.tempcard.max = this.tempcard.min;
                this.tempcard.min = temp
            }
            for (let i = 0; i < this.userChoiceNameWithCount.length; i++){
                if(this.userChoiceNameWithCount[i].card === this.tempcard.card){
                    this.userChoiceNameWithCount.splice(i, 1);
                    break;
                }
            }
            // if(this.userChoiceNameWithCount.indexOf(this.tempcard.card) > -1) {
                
            //     this.userChoiceNameWithCount.splice(this.userChoiceNameWithCount.indexOf(this.tempcard.card), 1);
            // }
            this.userChoiceNameWithCount.push({
                card: this.tempcard.card,
                min: this.tempcard.min,
                max: this.tempcard.max,
            });
            this.singleCardDialogClose();
        },
        clickUnitCard(card) {
            //click img and text
            if(this.everyCardCountFilter === true) {
                //单卡数量过滤模式
                this.tempcard.card = card;
                this.singleCardDialog = true;
                return;
            }

            if (this.userChoiceName.indexOf(card.name) === -1) {
                this.userChoiceName.push(card.name);
                this.userChoiceObj.push(card);
            }
            else {
                this.userChoiceName.splice(this.userChoiceName.indexOf(card.name), 1);
                // console.log(this.userChoiceObj.indexOf(card));
                this.userChoiceObj.splice(this.userChoiceObj.indexOf(card), 1);
            }
        },
        //方法弃用
        changeChoiceObj(card) {
            //click checkbox
            //浏览器类型判断
            console.log(navigator.userAgent)
            var u_agent = navigator.userAgent;
            var browser_name = 'Failed to identify the browser';
            if (u_agent.indexOf('Firefox') > -1) {
                browser_name = 'Firefox';
            } else if (u_agent.indexOf('Chrome') > -1) {
                browser_name = 'Chrome';
            } else if (u_agent.indexOf('Safari') > -1) {
                browser_name = 'Safari';
            } else if (u_agent.indexOf('Trident') > -1 && u_agent.indexOf('rv:11') > -1) {
                browser_name = 'IE';//'IE11'
            } else if (u_agent.indexOf('MSIE') > -1 && u_agent.indexOf('Trident') > -1) {
                browser_name = 'IE';//'IE(8-10)'
            } else if (u_agent.indexOf('MSIE') > -1) {
                browser_name = 'IE';//'IE(6-7)'
            } else if (u_agent.indexOf('Opera') > -1) {
                browser_name = 'Opera';
            } else {
                browser_name += ',info:' + u_agent;
            }

            if(browser_name === 'IE' || browser_name === 'Firefox' || browser_name === 'Safari') {
                if (this.userChoiceName.indexOf(card.name) === -1) {
                    this.userChoiceObj.push(card);
                }
                else {
                    this.userChoiceObj.splice(this.userChoiceObj.indexOf(card), 1)
                }
            } else {
                if (this.userChoiceName.indexOf(card.name) !== -1) {
                    this.userChoiceObj.push(card);
                }
                else {
                    this.userChoiceObj.splice(this.userChoiceObj.indexOf(card), 1)
                }
            }
            

        },
        removeChoiced(card) {
            if(this.everyCardCountFilter === true) {
                this.userChoiceNameWithCount.splice(this.userChoiceNameWithCount.indexOf(card),1);
                return;
            }
            this.userChoiceObj.splice(this.userChoiceObj.indexOf(card), 1);
            this.userChoiceName.splice(this.userChoiceName.indexOf(card.name), 1);
        },
        handleSearch(id) {
            this.disabledButton = true;
            this.processCursor = true;
            if (this.userChoiceName.length > 0 || true) {
                var postData = {
                    "cards": this.userChoiceName,
                    "cardCountFilter": false,
                    "cardCountQuery": null,
                    "giftFilter": null,
                    "rateFilter": null,
                    "priceFilter":null,
                    "skip": 0,
                    "sort": "rate_sort",
                    "order": "-", 
                    "game": this.game
                };
                if (this.giftSearchFilter) {
                    //附加物过滤条件开启
                    
                    let giftFilter = JSON.parse(JSON.stringify(this.giftquery)); //深拷贝，防止引用
                    for(let gift in giftFilter){
                        //增加附加物差额增量
                        giftFilter[gift].min > 0 ? giftFilter[gift].min+= this.giftCountIgnore : 0;
                        giftFilter[gift].max > 0 ? giftFilter[gift].max+= this.giftCountIgnore : 0;

                        //大小值互换
                        if(giftFilter[gift].min > giftFilter[gift].max) {
                            let a = giftFilter[gift].min;
                            giftFilter[gift].min = giftFilter[gift].max;
                            giftFilter[gift].max = a;
                            // console.log("-大小值输入错误，自动更正-")
                        }
                    }
                    console.log(giftFilter);
                    postData.giftFilter = giftFilter;
                    
                }

                if (this.rateSearchFilter) {
                    let rateFilter = this.ratequery; 
                    rateFilter[this.rateHighField] = this.rateHighQuery;// 高稀有度条件加入查询条件
                    for(let rate in rateFilter){
                        if(rateFilter[rate].min > rateFilter[rate].max) {
                            //大小值互换
                            let a = rateFilter[rate].min;
                            rateFilter[rate].min = rateFilter[rate].max;
                            rateFilter[rate].max = a;
                            // console.log("-大小值输入错误，自动更正-")
                        }
                    }
                    postData.rateFilter = rateFilter;
                }
                //价格设定开启
                if (this.priceSearchFilter) {
                    let priceFilter = this.pricequery; 
                    if (priceFilter.min > priceFilter.max) {
                        //大小值互换
                        let a = priceFilter.min;
                        priceFilter.min = priceFilter.max;
                        priceFilter.max = a;
                        // console.log("-大小值输入错误，自动更正-")
                    }
                    postData.priceFilter = priceFilter;
                }
                //增加单卡数量查询条件
                if (this.everyCardCountFilter) {
                    postData.cardCountFilter = true;
                    let cardQueryArr = [];
                    for(let singlecard of this.userChoiceNameWithCount){
                        cardQueryArr.push({
                            cardid: singlecard.card._id,
                            min: singlecard.min,
                            max: singlecard.max
                        })
                    }
                    if(cardQueryArr.length === 0) {
                        //未选择任何单卡，关闭单卡查询条件,清空已选卡区域
                        postData.cardCountFilter = false;
                        postData.cards = [];
                    } else {
                        postData.cardCountQuery = cardQueryArr;
                    }
                    
                }

                //增加id查询条件
                if(id){
                    postData._id = id;
                }
                let self = this;
                this.$axios.get(this.GetStoreBySearchUrl, {
                    params:postData
                }).then(function (response) {
                    self.processCursor = false;
                    self.disabledButton = false;
                    //if count is 0,show no result alert
                    if (!response.data.data) {
                        self.showAlert = true;
                        self.showAlertMsg = self.locale === 'cn' ? '搜索结果为空' : 'sorry, no result';
                    }
                    self.$emit('handleSearch', response.data.data, postData);
                })
            }
            else {
                this.processCursor = false;
                this.disabledButton = false;
                this.showAlert = true;
                this.showAlertMsg = '您还未选择任何卡牌';

            }
        },
        reset() {
            location.reload();
            // this.userChoiceName = [];
            // this.userChoiceObj = [];
        },
        handleRateRangeEnableToggle(rateField){
            let enable = this.ratequery[rateField].enable;
            let ratequery = Object.assign({}, this.ratequery) ;
            let $rateField = ratequery[rateField]
            $rateField.enable = !enable;
            this.$set(this,'ratequery',ratequery);
        },
        handleGiftRangeEnableToggle(giftField){
            let enable = this.giftquery[giftField].enable;
            let giftquery = Object.assign({}, this.giftquery) ;
            let $giftField = giftquery[giftField]
            $giftField.enable = !enable;
            this.$set(this,'giftquery',giftquery);
        },
        handlePreset(presetFilter) {
            this.showSearchFilter = true;
            let reg = /(^[^@]+)@([0-9]+)\~([0-9]+)/i;
            let priceReg = /(^[0-9]+)\~([0-9]+)/i;
            //设置附加物推荐字段
            if (presetFilter.giftFilter.length > 0) {

                this.giftSearchFilter = true;

                presetFilter.giftFilter.forEach((giftOne) => {
                    if (reg.test(giftOne)) {
                        //配置格式正确
                        let field = giftOne.match(reg)[1];
                        let min = Number(giftOne.match(reg)[2]);
                        let max = Number(giftOne.match(reg)[3]);
                        //遍历当前所有礼物，如与配置相同则应用，否则禁用
                        for(let giftField in this.giftquery) {
                            if(giftField == field) {
                                this.giftquery[field] = {
                                    enable: true,
                                    min: min,
                                    max: max
                                }
                            } else {
                                this.giftquery[giftField] = {
                                    enable: false,
                                    min: 0,
                                    max: 99999
                                }
                            }
                        }
                    }
                })
            } else {
                this.giftSearchFilter = false;
            }

            //将高稀有度过滤条件初始化
            this.rateHighQuery = {
                enable: false,
                min: 0,
                max: 99
            }
            //设置稀有度推荐字段
            if (presetFilter.rateFilter.length > 0) {

                this.rateSearchFilter = true;

                presetFilter.rateFilter.forEach((rateOne) => {
                    if (reg.test(rateOne)) {
                        //配置格式正确
                        let field = rateOne.match(reg)[1];
                        let min = Number(rateOne.match(reg)[2]);
                        let max = Number(rateOne.match(reg)[3]);
                        if(field === this.rateHighField) {
                            this.rateHighQuery = {
                                enable: true,
                                min: min,
                                max: max
                            }
                            if (presetFilter.rateFilter.length === 1) {
                                //只有一个高稀有度配置，禁用其他稀有度配置
                                this.showRateRange = false;
                                for (let rateField in this.ratequery) {

                                    this.ratequery[rateField] = {
                                        enable: false,
                                        min: 1,
                                        max: 99
                                    }

                                }
                            }
                        } else {
                            for(let rateField in this.ratequery) {
                                if (rateField == field) {
                                    this.ratequery[field] = {
                                        enable: true,
                                        min: min,
                                        max: max
                                    }
                                    this.showRateRange = true;
                                } else {
                                    this.ratequery[rateField] = {
                                        enable: false,
                                        min: 1,
                                        max: 99
                                    }
                                }
                            }
                        }
                    }
                })
            } else {
                //无稀有度条件，关闭稀有度过滤选项
                this.rateSearchFilter = false;
            }

            //设置卡id查询条件 
            if (presetFilter.cardFilter.length > 0) {
                if (presetFilter.enableSingleCardCount) {
                    //开启同卡查询条件
                    this.everyCardCountFilter = true;
                    //清空已选
                    this.userChoiceNameWithCount = [];
                    let applyCount = 0;
                    presetFilter.cardFilter.forEach((cardOne) => {
                        if (reg.test(cardOne)) {
                            //配置格式正确
                            let cardid = cardOne.match(reg)[1];
                            let min = Number(cardOne.match(reg)[2]);
                            let max = Number(cardOne.match(reg)[3]);
                            //查询所有卡牌与id匹配，匹配成功后获取卡牌obj
                            for (let i = 0; i < this.allTabCards.length; i++) {
                                let tabCardOne = this.allTabCards[i];
                                if (tabCardOne._id == cardid) {
                                    applyCount++;
                                    this.tempcard = {
                                        card: tabCardOne,
                                        min: min,
                                        max: max
                                    };
                                    this.singleCardSubmit();
                                    break;
                                }
                            }

                        }
                    })
                } else {
                    //未开启同卡查询条件
                    this.everyCardCountFilter = false;
                    //清空已选
                    this.userChoiceName = []; 
                    this.userChoiceObj = [];
                    presetFilter.cardFilter.forEach((cardOne) => {
                        let cardid;
                        if (reg.test(cardOne)) {
                            //仍然发现当前格式配置，则进行匹配
                            cardid = cardOne.match(reg)[1];
                        } else {
                            //否则按全部内容均为id识别
                            cardid = cardOne;
                        }
                        if(cardid) {
                            //查询所有卡牌与id匹配，匹配成功后获取卡牌obj
                            for (let i = 0; i < this.allTabCards.length; i++) {
                                let tabCardOne = this.allTabCards[i];
                                if (tabCardOne._id == cardid) {
                                    this.clickUnitCard(tabCardOne);
                                    break;
                                }
                            }
                        }
                        
                    })
                }
            } else {
                this.everyCardCountFilter = false;
            }

            //设置价格查询条件 
            if(presetFilter.priceFilter) {
                this.priceSearchFilter = true;

                let priceOne = presetFilter.priceFilter;
                if (priceReg.test(priceOne)) {
                    //配置格式正确
                    let min = Number(priceOne.match(priceReg)[1]);
                    let max = Number(priceOne.match(priceReg)[2]);

                    this.pricequery = {
                        min: min,
                        max: max
                    }
                }

            } else {
                this.priceSearchFilter = false;
            }
            alert('搜索预设成功！您可以直接点击查询按钮搜索组合啦！如有需要也可以选择想要的角色后再点查询，结果会更加理想哦！');
        }
    }
}
</script>

<style scoped>
h2 {
    margin: 5px 10px 5px 10px;
}

.titleArea {
    min-height: 20px;
    font-size: 20px;
}
.collapseTitle {
    font-size: 1.2em;
    /* font-weight: bold; */
    overflow: hidden;
}
.collapseContent {
    font-size: 1em;
    /* font-weight: normal; */
}
.collapseCard {
    /* margin: 5px 5px 0px 10px !important; */
    
}
.searchFilter {
    margin: 5px 0px 5px 0px;
    border: 1px solid #ccc;
    border-radius: 3px 4px;
    text-align: left;
}
.searchFilterControlArea {
    margin: -5px 0px 5px 0px;
    /* border: 1px solid #ccc;
    border-radius: 3px 4px; */
}
.presetFilterContent {
    margin: 0px 30px;
}
.filter-switch{
    margin-left: 10px;
    margin-top: 5px;
}
.ad-radio {
    margin-right: 5px;
    padding: 3px;
}

.ad-input {
    margin-left: 5px;
    width: 100px;
}
.presetBtn {
    margin: 5px 8px;
    font-size: 1.2em;
}
.rate-select{
    display: inline-block;
    margin-left: 15px;
    margin-bottom: 5px;
}
.tabsNavLine {
    display: none;
}

.tabNav {}

.tabsArea {
    min-height: 40px;
    padding-left: 10px;
}

.tabBtn {
    margin: 4px;
}

.tabBtnClicked {
    background-color: #ff5252 !important;
}

.cardArea {
    min-height: 80px;
    
}

.cusCheckBox {
    margin: 4px 0px 0px 4px;
}

.unitCard {
    display: inline-block;
    width: 80px;
    margin: 4px 7px;
    cursor: pointer;
    vertical-align:text-top;
    overflow: hidden;
}

.checkboxLayerContainer {
    position: relative;
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: red;
}
.checkboxLayer{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 0.5;
    -moz-opacity:0.5;
}
.unitCardName {
    font-size: 8px;
    width: 80px;
    word-break: break-all;
    /* overflow: hidden;
    text-overflow: ellipsis; */
    /* white-space: nowrap; */
}
.singleCardDialog {
    display: flex;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
}
.tabCardShow {
    text-align: left;
    border: 1px solid #ccc;
    min-height: 130px
}

.choicedCard {
    margin-top: 10px;
    border-radius: 3px 4px;
    border: 1px solid #ccc;
    min-height: 50px;
    padding: 5px;
}

.submitFind {
    margin-top: 5px;
}

.submitButton {
    margin: 4px 7px !important;
}

.processArea {
    margin-top: 10px;
}

.alertContent {
    color: red;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
.demo-flat-button {
    font-size: 1.2em;
    font-weight: bold;
    margin: 5px;
}
</style>