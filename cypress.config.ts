import path from "path";
import _ from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import Promise from "bluebird";
import codeCoverageTask from "@cypress/code-coverage/task";
import { devServer } from "@cypress/vite-dev-server";
import { defineConfig } from "cypress";
import { mergeConfig, loadEnv } from "vite";



module.exports = defineConfig({
  projectId: "7s5okt",
  retries: {
    runMode: 2,
  },
  env: {
    apiUrl: "http://localhost:3001",

    codeCoverage: {
      url: "http://localhost:3001/__coverage__",
      exclude: "cypress/**/*.*",
    },
  
  },
  component: {
    devServer(devServerConfig) {
      const viteConfig = require("./vite.config.ts");
      const conf = {
        define: {
          "process.env": loadEnv("development", process.cwd(), "VITE"),
        },
        server: {
      
          port: 3002,
        },
      };

      const resolvedViteConfig = mergeConfig(viteConfig, conf);
      return devServer({
        ...devServerConfig,
        framework: "react",
        viteConfig: resolvedViteConfig,
      });
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/tests/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportHeight: 1000,
    viewportWidth: 1280,
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      const testDataApiEndpoint = `${config.env.apiUrl}/testData`;


      on("task", {
        async "db:seed"() {
          // seed database with test data
          const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
          return data;
        },
      });

      codeCoverageTask(on, config);
      return config;
    },
  },
});
