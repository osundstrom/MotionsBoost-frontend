<script>

import createChallenge from '@/components/createChallenge.vue';
import navigation from '../components/navigation.vue'

export default {
    name: 'createChallengeView',
    props: ['groupId'],
    components: { createChallenge, navigation },

    mounted() {
        
        console.log( "mounted createChallenge groupId:", this.groupId);
        
    }
}

</script>

<template>
    <navigation/> <!--Visar navigation komponenten-->

    <createChallenge :groupId="groupId"/> <!--Visar createGroup komponenten-->

</template>




<style scoped>

</style>
