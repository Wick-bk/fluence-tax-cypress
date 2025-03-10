import { defineConfig } from "cypress";
import webpack from "@cypress/webpack-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import fs from "fs";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        resolve: {
          extensions: [".ts", ".js"],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                  options: {
                    transpileOnly: true,
                  },
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

  // Загружаем конфигурацию окружения
  const envName = process.env.CYPRESS_ENV || "dev"; // По умолчанию "dev"
  const envConfig = JSON.parse(fs.readFileSync("cypress.env.json", "utf-8"))[envName];

  if (!envConfig) {
    throw new Error(`Окружение "${envName}" не найдено в cypress.env.json`);
  }

  // Применяем настройки окружения к конфигу Cypress
  config.baseUrl = envConfig.baseUrl;
  config.env = {
    ...config.env,
    ...envConfig, // Добавляем все переменные из окружения
    "cypress-cucumber-preprocessor": {
      json: {
        enabled: true,
        output: "cypress/reports/cucumber-json/cucumber-[hash].json",
      },
    },
  };

  on("after:run", async (results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult) => {
    const report = require("multiple-cucumber-html-reporter");
    const fs = require("fs");

    const jsonDir = "cypress/reports/cucumber-json";
    const reportPath = "cypress/reports/cucumber-html-report";

    if ("runs" in results && results.runs && results.runs.length > 0) {
      console.log("Генерируем JSON вручную...");
      if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir, { recursive: true });
      }

      results.runs.forEach((run, index) => {
        const cucumberJson = [
          {
            uri: `file:${run.spec.relative}`,
            id: run.spec.name.replace(".feature", "").toLowerCase(),
            keyword: "Feature",
            name: run.spec.name.replace(".feature", ""),
            elements: (run.tests || []).map((test) => ({
              keyword: "Scenario",
              name: test.title[test.title.length - 1],
              steps: [
                {
                  keyword: "Given",
                  name: "Тест выполнен",
                  result: {
                    status: test.state === "passed" ? "passed" : "failed",
                    duration: test.duration ? test.duration * 1000000 : 0,
                  },
                },
              ],
            })),
          },
        ];
        fs.writeFileSync(`${jsonDir}/run-${index}.json`, JSON.stringify(cucumberJson, null, 2));
      });
    } else {
      console.log("Нет успешных результатов тестов для генерации JSON!");
      console.log("Полные результаты:", JSON.stringify(results, null, 2));
    }

    console.log(`Проверяем папку JSON: ${jsonDir}`);
    if (!fs.existsSync(jsonDir)) {
      console.error(`❌ Папка ${jsonDir} не существует!`);
      return;
    }

    const jsonFiles = fs.readdirSync(jsonDir);
    console.log(`Найдено JSON-файлов: ${jsonFiles.length}`);
    console.log(`Список файлов: ${jsonFiles.join(", ")}`);

    if (jsonFiles.length === 0) {
      console.error("❌ Нет JSON-файлов для отчёта!");
      return;
    }

    console.log("✅ Генерируем HTML-отчёт...");
    try {
      report.generate({
        jsonDir,
        reportPath,
        reportName: `Cucumber Test Report (${envName})`, // Добавляем имя окружения в отчет
        pageTitle: `Cucumber Report - ${envName}`,
        displayDuration: true,
        metadata: {
          browser: { name: "chrome", version: "latest" },
          device: "Local test machine",
          platform: { name: "macOS", version: "Sonoma" },
          environment: envName, // Добавляем окружение в метаданные
        },
      });
      console.log(`✅ HTML-отчёт создан: ${reportPath}/index.html`);
    } catch (error) {
      console.error("❌ Ошибка генерации отчёта:", error);
    }
  });

  return config;
}

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    viewportWidth: 1800,
    viewportHeight: 1200,
    setupNodeEvents,
  },
});