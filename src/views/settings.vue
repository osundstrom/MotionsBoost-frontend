<script>
import navigation from '../components/navigation.vue'


export default {
  components: { navigation },

  data() {
    const name = sessionStorage.getItem("user");
    const [firstName, lastName] = name.split(" ");

    return {
      imageUrl: sessionStorage.getItem("imageUrl"),
      email: sessionStorage.getItem("email"),
      firstName: firstName,
      lastName: lastName,
      loading: false,
      isDarkMode: localStorage.getItem("darkMode") === "true",
      
    };
  },


  async mounted() {
   this.applyDarkMode();
    
  },

 

  methods: {

//------------------------------------Dark mode-----------------------------------------//


applyDarkMode() {
   

      
      if (this.isDarkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "true");
        document.documentElement.setAttribute('data-bs-theme', "dark");
        
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
        document.documentElement.setAttribute('data-bs-theme', "light");
        
      }
    },

    //------------------------------------Ändra bild-----------------------------------------//

  async uploadImage(event) {
    this.loading = true;
    let errorDivImage = document.getElementById("errorDivImage"); 

    const file = event.target.files[0];
    if (!file) {
        console.error("Ingen fil vald");
        return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = sessionStorage.getItem("token");
      console.log("Token i settings:", token);

      const response = await fetch("http://localhost:3000/auth/updateuserimage", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        this.imageUrl = data.imageUrl;
        
        sessionStorage.setItem("imageUrl", data.imageUrl); 
        this.loading = false;

      } else {
        errorDivImage.textContent = "Fel vid uppladdning av bild";
        this.loading = false;
      }
    } catch (error) {
        console.error(error);
        errorDivImage.textContent = "Fel vid uppladdning av bild";
        this.loading = false;
    }
  },

//------------------------------------Ändra uppgifter-----------------------------------------//
async editUser() {
    this.loading = true;
    let errorDivUser = document.getElementById("errorDivUser"); 
    let successDivUser = document.getElementById("successDivUser");

  if (!this.firstName || !this.lastName || !this.email) {
    errorDivUser.textContent = "Alla fält måste fyllas i.";
    return;
  }


  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:3000/auth/updateUser", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      }),
    });

    if (response.ok) {
      sessionStorage.setItem("user", `${this.firstName} ${this.lastName}`);
      sessionStorage.setItem("email", this.email);
      successDivUser.textContent = "uppdaterad"; 
      this.loading = false;
    } else {
        errorDivUser.textContent = "Kunde ej uppdatera uppgifterna.";
        this.loading = false;
    }
  } catch (error) {
    console.error("Fel vid uppdatering av uppgifter:", error);
    errorDivUser.textContent = "Kund ej uppdatera uppgifterna.";
    this.loading = false;
  }
}

},

}

</script>


<template>

  <!-- Navigation -->
  <navigation />
  <div class="forContent"></div>
  
  
  <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
<div v-else>


  <!-- Sektion profil-->
  <div class="sectionOne container d-flex align-items-start justify-content-center">

  <div class="row w-100">
    <h1 class="h1Class">Inställningar</h1>

    

  <!-- Profil bild -->
  <div class="imagePic col-12 col-md-4 d-flex justify-content-center align-items-center">
    

 <!-- om laddat upp profilbild -->
  <img
    v-if="imageUrl && imageUrl !== 'null' && imageUrl !== ''"
    :src="`http://localhost:3000${imageUrl}`"
    class="img-fluid rounded profile-pic"
    alt="Profil bild"
  >
  <!-- om ej laddat upp profilbild -->
  <img
    v-else
    src="../assets/standardProfile.jpg"
    class="img-fluid rounded profile-pic"
    alt="Standard profil bild"
  >
  
  <label class="btn btn-warning" for="fileInput">
    Ändra
</label>
    <input id="fileInput" type="file" @change="uploadImage" accept="image/*" hidden>
    
    <div id="errorDivImage" role="alert"></div>
</div>



  </div>
  


  <div class="row w-100">

<!-- Uppgifter ändra -->
<div class="contentChange col-12 col-md-4 d-flex flex-column align-items-left">

    <div class="form-check form-switch dark-mode-switch">
  <span class="switch-label-light">Ljust</span>

  <input
    class="form-check-input"
    type="checkbox"
    id="darkModeSwitch"
    v-model="isDarkMode"
    @change="applyDarkMode"
    />
  <span class="switch-label-dark">Mörkt</span>
</div>

<h3>Ändra uppgifter</h3>

  <!-- Förnamn -->
  <div>
    <label><strong>Förnamn:</strong></label>
    <input
      type="text"
      v-model="firstName"
      class="form-control mb-2"
    />
  </div>

  <!-- Efternamn -->
  <div>
    <label><strong>Efternamn:</strong></label>
    <input
      type="text"
      v-model="lastName"
      class="form-control mb-2"
    />
  </div>

  <!-- E-post -->
  <div>
    <label><strong>E-post:</strong></label>
    <input
      type="email"
      v-model="email"
      class="form-control mb-2"
    />
  </div>
  
  <div id="errorDivUser" role="alert"></div>
  <div id="successDivUser" role="alert"></div>

  <!-- Spara Button -->
  <button class="btn btn-success mt-3" @click="editUser">Spara</button>
</div>


  
</div>



</div>


 <!-- radera konto-->
<div class="sectionThree">
  
</div>


</div>

</template>


<style scoped>
.forContent {
  margin-top: 10vh;
}

.h1Class { 
    
    margin-bottom: 3vh;
    
 
}

/* ------------------------Profil sektion ----------------------------------------*/

.sectionOne{
 min-height: 71.5vh;
 flex-direction: column;
 margin-bottom: 5vh;
}

.profile-pic {
  min-width: 20vw;
  object-fit: cover; 
  max-height: 30vh;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.imagePic{
    flex-direction: column;
}

.btn{
    margin-top: -5vh;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
   
}

.btn input[type="file"] {
  display: none;
}

.contentChange{
    flex-direction: column;
    margin-top: 5vh;
}







/* ------------------------sektion radera ----------------------------------------*/



.sectionThree{
  min-height: 10vh;
  background-color: #f74747ad;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}



/* ------------------------Spinner ----------------------------------------*/


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


#errorDivImage{
    display: flex;
    justify-content: center;
    color: rgb(255, 0, 0);
    padding: 2%;
    font-size: 1.2rem;
    font-weight: 600;
  }

  
#errorDivUser{
    display: flex;
    justify-content: center;
    color: rgb(255, 0, 0);
    padding: 2%;
    font-size: 1.2rem;
    font-weight: 600;
  }

  #successDivUser{
    display: flex;
    justify-content: center;
    color: rgb(25, 0, 255);
    padding: 2%;
    font-size: 1.2rem;
    font-weight: 600;
  }

/*------------------------Mörkt läge ----------------------------------------*/

.dark-mode-switch {
  display: flex;
  align-items: center;
  margin-bottom: 1vh;
  position: relative;
  z-index: 0;
}

.switch-label-dark {
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  z-index: 1;
  margin-left: 1vw;
}

.switch-label-light {
  font-size: 1rem;
  font-weight: bold;
  position: relative;
  z-index: 1;
  margin-right: 3.5vw;
}




.form-switch .form-check-input {
  width: 4em; 
  height: 1.75em; 
  cursor: pointer;
}





</style>