<template>
    <div class="contentbody">
        <mu-toast v-if="toastAlert" :message="toastMassage" @close="hideToastAlert" />
        <mu-row :gutter="false">
            <mu-col width="100" tablet="10" desktop="10"></mu-col>
            <mu-col width="100" tablet="80" desktop="80">
                <!--内容区域  -->
                <div class="BodyPart">
    
                    <!-- part of intro -->
    
                    <!-- part of execute -->
 
                    <div class="step-do">
                        <mu-stepper :activeStep="activeStep">
                            <mu-step>
                                <mu-step-label>
                                    {{ $t('querystep1') }}
                                </mu-step-label>
                            </mu-step>
                            <mu-step>
                                <mu-step-label>
                                    {{ $t('querystep2') }}
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
                            <mu-raised-button :label="$t('laststepbtn')" primary v-if="activeStep !== 3" :disabled="activeStep === 0 || activeStep === 3" @click.native="handlePrev"></mu-raised-button>
                            <mu-raised-button :label="$t('continuebtn')" secondary v-if="activeStep === 3" :disabled="activeStep !== 3" @click.native="handleReturn"></mu-raised-button>
                        </div>
                        <div class="step-control2">
                            <mu-raised-button :label="$t('laststepbtn')" primary v-if="activeStep !== 3" :disabled="activeStep === 0 || activeStep === 3" @click.native="handlePrev"></mu-raised-button>
                            <mu-raised-button :label="$t('continuebtn')" secondary v-if="activeStep === 3" :disabled="activeStep !== 3" @click.native="handleReturn"></mu-raised-button>
                        </div>
                        <div class="step-control3">
                            <mu-raised-button :label="$t('laststepbtn')" primary v-if="activeStep !== 3" :disabled="activeStep === 0 || activeStep === 3" @click.native="handlePrev"></mu-raised-button>
                            <mu-raised-button :label="$t('continuebtn')" secondary v-if="activeStep === 3" :disabled="activeStep !== 3" @click.native="handleReturn"></mu-raised-button>
                        </div>
                    </div>

                    <mu-paper class="execute" :zDepth="2">
    
                        
                        <!-- <mu-divider /> -->
                        <div v-show="activeStep === 0">
                            <cardShow v-on:handleSearch="searchData" :game="game"></cardShow>
                        </div>
                        <div v-show="activeStep === 1" v-if="init">
                            <searchedShowOnlyId v-on:choiceThis="choiceOne" :listData="searchedListData" :searchedPostData="searchedPostData" :game="game"></searchedShowOnlyId>
                        </div>
                        <!-- <div v-if="activeStep === 2">
                            <takeShow v-on:confirmSubmit="submitCode" :compInfo="selectedComp" :game="game"></takeShow>
                        </div>
                        <div v-if="activeStep === 3">
                            <endShow :compInfo="selectedComp" :takeInfo="soldCompInfo" :game="game"></endShow>
                        </div> -->

                        <!-- <mu-row gutter>
                                <mu-col desktop="15" tablet="15" width="100">
                                    
                                </mu-col>
                                <mu-col desktop="85" tablet="85" width="100">
                                    
                                </mu-col>
                            </mu-row> -->
                    </mu-paper>
    
                </div>
            </mu-col>
            <mu-col width="100" tablet="10" desktop="10"></mu-col>
        </mu-row>
    </div>
</template>
<script>
import tools from '../common/tools.vue'
import searchedShowOnlyId from '../common/searchedShowOnlyId.vue'
// import takeShow from '../common/takeShow.vue'
// import endShow from '../common/endShow.vue'
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

    },
    computed:{
        locale(){
            return this.$store.state.locale
        }
    },
    methods: {
        
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
                    this.activeStep--;
                    this.init = false;
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
                if(this.locale === 'cn'){
                    this.showToastAlert('搜索成功！');
                } else {
                    this.showToastAlert('Query Finished');
                }
            }
            else {
                //pop alert msg
                if(this.locale === 'cn'){
                    this.showToastAlert('没有找到符合您要求的结果 TλT~');
                } else {
                    this.showToastAlert('Sorry, No Result Found');
                }
                
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
        showToastAlert(msg) {
            this.toastMassage = msg;
            this.toastAlert = true;
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => { this.toastAlert = false; this.toastMassage = '' }, 3000);
        },

        hideToastAlert() {
            this.toastAlert = false;
            this.toastMassage = '';
            if (this.toastTimer) clearTimeout(this.toastTimer);
        }
    },
    components: {
        cardShow,
        searchedShowOnlyId,
        // takeShow,
        // endShow
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
    right: 10px;
    top: 0%;
    width: 100px;
    margin: 0px 0px 10px 10px;
    /* float: right; */
}
.step-control2 {
    position: fixed;
    right: 10px;
    top: 45%;
    width: 100px;
    margin: 0px 0px 10px 10px;
    /* float: right; */
}
.step-control3 {
    position: fixed;
    right: 10px;
    top: 90%;
    width: 100px;
    margin: 0px 0px 10px 10px;
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

