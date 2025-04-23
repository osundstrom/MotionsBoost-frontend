<script>
import navigation from '../components/navigation.vue'


export default {
    props: ['groupId', "challengeId"],
  components: { navigation },

  data() {
    return {
        groupDetails: null,
        loading: true,
        groupMembers: [],
        ActiveUserId: sessionStorage.getItem("userId"),
        showStepCodeBox: false,
        challangeSteps: 10000, //måste bytas med inmatade sedfan
      
    };
  },


  async mounted() {
    console.log("GruppId:", this.groupId);
    await this.fetchGroupInfo();
    await this.fetchGroupMembers();
  },

 

  methods: {
    //------------------------- fetch gruppinfo--------------------------------------//
    async fetchGroupInfo() {
      
      this.loading = true; 

      try {
        console.log("gruppid", this.groupId)
        const token = sessionStorage.getItem("token");

        console.log("Token:", token);
        const response = await fetch(`http://localhost:3000/groups/${this.groupId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },

        });

        if (response.ok) {
          const data = await response.json();
          this.groupDetails = data;

          console.log("Gruppinformation:", this.groupDetails);

        } else {
          console.error("kunde ej hämta gruppens information");
        }
      } catch (error) {
        console.error(error);
      }
      
        this.loading = false;
    },
//------------------------- fetch gruppanvändare--------------------------------------//
    async fetchGroupMembers() {
      this.loading = true; 

      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/groups/${this.groupId}/members`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.groupMembers = data;
          console.log("Gruppmedlemmar:", this.groupMembers);
        } else {
          console.error("kunde ej hämta gruppens medlemmar");
        }
      } catch (error) {
        console.error(error);
      }finally {
        this.loading = false; 
      }
    },

},


    computed: {
    progressPercentage() {
      if (!this.groupDetails || !this.groupDetails.totalSteps) return 0;
      return Math.min((this.groupDetails.totalSteps / this.challangeSteps) * 100, 100)
    },
  },


}





</script>


<template>

  <!-- Navigation -->
  <navigation />
  <div class="forContent">

  <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>


   

     

  <!-- Sektion profil-->
  <div class="sectionOne">
    <h1>{{ groupDetails.groupName }}</h1>
    
      <div>
        <h5>{{ groupDetails?.info }}</h5>

        <div class="codeJoin" v-if="groupDetails?.groupRole === 'owner'">
        <h5>Kod: {{ groupId }}</h5>
        <p>Ge koden till alla du vill bjuda in</p>
        
        </div>
         
        <div class="progress-container">
              <h5>Steg: {{ groupDetails?.totalSteps }} / {{ challangeSteps }}</h5>
              <div class="progress">
                <div
                  class="progress-bar"
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

      <div class="add-steps-container">
  
  <div class="add-steps-form">
    <input
      type="number"
      class="form-control"
      placeholder="Ange antal steg"
      v-model="stepsToAdd"
    />
    <button class="btn btn-success mt-2" @click="addSteps">Lägg till steg</button>
  </div>
</div>
  
</div>

   
<div class="sectionTwo">
  <h2>Medlemmar i gruppen</h2>
  <div v-if="groupMembers.length === 0">
    <p>Inga medlemmar i gruppen ännu.</p>
  </div>
  <div v-else>
    <ul class="member-list">
      <li v-for="(member, index) in groupMembers" :key="index">
        <div class="member-header">
        
        <strong>
            {{ member.firstName }} {{ member.lastName }} 
            <span v-if="member.groupRole === 'owner'" class="badge bg-warning"><i class="fa-solid fa-crown"></i></span>
            <span v-if="member.userId === ActiveUserId" class="badge bg-info"><i class="fa-solid fa-user"></i> </span>
        </strong>
        </div>
        <p class="member-steps">{{ member.totalSteps }} steg</p>
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
 min-height: 30vh;
 text-align: center;
}

.progress-container {
  margin: 20px auto; 
  text-align: center;
  width: 80%; 
  
}

.progress {
  height: 20px;
  background-color: #e0e0e0; 
  border-radius: 10px; 
  overflow: hidden; 
}

.progress-bar {
  height: 100%; 
  background-color: #4caf50; 
  transition: width 0.5s ease-in-out;
}



/* ------------------------ sektion två ----------------------------------------*/

.sectionTwo
{
  min-height: 52vh;
  background-color: #7e9cffab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  li{
    list-style-type: none;
  }
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