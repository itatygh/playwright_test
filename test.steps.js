// test.steps.js
// test.steps.js
import { KanbanPage } from './pages/KanbanPage';

export async function editKanbanCardTest(page) {
  const kanbanPage = new KanbanPage(page);

  await kanbanPage.goto();

  const nombrePrimerColumna = await kanbanPage.getFirstSectionName();

  let actionCompleted = false;
  const sections = await page.$$('section.min-w-\\[280px\\].last\\:pr-6.box-content');
  let primerNumero = null;

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const articles = await kanbanPage.getArticlesInSection(section);


    for (let j = 0; j < articles.length; j++) {
      const article = articles[j];
      await kanbanPage.hoverAndClickArticle(article);

      primerNumero = await kanbanPage.getSubtaskNumber();


      const subtasks = await kanbanPage.getCheckboxLabels();
      let foundUnchecked = false;

      for (let k = 0; k < subtasks.length; k++) {
        const label = subtasks[k];
        const checkbox = await label.$('input[type="checkbox"]');
        if (checkbox && !(await checkbox.isChecked())) {
          await kanbanPage.clickLabel(label);
          foundUnchecked = true;
          break;
        }
      }

      if (foundUnchecked) {
        const targetDiv = await page.$('div.text-sm.text-black.dark\\:text-white.font-bold.rounded.px-4.py-3.relative.w-full.flex.items-center.border.border-medium-grey.border-opacity-25.cursor-pointer.hover\\:border-main-purple.focus\\:border-main-purple.group');
        await targetDiv.click();

        const innerDiv = await targetDiv.$('div.p-4.text-medium-grey.hover\\:text-black.dark\\:hover\\:text-white');
        await innerDiv.click();

        const divValue = await targetDiv.getAttribute('value');
        if (nombrePrimerColumna === divValue?.toUpperCase()) {
          console.log("La tarjeta se movió de manera adecuada a la primera columna");
        } else {
          console.log("La tarjeta no se movió adecuadamente");
        }

        actionCompleted = true;
        break;
      }
    }

    if (actionCompleted) {
      break;
    }
  }

  // Retornar el número de subtarea (para usarlo en el archivo de prueba)
  return primerNumero;
}
