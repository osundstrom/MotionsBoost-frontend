
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

    methods: {
      //funktion utlogg
      logout() {
        sessionStorage.removeItem("token"); //tar bort token.
        sessionStorage.removeItem("userId"); //tar bort user.
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
          <li><RouterLink class="dropdown-item" to="/profil">Min sida</RouterLink></li>
          <li><RouterLink class="dropdown-item" to="/creategroup">Skapa grupp</RouterLink></li>
          <li><a class="dropdown-item" href="#">Inställningar</a></li>
          <li><a class="dropdown-item" href="#">Information</a></li>
        </ul>
      </div>

      <!-- Centered logo -->
      <img src="../assets/logomb.png" alt="Logo" class="navbar-logo">

      <!-- Avatar with logout -->
      <div class="dropdown">
        <a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="../assets/backgroundlogin.jpg" alt="Avatar" class="rounded-circle" width="40" height="40">
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <a class="dropdown-item dropdown-logout" @click="logout">Logga ut</a>
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
    
  }

  .dropdown-item:hover{
      text-decoration: underline;
    }
  
  .dropdown-logout:hover {
    background-color: #f55959;   
  }

  .dropdown i {
    color: black;
  }
  
  .dropdown-menu-list{
    background-color: #436efdc9;
  }
  /*--------------------------navbar color---------------------------------*/
  
  .custom-navbar{
      background-color: #436efdc9;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  
  /*--------------------------navbar logo---------------------------------*/
  
  .navbar-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
  }


 
  
  </style>