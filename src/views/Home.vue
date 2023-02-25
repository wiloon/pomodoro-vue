<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Pomodoro msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pomodoro from '@/components/Pomodoro.vue' // @ is an alias to /src

@Component({
  components: {
    Pomodoro
  }
})
export default class Home extends Vue {}
</script>
