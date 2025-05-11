
<script>

//URL
let URL = "http://localhost:3000/auth/login"

export default {
    name: "loginForm",

    
methods: {

    goToRegister() {
      this.$router.push("/register"); 
    },

    
//funktion för inlogg
    async loginFunc() {
        //console.log("test")

        //hämtar email och lösenord rån formulär
        const email = document.getElementById("InputEmail").value;
        const password = document.getElementById("InputPassword").value;
        let errorDiv = document.getElementById("errorDiv"); //ferlmeddelanden
        try {
            //POST förfrågan
            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json",
            },

            //Skickar mail och lösen
            body: JSON.stringify({
                email: email,
                password: password
            })
        }) 

        //om misslyckas
        if (!response.ok) { 
        console.log("error")
        errorDiv.textContent = "Felaktig Epost//lösenord"; 
        throw new Error("Felaktig Epost/lösenord"); 
        
      }
        
      //Väntar svar och till JSON
        const data = await response.json();

        console.log(data);


        //Sparar token i sessionStorage
        sessionStorage.setItem("token", data.jwtToken);
        sessionStorage.setItem("userId", data.payload.userId)
        sessionStorage.setItem("user", data.payload.name)
        sessionStorage.setItem("email", data.payload.email)
        sessionStorage.setItem("imageUrl", data.payload.imageUrl);

        //Om token finns så skcikas man vidare till /profil 
        if (data.payload.userId && data.jwtToken) {
        this.$router.push("/profil");
        }else {
            throw new Error("kunde ej ändra till profil sidan");
        }

        }catch (error) {
            console.error(error);
            errorDiv.textContent = "Felaktig epost/lösenord";   
        }
    },

    loginWithGoogle() {
      
      window.location.href = "http://localhost:3000/auth/google";
    }

}
}
</script>




<template>
    
<div id="fullform" class="conatiner-md" >
    

<form @submit.prevent="loginFunc" class="container-md">
    <!-- Formulär inloggning -->
  <div class="mb-3">
    <label for="InputEmail" class="form-label">Epost</label>
    <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="name@example.com">
  </div>
        <div class="mb-3">
            <label for="InputPassword" class="form-label">Lösenord</label>
            <input type="password" class="form-control" id="InputPassword" placeholder="Lösenord">
        </div>
        
        <div class="d-flex justify-content-between">
        
        <button type="submit" class="btn btn-primary w-45">Logga in</button>

        
        <button type="button" class="btn btn-secondary w-45" @click="goToRegister">Skapa konto</button>
      </div>

      <div class="mt-3 d-flex flex-column align-items-center">
        
        <hr/>

        <button type="button" class="btn btn-danger w-100 mb-2" @click="loginWithGoogle">
          <i class="fab fa-google me-2"></i> Logga in med Google
        </button>
       
      </div>
            
</form>


</div>
<div id="errorDiv"></div>

</template>




<style scoped>
 
    form{
        background-color: rgba(255, 255, 255, 0.75);
        padding: 2%;
        border-radius: 10px;

        @media (min-width: 750px) {
        width: 40vw;
    }
    }
  

  #fullform{
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    
}



  #errorDiv{
    display: flex;
    justify-content: center;
    color: white;
    text-shadow: -1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000, 1px 1px 0 #ff0000;
  }
    

</style>