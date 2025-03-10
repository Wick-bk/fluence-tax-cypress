const report = require("multiple-cucumber-html-reporter");
const fs = require("fs");

const jsonDir = "cypress/reports/cucumber-json";
const reportPath = "cypress/reports/cucumber-html-report";

if (!fs.existsSync(jsonDir) || fs.readdirSync(jsonDir).length === 0) {
  console.error("❌ Нет JSON-файлов!");
  process.exit(1);
}

report.generate({
  jsonDir,
  reportPath,
  reportName: "Cucumber Test Report",
  pageTitle: "Cucumber Report",
  displayDuration: true,
  metadata: {
    browser: { name: "chrome", version: "latest" },
    device: "Local test machine",
    platform: { name: "macOS", version: "Sonoma" },
  },
});