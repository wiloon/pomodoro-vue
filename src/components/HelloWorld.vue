<template>
  <v-container>
    <p>Type: {{ type }}</p>
    <p>Start: {{ timestampStr }}</p>
    <p>Left: {{ pomodoroTime }}</p>
    <v-btn v-on:click="tick" v-bind:color="tickBtnColor">tick</v-btn>
    <v-btn v-on:click="fullScreen" >Full Screen</v-btn>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class HelloWorld extends Vue {
  timestamp = new Date()
  timestampStr = this.timestamp.toLocaleString()
  timer = 0
  type = 'long'
  pomodoroTime = ''
  tickBtnColor = 'primary'

  fullScreen (): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  tick (): void {
    this.timestamp = new Date()
    this.timestampStr = this.timestamp.toLocaleString()

    this.pomodoroTime = '0'
    if (this.type === '' || this.type === 'short') {
      this.type = 'long'
    } else {
      this.type = 'short'
    }
    this.tickBtnColor = 'primary'
  }

  updateTimestamp (): void {
    const diff = new Date().getTime() - this.timestamp.getTime()
    const result = diff / (1000 * 60)

    if ((this.type === 'long' && result < 25) || (this.type === 'short' && result < 5)) {
      this.pomodoroTime = result.toFixed(2)
    } else {
      if (this.tickBtnColor === 'primary') {
        this.tickBtnColor = 'error'
      } else {
        this.tickBtnColor = 'primary'
      }
    }
  }

  mounted () {
    this.timer = setInterval(this.updateTimestamp, 1000)
  }
}
</script>
