
<script>

//importerar routerlink
import { RouterLink } from 'vue-router';
import logo from '@/assets/logomb.png';
console.log(logo);
  export default {
    name: "navigation",
    components: {
      RouterLink 
    },

    data() {
        return {
          imageUrl: sessionStorage.getItem("imageUrl"),
          
        };
      },

      computed: {
    corrImgUrl() {
      if (!this.imageUrl || this.imageUrl === 'null' || this.imageUrl === '') {
        return null; 
      }
      if (this.imageUrl.startsWith("http://") || this.imageUrl.startsWith("https://")) {
        return this.imageUrl; 
      } 
      if(this.imageUrl.startsWith("/uploads")) {
        return `http://localhost:3000${this.imageUrl}`
      }
      console.error("vad är detta för länk??", this.imageUrl);
      return null;
    
    }
  },

    methods: {
      
      //funktion utlogg
      logout() {
        sessionStorage.removeItem("token"); //tar bort token.
        sessionStorage.removeItem("userId"); //tar bort user.
        sessionStorage.removeItem("user"); //tar bort user.
        sessionStorage.removeItem("email"); //tar bort email. 
        sessionStorage.removeItem("imageUrl"); //tar bort imageUrl.
        console.log("utloggad")
        this.$router.push("/");
      }
    },
  

  }

</script>

<template>
  <nav class="navbar custom-navbar fixed-top">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      
      <!-- Burger dropdown menu -->
      <div class="dropdown">
        <button class="btn text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa-solid fa-bars fs-2"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-list">
          <li><RouterLink class="dropdown-item oneItem" to="/profil"><i class="fa-solid fa-user"></i> Min sida</RouterLink></li>
          <li><RouterLink class="dropdown-item oneItem" to="/creategroup"><i class="fa-solid fa-square-plus"></i> Skapa grupp</RouterLink></li>
          <li><RouterLink class="dropdown-item oneItem" to="/settings"><i class="fa-solid fa-gear"></i> Inställningar</RouterLink></li>
          <li><RouterLink class="dropdown-item oneItem" to="/information"><i class="fa-solid fa-circle-info"></i> Information</RouterLink></li>
        </ul>
      </div>

      <!-- logo -->
      <img src="../assets/logomb.png" alt="Logo bild" class="navbar-logo">

     <!-- Avatar med logout -->
<div class="dropdown">
  <a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    <!-- om laddat upp profilbild -->
    <img
      v-if="corrImgUrl"
      :src=corrImgUrl
      alt="Avatar"
      class="rounded-circle"
      width="40"
      height="40"
    >
    <!-- om ej laddat upp profilbild -->
    <img
      v-else
      src="../assets/standardProfile.jpg"
      alt="Standard Avatar"
      class="rounded-circle"
      width="40"
      height="40"
    >
  </a>
  <ul class="dropdown-menu dropdown-menu-end">
    <li>
      <a class="dropdown-item dropdown-logout" @click="logout"> <i class="fa-solid fa-right-from-bracket"></i> Logga ut </a>
    </li>
  </ul>
</div>

    </div>
  </nav>
</template>
  
  
  
  <style scoped>
  
  
  /*-------------------------- dropdown---------------------------------*/
  
  
    .dropdown-menu-end  {
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    overflow: hidden;
  }
  
  .dropdown-logout {
    padding: 0.5rem 1rem;
    background-color: rgba(245, 102, 102, 0.726);
    text-align: center;
    z-index: 1;
    font-weight: bolder;    
  }

  .dropdown-item:hover{
      color: white;
      i{
        color: white;
      }
    }
  
  .dropdown-logout:hover {
    background-color: #f53939;   
  }

  .dropdown i {
    color: black;
  }
  
  .dropdown-menu-list{
    background-color: #7e9cffc4;
    
   
  }
  .oneItem {
    font-weight: bolder;
  }

  .oneItem:hover{
    background-color: #95abf500;
   
  }
  /*--------------------------navbar color---------------------------------*/
  
  .custom-navbar{
      background-color: #436EFD;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      height: 7vh;
  }
  
  /*--------------------------navbar logo---------------------------------*/
  
  .navbar-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
  }


 
  
  </style>