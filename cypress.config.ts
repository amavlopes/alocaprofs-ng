import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      apiUrl: 'http://localhost:7000'
    }
  },
  video: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos'
})
