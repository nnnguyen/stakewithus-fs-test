import Vue from 'vue';
import Router from 'vue-router';

import DefaultLayout from '@/pages/layouts/DefaultLayout';
import Home from '@/pages/Home';
import Validators from '@/pages/Validators';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      redirect: "/home",
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/validators',
          name: 'Validators',
          component: Validators
        }
      ]
    }
  ]
})
