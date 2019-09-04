import Vue from 'vue';
import Router from 'vue-router';

import DefaultLayout from '@/pages/layouts/DefaultLayout';
import Home from '@/pages/Home';
import Validators from '@/pages/Validators';
import ValidatorList from '@/components/ValidatorList';
import EditValidator from '@/components/EditValidator';

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
          component: Validators,
          redirect: "/list",
          children: [
            {
              path: '/list',
              name: 'Validator List',
              component: ValidatorList
            },
            {
              path: '/edit-validator/:address',
              name: 'Edit Validator',
              component: EditValidator
            }
          ]
        }
      ]
    }
  ]
})
