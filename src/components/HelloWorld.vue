<template>
  <v-container>
    <p>Type: {{ type }}</p>
    <p>Start: {{ timestampStr }}</p>
    <v-row>
      <v-col cols="1">{{ pomodoroTimeLast }}</v-col>
      <v-col cols="10"> <v-progress-linear v-bind:value="progress" dark bottom ></v-progress-linear></v-col>
      <v-col cols="1">{{ pomodoroTimeLeft }}</v-col>
    </v-row>
    <v-btn v-on:click="tick" v-bind:color="tickBtnColor">tick</v-btn>
    <v-btn v-on:click="fullScreen">Full Screen</v-btn>
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
  pomodoroTimeLast = ''
  pomodoroTimeLeft = ''
  tickBtnColor = 'primary'
  duration = 25
  progress = 0

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

    this.pomodoroTimeLast = '0'
    this.pomodoroTimeLeft = String(this.duration)
    if (this.type === '' || this.type === 'short') {
      this.type = 'long'
      this.duration = 25
    } else {
      this.type = 'short'
      this.duration = 5
    }
    this.tickBtnColor = 'primary'
  }

  updateTimestamp (): void {
    const diff = new Date().getTime() - this.timestamp.getTime()
    const last = (diff / (1000 * 60))
    const left = this.duration - last

    if (left > 0) {
      this.pomodoroTimeLeft = left.toFixed(2)
      this.pomodoroTimeLast = last.toFixed(2)
      this.progress = (last / this.duration) * 100
      console.log(last + ', ' + this.progress)
    } else {
      this.pomodoroTimeLeft = '0'
      this.pomodoroTimeLast = String(this.duration)
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
