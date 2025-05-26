<script>
import navigation from '../components/navigation.vue'




export default {
  props: ["groupId"],
  components: { navigation },
  //------------------------- data--------------------------------------//
  data() {
    return {
      groupDetails: null,
      loading: true,
      groupMembers: [],
      ActiveUserId: sessionStorage.getItem("userId"),
      groupChallenges: [],


    };
  },


  //------------------------- Mounted--------------------------------------//
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
      } finally {

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
      } finally {
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

          console.log("utmaningar", this.groupChallenges);

        } else {

          console.error("Kunde ej hämta gruppens utmaningar");
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }


    },

    //------------------------- Popup radera --------------------------------------//

    popupDeleteGroup() {
      if (window.confirm(`Är du säker på att du vill radera din grupp: "${this.groupDetails?.groupName}"?`)) {
        this.deleteGroup();
      } else {
        console.log("Radering avbuten");
      }
    },

    //------------------------- Delete Group--------------------------------------//
    async deleteGroup() {
      if (this.groupDetails?.groupRole !== "owner") {
        console.error("Endast ägaren kan radera gruppen.");
        alert("Endast ägaren kan radera grupp");
        return;
      }

      this.loading = true;
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Ingen token");
          alert("Ej autensierad, logga in på nytt");
          this.loading = false;
          return;
        }

        const response = await fetch(`http://localhost:3000/groups/${this.groupId}/delete`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert(`Gruppen "${this.groupDetails?.groupName}" har raderats.`);
          this.$router.push("/profil");
        }

      } catch (error) {
        console.error(error);
        alert("kunde ej radera gruppen, försök igen senare.");
      } finally {
        this.loading = false;
      }
    },

    //------------------------- korrekt bildlänk--------------------------------------//
    corrImgUrl(imageUrl) {
      if (!imageUrl || imageUrl === "null" || imageUrl === "") {
        return null;
      }
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
      }
      if (imageUrl.startsWith("/uploads")) {
        return `http://localhost:3000${imageUrl}`
      }
      console.warn("vad är detta för länk??", imageUrl);
      return null;

    }



  },
  //-------------------------computed --------------------------------------//

  computed: {
    // Sorterar gruppmedlemmar efter totala steg
    sortMemberSteps() { 
      return this.groupMembers.sort((a, b) => {
        return b.totalSteps - a.totalSteps;
      });
    },
    // Sorterar utmaningar efter datum
    sortDateChallenges() { 
      return this.groupChallenges.slice().sort((b, a) => {
        return new Date(a.challengeCreatedAt) - new Date(b.challengeCreatedAt);
      });
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






      <!-- Sektion ett-->
      <div class="sectionOne">




        <div class="d-flex justify-content-center align-items-center mb-3">
          <h1 class="mb-0 me-3">{{ groupDetails?.groupName }}</h1>

          <button v-if="groupDetails?.groupRole === 'owner'" @click="popupDeleteGroup" class="btn btn-danger btn-sm"
            title="Radera grupp" style="margin-top: 0.5vw;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>



        <div>
          <h5>{{ groupDetails?.info }}</h5>
          <p>Gruppen har tagit <b>{{ groupDetails.totalSteps }}</b> steg totalt</p>
          <div class="codeJoin" v-if="groupDetails?.groupRole === 'owner'">
            <h5>Kod: {{ groupId }}</h5>
            <p>Ge koden till alla du vill bjuda in</p>

          </div>

        </div>



      </div>
      <!-- Sektion utmainingar-->
      <div class="challengesSection">
        <!-- Om ägare-->
        <div class="ifOwner">
          <h2>Utmaningar</h2>
          <!-- Knapp för skapa utmaning-->
          <div class="float-right" style="margin-left: 1vw; " v-if="groupDetails?.groupRole === 'owner'">
            <router-link :to="{ name: 'createChallenge', params: { groupId: this.groupId } }" class="btn btn-primary">
              +
            </router-link>

          </div>
        </div>

        <div v-if="groupChallenges.length === 0">
          <p>Inga utmaningar har skapats ännu.</p>
        </div>
        <!-- Lista över utamningar-->
        <ul v-else class="challengeList">
          <li v-for="(challenge, index) in sortDateChallenges" :key="index">
            <h4>
              <router-link :to="{ name: 'oneChallenge', params: { challengeId: challenge.challengeId } }"
                class="challengeLink" @statusUpdated="fetchGroupChallenges">

                <i class="fa-solid"></i>{{ challenge.challengeName }}

              </router-link>
            </h4>
            <p>
              <span v-if="challenge.challengeStatus === false"> Avklarad <i class="fa-solid fa-square-check green-icon">
                </i></span>
              <span v-if="challenge.challengeStatus === true"> Skapad: {{ new
                Date(challenge.challengeCreatedAt).toLocaleDateString() }}</span>
            </p>
          </li>
        </ul>
      </div>




      <!-- Sektion två-->
      <div class="sectionTwo">
        <h2>Medlemmar i gruppen</h2>
        <div v-if="groupMembers.length === 0">
          <p>Inga medlemmar i gruppen ännu.</p>
        </div>
        <div v-else>
          <ul class="memberList">
            <li v-for="(member, index) in sortMemberSteps" :key="index">
              <div class="memberInfo">
                <img v-if=corrImgUrl(member.imageUrl) :src="corrImgUrl(member.imageUrl)" alt="Profil bild"
                  class="profileImage" />
                <img v-else src="../assets/standardProfile.jpg" alt="Standard profil bild" />
                <div>
                  <div>
                    <strong>
                      {{ member.firstName }} {{ member.lastName }}
                      <span v-if="member.groupRole === 'owner'" class="badge bg-warning"><i
                          class="fa-solid fa-crown"></i></span>
                      <span v-if="member.userId === ActiveUserId" class="badge bg-info"><i class="fa-solid fa-user"></i>
                      </span>
                    </strong>
                  </div>
                  <p>{{ member.totalSteps }} steg</p>
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

.sectionOne {
  min-height: 14vh;
  text-align: center;
  width: 100%;

}



/* ----------------------- challenge  ----------------------------------------*/


.challengesSection {
  min-height: 34vh;
  background-color: #4c72f1ab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  padding-bottom: 1vh;

}

.green-icon {
  color: green;
}

.red-icon {
  color: red;
}

.yellow-icon {
  color: yellow;
}

.challengeList {
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: center;

}

.challengeList li {
  background-color: #ffffff91;
  margin-top: 1vh;
  text-wrap: nowrap;
  padding-right: 2vw;
  padding-left: 2vw;
  border-radius: 10px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);

}


.challengeLink {
  text-decoration: none;
  color: inherit;
  display: block;
}

.challengeList li:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.challengeList h4 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  color: #333;
}

.challengeList p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}

.ifOwner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  width: 100%;

  .btn {
    margin: 0;
    margin-right: 2vh;
    margin-top: 1vh;
  }

  h2 {
    margin: 0;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}







/* ------------------------ sektion två ----------------------------------------*/

.sectionTwo {
  min-height: 34vh;
  background-color: #7e9cffab;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);

  li {
    list-style-type: none;
    display: flex;
    align-items: center;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 15px;
    object-fit: cover;
    margin-bottom: 2vh;
    border: 1px solid #ccc;
  }

}



.memberInfo {
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