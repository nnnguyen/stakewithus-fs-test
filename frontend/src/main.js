// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import LoadScript from 'vue-plugin-load-script'
import MaterialDashboard from './material-dashboard'
import VueResource from 'vue-resource';
import Vuelidate from 'vuelidate';

Vue.config.productionTip = false;
Vue.use(LoadScript);
Vue.use(MaterialDashboard);
Vue.use(VueResource);
Vue.use(Vuelidate);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
