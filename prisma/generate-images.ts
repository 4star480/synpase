import { join } from "path";
import { GAMES } from "./catalog-data";
import { downloadAllImages } from "./download-images";
import { generateAllLocalImages } from "../src/lib/svg-art";

const ROOT = join(__dirname, "..");

async function main() {
  console.log("Step 1: Try downloading images from the web...");
  await downloadAllImages(ROOT);

  console.log("Step 2: Generate local SVG art for any missing assets...");
  generateAllLocalImages(join(ROOT, "public"), GAMES, false);

  console.log("Done — game covers, categories, guides, hero & video thumbs ready.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
