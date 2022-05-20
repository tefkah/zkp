describe('zkp-editor: SearchHighlightingExample component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=searchhighlightingexample--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to SearchHighlightingExample!');
    });
});
