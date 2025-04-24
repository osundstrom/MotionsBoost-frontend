<script>

import createGroup from '@/components/createGroup.vue';
import navigation from '../components/navigation.vue'

export default {
    components: { createGroup, navigation },

    mounted() {
        const token = sessionStorage.getItem("token");
        if (!token) {
            this.$router.push("/");
        }
    }
}

</script>

<template>
    <navigation/> <!--Visar navigation komponenten-->

    <createGroup/> <!--Visar createGroup komponenten-->

</template>




<style scoped>

</style>
