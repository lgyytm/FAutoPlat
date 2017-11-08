<template>
    <div>
        <div class="toggleshow">
            <mu-switch :label="$t('showcardnamelabel')" v-model="toggleShowName" />
            <mu-switch :label="$t('showlowlevellabel')" v-model="toggleShowIgnoreRate" />
        </div>
        <mu-back-top/>
        <mu-table :fixedHeader="fixedHeader" :selectable="selectable" :showCheckbox="showCheckbox" height="1000px" ref="table">
            <mu-thead slot="header">
                <mu-tr>
                    <mu-th class="colume1" tooltip="index"> </mu-th>
                    <mu-th v-if="toggleShowName" class="colume2" tooltip="完整名称" :title="$t('cardpreviewlabel')">{{$t('cardpreviewlabel')}}</mu-th>
                    <mu-th v-if="!toggleShowName" class="colume2" tooltip="图片预览" :title="$t('imgpreviewlabel')">{{$t('imgpreviewlabel')}}</mu-th>
                    <mu-th class="colume4 center" tooltip="石头数" :title="$t('gifttotallabel')">{{$t('gifttotallabel')}}</mu-th>
                    <mu-th class="colume4 center" tooltip="SSR总数" :title="$t('highratelabel')">{{$t('highratelabel')}}</mu-th>
                    
                    <mu-th class="colume3 center">id</mu-th>
                </mu-tr>
            </mu-thead>
            <mu-tbody ref="container" class="infinite-container">
                <mu-tr v-for="(item,index) in listData" :key="item._id">
                     <mu-td class="colume1">
                        {{index + 1}}
                    </mu-td> 
                    <mu-td class="colume2" >
                        <mu-paper class="imgPre" v-for="card in item.cards" :key="card._id" :zDepth="1" v-show="rateIgnoreArr.indexOf(card.rate) < 0 || toggleShowIgnoreRate">
                            <img :src="card.img" />
                            <div class="unitCardName" v-if="toggleShowName">
                                <b >{{card.name}}</b>
                                <span v-if="card.count !== 1">X{{card.count}}</span>
                            </div>
                                <span v-if="card.count !== 1 && !toggleShowName">X{{card.count}}</span>
                        </mu-paper>
                    </mu-td>
                    <mu-td class="colume4 center">
                        <div class="gift_count" v-for="gift in giftArr" :key="gift.giftField">
                            {{gift.giftName}}:
                            <div class="gift_count_number">
                                {{item[gift.giftField]}}
                            </div>
                        </div>
                    </mu-td>
                    <mu-td class="colume4 center">
                        {{item.rate_sort}}
                    </mu-td>  
                    
                    <mu-td class="colume3 center">
                        <div :id="item._id">{{item._id}}</div>
                        <mu-raised-button :label="$t('copyidbtn')" :class="'copybtn' + item._id" secondary @click.native="copyContent(item._id)"></mu-raised-button>
                        <!-- <mu-raised-button label="就选这个" class="selectButton" secondary @click.native="choiceThis(item)"></mu-raised-button> -->
                    </mu-td>
                </mu-tr>
                
            </mu-tbody>
        </mu-table>
        <mu-infinite-scroll ref="scrol" :scroller="scroller" :loading="loading" @load="loadMore"></mu-infinite-scroll>
        <!-- <div class="afterTable">
            <mu-flat-button class="loadMoreBtn" v-if="!noMoreData" icon="expand_more" :disabled="processCursor" label="load more"  @click.native="loadMore"/>
            <span v-if="noMoreData"></span>
        </div> -->
        
        <!-- <div class="processArea">
            <mu-circular-progress :size="40" v-if="processCursor"></mu-circular-progress>
        </div> -->

        <mu-dialog :open="dialog" title="用户提示" @close="closeDialog">
            {{dialogContent}}
            <mu-flat-button slot="actions" primary @click.native="closeDialog" label="确定" />
        </mu-dialog>

    </div>
</template>

<script>
import Clipboard from 'clipboard';
export default {
    data() {
        return {
            GetStoreBySearchUrl: '/store/search/get',
            GetRateIgnoreUrl:'/price/rateignore/get',
            GetPateConfigUrl: '/pageconfig/get',
            giftArr:[],
            tableData: [],
            rateIgnoreArr: [],
            bottomSheet: false,
            fixedFooter: false,
            selectable: false,
            showCheckbox: false,
            scroller: null,
            toggleShowName: false,
            toggleShowIgnoreRate: false,
            loading: false,
            processCursor: false,
            noMoreData: false,
            dialog: false,
            dialogContent:''
        }
    },
    computed: {
        locale(){
            return this.$store.state.locale
        }
    },
    mounted() {
        //  console.log(this.$refs.table.$el.childNodes[2]);
        this.scroller = this.$refs.table.$el.childNodes[2];
        if(this.game === 'SGXD') {
            this.toggleShowIgnoreRate = true
        }
        if(this.game === 'BG') {
            this.toggleShowIgnoreRate = true
        }
        
    },
    created(){
        this.getRateIgnore();
        this.getPageConfig();
    },
    props: {
        listData: {
            type: Array
        },
        searchedPostData: {
            type: Object
        },
        game: {
            type: String
        }
    },
    watch:{
        //每次数据变动后，重置加载按钮
        listData(val) {
            this.noMoreData = false;
        },
        locale(val) {
            if(val) {
                this.getPageConfig();
            }
        }
    },
    methods: {
        // cardShowJudge(){
        //     console.log("in judge:" + this.rateIgnoreArr.indexOf(card.rate) < 0 || this.toggleShowIgnoreRate);
        //     return this.rateIgnoreArr.indexOf(card.rate) < 0 || this.toggleShowIgnoreRate
        // },
        getPageConfig(){
            let self = this;
            this.$axios.get(this.GetPateConfigUrl, {
                params: {
                    game: self.game,
                    location: self.locale
                }
            }).then((res) => {
                if(res.data.code === "1"){
                    //获取配置成功
                    
                    // self.giftName = res.data.data.giftName || '石头数';
                    // self.giftField = res.data.data.giftField;
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
                    // //增加高等级稀有度过滤选项
                    // // self.rateHighField = 'rate_sort';
                    // self.rateHighName = res.data.data.rate_sort || 'SSR总数';
                }
            })
        },
        closeDialog(){
            this.dialog = false;
            this.dialogContent = '';
        },
        closeBottomSheet() {
            this.bottomSheet = false
        },
        openBottomSheet() {
            this.bottomSheet = true
        },
        choiceThis(item) {
            // if (this.game === "AG" || this.game === "CGSS" || this.game === "MLTD") {
            //     this.dialogContent = "该账号id为:" + item._id +", 该游戏暂不支持自动提货，请提供id和游戏名称给小二手工提货";
            //     this.dialog = true;
            //     return;
            // }
            this.$emit('choiceThis', item);

        },
        getRateIgnore() {
            let self = this;
            this.$axios.get(self.GetRateIgnoreUrl, {
                params:{
                    game: self.game
                }
            }).then((res) => {
                if(res.data.code === "1") {
                    self.rateIgnoreArr = res.data.data.rates;
                    // console.log(self.rateIgnoreArr);
                }
            })
        },
        loadMore() {
            if(this.noMoreData === true) return;
            this.loading = true;
            this.processCursor = true;
            let self = this;
            setTimeout(() => {
                if (self.searchedPostData) {
                    var postData = self.searchedPostData;
                    postData.skip += 20;
                    self.$axios.get(self.GetStoreBySearchUrl, {
                        params: postData
                    }).then(function (res) {
                        if (res.data.data.length !== 0) {
                            for (let item of res.data.data) {
                                self.listData.push(item);
                            }
                        }
                        else {
                            //已没有搜索结果
                            self.$refs.scrol.$el.remove();
                            self.noMoreData = true;
                        }
                        self.loading = false;
                        self.processCursor = false;
                    })
                }
                else {
                }
            }, 1000);

        },
        copyContent(id) {
            var clipboard = new Clipboard('.copybtn' + id, {
                target: function() {
                    return document.getElementById(id);
                }
            });
            clipboard.on('success', function(e) {
                // console.info('Action:', e.action);
                // console.info('Text:', e.text);
                // console.info('Trigger:', e.trigger);
                // e.clearSelection();
                alert('copy succeed');
                clipboard.destroy();
            });

            clipboard.on('error', function(e) {
                // console.error('Action:', e.action);
                // console.error('Trigger:', e.trigger);
            });
            // let node = document.getElementById(id);
            // node.select();
            // let tag = document.execCommand("copy");
            // // 创建元素用于复制
            // var aux = document.createElement("input");

            // // 获取复制内容
            // var content = document.getElementById(id).innerHTML.trim();

            // // 设置元素内容
            // aux.setAttribute("value", content);

            // // 将元素插入页面进行调用
            // document.body.appendChild(aux);

            // // 复制内容
            // aux.select();

            // // 将内容复制到剪贴板
            // let tag = document.execCommand("copy");

            // // 删除创建元素
            // document.body.removeChild(aux);

            // if (tag) {
            //     //复制成功
            //     alert('copy succeed');
            // }
        }
    }
}
</script>
<style scoped>
.mu-th, .mu-td {
    padding-left: 3px;
    padding-right: 3px;
}
.colume1 {
      width: 5%;  
     /* word-break: break-all;
    white-space: normal !important;  */
}

.colume2 {
     width: 57%;  
      white-space: normal;  
}
.column4 {
    width: 10%; 
}
.colume3 {
     width: 16%; 
}
.gift_count {
    white-space: normal;  
    word-break: break-all;
}
.center {
    text-align: center;
}
tr:nth-child(even) {
    background-color: #eeeeee
}
.cardname-chip {
    margin: 3px;
    background-color: #ffccbc;
}

.imgPre {
    display: inline-block;
    margin: 2px;
    vertical-align:text-top;
}
.unitCardName {
    font-size: 8px;
    width: 80px;
    /* overflow: hidden;
    text-overflow: ellipsis; */
    /* white-space: nowrap; */
}
.infinite-container {
    /* display: block; */
    max-height: 800px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
</style>
