require("dotenv").config();
const puppeteer = require("puppeteer");
const handler = require("serve-handler");
const http = require("http");

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
    userDataDir: "./data",
    args: [
      "--start-fullscreen",
      "--kiosk",
      "--disable-infobars",
      "--disable-session-crashed-bubble",
      "--noerrdialogs",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
  });

  const page = await browser.newPage();

  const server = http.createServer((request, response) => {
    return handler(request, response);
  });

  server.listen(3000, () => {
    console.log("Running at http://localhost:3000");
    page.goto("http://localhost:3000", {
      waitUntil: "networkidle2",
    });
  });
}

main();
