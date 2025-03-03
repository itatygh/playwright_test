// @ts-check
import { test, expect } from '@playwright/test';
test('Edit Kanban Card - Mark a Subtask as Complete and Move to First Column', async ({ page }) => {
  await page.goto('https://kanban-566d8.firebaseapp.com/');
  await page.waitForTimeout(2000);
  
  // Esperar a que la primera sección sea visible
  await page.waitForSelector('section.min-w-\\[280px\\].last\\:pr-6.box-content', { state: 'visible' });

  const sections = await page.$$('section.min-w-\\[280px\\].last\\:pr-6.box-content');
  const firstSection = sections[0];
  const h2Element = await firstSection.$('h2.text-medium-grey.font-bold.text-xs.uppercase');
  const h2Text = await h2Element.innerText();
  
  // Asegurémonos de eliminar el número entre paréntesis y los paréntesis
  const nombrePrimerColumna = h2Text.replace(/\s?\(\s*\d+\s*\)/, '').trim();
  
  console.log('Texto del <h2> sin números entre paréntesis: ', nombrePrimerColumna);

  let actionCompleted = false; // Variable para indicar si la acción se completó exitosamente

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];

    // Obtén todos los artículos dentro de la sección
    const articles = await section.$$('article.group.cursor-pointer');

    // Itera sobre todos los artículos encontrados
    for (let j = 0; j < articles.length; j++) {
      const article = articles[j];

      // Desplaza el artículo a la vista si es necesario
      await article.scrollIntoViewIfNeeded({ timeout: 60000 }); // Asegúrate de que el artículo sea visible
      await page.waitForTimeout(500); // Espera 0.5 segundos antes de interactuar con el artículo

      // Realiza las acciones sobre cada artículo
      await article.hover();
      console.log(`Mouse posicionado sobre el artículo ${j + 1} de la sección ${i + 1}`);

      // Haz clic en el artículo
      await article.click();
      console.log(`Clic realizado sobre el artículo ${j + 1} de la sección ${i + 1}`);

      // Espera un poco para que el div se haga visible
      await page.waitForTimeout(1000);
      await page.waitForSelector('div', { state: 'visible' });

      const texto1 = await page.locator('p.text-medium-grey.dark\\:text-white.text-xs.font-bold.pb-4').first().innerText();
      const numero = texto1.match(/\d+/); // Esto buscará el primer conjunto de dígitos
      const primerNumero = numero ? parseInt(numero[0], 10) : null;
      console.log(primerNumero);  // Muestra el número en la consola

      // Encuentra todas las labels dentro del div desplegado
      const labels = await page.$$(
        'div .cursor-pointer.bg-light-grey.dark\\:bg-very-dark-grey.dark\\:hover\\:bg-main-purple\\/25.p-4.flex.items-center.gap-4.rounded.hover\\:bg-main-purple.hover\\:bg-opacity-25'
      );

      let foundUnchecked = false;  // Variable para marcar si encontramos un checkbox sin marcar

      // Itera sobre todas las labels y encuentra la primera que no tenga el checkbox marcado
      for (let k = 0; k < labels.length; k++) {
        const label = labels[k];

        // Encuentra el checkbox dentro de la label
        const checkbox = await label.$('input[type="checkbox"]');

        if (checkbox) {
          // Verifica si el checkbox está marcado
          const isChecked = await checkbox.isChecked();

          // Si no está marcado, haz clic en el checkbox y detén la búsqueda
          if (!isChecked) {
            await label.scrollIntoViewIfNeeded();  // Asegura que la label sea visible
            await label.hover();
            console.log(`Mouse posicionado sobre la label ${k + 1}`);

            // Haz clic en la label (que contiene el checkbox)
            await label.click();
            console.log(`Clic realizado sobre la label ${k + 1} para marcar el checkbox`);

            foundUnchecked = true;  // Marcamos que encontramos un checkbox no marcado
            break;  // Salimos del loop de labels
          }
        }

        // Espera un poco antes de mover el mouse a la siguiente label
        await page.waitForTimeout(500); // Espera 0.5 segundos
      }

      // Si encontramos un checkbox sin marcar, dejamos de recorrer las secciones
      if (foundUnchecked) {
        console.log('Se encontró un checkbox sin marcar, deteniendo la iteración de artículos y secciones.');

        // Coloca el mouse sobre el div con la clase especificada
        const targetDiv = await page.$('div.text-sm.text-black.dark\\:text-white.font-bold.rounded.px-4.py-3.relative.w-full.flex.items-center.border.border-medium-grey.border-opacity-25.cursor-pointer.hover\\:border-main-purple.focus\\:border-main-purple.group');
        if (targetDiv) {
          await targetDiv.scrollIntoViewIfNeeded();  // Asegura que el div esté visible
          await targetDiv.click();
          console.log('Clic realizado sobre el div.');

          // Ahora, dentro de este div, buscamos el siguiente div con la clase indicada
          const innerDiv = await targetDiv.$('div.p-4.text-medium-grey.hover\\:text-black.dark\\:hover\\:text-white');
          if (innerDiv) {
            await innerDiv.click();
            console.log('Clic realizado sobre el div interno con la clase p-4 text-medium-grey hover:text-black dark:hover:text-white.');
            
            const divValue = await targetDiv.getAttribute('value');
            if(nombrePrimerColumna===divValue?.toUpperCase()){
                console.log("La tarjeta se movió de manera adecuada a la primera columna");
            }else{
              console.log("La tarjeta no se movió adecuadamente");
            }
          }

          const texto2 = await page.locator('p.text-medium-grey.dark\\:text-white.text-xs.font-bold.pb-4').first().innerText();
          const numero2 = texto2.match(/\d+/);
          const primerNumero2 = numero2 ? parseInt(numero2[0], 10) : null;
          //Aserción que asegura que el número de subtask haya aumentado uno.
          expect(primerNumero2).toBe(primerNumero + 1);
        }

        actionCompleted = true;  // Marcamos que la acción se completó correctamente
        break;  // Salimos del bucle de artículos
      }
    }

    // Si la acción ya se completó, terminamos el ciclo de secciones
    if (actionCompleted) {
      break;
    }
  }
});
