import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		specPattern: "src/e2e/cypress/e2e/**/*.cy.ts",
		supportFile: "src/e2e/cypress/support/e2e.ts",
		baseUrl: "http://localhost:3000",
	},
});
