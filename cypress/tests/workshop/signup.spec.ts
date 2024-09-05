describe("User Sign-up and Login", function () {
    beforeEach(function () {
      cy.task("db:seed");
      cy.intercept("POST", "/users").as("signup");
    });
  
    it("should redirect unauthenticated user to signin page", function () {
      cy.visit("/personal");
      cy.location("pathname").should("equal", "/signin");
    });
  
    it("should allow a visitor to sign-up, login, and logout", function () {
      const userInfo = {
        firstName: "Bob",
        lastName: "Ross",
        username: "PainterJoy90",
        password: "s3cret",
      };
  
      // Navigate to the home page
      cy.visit("/");
  
      // Click on sign-up button and verify title
      cy.getBySel("signup").click();
      cy.getBySel("signup-title").should("be.visible").and("contain", "Sign Up");
  
      // Fill out the sign-up form
      cy.getBySel("signup-first-name").type(userInfo.firstName);
      cy.getBySel("signup-last-name").type(userInfo.lastName);
      cy.getBySel("signup-username").type(userInfo.username);
      cy.getBySel("signup-password").type(userInfo.password);
      cy.getBySel("signup-confirmPassword").type(userInfo.password);
     
      // Submit sign-up form and wait for response
      cy.getBySel("signup-submit").click();
      cy.wait("@signup").then(({ response }) => {
        // Validate the response
        expect(response?.statusCode).to.eq(201); // Assuming the success status code is 201
        expect(response?.body).to.have.property('user');
        expect(response?.body.user).to.deep.include({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          username: userInfo.username,
        });
      });
  
      // Log in the user
      cy.login(userInfo.username, userInfo.password);
  
      // Verify user onboarding dialog
      cy.getBySel("user-onboarding-dialog").should("be.visible");
    });
  });
  