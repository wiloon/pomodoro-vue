<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer
          v-model="drawer"
          app
          clipped
        >
          <v-list dense>
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar
          app
          clipped-left
        >
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>Pomodoro</v-toolbar-title>
        </v-app-bar>

        <v-main>
         <HelloWorld></HelloWorld>
          {{ foo }}
        </v-main>

        <v-footer app>
          <span>w10n &copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-app>
    </v-app>
  </div>
</template>

<script lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { Component, Vue } from 'vue-property-decorator'
import { wakeLock } from './assets/keep-screen-on.js'

@Component({
  components: { HelloWorld }
})
export default class App extends Vue {
  drawer = false
  foo = ''

  mounted () {
    this.$vuetify.theme.dark = true
    wakeLock()
  }
}
</script>
