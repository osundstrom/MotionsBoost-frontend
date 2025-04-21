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
    };
  },


  mounted() {

    this.fetchTotalSteps();
  },


  methods: {
    //-------------------------steps fetch--------------------------------------//
    async fetchTotalSteps() {
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
      finally {
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

    <div class="container mt-4">
      <div class="row align-items-center">
        
          <div class="col-3 text-center">

            <img src="../assets/backgroundlogin.jpg" class="img-fluid rounded profile-pic" alt="Profil bild">

          </div>

          <div class="col-9 col-md-5">
              <h5 class="card-title d-flex justify-content-between align-items-center">
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
          <h6 class="fw-bold">Medlem i grupper</h6>
          <p v-for="group in memberGroups" :key="group">{{ group }}</p>
        </div>

      </div>
    </div>


<div class="sectionThree">
  <div class="mt-4">
        <div class="text-white p-3 text-center">
          <h6 class="fw-bold">Ägare av grupper</h6>
          <p v-for="group in ownedGroups" :key="group">{{ group }}</p>
        </div>
      </div>
</div>


</template>


<style scoped>
.forContent {
  margin-top: 10vh;
}

.sectionOne{
  height: 30vh;
  display: flex;
  width: 100vw;
}

.sectionTwo
{
  height: 30vh;
  background-color: #7e9cffab;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
}

.sectionThree{
  height: 30vh;
  background-color: #4767f7ad;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
}


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
  right: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
  width: 250px;
}




</style>