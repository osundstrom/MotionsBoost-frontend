<script>
import navigation from '../components/navigation.vue'


export default {
  components: { navigation },

  data() {
    return {
      imageUrl: sessionStorage.getItem("imageUrl"),
      name: sessionStorage.getItem("user"),
      totalSteps: 0,
      loading: true,
      showGroupCodeBox: false,
      groupCode: "",
      memberGroups: [],
      ownedGroups: [],
    };
  },

  computed: {
    corrImgUrl() {
      if (!this.imageUrl || this.imageUrl === 'null' || this.imageUrl === '') {
        return null; 
      }
      if (this.imageUrl.startsWith("http://") || this.imageUrl.startsWith("https://")) {
        return this.imageUrl; 
      } 
      if(this.imageUrl.startsWith("/uploads")) {
        return `http://localhost:3000${this.imageUrl}`
      }
      console.warn("vad är detta för länk??", this.imageUrl);
      return null;
    
    }
  },


  async mounted() {
    await this.fetchGroups();
    await this.fetchTotalSteps();
  },

 

  methods: {
    //-------------------------steps fetch--------------------------------------//
    async fetchTotalSteps() {

      //test för se vad som får.
      const imageUrl = sessionStorage.getItem("imageUrl");
        console.log(imageUrl)
      
      this.loading = true; 
      try {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");
        console.log("Token:", token);
        const response = await fetch("http://localhost:3000/users/usersteps", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },

        });

        if (response.ok) {
          const data = await response.json();
          this.totalSteps = data;
        } else {
          console.error("kunde ej hämta steg för användaren");
        }
      } catch (error) {
        console.error(error);
      }finally {
        this.loading = false; 
      }
      
    },

//-------------------------join group--------------------------------------//

async joinGroup() {
      try {
        this.loading = true;
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");
        
        const response = await fetch("http://localhost:3000/groups/joinGroup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            groupId: this.groupCode,
            userId: userId
          }),
        });

        if (response.ok) {
          alert("Du har gått med i gruppen");
          this.showGroupCodeBox = false;
          this.groupCode = ""; //rensa
        } else {
          alert("Kan ej gå med i gruppen");
          console.error(data.message);
        }
        
      } catch (error) {
        console.error(error);
      }finally {
        this.fetchGroups(); //uppdatera grupper
        this.loading = false; 
      }
      
     },
      

    //-------------------------hämta grupper--------------------------------------//
async fetchGroups() {
      try {
        this.loading = true;
        const token = sessionStorage.getItem("token");   
        const userId = sessionStorage.getItem("userId");

        const response = await fetch("http://localhost:3000/groups/myGroups", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },

        });

        if (response.ok) {
          const data = await response.json();
          
          
          this.memberGroups = data.groups
        .filter(item => item.groupRole === "member")
        .map(item => item.group);

        this.ownedGroups = data.groups
        .filter(item => item.groupRole === "owner")
        .map(item => item.group);

        console.log("Owned Groups:", this.ownedGroups);
        console.log("member Groups:", this.memberGroups);
          
          
        } else {
          console.error("kunde ej hämta grupper för användaren");
        }
      } catch (error) {
        console.error(error);
      }
      finally {
          this.loading = false;
        }
        
    },

  }
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
 <!--knapp grupp -->
<button class="toggle-code-btn btn btn-success" @click="showGroupCodeBox = !showGroupCodeBox">
  <span v-if="!showGroupCodeBox">+</span>
  <span class="btn-success" v-else>&times;</span>
</button>

<!-- grupp kod -->
<div v-if="showGroupCodeBox" class="group-code-box">
  <label for="code" class="form-label">Ange gruppens kod</label>
  <input  type="text" class="form-control mb-2" placeholder="Ange kod" v-model="groupCode"/>
  <button class="btn btn-success btn-sm" @click="joinGroup">Gå med</button>
</div>

  <!-- Sektion profil-->
  <div class="sectionOne container d-flex align-items-center justify-content-center">
  <div class="row w-100">

  <!-- Profil bild -->
  <div class="col-12 col-md-4 d-flex justify-content-center align-items-center">

 <!-- om laddat upp profilbild -->
  <img
    v-if="corrImgUrl"
    :src=corrImgUrl
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
</div>

    <!-- total steg och namn -->
    <div class="col-12 col-md-4 d-flex flex-column justify-content-center text-center">
      <h2>{{ name }}</h2>
      <div class="mt-2">
        <p v-if="loading">
          <strong class="spinner-grow text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </strong>
        </p>
        <p v-else class="text-nowrap fs-5">Du har tagit totalt <strong>{{ totalSteps }}</strong> steg</p>
      </div>
    </div>
  </div>
</div>

    <!-- Grupper -->
<div class="sectionTwo">
  <div class="mt-4">
        <div class=" p-3 mb-2 text-center">
          <h5 class="fw-bold">Medlem i grupper</h5>
          <p v-if="memberGroups.length === 0">Gå med i några grupper</p>
          <router-link
        v-for="group in memberGroups"
        :key="group._id"
        :to="{ name: 'oneGroup', params: { groupId: group._id } }"
        class="group-link"
      >
        {{ group.groupName }}
      </router-link>
        </div>

      </div>
    </div>

 <!-- Sektion tre-->
<div class="sectionThree">
  <div class="mt-4">
        <div class="p-3 text-center">
          <h5 class="fw-bold">Ägare av grupper</h5>
          <p v-if="ownedGroups.length === 0">Du äger ej några grupper</p>
          <router-link
        v-for="group in ownedGroups"
        :key="group._id"
        :to="{ name: 'oneGroup', params: { groupId: group._id } }"
        class="group-link"
      >
        {{ group.groupName }}
      </router-link>
        </div>
      </div>
</div>
</div>

</template>


<style scoped>
.forContent {
  margin-top: 10vh;
}

/* ------------------------Profil sektion ----------------------------------------*/

.sectionOne{
 min-height: 400px;
 text-align: left;
}

.profile-pic {
  min-width: 20%;
  object-fit: cover;  
  max-height: 30vh;
}





@media (max-width: 767px) {
  .sectionOne {
    min-height: 35vh;
    height: fit-content;
    margin-bottom: 1vh;
  }


  
}







/* ------------------------grupper sektioner ----------------------------------------*/

.sectionTwo
{
  min-height: 30vh;
  background-color: #7e9cffab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  
}
.group-link{
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: black;
  background-color: #ffffff91;
  margin-top: 1vh;
  text-wrap: nowrap;
  padding: 2%;
  border-radius: 10px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  font-weight: 500;

}

.group-link:hover {
  background-color: #f0f0f0;
  cursor: pointer;
  text-decoration: underline;
}

.sectionThree{
  min-height: 30vh;
  background-color: #4767f7ad;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

/* ------------------------Knapp/gå med grupp ----------------------------------------*/


.toggle-code-btn {
  position: absolute;
  top: 80px;
  right: 22px;
  padding: 4px 10px;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}


.groupcodeInput{
  width: 100%;
}


.group-code-box {
  color: black;
  position: absolute;
  top: 90px;
  right: 65px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  width: 250px;
  box-sizing: border-box;
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