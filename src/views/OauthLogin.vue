<script>
  export default {
    name: "OauthLogin",


    data() {
      return {
        loading: true, 
      };
    },
    mounted() {
       this.loading = true;
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const encodedPayload = urlParams.get('payload');
  
      if (token && encodedPayload) {
        try {
          const payloadString = decodeURIComponent(encodedPayload);
          const payload = JSON.parse(payloadString);
  
          console.log("Mottagen token:", token);
          console.log("payload:", payload);
  
          // Spara token och användarinformation i sessionStorage
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userId", payload.userId); 
          sessionStorage.setItem("firstName", payload.firstName);     
          sessionStorage.setItem("lastName", payload.lastName);        
          sessionStorage.setItem("email", payload.email);   
          sessionStorage.setItem("imageUrl", payload.imageUrl); 
          sessionStorage.setItem("user", payload.firstName + " " + payload.lastName);
  
          // Omdirigera till profilsidan
          this.$router.push("/profil");
          this.loading = false;
        } catch (error) {
        
          this.$router.push("/login");
          this.loading = false;
        }
      } else {
        this.$router.push("/login");
        this.loading = false;
      }
      this.loading = false;
    }
    
  };
  </script>


<template>
      <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

  </template>
  
  <style scoped>
 .loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);  
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;  
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.5rem;
}
  </style>