// tests/kanban.spec.js
import { test, expect } from '@playwright/test';
import { editKanbanCardTest } from '../test.steps';

test('Edit Kanban Card - Mark a Subtask as Complete and Move to First Column', async ({ page }) => {
  const primerNumero = await editKanbanCardTest(page);
  const texto2 = await page.locator('p.text-medium-grey.dark\\:text-white.text-xs.font-bold.pb-4').first().innerText();
  const numero2 = texto2.match(/\d+/);
  const primerNumero2 = numero2 ? parseInt(numero2[0], 10) : null;

  // Aserción que asegura que el número de subtask haya aumentado en 1
  expect(primerNumero2).toBe(primerNumero + 1);
});
