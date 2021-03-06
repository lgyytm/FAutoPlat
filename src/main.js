import Vue from 'vue';
import App from './App.vue';
import i18n from './i18n.js';
import router from './router/router.js';
import store from './store/store.js';
import axios from 'axios';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-carbon.css';
import config from './common/config';
// import configuration from './common/js/configuration'
// import iview from 'iview';

import 'iview/dist/styles/iview.css';
import Message from 'iview/src/components/message';

import Icon from 'vue2-svg-icon/Icon.vue';
Vue.component('icon', Icon); 

Vue.use(MuseUI);


axios.defaults.baseURL = config.backUrl;
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
Vue.prototype.$Message = Message;
// Vue.use(configuration);

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

