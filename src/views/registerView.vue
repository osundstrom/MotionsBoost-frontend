<script>
import RegisterForm from '@/components/registerForm.vue';
import loginForm from '../components/loginForm.vue'

export default {
    components: { RegisterForm}
  }

</script>

<template>
<main>

<h1>Skapa ditt konto</h1>
<RegisterForm/> <!--Visar registerForm komponenten-->
  
</main>
</template>




<style scoped>
main{
  background-image: url("/src/assets/backgroundlogin.jpg");
  background-size: cover; 
  background-position: center; 
  min-height: 92vh;
  color: white;
  overflow-y: hidden;
}
h1{
  text-align: center;
  padding-top: 10vh;
  font-weight: 900;
  color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

</style>
