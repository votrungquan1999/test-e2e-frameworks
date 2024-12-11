// TODO: try to find a way to make sure the button is not clickable
describe.skip("Covered Button", () => {
	beforeEach(() => {
		cy.visit("/to-dos");
	});

	it("should not be able to click covered button", () => {
		// Verify the button exists but is covered
		cy.get("#covered-button").should("exist").and("not.be.visible");
		cy.get("#covered-button-overlay")
			.should("exist")
			.and("be.visible")
			.and("have.css", "background-color", "rgb(0, 0, 0)"); // Verify it's black and opaque

		// Attempt to click should fail because the element is covered
		cy.get("#covered-button").should("not.be.clickable");
	});
});
