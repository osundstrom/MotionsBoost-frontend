import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/registerView.vue';
import OauthLogin from '@/views/OauthLogin.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../views/ProfilView.vue'),
      beforeEnter: (to, from, next) => {
        const token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {
          next("/");
        }
      },
    },

    {
      path: '/creategroup',
      name: 'creategroup',
      component: () => import('../views/createGroupView.vue'),
      beforeEnter: (to, from, next) => {

        const token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {

          next("/");
        }
      },
    },

    {
      path: '/createchallenge/:groupId',
      name: 'createChallenge',
      component: () => import('../views/createChallengeView.vue'),
      props: true,
      beforeEnter: (to, from, next) => {

        const token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {

          next("/");
        }
      },
    },

    {
      path: '/group/:groupId',
      name: 'oneGroup',
      component: () => import('../views/oneGroup.vue'),
      props: true,
      beforeEnter: (to, from, next) => {

        const token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {

          next("/");
        }
      },
    },

    {
      path: '/challenge/:challengeId',
      name: 'oneChallenge',
      component: () => import('../views/oneChallenge.vue'),
      props: true,
      beforeEnter: (to, from, next) => {
        const token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {

          next("/");
        }
      },
    },

    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/settings.vue'),
      props: true,
      beforeEnter: (to, from, next) => {

        const token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {

          next("/");
        }
      },
    },

    {
      path: '/information',
      name: 'information',
      component: () => import('../views/information.vue'),
      beforeEnter: (to, from, next) => {
        const token = sessionStorage.getItem("token");
        if (token) {
          next();
        } else {
          next("/");
        }
      },
    },

    {
      path: '/oauth/login',
      name: 'oauthLogin',
      component: OauthLogin
    },





  ],
})

export default router
