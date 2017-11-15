<template>
    <div>
        <div class="demo-flat-button-container">
          <mu-flat-button label="更多功能" @click.native="openBottomSheet">
              <icon   name="fan" :w="24" :h="24"></icon>
          </mu-flat-button>
        </div>
        <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
            <mu-list @itemClick="closeBottomSheet">
                <mu-sub-header>
                    额外功能
                </mu-sub-header>
                <mu-list-item title="根据提货码查询历史提货信息" @click.native="showSearchSoldComp" />
                <mu-list-item title="根据ID搜索账号" @click.native="searchCompByIdDialog = true"/>
                <mu-list-item title="其他功能" @click.native="testFunc"/>
                <mu-list-item title="其他功能" @click.native="testFuncPre"/>
            </mu-list>
        </mu-bottom-sheet>

        <mu-dialog :open="searchSoldCompDialog" title="查询历史提货信息" >
            <mu-paper :zDepth="1" class="SSCDialogContent" v-if="SSCStatus===0">
                <mu-content-block class="alertContent">请输入一条您使用过的提货码，然后点击查询</mu-content-block>
                <icon class="imgIcon" name="magnify" :w="24" :h="24"></icon>
                <mu-text-field class="textArea" :errorText="errorText" label="提货码" labelFloat v-model="deliveryCode"></mu-text-field>
            </mu-paper>
            <mu-paper :zDepth="1" v-if="SSCStatus===1">
                <mu-sub-header class="SSCResultHeader"><b>查询结果</b></mu-sub-header>
                <!-- <mu-sub-header class="SSCResultHeader"><mu-raised-button label="点击查看使用教程" primary @click.native="openEndShow"></mu-raised-button></mu-sub-header> -->
                <mu-divider></mu-divider>
                <mu-table :showCheckbox="false">
                    <mu-tbody>
                        <mu-tr>
                            <mu-td class="col1">组合名称：</mu-td>
                            <mu-td class="col2 SSCCol2">
                                <span v-for="(card,index) in soldCompInfo.cards" :key="card._id">
                                    [{{card.name}}] X {{card.count}}
                                    <span v-if="index !== soldCompInfo.cards.length -1">+</span>
                                </span>
                            </mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td class="col1"></mu-td>
                            <mu-td class="col2 SSCCol2"><span class="fontTip">（字体提示：大写L-小写l-数字1 大写I-小写i 字母O-数字0）</span></mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td class="col1">引继码：</mu-td>
                            <mu-td class="col2 SSCCol2">
                                <span id="leadcode">
                                    {{soldCompInfo.migration_code}}{{soldCompInfo.inheritId}}
                                    </span> 
                                <mu-raised-button label="点击复制" :class="'copybtn' + 'leadcode'" secondary @click.native="copyContent('leadcode')"></mu-raised-button>
                            </mu-td>
                        </mu-tr>
                        <mu-tr>
                            <mu-td class="col1">密码：</mu-td>
                            <mu-td class="col2 SSCCol2">
                                <span id="pwd">
                                    {{soldCompInfo.migration_password}}{{soldCompInfo.Password}}
                                </span>
                                <mu-raised-button label="点击复制" :class="'copybtn' + 'pwd'" secondary @click.native="copyContent('pwd')"></mu-raised-button>
                            </mu-td>
                        </mu-tr>
                        <!-- <mu-tr>
                            <mu-td class="col1">提货时间：</mu-td>
                            <mu-td class="col2 SSCCol2">
                                {{soldCompInfo.soldTime}}
                            </mu-td>
                        </mu-tr> -->
                    </mu-tbody>
                </mu-table>
                
                <mu-paper :zDepth="1"  class="userHelp">
                    <mu-content-block>
                        <div v-html="endTutorialHtml"></div>
                    </mu-content-block>
                </mu-paper>
                
            </mu-paper>
            <mu-raised-button v-if="SSCStatus===0" :disabled="searchBtnDisabled" label="查询" slot="actions" secondary @click.native="searchSoldComp"></mu-raised-button>
            <mu-raised-button v-if="SSCStatus===1" label="继续查询" slot="actions" secondary @click.native="searchContinue"></mu-raised-button>
            <mu-raised-button label="关闭" slot="actions" primary @click.native="closeSSCDialog"></mu-raised-button>
        </mu-dialog>

        <mu-dialog :open="searchCompByIdDialog" title="根据ID查询账号" >
            <mu-paper :zDepth="1" class="SSCDialogContent">
                <mu-content-block class="alertContent">请输入ID，然后点击查询</mu-content-block>
                  <icon class="imgIcon" name="magnify" :w="24" :h="24"></icon>
               <mu-text-field class="textArea" :errorText="errorTextinSearchId" label="账号ID" labelFloat v-model.trim="compId">
                </mu-text-field>
            </mu-paper>
            
            </mu-paper>
            <mu-raised-button label="查询" slot="actions" secondary @click.native="handleSearchById"></mu-raised-button>
            <mu-raised-button label="关闭" slot="actions" primary @click.native="searchCompByIdDialog = false"></mu-raised-button>
        </mu-dialog>
    </div>
</template>

<script>
import bus from "../../common/bus";
import Clipboard from "clipboard";

export default {
  data() {
    return {
      GetPateConfigUrl: "/pageconfig/get",
      endTutorialHtml: "",
      dcodeHistoryGetUrl: "/soldlog/bydcode/get",
      bottomSheet: false,
      searchSoldCompDialog: false,
      searchCompByIdDialog: false,
      compId: "",
      errorText: "",
      errorTextinSearchId: "",
      deliveryCode: "",
      SSCStatus: 0, //查询历史信息状态，0为待查询，1为已查询
      soldCompInfo: {},
      searchBtnDisabled: false, //查询按钮是否禁用
    };
  },
  created() {
    bus.$on("searchHistory", () => {
      this.showSearchSoldComp();
    });
  },
  watch: {
    deliveryCode: function(val) {
      if (val === "") {
        this.errorText = "";
      }
    },
    searchBtnDisabled(val) {
      if (val) {
        setTimeout(() => {
          this.searchBtnDisabled = false;
        }, 1000);
      }
    }
  },
  methods: {
    getPageConfig(game) {
      if (!game) {
        console.log("game not exist");
        return;
      }
      let self = this;
      this.$axios
        .get(this.GetPateConfigUrl, {
          params: {
            game: game
          }
        })
        .then(res => {
          if (res.data.code === "1") {
            //获取配置成功
            this.endTutorialHtml = res.data.data.end_tutorial;
          }
        });
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      this.bottomSheet = true;
    },
    closeSSCDialog() {
      this.searchSoldCompDialog = false;
      this.deliveryCode = "";
      this.SSCStatus = 0;
      this.soldCompInfo = {};
    },
    testFunc() {
      console.log("ok");
    },
    testFuncPre() {
      bus.$emit("endPre");
    },
    handleSearchById() {
      let inputId = this.compId.replace(/\s/g, "").replace(/[^a-zA-Z\d]+/g, "");
      // console.log(inputId);
      if (inputId.length % 24 !== 0 || inputId.length === 0) {
        this.errorTextinSearchId = "您输入的ID不正确，请重新输入";
      } else {
        this.errorTextinSearchId = "";
        bus.$emit("searchById", inputId);
        this.searchCompByIdDialog = false;
      }
    },
    showSearchSoldComp() {
      this.searchSoldCompDialog = true;
    },
    searchSoldComp() {
      this.searchBtnDisabled = true;
      let deliveryCode = this.deliveryCode.replace(/\s/g, "");
      if (deliveryCode.length !== 32) {
        this.errorText = "您输入的提货码不正确，请重新输入，只能输一条哦";
      } else {
        //let data = {DC: this.deliveryCode};
        let self = this;
        this.$axios
          .get(this.dcodeHistoryGetUrl, {
            params: {
              dcode: deliveryCode
            }
          })
          .then(function(res) {
            if (res.data.code === "1") {
              self.soldCompInfo = res.data.data;
              self.SSCStatus = 1;
              self.getPageConfig(res.data.data.game);
            } else {
              self.errorText = "未查询到您的提货码的提货记录";
            }
          });
      }
    },
    searchContinue() {
      this.deliveryCode = "";
      this.SSCStatus = 0;
    },
    // openEndShow() {
    //     bus.$emit('endPre');
    // },
    // copyContent(id) {
    //     // 创建元素用于复制
    //     var aux = document.createElement("input");

    //     // 获取复制内容
    //     var content = document.getElementById(id).innerHTML.trim();

    //     // 设置元素内容
    //     aux.setAttribute("value", content);

    //     // 将元素插入页面进行调用
    //     document.body.appendChild(aux);

    //     // 复制内容
    //     aux.select();

    //     // 将内容复制到剪贴板
    //     let tag = document.execCommand("copy");

    //     // 删除创建元素
    //     document.body.removeChild(aux);

    //     if (tag) {
    //         //复制成功
    //         alert('复制成功');
    //     }
    // }
    copyContent(id) {
      var clipboard = new Clipboard(".copybtn" + id, {
        // target: function() {
        //     return document.getElementById(id);
        // },
        text: function(trigger) {
          return document.getElementById(id).innerText.trim();
        }
      });
      clipboard.on("success", function(e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
        e.clearSelection();
        alert("复制成功");
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
.col1 {
  width: 120px;
}
.SSCDialogContent {
  padding: 10px;
}
.SSCResultHeader {
  text-align: center;
}
.SSCCol2 {
  font-family: "Source Code Pro";
  /* letter-spacing: 2px; */
  font-size: 1em;
}
.fontTip {
  font-size: 1em;
  color: red;
}
.textArea {
  width: 300px;
}
.userHelp {
  min-height: 260px;
  overflow: auto;
  word-wrap: break-word;
  word-break: break-all;
}
.imgIcon {
  vertical-align: middle;
}
</style>