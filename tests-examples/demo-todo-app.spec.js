// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://kanban-566d8.firebaseapp.com/');
});

const DIVS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
];

test.describe('TestKanbanForms', () => {

  test('should move a card when a subtask is marked as done', async ({ page }) => {
    // create a new todo locator
   // Navegar a la página
  await page.goto('https://kanban-566d8.firebaseapp.com/');

  // Seleccionar todas las sections que tienen la clase min-w-[280px], excepto la primera
  const sections = await page.locator('section.min-w-[280px]');
  
  // Iterar sobre cada sección (exceptuando la primera, que es index 0)
  for (let i = 1; i < await sections.count(); i++) {
    const section = sections.nth(i);

    // Dentro de la sección, buscar los artículos
    const articles = section.locator('article');
    
    // Iterar sobre cada artículo dentro de la sección
    for (let j = 0; j < await articles.count(); j++) {
      const article = articles.nth(j);

      // Buscar el div que contiene los labels de las subtareas
      const subtasksDiv = article.locator('div > div > label');

      // Verificar si alguna de las subtareas no está seleccionada
      const unselectedTask = await subtasksDiv.locator(':not([class*="selected"])').first();

      if (await unselectedTask.count() > 0) {
        // Si encontramos una tarea no seleccionada, seleccionamos una
        await unselectedTask.click();
        
        // Verificar que la tarea ha sido seleccionada, en caso de que sea necesario
        await expect(unselectedTask).toHaveClass(/selected/); // Ajusta según la clase que indique selección
        
        // Salir del bucle, ya que ya seleccionamos una task no seleccionada
        return;
      }
    }
  }

  // Si no se encuentra ninguna task no seleccionada, se puede lanzar un error o manejarlo de otra manera
  throw new Error('No se encontró ninguna task no seleccionada');


  });
  
});

