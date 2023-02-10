beforeEach(() => {
  cy.visit("/");
});

describe("should find all html", () => {
  it("should find all html", () => {
    cy.get("#searchForm").should("exist");
    cy.get("#searchText").should("exist");
    cy.get("#search").should("exist");
    cy.get("#movie-container").should("exist");
  });
});

describe("mock tests for movie search", () => {
  it("should find movie on search", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "movies" }).as(
      "omdbCall"
    );

    cy.get("#searchText").type("Mock of the Rings");

    cy.get("#search").click();

    cy.get(".movie").should("exist").should("have.length", 3);
    cy.get("h3").should("have.length", 3);
    cy.get("h3")
      .first()
      .contains("The Lord of the Rings: The Fellowship of the Ring")
      .should("exist");
    cy.get("img").should("exist");
    cy.get("img")
      .first()
      .should("have.attr", "src")
      .should("include", "testPoster");
    cy.get("img")
      .first()
      .should("have.attr", "alt")
      .should("include", "The Lord of the Rings: The Fellowship of the Ring");
  });

  it("should not find movies on search", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "empty" }).as(
      "omdbCall"
    );

    cy.get("#searchText").type("No movie");

    cy.get("#search").click();

    cy.get(".movie").should("not.exist");
    cy.get("h3").should("not.exist");
    cy.get("img").should("not.exist");
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });

  it("should not find movies and show error", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "error" }).as(
      "omdbCall"
    );

    cy.get("#searchText").type("giveMeAnError");

    cy.get("#search").click();

    cy.wait("@omdbCall").then((xhr) => {
      expect(xhr.response.body).to.have.property("Response", false);
      expect(xhr.response.body).to.have.property("Error", "No movie was found");
    });

    cy.get(".movie").should("not.exist");
    cy.get("p").should("contain", "Inga sökresultat att visa").should("exist");
  });
});

describe("tests for API", () => {
  it("should fetch data from API", () => {
    cy.get("#searchText").type("Jurassic Park");

    cy.get("#search").click();

    cy.get("h3").should("have.length", 10);
    cy.get("h3").contains("Jurassic Park").should("exist");
  });
});
