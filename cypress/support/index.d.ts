declare namespace Cypress {
  interface Chainable<Subject> {
    typeDashboard(): Chainable<any>;
    customLogin(): Chainable<Promise<any>>;
  }
}