<script>

import loginForm from '../components/loginForm.vue'

export default {
    components: { loginForm },

    mounted() {
        const token = sessionStorage.getItem("token");
        if (token) {
            this.$router.push("/profil");
        }
    }
}

</script>

<template>
<main>

<h1>Välkommen</h1>
<loginForm/> <!--Visar loginForm komponenten-->
  
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
