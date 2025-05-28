<script>
import navigation from '../components/navigation.vue'

export default {
    components: { navigation },
}

</script>

<template>
    <navigation /> <!--Visar navigation komponenten-->

    <div class="SectionOne">
        <h1>Information</h1>
    </div>

    <div class="SectionTwo">
        <div class="container">

        <h2>Användning</h2>

        <h5>Skapa grupp</h5>
        <p>
            En grupp skapas genom att via menyn klicka på skapa grupp,
            där får man fylla i efter önskemål gruppens namn och beskrivning
        </p>
        <h5>Gå med i grupp</h5>
        <p>
            För att gå med i en grupp behövs grupppens kod. Denna kod visas för 
            gruppensägare under gruppens sida, koden anges sedan av den som
            vill gå med i fältet under "+" knappen under profil sidan.
        </p>

        <h5>Ändra uppgifter och radera konto</h5>
        <p>
            Samtliga utav dina uppgifter går att redigera under 
            inställnignsfliken i menyn. Inne på inställnignar 
            kan du även radera ditt konto, om detta görs raderas alla
            dina uppgifter vilket inte kan ångras!.

        </p>

        <h5>Mörkt läge</h5>
        <p>
            Det går enkelt att byta mellan mörkt och ljust läge 
            genom att klicka på switch knappen under inställnignar.
        </p>

    </div>
    </div>

    <div class="sectionThree">
        <div id="marginID" class="container">
            <h2>Om MotionsBoost</h2>
            <p>
                MotionsBoost är en plattform skapad för att främja fysisk aktivitet och gemenskap, detta genom att få alla att vara med på deras villkor. 
                Den skapades som slutprojekt för Webbutvecklingsprogrammet hos Mittuniversitetet.
            </p>
            <p>
                <strong>Oskar Sundström</strong>, <strong><a class="maillink" href="mailto:ossu2300@student.miun.se">Ossu2300@student.miun.se</a></strong>
            </p>
       
        </div>
    </div>

</template>







<style scoped>
.SectionOne {
    margin-top: 10vh;
    text-align: center;
    min-height: 10vh;

}


.SectionTwo {
    width: 100%;
    color: rgb(0, 0, 0);
    
    background-color: #7e9cffab;
    padding: 2%;
    min-height: 40vh;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);

}


.sectionThree {
    min-height: 35vh;
    background-color: #4767f7ad;
    width: 100%;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);

    
}

#marginID {
    padding-top: 4vh;
    
}

.maillink:hover {
    color: #fff;
    text-decoration: none;
}

.maillink {
    color: black;
}
</style>
