import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    "en": {
        //oasindex
        "pagetitle": "Self-service Enquiry System",

        //searchonly
        "querystep1": "Start Query",
        "querystep2": "End Query",
        "laststepbtn": "Previous",
        "continuebtn": "Continue to query",

        //cardshow
        "storetitle": "Card Store",
        "querysetlabel": "Query condition setting",
        "giftcountquerysetlabel": "Quantity setting",
        "inputgiftcountlabel": "Please enter the number",
        "giftminhinttext": "min:0",
        "giftmaxhinttext": "max:99999",
        "cardratequerysetlabel": "Card rare setting",
        "ratelabel": "rare",
        "filterenabled": "Range setting",
        "rateminlabel": "select min count",
        "ratemaxlabel": "select max count",
        "collapselabel": "collapse query condition",
        "expandlabel": "expand query condition",
        "selectedlabel": "Selected Preview",
        "searchbtn": "SEARCH",
        "resetbtn": "RESET",
       // 新增 20170916
        "everycardcountsetlabel": "open same card count settings",
        "carddialogtitle": "same card count setting",
        "carddialogchoicedlabel": "selected card",
        "carddialogmincount": "min count",
        "carddialogmaxcount": "max count",
        "carddialogsubmit": "submit",
        "carddialogcancel": "cancel",
        "clicktoselectcardcountlabel": "SelectCount",
        "choicedcardcountlabel": "count",
				"gifttotallabel": "addition",
				
        //searchedshowonlyid
        "showcardnamelabel": "show cardname",
        "showlowlevellabel": "show low rare card",
        "cardpreviewlabel": "card preview",
        "imgpreviewlabel": "img preview",
        "stonecountlabel": "stone count",
        "highratelabel": "high rare count",
        "copyidbtn": "copy ID"
    },
   
    "jp": {
        //oasindex
        "pagetitle": "セルフサービス システム",

        //searchonly
        "querystep1": "クエリを開始する",
        "querystep2": "クエリの結果",
        "laststepbtn": "戻り",
        "continuebtn": "クエリを続く",

        //cardshow
        "storetitle": "アカウントストア",
        "querysetlabel": "クエリ条件の設定",
        "giftcountquerysetlabel": "数量設定",
        "inputgiftcountlabel": "数字を入力してください",
        "giftminhinttext": "min:0",
        "giftmaxhinttext": "max:99999",
        "cardratequerysetlabel": "レア度設定",
        "ratelabel": "レア度",
        "filterenabled": "範囲設定",
        "rateminlabel": "最小値を選択してください",
        "ratemaxlabel": "最大値を選択してください",
        "collapselabel": "折り畳む検索条件",
        "expandlabel": "展開検索条件",
        "selectedlabel": "選択のプレビュー",
        "searchbtn": "探す",
        "resetbtn": "リセット",
        // 新增 20170916
        "everycardcountsetlabel": "同じカード数量設定を開く",
        "carddialogtitle": "同じカード数量設定",
        "carddialogchoicedlabel": "選択しだカード",
        "carddialogmincount": "最小値",
        "carddialogmaxcount": "最大値",
        "carddialogsubmit": "はい",
        "carddialogcancel": "いええ",
        "clicktoselectcardcountlabel": "数量を選択する",
        "choicedcardcountlabel": "数量",
				"gifttotallabel": "おまけ",
				
        //searchedshowonlyid
        "showcardnamelabel": "表示文字",
        "showlowlevellabel": "低レアのカードを表示する",
        "cardpreviewlabel": "カードの展示",
        "imgpreviewlabel": "画像プレビュー",
        "stonecountlabel": "石の数",
        "highratelabel": "高級カード数",
        "copyidbtn": "コピー ID"
    },
    "kr": {
        //oasindex
        "pagetitle": "조회시스템",

        //searchonly
        "querystep1": "조회하기",
        "querystep2": "조회결과",
        "laststepbtn": "뒤로가기",
        "continuebtn": "계속조회하기",

        //cardshow
        "storetitle": "카드상점",
        "querysetlabel": "조회조건설정",
        "giftcountquerysetlabel": "수량설정",
        "inputgiftcountlabel": "수량을입력하세요",
        "giftminhinttext": "최저0",
        "giftmaxhinttext": "최고99999",
        "cardratequerysetlabel": "희귀도설정",
        "ratelabel": "희귀도",
        "filterenabled": "범위설정",
        "rateminlabel": "최저수량을설정하세요",
        "ratemaxlabel": "최고수량을설정하세요",
        "collapselabel": "검색조건접기",
        "expandlabel": "검색조건펼치기",
        "selectedlabel": "선택한것미리보기",
        "searchbtn": "조회",
        "resetbtn": "초기화",
         // 新增 20170916
        "everycardcountsetlabel": "중복카드 수량 설정",
        "carddialogtitle": "중복카드 조건 설정",
        "carddialogchoicedlabel": "카드 전부 선택하기",
        "carddialogmincount": "최소량",
        "carddialogmaxcount": "최대량",
        "carddialogsubmit": "결정",
        "carddialogcancel": "취소",
        "clicktoselectcardcountlabel": "수량을 눌러서 선택하세요",
        "choicedcardcountlabel": "수량",
				"gifttotallabel": "추가사항",
				
        //searchedshowonlyid
        "showcardnamelabel": "텍스트표시",
        "showlowlevellabel": "희소성이가장낮은카드표시",
        "cardpreviewlabel": "상세설명",
        "imgpreviewlabel": "미리보기",
        "stonecountlabel": "다이아수",
        "highratelabel": "높은희귀도수량",
        "copyidbtn": "아이디복사"
        
    },
    "cn": {
        //oasindex
        "pagetitle": "自助查询系统",

        //searchonly
        "querystep1": "开始查询",
        "querystep2": "查询结果",
        "laststepbtn": "上一步",
        "continuebtn": "继续查询",

        //cardshow
        "storetitle": "卡牌超市",
        "querysetlabel": "查询条件设置",
        "giftcountquerysetlabel": "数量设定",
        "inputgiftcountlabel": "请输入数量区间",
        "giftminhinttext": "最低为0",
        "giftmaxhinttext": "最高为99999",
        "cardratequerysetlabel": "稀有度设定",
        "ratelabel": "稀有度",
        "filterenabled": "设定范围", //20170925
        "rateminlabel": "请选择最低数量",
        "ratemaxlabel": "请选择最高数量",
        "collapselabel": "折叠高级搜索条件",
        "expandlabel": "展开高级搜索条件",
        "selectedlabel": "已选预览",
        "searchbtn": "查询",
        "resetbtn": "重置",
          // 新增 20170916
        "everycardcountsetlabel": "开启同卡数量设置",
        "carddialogtitle": "同卡条件设置",
        "carddialogchoicedlabel": "所选卡牌",
        "carddialogmincount": "最低数量",
        "carddialogmaxcount": "最高数量",
        "carddialogsubmit": "确定",
        "carddialogcancel": "取消",
        "clicktoselectcardcountlabel": "点击选择数量",
        "choicedcardcountlabel": "数量",
        // 新增 20170924
        "gifttotallabel": "附加物",
        "pricesetlabel": "价格设定",
        
        //searchedshowonlyid
        "showcardnamelabel": "显示文字",
        "showlowlevellabel": "显示低稀有度卡牌",
        "cardpreviewlabel": "完整信息",
        "imgpreviewlabel": "图片预览",
        "stonecountlabel": "石头数",
        "highratelabel": "高稀有度总数",
        "copyidbtn": "复制ID"

    },
     "tc": {
        //oasindex
        "pagetitle": "自助查詢系統",

        //searchonly
        "querystep1": "開始查詢",
        "querystep2": "查詢結果",
        "laststepbtn": "上一步",
        "continuebtn": "繼續查詢",

        //cardshow
        "storetitle": "卡牌超市",
        "querysetlabel": "查詢條件設置",
        "giftcountquerysetlabel": "數量設定",
        "inputgiftcountlabel": "請輸入數量區間",
        "giftminhinttext": "最低為0",
        "giftmaxhinttext": "最高為99999",
        "cardratequerysetlabel": "稀有度設定",
        "ratelabel": "稀有度",
        "filterenabled": "範圍設定",
        "rateminlabel": "請選擇最低數量",
        "ratemaxlabel": "請選擇最高數量",
        "collapselabel": "折疊搜索條件",
        "expandlabel": "展開搜索條件",
        "selectedlabel": "已選預覽",
        "searchbtn": "查詢",
        "resetbtn": "重置",
         // 新增 20170916
        "everycardcountsetlabel": "開啟同卡數量設置",
        "carddialogtitle": "同卡條件設置",
        "carddialogchoicedlabel": "所選卡牌",
        "carddialogmincount": "最低數量",
        "carddialogmaxcount": "最高數量",
        "carddialogsubmit": "確定",
        "carddialogcancel": "取消",
        "clicktoselectcardcountlabel": "點擊選擇數量",
        "choicedcardcountlabel": "數量",
        "gifttotallabel": "附加物",
        
        //searchedshowonlyid
        "showcardnamelabel": "顯示文字",
        "showlowlevellabel": "顯示低稀有度卡牌",
        "cardpreviewlabel": "完整信息",
        "imgpreviewlabel": "圖片預覽",
        "stonecountlabel": "石頭數",
        "highratelabel": "高稀有度總數",
        "copyidbtn": "覆制ID"

    }
}
// {
//     "en": {
//         //oasindex
//         "pagetitle": "Self-service Enquiry System",

//         //searchonly
//         "querystep1": "Start Query",
//         "querystep2": "End Query",
//         "laststepbtn": "Previous",
//         "continuebtn": "Continue to query",

//         //cardshow
//         "storetitle": "Card Store",
//         "querysetlabel": "Query condition setting",
//         "giftcountquerysetlabel": "Quantity setting",
//         "inputgiftcountlabel": "Please enter the number",
//         "giftminhinttext": "min:0",
//         "giftmaxhinttext": "max:99999",
//         "cardratequerysetlabel": "Card level setting",
//         "ratelabel": "level",
//         "filterenabled": "enabled",
//         "rateminlabel": "select min count",
//         "ratemaxlabel": "select max count",
//         "collapselabel": "collapse query condition",
//         "expandlabel": "expand query condition",
//         "selectedlabel": "Selected Preview",
//         "searchbtn": "SEARCH",
//         "resetbtn": "RESET",

//         //searchedshowonlyid
//         "showcardnamelabel": "show cardname",
//         "showlowlevellabel": "show low level card",
//         "cardpreviewlabel": "card preview",
//         "imgpreviewlabel": "img preview",
//         "stonecountlabel": "stone count",
//         "highratelabel": "high level count",
//         "copyidbtn": "copy ID"
        

//     },
//     "cn": {
//         //oasindex
//         "pagetitle": "自助查询系统",

//         //searchonly
//         "querystep1": "开始查询",
//         "querystep2": "查询结果",
//         "laststepbtn": "上一步",
//         "continuebtn": "继续查询",

//         //cardshow
//         "storetitle": "卡牌超市",
//         "querysetlabel": "查询条件设置",
//         "giftcountquerysetlabel": "数量设定",
//         "inputgiftcountlabel": "请输入数量区间",
//         "giftminhinttext": "最低为0",
//         "giftmaxhinttext": "最高为99999",
//         "cardratequerysetlabel": "稀有度设定",
//         "ratelabel": "稀有度",
//         "filterenabled": "是否过滤",
//         "rateminlabel": "请选择最低数量",
//         "ratemaxlabel": "请选择最高数量",
//         "collapselabel": "折叠搜索条件",
//         "expandlabel": "展开搜索条件",
//         "selectedlabel": "已选预览",
//         "searchbtn": "查询",
//         "resetbtn": "重置",
        
//         //searchedshowonlyid
//         "showcardnamelabel": "显示文字",
//         "showlowlevellabel": "显示低稀有度卡牌",
//         "cardpreviewlabel": "完整信息",
//         "imgpreviewlabel": "图片预览",
//         "stonecountlabel": "石头数",
//         "highratelabel": "高稀有度总数",
//         "copyidbtn": "复制ID"

//     },
//     "jp": {
//         //oasindex
//         "pagetitle": "自己検索システム",

//         //searchonly
//         "querystep1": "クエリを開始する",
//         "querystep2": "クエリ結果",
//         "laststepbtn": "一歩上",
//         "continuebtn": "クエリを続行する",

//         //cardshow
//         "storetitle": "カードストア",
//         "querysetlabel": "クエリ条件の設定",
//         "giftcountquerysetlabel": "数量設定",
//         "inputgiftcountlabel": "数字を入力してください",
//         "giftminhinttext": "min:0",
//         "giftmaxhinttext": "max:99999",
//         "cardratequerysetlabel": "まれな程度設定",
//         "ratelabel": "まれな程度",
//         "filterenabled": "有効かどうか",
//         "rateminlabel": "最小量を選択してください",
//         "ratemaxlabel": "最大量を選択してください",
//         "collapselabel": "折り畳む検索条件",
//         "expandlabel": "展開検索条件",
//         "selectedlabel": "選択のプレビュー",
//         "searchbtn": "探す",
//         "resetbtn": "リセット",

//         //searchedshowonlyid
//         "showcardnamelabel": "表示文字",
//         "showlowlevellabel": "低レベルのカードを表示する",
//         "cardpreviewlabel": "カードの展示",
//         "imgpreviewlabel": "画像プレビュー",
//         "stonecountlabel": "石の数",
//         "highratelabel": "高級カード数",
//         "copyidbtn": "コピー ID"
        
//     }
// }

const i18n = new VueI18n({
    locale: 'cn',
    messages
})

export default i18n;