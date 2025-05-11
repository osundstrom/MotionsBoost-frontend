<script>
  export default {
    name: "OauthLogin",
    mounted() {
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
        } catch (error) {
          console.error("Fel vid bearbetning av OAuth callback data:", error);
          // Omdirigera till inloggningssidan med ett felmeddelande
          this.$router.push("/login?error=oauth_processing_failed");
        }
      } else {
        console.error("OAuth callback saknar token eller payload.");
        // Omdirigera till inloggningssidan med ett felmeddelande
        this.$router.push("/login?error=oauth_missing_data");
      }
    }
  };
  </script>


<template>
    <div class="loading-container">
      <p>Försöker logga in</p>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Laddar ......</span>
      </div>
    </div>
  </template>
  
  <style scoped>
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80vh;
    text-align: center;
  }
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
  </style>