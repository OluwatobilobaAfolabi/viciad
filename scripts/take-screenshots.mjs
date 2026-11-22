import { execSync } from "child_process";
import fs from "fs";

const pages = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "hsse-policy", path: "/about/hsse-policy" },
  { name: "services", path: "/services" },
  { name: "gallery", path: "/gallery" },
  { name: "contact", path: "/contact" },
];

const targetDir = process.argv[2] || "screenshots/before";
fs.mkdirSync(targetDir, { recursive: true });

const chrome = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"';

for (const page of pages) {
  const url = `http://localhost:3456${page.path}`;
  console.log(`Capturing ${page.name}...`);

  // Desktop (1440x900)
  execSync(
    `${chrome} --headless --disable-gpu --virtual-time-budget=3000 --window-size=1440,900 --screenshot=${targetDir}/${page.name}-desktop.png "${url}"`,
    { stdio: "ignore" }
  );

  // Mobile (390x844)
  execSync(
    `${chrome} --headless --disable-gpu --virtual-time-budget=3000 --window-size=390,844 --screenshot=${targetDir}/${page.name}-mobile.png "${url}"`,
    { stdio: "ignore" }
  );
}

console.log(`All screenshots saved to ${targetDir}`);
