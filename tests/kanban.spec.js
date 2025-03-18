// tests/kanban.spec.js
import { test, expect } from '@playwright/test';
import { editKanbanCardTest } from '../test.steps';
import { KanbanPage } from '../pages/KanbanPage';

test('Edit Kanban Card - Mark a Subtask as Complete and Move to First Column', async ({ page }) => {
  const primerNumero = await editKanbanCardTest(page);
  const texto2 = await page.locator('p.text-medium-grey.dark\\:text-white.text-xs.font-bold.pb-4').first().innerText();
  const numero2 = texto2.match(/\d+/);
  const primerNumero2 = numero2 ? parseInt(numero2[0], 10) : null;

  // Aserción que asegura que el número de subtask haya aumentado en 1
  expect(primerNumero2).toBe(primerNumero + 1);
});

test('texto', async ({ page }) => {
  const kanbanPage = new KanbanPage(page);
  await kanbanPage.goto();
  await page.waitForSelector('section');

  const sections = await page.locator('section');
  const numberSection = await sections.count();
 

  for (let i = 0; i < numberSection; i++) {
    const section = sections.nth(i);
    await page.waitForSelector('h2');
    

    const nombreColumna = await section.locator('h2').first().innerText();
    console.log(nombreColumna);

    const articles = await section.locator('article');
    const numberArticle = await articles.count();

    for (let x = 0; x < numberArticle; x++) {
      await page.waitForSelector('h3');
      const article = articles.nth(x);
      const nombreArticle = await article.locator('h3').innerText();
      console.log(nombreArticle);
     
    }
  }

 
 
  
});


