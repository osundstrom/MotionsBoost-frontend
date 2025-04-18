<script>
import navigation from '../components/navigation.vue'


export default {
  components: { navigation },

  data() {
    return {
      name: sessionStorage.getItem("user"),
      email: sessionStorage.getItem("email"),
      totalSteps: 0,
      loading: true
    };
  },


  mounted() {

    this.fetchTotalSteps();
  },


  methods: {

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
    }
  }
}


</script>


<template>

  <!-- Navigation -->
  <navigation />

  <div class="forContent">

    <div class="container">
      <div class="card shadow-sm" style="max-width: 80vw; margin: 0 auto;">
        <div class="row g-0">
          <div class="col-md-4 p-3 text-center">
            <img src="../assets/backgroundlogin.jpg" class="img-thumbnail" alt="Profile Picture">
            <button class="btn btn-sm btn-outline-primary">
              <i class="fas fa-edit"></i> Ändra
            </button>

          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title d-flex justify-content-between align-items-center">
                {{ name }}

              </h5>
              <p class="card-text text-muted">
                {{ email }}
              </p>

              <div class="border-top pt-2">
                <div class="row text-center">

                  <div class="col ">
                    <h6>Totalt antal steg du har tagit</h6>
                    <strong v-if="loading">
                      <i class="fas fa-spinner fa-spin"></i>
                    </strong>
                    <strong v-else>{{ totalSteps }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<style scoped>
.forContent {
  margin-top: 10vh;
}
</style>