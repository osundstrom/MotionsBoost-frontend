<script>
import router from '@/router';

// URL
let URL = "http://localhost:3000/challenges";

export default {
    name: "createChallenge",
    props: {
        groupId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            challengeName: "", 
            targetSteps: 0, 
            loading: false
        };
    },  
    async mounted() {
    console.log("create MOUNTED - groupId prop:", this.groupId); 
  
  },

  //------------------------- methods--------------------------------------//
    methods: {
       
      //------------------------- createChallenge--------------------------------------//
        async createChallenge() {
            let errorDiv = document.getElementById("errorDiv");
            errorDiv.textContent = ""; 
            this.loading = true;

            if (!this.challengeName || !this.targetSteps ) {
                errorDiv.textContent = "Namn och stegmål på utmaningen måste anges.";
                this.loading = false;
                return;
            }

            if (this.targetSteps <= 0) {
                errorDiv.textContent = "Stegmål måste vara positivt";
                this.loading = false;
                return;
          }


            try {
              const token = sessionStorage.getItem("token");

              

                const response = await fetch(`${URL}/createChallenge/${this.groupId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        challengeName: this.challengeName,
                        targetSteps: this.targetSteps,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    errorDiv.textContent = "Fel vid skapandet av utmaning";
                    throw new Error(data.message);
                }

                
                alert("Utmaning skapad"); //byta ut?
                
                this.$router.push({ name: "oneGroup", params: { groupId: this.groupId } });


            } catch (error) {
                console.error(error);
                }
                finally {
                    this.loading = false; 
                }
        },
    },
};
</script>




<template>
   <!-- Sektion ett-->
    <div class="SectionOne">
        <h1>Skapa en utmaning</h1>
    </div>

 <!-- Sektion två-->
    <div class="SectionTwo">
    <form @submit.prevent="createChallenge" class="container-md">
      
      <div class="mb-3">
        <label for="InputChallengeName" class="form-label">Namn</label>
        <input
          type="text"
          class="form-control"
          id="InputChallengeName"
          v-model="challengeName"
          placeholder="Ange utmaningens namn"
          required
        />
      </div>

     
      <div class="mb-3">
        <label for="InputTargetSteps" class="form-label">Stegmål</label>
        <input
          type="number"
          class="form-control"
          id="InputTargetSteps"
          v-model.number="targetSteps"
          placeholder="Ange antal steg"
          required
          min="1"
        />
      </div>

      
      <div class="d-flex justify-content-center">
        <button type="submit" class="btn btn-success w-50" :disabled="loading">
           <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
           {{ loading ? ' Skapar...' : 'Skapa utmaning' }}
        </button>
      </div>
    </form>
   
    <div id="errorDiv" class="mt-3"></div>
  </div>
</template>





<style scoped>

/*----------------------- sektion ett ----------------------------------------*/

.SectionOne{
    margin-top: 10vh;
    color: rgb(0, 0, 0);
    text-align: center;
    min-height: 10vh;
    
}
/*----------------------- form ----------------------------------------*/


 form{
        background-color: #4767f7ad;
        padding: 2%;
        border-radius: 10px;
        margin-top: 2vh;
        max-width: 90vw;
        font-size: larger;
        

    }

    @media (min-width: 850px) {
    form { 
        width: 40vw;
    }
}
  /*----------------------- sektion två ----------------------------------------*/

.SectionTwo{
    width: 100%;
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    background-color: #7e9cffab;
    padding: 2%;
    min-height: 71.5vh;
    
}


/*----------------------- error ----------------------------------------*/

  #errorDiv{
    display: flex;
    justify-content: center;
    color: white;
    text-shadow: -1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000, 1px 1px 0 #ff0000;
  }
</style>