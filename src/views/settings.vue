<script>
import navigation from '../components/navigation.vue'


export default {
  components: { navigation },

  //------------------------------------Data-----------------------------------------//
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

  //------------------------------------Computed-----------------------------------------//
  computed: {
    corrImgUrl() {
      if (!this.imageUrl || this.imageUrl === "null" || this.imageUrl === "") {
        return null;
      }
      if (this.imageUrl.startsWith("http://") || this.imageUrl.startsWith("https://")) {
        return this.imageUrl;
      }
      if (this.imageUrl.startsWith("/uploads")) {
        return `http://localhost:3000${this.imageUrl}`
      }
      console.warn("vad är detta för länk??", this.imageUrl);
      return null;

    }
  },

  //------------------------------------Mounted-----------------------------------------//
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
    },


    //------------------------------------Radera konto-----------------------------------------//
    popupDelete() {
      if (window.confirm("Är du säker att du vill radera kontot?")) {
        this.deleteAccount();
      } else {
        console.log("Avruten radering");
      }
    },


    async deleteAccount() {
      this.loading = true;
      let errorDivUser = document.getElementById("errorDivUser");
      if (errorDivUser) errorDivUser.textContent = "";

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Ingen token hittades. Kan inte radera konto.");
          if (errorDivUser) errorDivUser.textContent = "Autentiseringstoken saknas. Logga in igen.";
          this.loading = false;
          return;
        }

        const response = await fetch("http://localhost:3000/auth/deleteUser", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Konto raderat!");

          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("email");
          sessionStorage.removeItem("imageUrl");

          this.$router.push("/");
        } else {
          alert(`Kunde inte radera kontot: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Fel vid radering av konto:", error);
        if (errorDivUser) errorDivUser.textContent = "Fel vid radering av konto.";
      } finally {
        this.loading = false;
      }
    }
  },
}

</script>
<!--------------------------------- TEMPLATE -------------------------------------- -->
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
    <div class="sectionOne container d-flex align-items-center justify-content-center">

      <div class="row w-100">
        <h1 class="h1Class">Inställningar</h1>



        <!-- Profil bild -->
        <div class="imagePic d-flex justify-content-center align-items-center">


          <!-- om laddat upp profilbild -->
          <img v-if="corrImgUrl" :src=corrImgUrl class="img-fluid rounded profilePic" alt="Profil bild">
          <!-- om ej laddat upp profilbild -->
          <img v-else src="../assets/standardProfile.jpg" class="img-fluid rounded profilePic"
            alt="Standard profil bild">

          <label class="btn btn-warning" for="fileInput">
            Ändra
          </label>
          <input id="fileInput" type="file" @change="uploadImage" accept="image/*" hidden>

          <div id="errorDivImage" role="alert"></div>
        </div>



      </div>



      <div class="row w-100">

        <!-- Uppgifter ändra -->
        <div class="contentChange container col-12 col-md-4 d-flex flex-column align-items-left">



          <h3>Ändra uppgifter</h3>

          <!-- Förnamn -->
          <div>
            <label><strong>Förnamn:</strong></label>
            <input type="text" v-model="firstName" class="form-control mb-2" />
          </div>

          <!-- Efternamn -->
          <div>
            <label><strong>Efternamn:</strong></label>
            <input type="text" v-model="lastName" class="form-control mb-2" />
          </div>

          <!-- E-post -->
          <div>
            <label><strong>E-post:</strong></label>
            <input type="email" v-model="email" class="form-control mb-2" />
          </div>

          <div id="errorDivUser" role="alert"></div>
          <div id="successDivUser" role="alert"></div>

          <!-- Spara Button -->
          <button class="btn btn-success mt-3" @click="editUser">Spara</button>

          <!-- Mörkt läge switch-->
          <div class=" container d-flex justify-content-center">
            <div class="form-check form-switch dark-mode-switch ">
              <span class="switch-label-light">Ljust</span>

              <input class="form-check-input" type="checkbox" id="darkModeSwitch" v-model="isDarkMode"
                @change="applyDarkMode" />
              <span class="switch-label-dark">Mörkt</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- radera konto-->
    <div class="sectionThree" @click="popupDelete">
      Radera konto
    </div>
  </div>

</template>

<!--------------------------------- STYLE -------------------------------------- -->

<style scoped>

.forContent {
  margin-top: 10vh;
}

.h1Class {
  text-align: center;
  margin-bottom: 3vh;


}

/* ------------------------Profil sektion ----------------------------------------*/

.sectionOne {
  min-height: 71.5vh;
  flex-direction: column;
  margin-bottom: 5vh;
}

.profilePic {
  min-width: 20vw;
  object-fit: cover;
  max-height: 30vh;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.imagePic {
  flex-direction: column;
}

.btn {
  margin-top: -5vh;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

}

.btn input[type="file"] {
  display: none;
}

.contentChange {
  flex-direction: column;
  margin-top: 5vh;
}




/* ------------------------sektion radera ----------------------------------------*/



.sectionThree {
  min-height: 10vh;
  background-color: #f74747ad;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  font-weight: 900;
  font-size: 150%;
}

.sectionThree:hover {
  background-color: #f74747;
  cursor: pointer;
  color: white;
  font-weight: bolder;
  text-decoration: underline;
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
  z-index: 871;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.5rem;
}


#errorDivImage {
  display: flex;
  justify-content: center;
  color: rgb(255, 0, 0);
  padding: 2%;
  font-size: 1.2rem;
  font-weight: 600;
}


#errorDivUser {
  display: flex;
  justify-content: center;
  color: rgb(255, 0, 0);
  padding: 2%;
  font-size: 1.2rem;
  font-weight: 600;
}

#successDivUser {
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
  gap: 1rem;
  margin-top: 3vh;
  margin-right: 1.5vw;

}

.switch-label-dark {
  font-size: 1rem;
  font-weight: bold;


}

.switch-label-light {
  font-size: 1rem;
  font-weight: bold;


}


.form-switch .form-check-input {
  width: 4em;
  height: 1.75em;
  cursor: pointer;
  margin-left: 0;
  margin-right: 0;

}
</style>