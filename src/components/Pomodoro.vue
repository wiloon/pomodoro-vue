<template>
  <v-container>
    <p>Type: {{ type }}</p>
    <p>Start: {{ timestampStr }}</p>
    <v-row>
      <v-col cols="1">{{ pomodoroTimeLast }}</v-col>
      <v-col cols="9">
        <v-progress-linear
          v-bind:value="progress"
          dark
          bottom
          v-bind:indeterminate="indeterminateValue"
          v-bind:color="progressBarColor"
        ></v-progress-linear>
      </v-col>
      <v-col cols="2">{{ pomodoroTimeLeft }}</v-col>
    </v-row>
    <v-row>
      <v-btn v-on:click="tick" v-bind:color="tickBtnColor" class="p-button">tick</v-btn>
      <v-btn v-on:click="fullScreen" class="p-button">Full Screen</v-btn>
      <v-btn v-on:click="decreaseDingInterval" class="p-button">-</v-btn>
      <v-btn v-on:click="increaseDingInterval" class="p-button">+</v-btn>
      Ding Interval: {{ dingInterval }}
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import audio0 from '../assets/y1115.mp3'

const typeLong = 'L'
const typeShort = 'S'

@Component({
  components: {}
})
export default class Pomodoro extends Vue {
  dingSrc = ''
  timestamp = new Date()
  timestampStr = this.timestamp.toLocaleString()
  timer = 0
  type = typeLong
  pomodoroTimeLast = ''
  pomodoroTimeLeft = ''
  tickBtnColor = 'primary'
  duration = 25
  progress = 0
  indeterminateValue = false
  progressBarColor = 'indigo'
  dingCount = 0
  dingInterval = 3

  decreaseDingInterval (): void {
    if (this.dingInterval > 2) {
      this.dingInterval--
    }
  }

  increaseDingInterval (): void {
    if (this.dingInterval < 100) {
      this.dingInterval++
    }
  }

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
    if (this.type === '' || this.type === typeShort) {
      this.type = typeLong
      this.duration = 25
    } else {
      this.type = typeShort
      this.duration = 5
    }
    this.tickBtnColor = 'primary'
    this.progressBarColor = 'indigo'
    this.indeterminateValue = false
  }

  updateTimestamp (): void {
    const diff = new Date().getTime() - this.timestamp.getTime()
    const last = (diff / (1000 * 60))
    const left = this.duration - last

    if (left > 0) {
      this.pomodoroTimeLeft = left.toFixed(2)
      this.pomodoroTimeLast = last.toFixed(2)
      this.progress = (last / this.duration) * 100
    } else {
      this.pomodoroTimeLeft = '0'
      this.pomodoroTimeLast = String(this.duration)
      // if (this.tickBtnColor === 'primary') {
      //   this.tickBtnColor = 'error'
      //   this.indeterminateValue = true
      //   this.progressBarColor = 'pink'
      // } else {
      //   this.tickBtnColor = 'primary'
      //   this.indeterminateValue = true
      //   this.progressBarColor = 'indigo'
      // }

      if (this.dingCount % this.dingInterval === 0) {
        const ding = new Audio(audio0)
        ding.play()
      }
      this.dingCount++
    }
  }

  mounted () {
    this.timer = setInterval(this.updateTimestamp, 1000)
  }
}
</script>
<style scoped>
.p-button {
  margin-right: 10px;
}
</style>
