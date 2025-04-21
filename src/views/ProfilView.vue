<script>
import navigation from '../components/navigation.vue'


export default {
  components: { navigation },

  data() {
    return {
      name: sessionStorage.getItem("user"),
      totalSteps: 0,
      loading: true,
      showGroupCodeBox: false,
      groupCode: "",
      memberGroups: [],
      ownedGroups: [],
    };
  },


  mounted() {
    this.fetchGroups();
    this.fetchTotalSteps();
  },


  methods: {
    //-------------------------steps fetch--------------------------------------//
    async fetchTotalSteps() {
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
      }
    },

    //-------------------------hämta grupper--------------------------------------//
async fetchGroups() {
      try {
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

        console.log("Member Groups:", this.memberGroups);
console.log("Owned Groups:", this.ownedGroups);
          
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
  <div class="sectionOne">

    <div class="container h-100">
      <div class="row h-100 align-items-center">
        
          <div class="col-12 col-md-3 d-flex justify-content-center align-items-center" style="height: 80%">

            <img src="../assets/backgroundlogin.jpg" class="img-fluid rounded profile-pic" alt="Profil bild">

          </div>

          <div class="col-12 col-md-9 userCont">
              <h5 class="d-flex justify-content-between align-items-center">
                {{ name }}

              </h5>

                  <div class="mt-2 ">
                    <p v-if="loading" >
                      <strong class="spinner-grow text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </strong>
                    </p>
                    <p v-else class="text-nowrap">Du har tagit totalt <strong>{{ totalSteps }}</strong> steg</p>
                  </div>
               
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
          <p v-for="group in memberGroups" :key="group._id">{{ group.groupName }}</p>
        </div>

      </div>
    </div>


<div class="sectionThree">
  <div class="mt-4">
        <div class="p-3 text-center">
          <h5 class="fw-bold">Ägare av grupper</h5>
          <p v-if="ownedGroups.length === 0">Du äger ej några grupper</p>
          <p v-for="group in ownedGroups" :key="group">{{ group.groupName }}</p>
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
  height: 30vh;
  display: flex;
  flex-direction: column;
  width: 100vw;
  justify-content: center;
  align-items: center;  
}

.profile-pic {
  width: auto;  
  height: 80%;  
  object-fit: cover;  
  border-radius: 10px;
}




@media (max-width: 767px) {
  .sectionOne {
    height: 35vh;
    margin-bottom: 1vh;
  }

  .profile-pic {
    height: 75%;  
  }

  .userCont{
    display: flex;
    flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  
  
}

}

@media (min-width: 768px) {
  .sectionOne {
    height: 30vh;  
  }

  .profile-pic {
    height: 80%;  
  }
}



/* ------------------------grupper sektioner ----------------------------------------*/

.sectionTwo
{
  height: 30vh;
  background-color: #7e9cffab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}

.sectionThree{
  height: 30vh;
  background-color: #4767f7ad;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}

/* ------------------------Knapp/gå med grupp ----------------------------------------*/


.toggle-code-btn {
  position: absolute;
  top: 8vh;
  right: 1vw;
  padding: 4px 10px;
  font-size: 1.2rem;
}


.groupcodeInput{
  width: 300px;
}


.group-code-box {
  
  position: absolute;
  top: 10vh;
  right: 5vw;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
  width: 250px;
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