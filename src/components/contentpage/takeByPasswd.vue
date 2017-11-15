<template>
    <div class="contentbody" id="contentbody">
        <!-- <mu-toast v-if="toastAlert" :message="toastMassage" @close="hideToastAlert" /> -->
        <mu-row :gutter="false">
            <mu-col width="100" tablet="10" desktop="10"></mu-col>
            <mu-col width="100" tablet="80" desktop="80">
                <!--内容区域  -->
                <div class="BodyPart">
    
                    <!-- part of intro -->
    
                    <!-- part of execute -->
 
                    <div class="step-do" v-if="!isShowCopyId">
                        <mu-stepper :activeStep="activeStep">
                            <mu-step>
                                <mu-step-label>
                                    查询组合
                                </mu-step-label>
                            </mu-step>
                            <mu-step>
                                <mu-step-label>
                                    选取组合
                                </mu-step-label>
                            </mu-step>
                            <mu-step>
                                <mu-step-label>
                                    输入密匙
                                </mu-step-label>
                            </mu-step>
                            <mu-step>
                                <mu-step-label>
                                    提货完成
                                </mu-step-label>
                            </mu-step>
                        </mu-stepper>
                        <!-- <div class="step-control right">
                            <mu-raised-button label="上一步" v-if="activeStep !== 3" :disabled="activeStep === 0 || activeStep === 3" @click.native="handlePrev"></mu-raised-button>
                            <mu-raised-button label="继续购买" secondary v-if="activeStep === 3" :disabled="activeStep !== 3" @click.native="handleReturn"></mu-raised-button>
                        </div> -->
                        <div class="step-control">
                            <mu-raised-button label="上一步" primary v-if="activeStep !== 3" :disabled="activeStep === 0 || activeStep === 3" @click.native="handlePrev"></mu-raised-button>
                            <mu-raised-button label="继续购买" secondary v-if="activeStep === 3" :disabled="activeStep !== 3" @click.native="handleReturn"></mu-raised-button>
                        </div>
                        <!-- <div class="backTop">
                            <mu-raised-button label="返回顶部" primary @click.native="backTop"></mu-raised-button>
                        </div> -->
                    </div>
                    <!-- 非自助提货步骤条 -->
                    <div class="step-do" v-if="isShowCopyId">
                        <mu-stepper :activeStep="activeStep">
                            <mu-step>
                                <mu-step-label>
                                    查询组合
                                </mu-step-label>
                            </mu-step>
                            <mu-step>
                                <mu-step-label>
                                   查询结果
                                </mu-step-label>
                            </mu-step>
                            <!-- <mu-step>
                                <mu-step-label>
                                    输入密匙
                                </mu-step-label>
                            </mu-step>
                            <mu-step>
                                <mu-step-label>
                                    提货完成
                                </mu-step-label>
                            </mu-step> -->
                        </mu-stepper>
                        <!-- <div class="step-control right">
                            <mu-raised-button label="上一步" v-if="activeStep !== 3" :disabled="activeStep === 0 || activeStep === 3" @click.native="handlePrev"></mu-raised-button>
                            <mu-raised-button label="继续购买" secondary v-if="activeStep === 3" :disabled="activeStep !== 3" @click.native="handleReturn"></mu-raised-button>
                        </div> -->
                        <div class="step-control">
                            <mu-raised-button label="上一步" primary v-if="activeStep !== 3" :disabled="activeStep === 0 || activeStep === 3" @click.native="handlePrev"></mu-raised-button>
                            <mu-raised-button label="继续查询" secondary v-if="activeStep === 3" :disabled="activeStep !== 3" @click.native="handleReturn"></mu-raised-button>
                        </div>
                        <!-- <div class="backTop">
                            <mu-raised-button label="返回顶部" primary @click.native="backTop"></mu-raised-button>
                        </div> -->
                    </div>

                    <mu-paper class="execute" :zDepth="2">
    
                        
                        <!-- <mu-divider /> -->
                        <div v-show="activeStep === 0">
                            <cardShow v-on:handleSearch="searchData" :game="game"></cardShow>
                        </div>
                        <div v-show="activeStep === 1" v-if="init">
                            <searchedShow v-on:choiceThis="choiceOne" :listData="searchedListData" :searchedPostData="searchedPostData" :game="game"></searchedShow>
                        </div>
                        <div v-if="activeStep === 2">
                            <takeShow v-on:confirmSubmit="submitCode" :compInfo="selectedComp" :game="game"></takeShow>
                        </div>
                        <div v-if="activeStep === 3">
                            <endShow :compInfo="selectedComp" :takeInfo="soldCompInfo" :game="game"></endShow>
                        </div>
    
                        <!-- <mu-row gutter>
                                <mu-col desktop="15" tablet="15" width="100">
                                    
                                </mu-col>
                                <mu-col desktop="85" tablet="85" width="100">
                                    
                                </mu-col>
                            </mu-row> -->
                        <mu-back-top :height="0"/>
                    </mu-paper>
    
                </div>
            </mu-col>
            <mu-col width="100" tablet="10" desktop="10"></mu-col>
        </mu-row>
    </div>
</template>
<script>
import bus from '../../common/bus'
import tools from '../common/tools.vue'
import searchedShow from '../common/searchedShow.vue'
import takeShow from '../common/takeShow.vue'
import endShow from '../common/endShow.vue'
import cardShow from '../common/cardShow.vue'
export default {
  data() {
        return {
            open: false,
            //in this
            init: false,
            trigger: null,
            toastAlert: false,
            toastMassage: '',
            game:'',
            gameName: '',
            searchedListData: [],
            searchedPostData: null,
            selectedComp: {},
            activeStep: 0,
            soldCompInfo: {}
        }
    },
    created() {
        // in this
        this.game = this.$route.params.game;
        bus.$on('endPre', () => {
            // if(compInfo) {
            //     this.soldCompInfo = compInfo;
            // }
            this.activeStep = 3;
        })

    },
    computed: {
        //显示复制ID按钮，暂时取消自助提货流程
        isShowCopyId(){
            let result = false;
            console.log(this.game)
            if(this.game === 'AG' || this.game === 'MLTD' || this.game === 'CGSS' || this.game === 'ALCH'){
                result = true;
            }
            return result;
        }
    },
    methods: {
        backTop(){
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
            // window.scroll(0,0);
        },
        toggle() {
            this.open = !this.open
        },
        
        handleClose(e) {
            this.open = false
        },
        handlePrev() {
            switch (this.activeStep) {
                case 1:
                    //searchedShow page
                    this.searchedListData = [];
                    this.searchedPostData = null;
                    this.init = false;
                    this.activeStep--;
                    break;
                case 2:
                    //takeShow page
                    this.selectedComp = {};
                    this.activeStep--;
                    break;
            }

        },
        handleReturn() {
            this.searchedListData = [];
            this.selectedComp = {};
            this.soldCompInfo = {};
            this.activeStep = 0;
        },
        reset() {
            this.activeStep = 0
        },
        searchData(data, postData) {
            if (data && data.length > 0) {
                this.activeStep = 1;
                this.init = true;
                this.searchedListData = data;
                this.searchedPostData = postData;
                //pop alert msg
                this.showToastAlert('搜索成功！');
            }
            else {
                //pop alert msg
                this.showToastAlert('没有找到符合您要求的结果 TλT~', 'error');
            }
        },
        choiceOne(item) {
            this.selectedComp = item;
            this.activeStep = 2;
            //pop alert msg
            this.showToastAlert('选取成功！');
        },
        submitCode(data) {
            this.soldCompInfo = data.compInfo;
            //pop alert msg
            this.showToastAlert('提货成功！');
            this.activeStep = 3;
        },
        showToastAlert(msg, flag = 'success') {
            if(flag == 'success') this.$Message.success(msg)
            else if(flag == 'warning') this.$Message.warning(msg)
            else if(flag == 'info') this.$Message.info(msg)
            else this.$Message.error(msg)
            // this.toastMassage = msg;
            // this.toastAlert = true;
            // if (this.toastTimer) clearTimeout(this.toastTimer);
            // this.toastTimer = setTimeout(() => { this.toastAlert = false; this.toastMassage = '' }, 3000);
        },

        hideToastAlert() {
            this.toastAlert = false;
            this.toastMassage = '';
            if (this.toastTimer) clearTimeout(this.toastTimer);
        }
    },
    components: {
        cardShow,
        searchedShow,
        takeShow,
        endShow
    }
}
</script>
<style scoped>
.contentbody{
    min-height: 500px;
}
.BodyPart {
    /*background-color:#EEEEEE;*/
    margin: 0px auto;
    /* padding: 10px; */
    /*min-height:1000px;*/
    /* width: 80%; */
    text-align: left;
}

.execute {
    padding: 10px 10px;
    display: inline-block;
    min-height: 300px;
    /* min-width: 900px; */
    width: 100%;
    margin-top: 10px;
    text-align: center;
}
.step-control {
    position: fixed;
    right: 0px;
    top: 50%;
    width: 100px;
    margin: 0px 0px 10px 10px;
    /* float: right; */
}
.backTop {
    position: fixed;
    right: 0px;
    top: 50%;
    width: 100px;
    margin: 0px 0px 10px 10px;
    transform: translateY(50px);
    /* float: right; */
}
.right {
    float: right;
}

.step-do {
    /* margin: 0 auto; */
    /* margin-bottom: 20px; */
    overflow-x: auto;
    /* width: 80%; */
}

</style>

