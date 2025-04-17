
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
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar app color="#436efdc9" dark>

      <!-- Hamburger -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            class="ml-0"
          >
            <v-icon><i class="fa-solid fa-bars"></i></v-icon> 
          </v-btn>
        </template>
<!-------------------------------------------------------------------------------------------------- -->
        <!-- Dropdown Menu-->
        <v-list list color="#7E9CFF" dark>
          <v-list-item>
            <v-list-item-title><RouterLink to="/profil">Min sida</RouterLink></v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title><RouterLink to="/create">Skapa grupp</RouterLink></v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Inställningar</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Information</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
<!-------------------------------------------------------------------------------------------------->

      <!-- Logo -->
      <div class="logoDiv">
        <img src="@/assets/logomb.png" alt="Logo" />
      </div>
<!-------------------------------------------------------------------------------------------------->

      <!-- Avatar -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            class="avatar-btn"
          >
            <v-avatar size="40">
              <img src="@/assets/backgroundlogin.jpg" alt="Avatar">
            </v-avatar>
          </v-btn>
        </template>
<!-------------------------------------------------------------------------------------------------->

        <!-- Dropdown logout-->
        <v-list>
          <v-list-item @click="logout" class="btn btn-danger">
            <v-list-item-title >Logga ut</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
<!-------------------------------------------------------------------------------------------------->
    </v-app-bar>

  </v-app>
</template>

<style scoped>

.logoDiv {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 20%

}


.v-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

</style>