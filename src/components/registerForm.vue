<script>

//URL
let URL = "http://localhost:3000/auth/register"

export default {
  name: "registerForm",


  methods: {
    // gå till login 
    goToLogin() {
      this.$router.push("/");
    },



    //funktion för att skapa nytt konto
    async registerFunc() {
      const firstName = document.getElementById("InputFirstName").value;
      const lastName = document.getElementById("InputLastName").value;
      const email = document.getElementById("InputEmail").value;
      const password = document.getElementById("InputPassword").value;
      const file = document.getElementById("InputImage").files[0];
      const gdprCheckbox = document.getElementById("gdprCheckbox").checked;
      let errorDiv = document.getElementById("errorDiv");
      errorDiv.textContent = "";

      //kontrollera gdpr ruta
      if (!gdprCheckbox) { 
        errorDiv.textContent = "Du måste godkänna GDPR och användarvillkoren för att registrera dig.";
        return;
      }

      try {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("file", file);

        const response = await fetch(URL, {
          method: "POST",
          body: formData,
        })
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorDiv.textContent = errorData.message;
          }
          return;
        }
        const data = await response.json();
        this.$router.push("/");
      } catch (error) {
        console.error(error);
        errorDiv.textContent = error.message;
      }
    }
  }
}
</script>




<template>

  <div id="fullform" class="conatiner-md">


    <form @submit.prevent="registerFunc" class="container-md">
      <!-- Formulär skapa konto -->


      <div class="mb-3">
        <label for="inputFirstName" class="form-label">Förnamn</label>
        <input type="firstname" class="form-control" id="InputFirstName" aria-describedby="firstnameHelp"
          placeholder="Förnamn">

      </div>

      <div class="mb-3">
        <label for="inputLastName" class="form-label">Efternamn</label>
        <input type="lastname" class="form-control" id="InputLastName" aria-describedby="lastnameHelp"
          placeholder="Efternamn">

      </div>

      <div class="mb-3">
        <label for="InputEmail" class="form-label">Epost</label>
        <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp"
          placeholder="name@example.com">
      </div>

      <div class="mb-3">
        <label for="InputImage" class="form-label">Profilbild</label>
        <input type="file" class="form-control" id="InputImage" accept="image/*">
      </div>


      <div class="mb-3">
        <label for="InputPassword" class="form-label">Lösenord</label>
        <input type="password" class="form-control" id="InputPassword" placeholder="Lösenord">
      </div>

      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="gdprCheckbox">
        <label style="text-shadow: none; color: black;" class="form-check-label" for="gdprCheckbox">Jag godkänner
          hantering av mina uppgifter i enlighet med <a
            href="https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/">GDPR</a></label>
      </div>

      <div class="d-flex justify-content-between">

        <button type="submit" class="btn btn-primary w-45">Skapa konto</button>


        <button type="button" class="btn btn-secondary w-45" @click="goToLogin">Har du redan ett konto?</button>
      </div>

    </form>


  </div>
  <div id="errorDiv"></div>

</template>




<style scoped>
form {
  background-color: rgba(255, 255, 255, 0.75);
  padding: 2%;
  border-radius: 10px;

  @media (min-width: 750px) {
    width: 40vw;
  }
}

.form-check {
  a {
    color: blue;
    text-decoration: underline;
  }

  a:hover {
    color: #000000;
    text-shadow: -1px -1px 0 #ffffff00, 1px -1px 0 #ffffff00, -1px 1px 0 #ffffff00, 1px 1px #ffffff00;
    font-weight: bolder;
  }

  input {
    margin-right: 1%;
    cursor: pointer;
  }


}


#fullform {
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;

}

button:hover {
  text-decoration: underline;
}



#errorDiv {
  font-size: larger;
  display: flex;
  justify-content: center;
  color: rgb(0, 0, 0);
  text-shadow: -1px -1px 0 #f80707, 1px -1px 0 #f80707, -1px 1px 0 #f80707, 1px 1px 0 #f80707;
  font-weight: bolder;

}
</style>