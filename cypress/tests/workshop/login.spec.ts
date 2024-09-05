describe("User login", function(){
    it("should be able to login",function(){
        cy.visit('/personal');
        cy.location("pathname").should('equal',"/signin");
        cy.get('[id="username"]').type("Heath93");
        cy.get('[id="password"]').type("s3cret");
        cy.get('[data-test="signin-submit"]').click();
        cy.location("pathname").should('equal',"/");
    })
})