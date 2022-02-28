<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <h1>OOOPS</h1>
      </div>
      <h2>On est désolé, rien à trouver par ici</h2>
      <p>Les solutions à vos problèmes de location sont par là</p>
      <a href="/" class="fr-btn fr-btn-primary">
        Retour au site
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class File extends Vue {}
</script>

<style scoped lang="scss">
#notfound {
  height: 100vh;
  width: 100%;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.notfound {
  max-width: 410px;
  width: 100%;
  text-align: center;
}

.notfound .notfound-404 {
  height: 15rem;
  @media all and (max-width: 992px) {
    height: 5rem;
  }
  z-index: -1;
}

.notfound .notfound-404 h1 {
  font-family: "Montserrat", sans-serif;
  font-size: 15rem;
  line-height: 15rem;

  @media all and (max-width: 992px) {
    font-size: 5rem;
    line-height: 5rem;
  }
  margin: 0px;
  font-weight: 900;
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  background: url("../assets/images/banner3.png") no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: cover;
  background-position: center;
}

.notfound h2 {
  font-family: "Montserrat", sans-serif;
  color: #000;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 0;
}

.notfound p {
  font-family: "Montserrat", sans-serif;
  color: #000;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 20px;
  margin-top: 0px;
}
</style>
