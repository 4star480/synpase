import { join } from "path";
import { downloadAllImages } from "./download-images";

const ROOT = join(__dirname, "..");

downloadAllImages(ROOT).then(() => console.log("Images downloaded.")).catch(console.error);
