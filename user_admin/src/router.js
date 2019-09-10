import Vue from 'vue'
import Router from 'vue-router'
import Users from './views/Users.vue';
import UserCreate from './views/UserCreate';
import UserEdit from './views/UserEdit';
import UserView from './views/UserView';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/users/create',
      name: 'usercreate',
      component: UserCreate
    },
    {
      path: '/users/:id/edit',
      name: 'useredit',
      component: UserEdit
    },
    {
      path: '/users/:id',
      name: 'userview',
      component: UserView
    },
    { 
      path: '/',
      redirect: '/users'
    }
  ]
})
