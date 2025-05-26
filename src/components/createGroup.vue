<script>
// URL
let URL = "http://localhost:3000/groups/createGroup";

export default {
    name: "createGroup",
    data() {
        return {
            groupName: "",
            info: "",
        };
    },


    methods: {

        //------------------------- createGroup--------------------------------------//
        async createGroup() {
            let errorDiv = document.getElementById("errorDiv");
            const token = sessionStorage.getItem("token");
            errorDiv.textContent = "";

            if (!this.groupName) {
                errorDiv.textContent = "Gruppnamn måste anges.";
                return;
            }

            try {


                const response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        groupName: this.groupName,
                        info: this.info,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Fel vid skapande av grupp:", data.error);
                    errorDiv.textContent = data.message;
                    throw new Error(data.message || "Kunde ej skapa gruppen");
                }



                console.log("Grupp skapad:", data);
                alert("Grupp skapad");


                if (data.group && data.group._id) {
                    await this.$router.push({ name: 'oneGroup', params: { groupId: data.group._id } });
                } else {
                    await this.$router.push("/profil");
                }

            } catch (error) {
                console.error(error);

                if (errorDiv) {
                    errorDiv.textContent = "Fel vid skapande av grupp: ";
                }
            }
        },
    },
};
</script>




<template>
    <div class="SectionOne">
        <h1>Skapa en grupp</h1>
    </div>

    <div class="SectionTwo">

        <form @submit.prevent="createGroup" class="container-md">
            <!-- Formulär skapa grupp -->
            <div class="mb-3">
                <label for="InputGroupName" class="form-label">Gruppnamn</label>
                <input type="text" class="form-control" id="InputGroupName" v-model="groupName"
                    placeholder="Ange gruppens namn" required />
            </div>

            <div class="mb-3">
                <label for="InputGroupInfo" class="form-label">Beskrivning</label>
                <textarea class="form-control" id="InputGroupInfo" v-model="info" rows="3"
                    placeholder="Beskrivning av gruppen"></textarea>
            </div>

            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-success w-50">Skapa grupp</button>
            </div>
        </form>
        <div id="errorDiv" class="mt-3"></div>
    </div>
</template>




<style scoped>
.SectionOne {
    margin-top: 10vh;
    text-align: center;
    min-height: 10vh;

}


form {
    background-color: #4767f7ad;
    padding: 2%;
    border-radius: 10px;
    margin-top: 2vh;
    max-width: 90vw;
    font-size: larger;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);


}

@media (min-width: 850px) {
    form {
        width: 40vw;
    }
}

.SectionTwo {
    width: 100%;
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    background-color: #7e9cffab;
    padding: 2%;
    min-height: 71.5vh;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);

}



#errorDiv {
    display: flex;
    justify-content: center;
    color: white;
    text-shadow: -1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000, 1px 1px 0 #ff0000;
}
</style>