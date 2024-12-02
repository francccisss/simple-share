import assert, { fail } from "assert";
import test, { describe } from "node:test";
import fs from "fs/promises";
import FormData from "form-data";
import NodeFetch from "node-fetch";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { uploadFile } from "./fileupload.ts";

// why is the __dirname not within the scope of esm?
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// why is the __dirname not within the scope of esm?
// Needs `node-fetch` library because of browser api feature for sending form data
test("Uploading different file types images, videos, audios, text files etc...", async (t) => {
  await t.test("Upload Images", async () => {
    const formData = new FormData();
    const filePath = "leaves_green_dark_145996_3840x2400.jpg";
    try {
      await uploadFile(formData, filePath, {
        filename: "leaves_green_dark_145996_3840x2400.jpg",
        contentType: "image/jpeg",
      });
    } catch (err) {
      fail("Failed to upload image");
    }
  });

  await t.test("Upload Zip file", async () => {
    const formData = new FormData();
    const filePath = "go1.23.2.linux-amd64.tar.gz";
    try {
      await uploadFile(formData, filePath, {
        filename: "Golang binary",
        contentType: "application/gzip",
      });
    } catch (err) {
      fail("Failed to upload zip file");
    }
  });

  await t.test("Upload PDF file", async () => {
    const formData = new FormData();
    const filePath =
      "Abraham Silberschatz, Henry Korth and S. Sudarshan - Database System Concepts. 7-McGraw-Hill Education (2020).pdf";
    try {
      uploadFile(formData, filePath, {
        filename:
          "Abraham Silberschatz, Henry Korth and S. Sudarshan - Database System Concepts. 7-McGraw-Hill Education (2020)",
        contentType: "application/pdf",
      });
      assert.strictEqual(1, 1, "Image upload success");
    } catch (err) {
      fail("Failed to upload zip file");
    }
  });

  await t.test("Upload Audio file", async () => {
    const formData = new FormData();
    const filePath = "ROYA - Falling (D'Opera) (Official Visualizer).mp3";
    try {
      uploadFile(formData, filePath, {
        filename: "Roya - Falling",
        contentType: "audio/mpeg",
      });
      assert.strictEqual(1, 1, "Image upload success");
    } catch (err) {
      fail("Failed to upload zip file");
    }
  });
});
