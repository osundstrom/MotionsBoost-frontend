import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
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


  ],
})

export default router
