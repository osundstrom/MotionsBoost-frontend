<script>
import navigation from '../components/navigation.vue'
 



export default {
    props: ['groupId'],
  components: { navigation },

  data() {
    return {
        groupDetails: null,
        loading: true,
        groupMembers: [],
        ActiveUserId: sessionStorage.getItem("userId"),
       groupChallenges: [],
        
      
    };
  },


  async mounted() {
    console.log("onegroup MOUNTED - groupId:", this.groupId);
    console.log("GruppId:", this.groupId);
    await this.fetchGroupInfo();
    await this.fetchGroupMembers();
    await this.fetchGroupChallenges();
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
      }finally {
      
        this.loading = false;
      }
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


 //------------------------- Fetch Group Challenges --------------------------------------//
 async fetchGroupChallenges() {
    this.loading = true;
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/groups/${this.groupId}/challenges`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const challenges = await response.json();
        this.groupChallenges = challenges;

        console.log("utamingar", this.groupChallenges);

      } else {

        console.error("Kunde ej hämta gruppens utmaningar");
      }
    } catch (error) {
      console.error( error);
    }finally {
      this.loading = false; 
    }
  

}
}
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
    <h1>{{ groupDetails?.groupName }}</h1>
    
      <div>
        <h5>{{ groupDetails?.info }}</h5>

        <div class="codeJoin" v-if="groupDetails?.groupRole === 'owner'">
        <h5>Kod: {{ groupId }}</h5>
        <p>Ge koden till alla du vill bjuda in</p>
        
        </div>
    </div>

    

</div>

        <div class="challengesSection">
      <h2>Utmaningar</h2>
      <div class="mt-4" v-if="groupDetails?.groupRole === 'owner'">
        <router-link
        :to="{ name: 'createChallenge', params: { groupId: this.groupId } }"
        class="btn btn-primary"
        >
        Skapa ny utmaning
        </router-link>
        
  </div>
      

      <div v-if="groupChallenges.length === 0">
        <p>Inga utmaningar har skapats ännu.</p>
      </div>
      
      <ul v-else class="challenge-list">
  <li v-for="(challenge, index) in groupChallenges" :key="index">
    <h4>
      <router-link
        :to="{ name: 'oneChallenge', params: { challengeId: challenge.challengeId }}"
        class="challenge-link"
      >
      <i class="fa-solid fa-link"></i>{{ challenge.challengeName }}
        <span v-if="challenge.challengeStatus === true"> - <i class="fa-solid fa-square-check green-icon"></i></span>
        <span v-if="challenge.challengeStatus === false"> - <i class="fa-solid fa-square-xmark red-icon"></i></span>
      </router-link>
    </h4>
    <p>Skapad: {{ new Date(challenge.challengeCreatedAt).toLocaleDateString() }}</p>
  </li>
</ul>
    </div>
        
      
      

   
<div class="sectionTwo">
  <h2>Medlemmar i gruppen</h2>
  <div v-if="groupMembers.length === 0">
    <p>Inga medlemmar i gruppen ännu.</p>
  </div>
  <div v-else>
    <ul class="member-list">
      <li v-for="(member, index) in groupMembers" :key="index">
        <div class="member-info">
          <img 
            :src="`http://localhost:3000${member.imageUrl}` || '../assets/logomb.png'" 
            alt="Profile Image" 
            class="profile-image"
          />
          <div class="member-details">
            <div class="member-header">
              <strong>
                {{ member.firstName }} {{ member.lastName }} 
                <span v-if="member.groupRole === 'owner'" class="badge bg-warning"><i class="fa-solid fa-crown"></i></span>
                <span v-if="member.userId === ActiveUserId" class="badge bg-info"><i class="fa-solid fa-user"></i> </span>
              </strong>
            </div>
            <p class="member-steps">{{ member.totalSteps }} steg</p>
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


/* ----------------------- sektion ett ----------------------------------------*/

.sectionOne{
 min-height: 30vh;
 text-align: center;

}

/* ----------------------- challenge  ----------------------------------------*/


.challengesSection {
    min-height: 30vh;
  background-color: #4c72f1ab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;

}

.green-icon {
  color: green;
}

.red-icon{
    color: red;
}

.challenge-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: center;
  
}


.challenge-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.challenge-link:hover {
  background-color: #f0f0f0;
  border-radius: 5px;
}

.challenge-list h4 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  color: #333;
}

.challenge-list p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}







/* ------------------------ sektion två ----------------------------------------*/

.sectionTwo
{
  min-height: 30vh;
  background-color: #7e9cffab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
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