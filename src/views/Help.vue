<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>How it works</v-card-title>
          <v-card-text>
            <p class="mb-3">
              The timer alternates between two session types:
            </p>
            <v-table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Focus</strong></td>
                  <td>25 min</td>
                  <td>Concentrated work session</td>
                </tr>
                <tr>
                  <td><strong>Break</strong></td>
                  <td>5 min</td>
                  <td>Stand up, stretch, rest your eyes</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Controls</v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item prepend-icon="mdi-skip-next">
                <v-list-item-title>Next</v-list-item-title>
                <v-list-item-subtitle>Start the next session immediately (Focus → Break or Break → Focus)</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-fullscreen">
                <v-list-item-title>Full Screen</v-list-item-title>
                <v-list-item-subtitle>Enter full-screen mode — ideal for placing an idle phone next to your monitor</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-pause">
                <v-list-item-title>Pause / Resume</v-list-item-title>
                <v-list-item-subtitle>Pause the current session and resume when ready</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Alert sound</v-card-title>
          <v-card-text>
            <p>A sound plays periodically during a session as a reminder to stay on track. You can configure the sound and interval in <router-link to="/settings">Settings</router-link>.</p>
            <v-list lines="two" class="mt-2">
              <v-list-item prepend-icon="mdi-bell">
                <v-list-item-title>Bell</v-list-item-title>
                <v-list-item-subtitle>Short bell chime</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-weather-rainy">
                <v-list-item-title>Rain Forest</v-list-item-title>
                <v-list-item-subtitle>Ambient rain forest sound</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Offline use</v-card-title>
          <v-card-text>
            After the first visit, the app is fully cached by the browser. It works offline — no internet connection needed after the initial load.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
