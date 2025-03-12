// pages/KanbanPage.js
class KanbanPage {
    constructor(page) {
      this.page = page;
    }
  
    async goto() {
      await this.page.goto('https://kanban-566d8.firebaseapp.com/');
      await this.page.waitForTimeout(2000);
    }
  
    async getFirstSectionName() {
      await this.page.waitForSelector('section.min-w-\\[280px\\].last\\:pr-6.box-content', { state: 'visible' });
      const sections = await this.page.$$('section.min-w-\\[280px\\].last\\:pr-6.box-content');
      const firstSection = sections[0];
      const h2Element = await firstSection.$('h2.text-medium-grey.font-bold.text-xs.uppercase');
      const h2Text = await h2Element.innerText();
      return h2Text.replace(/\s?\(\s*\d+\s*\)/, '').trim();  // Eliminar números entre paréntesis
    }
  
    async getArticlesInSection(section) {
      const articles = await section.$$('article.group.cursor-pointer');
      return articles;
    }
    
    async hoverAndClickArticle(article) {
      await article.scrollIntoViewIfNeeded({ timeout: 60000 });
      await this.page.waitForTimeout(500);
      await article.hover();
      await article.click();
      await this.page.waitForTimeout(1000);
      await this.page.waitForSelector('div', { state: 'visible' });
    }
  
    async getCheckboxLabels() {
      return await this.page.$$(
        'div .cursor-pointer.bg-light-grey.dark\\:bg-very-dark-grey.dark\\:hover\\:bg-main-purple\\/25.p-4.flex.items-center.gap-4.rounded.hover\\:bg-main-purple.hover\\:bg-opacity-25'
      );
    }
  
    async clickLabel(label) {
      await label.scrollIntoViewIfNeeded();
      await label.hover();
      await label.click();
    }
  
    async getSubtaskNumber() {
      const texto = await this.page.locator('p.text-medium-grey.dark\\:text-white.text-xs.font-bold.pb-4').first().innerText();
      const numero = texto.match(/\d+/);
      return numero ? parseInt(numero[0], 10) : null;
    }
  }
  
  export { KanbanPage };
  