import { test, expect } from "@playwright/test";
async function navigate(page: import("@playwright/test").Page, label: string) {
  const mobile = test.info().project.name === "iphone";
  await page
    .getByRole("navigation", {
      name: mobile ? "Mobile navigation" : "Main navigation",
      exact: true,
    })
    .getByRole("button", { name: label, exact: true })
    .click();
}
test("original default, scenario controls, horizon, filters and accessible details", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Active Early Era 1 of the AGI transition",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Central / Base", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Fast / Bull", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Early Era 2 · AGI, Fast: 2028–2033/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Compare all", exact: true }).click();
  await expect(page.locator(".forecast-bar")).toHaveCount(24);
  await page.getByRole("button", { name: "Near 2040", exact: true }).click();
  await expect(page.locator(".offscreen").first()).toBeVisible();
  await page.getByRole("button", { name: "Reset timeline filters" }).click();
  await expect(page.locator(".forecast-bar")).toHaveCount(8);
  await page.getByLabel("Economic & industrial", { exact: true }).check();
  await expect(page.locator(".forecast-bar")).toHaveCount(12);
  await page
    .getByRole("button", { name: /Early Era 2 · AGI, Central:/ })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Early Era 2 · AGI details",
  });
  await expect(
    dialog.getByRole("heading", {
      name: "Operational definition",
      exact: true,
    }),
  ).toBeVisible();
  await expect(dialog.getByText("2034–2045", { exact: true })).toBeVisible();
  await expect(
    dialog.getByText("2050–2075 or absent", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: /Early Era 2 · AGI, Central:/ }),
  ).toBeFocused();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
  await expect(errors).toEqual([]);
});
test("age lens, key milestone comparison and evidence checklist", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Lifetime lens" }).click();
  await page.getByRole("switch", { name: "Show ages" }).check();
  await expect(page.getByText("Age ≈27–38", { exact: true })).toBeVisible();
  await page
    .getByRole("spinbutton", { name: "Reference age", exact: true })
    .fill("30");
  await expect(page.getByText("Age ≈38–49", { exact: true })).toBeVisible();
  await page
    .getByRole("spinbutton", { name: "Reference year", exact: true })
    .fill("2027");
  await expect(page.getByText("Age ≈37–48", { exact: true })).toBeVisible();
  await page
    .getByRole("spinbutton", { name: "Reference year", exact: true })
    .fill("2026");
  await page.getByRole("button", { name: "Compare key milestones" }).click();
  const dialog = page.getByRole("dialog", { name: "Milestone comparison" });
  await expect(dialog.locator(".comparison-card")).toHaveCount(3);
  await expect(
    dialog.getByRole("heading", {
      name: "E3 · UK near-abundance",
      exact: true,
    }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Close panel" }).click();
  await page
    .getByRole("button", { name: "Explore verification requirements" })
    .click();
  await expect(
    page.getByText("Not independently verified", { exact: true }),
  ).toHaveCount(12);
  await page
    .locator("summary")
    .filter({ hasText: "Professional parity across domains" })
    .click();
  await expect(
    page.getByText(/At least 70% of task families overall/),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText("Age ≈38–49", { exact: true })).toBeVisible();
});
test("views preserve independent alignment and precise economic threshold", async ({
  page,
}) => {
  await page.goto("/");
  await navigate(
    page,
    test.info().project.name === "iphone" ? "Scenarios" : "Scenario comparison",
  );
  await expect(page.locator(".forecast-bar")).toHaveCount(24);
  await navigate(
    page,
    test.info().project.name === "iphone"
      ? "Alignment"
      : "Capability & alignment",
  );
  await expect(
    page.getByText(
      "Operational levels and dates pending separate alignment research",
      { exact: true },
    ),
  ).toBeVisible();
  await navigate(
    page,
    test.info().project.name === "iphone" ? "Economy" : "Economic transition",
  );
  await expect(page.locator(".forecast-bar")).toHaveCount(4);
  await expect(
    page.getByText("95% of residents within every income quintile", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("No dated milestone supplied", { exact: true }),
  ).toBeVisible();
  await navigate(
    page,
    test.info().project.name === "iphone" ? "Methods" : "Methodology",
  );
  await expect(
    page.getByRole("heading", {
      name: "Source provenance & limits",
      exact: true,
    }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});
test("import review, hypothetical isolation, restore original and export", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Research data" }).click();
  const dialog = page.getByRole("dialog", { name: "Research data management" });
  await dialog.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"windows": "bad"}'),
  });
  await expect(dialog.getByRole("alert")).toBeVisible();
  const data = {
    schemaVersion: 1,
    kind: "user-hypothesis",
    title: "An alternative",
    windows: {
      agi: {
        central: { label: "2040–2050 hypothetical", start: 2040, end: 2050 },
      },
    },
  };
  await dialog.locator("input[type=file]").setInputFiles({
    name: "hypothesis.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await expect(
    dialog.getByText(
      "1 changed scenario window compared with the original dataset.",
      { exact: false },
    ),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Apply as hypothesis" }).click();
  await expect(
    page.getByText("User-edited hypothesis: An alternative", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: /Early Era 2 · AGI, Central: 2040–2050 hypothetical/,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Restore original", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /Early Era 2 · AGI, Central: 2034–2045/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Research data" }).click();
  const download = page.waitForEvent("download");
  await dialog
    .getByRole("button", { name: "Export original framework" })
    .click();
  expect((await download).suggestedFilename()).toBe(
    "master-era-framework-v1.json",
  );
});
test("production shell reloads offline with research and interactions", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Active Early Era 1 of the AGI transition",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Early Era 2 · AGI, Central:/ })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Early Era 2 · AGI details" }),
  ).toBeVisible();
  await context.setOffline(false);
});
test("capture responsive overview", async ({ page }) => {
  await page.goto("/");
  await page.screenshot({
    path: `test-results/overview-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("accessible overview and milestone panel", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.goto("/");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page
    .getByRole("button", { name: /Early Era 2 · AGI, Central:/ })
    .click();
  await page.locator("dialog").evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished),
    );
  });
  const panel = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    panel.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
test("timeline and views fit narrow phones, tablets and desktop without lateral scrolling", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "desktop",
    "Viewport sweep runs once; mobile interactions run in the iPhone project.",
  );
  await page.goto("/");
  for (const width of [320, 375, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page
      .getByRole("button", { name: "Compare all", exact: true })
      .click();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page
      .getByRole("button", { name: "Compare key milestones", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Milestone comparison" });
    await expect
      .poll(() => dialog.evaluate((el) => el.scrollWidth <= el.clientWidth))
      .toBe(true);
    await dialog.getByRole("button", { name: "Close panel" }).click();
  }
});
