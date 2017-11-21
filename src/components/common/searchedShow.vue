<template>
    <div>
        <div class="toggleshow">
            <mu-switch v-model="toggleShowName" id="showNameLabel" />
            <span id="showNameLabel">显示文字</span>
            <mu-switch v-model="toggleShowIgnoreRate" id="showIgnoreCardLabel" />
            <span id="showIgnoreCardLabel">展示低稀有度卡牌</span>
        </div>
        

        <mu-table :fixedHeader="fixedHeader" :selectable="selectable" :showCheckbox="showCheckbox" height="1000px"  ref="table">
            <mu-thead slot="header">
                <mu-tr>
                    <mu-th class="colume1" tooltip="序号"> </mu-th>
                    <mu-th v-if="toggleShowName" class="colume2" tooltip="完整名称">完整信息</mu-th>
                    <mu-th v-if="!toggleShowName" class="colume2" tooltip="图片预览">图片预览</mu-th>
                    <mu-th class="colume4 center" tooltip="附加物">附加物</mu-th>
                    <mu-th class="colume4 center" tooltip="SSR总数">{{rateHighName}}</mu-th>
                    <mu-th class="colume4 center" tooltip="价格">价格</mu-th>
                    <mu-th class="colume3 center" v-if="!isShowCopyId" tooltip="点击进入提货步骤">提货</mu-th>
                    <mu-th class="colume3 center" v-if="isShowCopyId" tooltip="点击复制id">卡组id</mu-th>
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
                                <span v-if="card.count !== 1" class="BlodRed">X{{card.count}}</span>
                            </div>
                                <span v-if="card.count !== 1 && !toggleShowName" class="BlodRed">X{{card.count}}</span>
                        </mu-paper>
                    </mu-td>
                    <mu-td class="colume4 center">
                        <div class="gift_count" v-for="gift in giftArr" :key="gift.giftField">
                            {{gift.giftName}}: 
                            <div class="gift_count_number">{{item[gift.giftField] - giftCountIgnore > 0 ? item[gift.giftField] - giftCountIgnore : 0}}</div>
                        </div>
                        
                    </mu-td>
                    <mu-td class="colume4 center">
                        {{item.rate_sort}}张
                    </mu-td>  
                    <mu-td class="colume4 center">
                        ￥{{item.price}}
                    </mu-td> 
                    <mu-td class="colume3 center" v-if="!isShowCopyId">
                        <mu-raised-button  label="就选这个" class="selectButton" secondary @click.native="choiceThis(item)"></mu-raised-button>
                    </mu-td>
                    <mu-td class="colume3 center" v-if="isShowCopyId">
                        <div :id="item._id">{{item._id}}</div>
                        <mu-raised-button :label="$t('copyidbtn')" :class="'copybtn' + item._id" secondary @click.native="copyContent(item._id)"></mu-raised-button>
                        <!-- <mu-raised-button label="就选这个" class="selectButton" secondary @click.native="choiceThis(item)"></mu-raised-button> -->
                    </mu-td>
                </mu-tr>

                <!-- <div class="afterTable">
                    <mu-flat-button class="loadMoreBtn" v-if="!noMoreData" icon="expand_more" :disabled="processCursor" label="点击加载更多" @click.native="loadMore" />
                    <span v-if="noMoreData">没有更多结果啦~</span>
                </div> -->

            </mu-tbody>
        </mu-table>
        <mu-infinite-scroll ref="scrol" :scroller="scroller" :loading="loading" @load="loadMore"></mu-infinite-scroll>
        <div class="afterTable">
            <span v-if="noMoreData">没有更多结果啦~</span>
        </div>
        <!-- <div class="processArea">
            <mu-circular-progress :size="40" v-if="processCursor"></mu-circular-progress>
        </div> -->
        
        <mu-dialog :open="dialog" title="用户提示" @close="closeDialog">
            {{dialogContent}}
            <mu-flat-button slot="actions" @click.native="closeDialog" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click.native="ensureDialog" label="确定" />
        </mu-dialog>

    </div>
</template>

<script>
import Clipboard from "clipboard";
// import itable from 'iview/src/components/table';
export default {
  data() {
    return {
      GetStoreBySearchUrl: "/store/search/get",
      GetRateIgnoreUrl: "/price/rateignore/get",
      GetPateConfigUrl: "/pageconfig/get",
      // columnsSet:[{
      //     key:'_id',
      //     title: "id"
      // },{
      //     key:'cards',
      //     title: "信息"
      // }],
      tableData: [],
      rateIgnoreArr: [],
      // giftName: '石头数',
      // giftField: '',
      giftArr: [],
      rateHighName: "SSR总数",
      giftCountIgnore: 0, //附加物差额配置
      bottomSheet: false,
      fixedHeader: true, //固定表头
      selectable: false,
      showCheckbox: false,
      scroller: null,
      toggleShowName: true,
      toggleShowIgnoreRate: true,
      loading: false,
      processCursor: false,
      noMoreData: false,
      dialog: false,
      dialogContent: "",
      url: {
        AG:
          "https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-17130288821.2.2ba7e6e9kw0dRr&id=536348800173",
        MLTD:
          "https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-3894680649.8.2ba7e6e9kw0dRr&id=554755943679",
        CGSS:
          "https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-3894680649.2.2ba7e6e9kw0dRr&id=522053456859",
        ALCH:
          "https://item.taobao.com/item.htm?spm=a1z10.1-c.w4004-3894680649.8.2ba7e6e9kw0dRr&id=554755943679"
      }
    };
  },
  // components:{
  //     itable
  // },
  mounted() {
    //  console.log(this.$refs.table.$el.childNodes[2]);

    this.scroller = this.$refs.table.$el.childNodes[2];
    if (this.game === "AG") {
      this.toggleShowIgnoreRate = false;
    }
    if (this.game === "ALCH") {
      this.toggleShowIgnoreRate = false;
    }
    if (this.game === "CGSS") {
      this.toggleShowIgnoreRate = false;
    }
  },
  computed: {
    //显示复制ID按钮，暂时取消自助提货流程
    isShowCopyId() {
      let result = false;
      console.log(this.game);
      if (
        this.game === "AG" ||
        this.game === "MLTD" ||
        this.game === "CGSS" ||
        this.game === "ALCH"
      ) {
        result = true;
      }
      return result;
    }
  },
  created() {
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
  watch: {
    //每次数据变动后，重置加载按钮
    listData(val) {
      this.noMoreData = false;
    }
  },
  methods: {
    // cardShowJudge(){
    //     console.log("in judge:" + this.rateIgnoreArr.indexOf(card.rate) < 0 || this.toggleShowIgnoreRate);
    //     return this.rateIgnoreArr.indexOf(card.rate) < 0 || this.toggleShowIgnoreRate
    // },
    getPageConfig() {
      let self = this;
      this.$axios
        .get(this.GetPateConfigUrl, {
          params: {
            game: self.game
          }
        })
        .then(res => {
          if (res.data.code === "1") {
            //获取配置成功

            // self.giftName = res.data.data.giftName || '石头数';
            // self.giftField = res.data.data.giftField;
            for (let gift of res.data.data.giftArr) {
              let g = {
                giftField: "",
                giftName: ""
              };
              if (gift.indexOf("@") > -1) {
                g.giftField = gift.split("@")[0];
                g.giftName = gift.split("@")[1];
              } else {
                g.giftField = rate;
                g.giftName = rate;
              }
              self.giftArr.push(g);
            }
            //增加高等级稀有度过滤选项
            // self.rateHighField = 'rate_sort';
            self.rateHighName = res.data.data.rate_sort || "SSR总数";
          }
        });
    },
    closeDialog() {
      this.dialog = false;
      this.dialogContent = "";
    },
    ensureDialog() {
      let t = this,
        game = t.game,
        urls = t.url,
        url = urls[game];
      window.open(url, "");
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      document.body.appendChild(a);
      a.click();
      a.remove();
      t.dialog = false;
      t.dialogContent = "";
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      this.bottomSheet = true;
    },
    choiceThis(item) {
      // if (this.game === "AG" || this.game === "CGSS" || this.game === "MLTD") {
      //     this.dialogContent = "该账号id为:" + item._id +", 该游戏暂不支持自动提货，请提供id和游戏名称给小二手工提货";
      //     this.dialog = true;
      //     return;
      // }
      this.$emit("choiceThis", item);
    },
    getRateIgnore() {
      let self = this;
      this.$axios
        .get(self.GetRateIgnoreUrl, {
          params: {
            game: self.game
          }
        })
        .then(res => {
          if (res.data.code === "1") {
            self.rateIgnoreArr = res.data.data.rates;
            self.giftCountIgnore = res.data.data.giftCountIgnore || 0;
            // console.log(self.rateIgnoreArr);
          }
        });
    },
    loadMore() {
      if (this.noMoreData === true) return;
      this.loading = true;
      this.processCursor = true;
      let self = this;
      setTimeout(() => {
        if (self.searchedPostData) {
          var postData = self.searchedPostData;
          postData.skip += 20;
          self.$axios
            .get(self.GetStoreBySearchUrl, {
              params: postData
            })
            .then(function(res) {
              if (res.data.data.length !== 0) {
                for (let item of res.data.data) {
                  self.listData.push(item);
                }
              } else {
                //已没有搜索结果,显示“没有更多结果啦”
                self.$refs.scrol.$el.remove();
                self.noMoreData = true;
              }
              self.loading = false;
              self.processCursor = false;
            });
        } else {
        }
      }, 1000);
    },
    copyContent(id) {
      let t = this;
      var clipboard = new Clipboard(".copybtn" + id, {
        target: function() {
          return document.getElementById(id);
        }
      });
      clipboard.on("success", function(e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
        // e.clearSelection();
        t.dialogContent = "复制成功，请问是否前往宝贝商品地址？";
        t.dialog = true;
        // alert('复制成功');
        clipboard.destroy();
      });

      clipboard.on("error", function(e) {
        // console.error('Action:', e.action);
        // console.error('Trigger:', e.trigger);
      });
    }
  }
};
</script>
<style scoped>
#showNameLabel {
  font-family: sans-serif;
  font-size: 15px;
  color: #990000;
  font-weight: bold;
}
#showIgnoreCardLabel {
  font-family: sans-serif;
  font-size: 15px;
  color: #cc6600;
  font-weight: bold;
}
.mu-th,
.mu-td {
  padding-left: 3px;
  padding-right: 3px;
}
.center {
  text-align: center;
}
.colume1 {
  width: 5%;
  text-align: center;
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
tr:nth-child(even) {
  background-color: #eeeeee;
}
.cardname-chip {
  margin: 3px;
  background-color: #ffccbc;
}

.imgPre {
  display: inline-block;
  margin: 2px;
  vertical-align: text-top;
}
.unitCardName {
  font-size: 8px;
  width: 80px;
  word-break: break-all;
  /* overflow: hidden;
    text-overflow: ellipsis; */
  /* white-space: nowrap; */
}
.afterTable {
  color: red;
}
.loadMoreBtn {
  color: red;
  width: 100%;
}
.BlodRed {
  font-size: 12px;
  font-weight: bold;
  color: red;
}
.infinite-container {
  /* display: block; */
  max-height: 800px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
