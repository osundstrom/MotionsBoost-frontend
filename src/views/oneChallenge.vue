<script>
import navigation from '../components/navigation.vue'


export default {
    props: ['groupId', "challengeId"],
  components: { navigation },

  data() {
    return {

        challengeDetails: null,
        loading: true,
        leaderboard: [],
        currentTotalSteps: 0,
        ActiveUserId: sessionStorage.getItem("userId"),
        stepsToAdd: null,
        errorMessage: null,
        
      
    };
  },


  async mounted() {
    console.log("GruppId:", this.groupId);
    console.log("ChallengeId:", this.challengeId);

    await this.fetchChallengeInfo();;
    await this.fetchChallengeLeaderboard();
    await this.checkChallengeStatus(); 
  },

 

  methods: {
    //------------------------- fetch challnge info--------------------------------------//
    async fetchChallengeInfo() {
      
      this.loading = true; 
      this.errorMessage = null;

      try {
        console.log("challengeId", this.challengeId)

        const token = sessionStorage.getItem("token");

        console.log("Token:", token);
        const response = await fetch(`http://localhost:3000/challenges/${this.challengeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },

        });

        if (response.ok) {
          const data = await response.json();
          this.challengeDetails = data;

          

        } else {
          console.error("kunde ej hämta utmaninigens information");
        }
      } catch (error) {
        console.error(error);
      }
      
        this.loading = false;
    },
//------------------------- fetch leaderboard--------------------------------------//
    async fetchChallengeLeaderboard() {
      
      this.errorMessage = null;
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/challengeUsers/challenge/${this.challengeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.leaderboard = data;

          this.currentTotalSteps = this.leaderboard.reduce((sum, entry) => {
            return sum + entry.stepsTaken;
          }, 0);
          this.checkChallengeStatus(); //kollar om utmaningen är klar
        } else {
          console.error("kunde ej hämta tävlandens steg");
        }
      } catch (error) {
        console.error(error);
      }finally {
        this.loading = false; 
      }
    },

//------------------------- add steps--------------------------------------//
    async addSteps() {
      

      this.loading = true; 
      this.errorMessage = null; 

      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/challengeusers/${this.challengeId}/addsteps`, { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ steps: this.stepsToAdd }), 
        });

        if (response.ok) {
         
          this.stepsToAdd = null;
          await this.fetchChallengeLeaderboard(); 
          

        } else {
          
          
          this.errorMessage = "Kunde inte lägga till steg";
          console.error(this.errorMessage);
          
        }
      } catch (error) {
        
        console.error(error);
        this.errorMessage = error.message;
        
      } finally {
        this.loading = false; 
      }
    },

    //------------------------- kolla avklarad--------------------------------------//
async checkChallengeStatus() {
    if (this.currentTotalSteps >= this.challengeDetails.targetSteps) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/challenges/${this.challengeId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ status: false }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("uppdaterat status");
          console.log(data);
          this.challengeDetails.challengeStatus = false; 
          this.$emit("statusUpdated")
        } else {
          console.error("Kunde inte uppdatera  status");
        }
      } catch (error) {
        console.error(error);
      }
    }
  },

},




//------------------------- computed--------------------------------------//

    computed: {
      targetStepsDisplay() {
      return this.challengeDetails?.targetSteps;

    },

    currentStepsDisplay() {
      return this.currentTotalSteps;
    },

    progressPercentage() {
      const current = this.currentTotalSteps;
      const target = this.challengeDetails.targetSteps;
      if (target === 0) return 0; 
      return Math.min(Math.round((current / target) * 100), 100);
    }

   

  },


   

}






</script>


<template>
  <!-- Navigation -->
   
  <navigation />
  <div class="forContent">
    <div v-if="loading" class="loading-overlay">
    </div>
   
    <div v-else-if="!challengeDetails" class="text-center mt-5">
        <h2>Utmaning kunde inte laddas</h2>
        <p>Försök igen senare.</p>
    </div>
    <div v-else>
      <!-- Sektion ett-->
      <div class="sectionOne">
        <h1>{{ challengeDetails.challengeName }}</h1>
        <div>
          
          <!-- Progress Bar -->
          <div class="progress-container">
            <h5>Steg: {{ currentStepsDisplay }} / {{ targetStepsDisplay }}</h5>
            <div class="progress">
      <div
        class="progress-bar"
        :class="{ orange: progressPercentage < 100, green: progressPercentage === 100 }"
        role="progressbar"
        :style="{ width: progressPercentage + '%' }"
        :aria-valuenow="progressPercentage"
        aria-valuemin="0"
        aria-valuemax="100"
  >
    {{ progressPercentage }}%
  </div>
</div>
          </div>
        </div>

        <div v-if="challengeDetails.challengeStatus === false" class="completion-message">
        <h3 class="text-success">Utmaningen är avklarad!</h3>
      </div>

        <!-- Lägg till steg -->
        <div class="add-steps-container">
          <div class="add-steps-form">
            <input
              type="number"
              min="1"
              class="form-control"
              placeholder="Ange antal steg att lägga till"
              v-model.number="stepsToAdd" 
            />
            <button class="btn btn-success mt-2" @click="addSteps">Lägg till steg</button>
          </div>
        </div>
      </div>

       <!-- Sektion två-->
      <div class="sectionTwo">
        <h2>Antal steg</h2>
        
        <div v-if="leaderboard.length === 0">
          <p>Inga steg registrerade för denna utmaning ännu.</p>
        </div>
        
        <div v-else>
          <ul class="member-list">
            
            <li v-for="(entry, index) in leaderboard" :key="entry.userId || index">
              <div class="member-info">
               
                <img
            v-if="entry.user.imageUrl && entry.user.imageUrl !== 'null' && entry.user.imageUrl !== ''"
            :src="`http://localhost:3000${entry.user.imageUrl}`"
            alt="Profile Image"
            class="profile-image"
            />
          <img
          v-else
          src="../assets/standardProfile.jpg"
          alt="Default Profile Image"
          class="profile-image"
            />
                <div class="member-details">
                  <div class="member-header">
                    <strong>
                     
                      {{ entry.user.firstName }} {{ entry.user.lastName }}
                      
                      <span v-if="entry.userId === ActiveUserId" class="badge bg-info"><i class="fa-solid fa-user"></i></span>
                    </strong>
                  </div>
                 
                  <p class="member-steps">{{ entry.stepsTaken }} steg</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>


.forContent {
  margin-top: 10vh;
}

/* ----------------------- add steps ----------------------------------------*/
.add-steps-container {
  margin: 20px auto;
  text-align: center;
  width: 70%;
  max-width: 400px;
  margin-top: 5vh;
}

.add-steps-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-steps-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-steps-form button {
  width: 100%;
}


/* ----------------------- sektion ett ----------------------------------------*/

.sectionOne{
 min-height: 40vh;
 text-align: center;
}

.progress-container {
  margin: 20px auto; 
  text-align: center;
  max-width: 80%; 
  
}

.progress {
  height: 20px;
  background-color: #e0e0e0; 
  border-radius: 10px; 
  overflow: hidden; 
}

.progress-bar {
  height: 100%; 
  transition: width 0.5s ease-in-out;
  &.orange {
    background-color: orange; 
  }
  &.green{
    background-color: #4caf50; 
  }
  
}






/* ------------------------ sektion två ----------------------------------------*/

.sectionTwo
{
  min-height: 42vh;
  background-color: #7e9cffab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  li{
    list-style-type: none;
    display: flex;
    align-items: center;
  }
  img{
    width: 40px;
  height: 40px;
  border-radius: 50%; 
  margin-right: 15px; 
  object-fit: cover; 
  margin-bottom: 2vh;
  border: 1px solid #ccc;
}

  }



.member-info {
  display: flex;
  align-items: center;
  width: 100%;
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



</style>