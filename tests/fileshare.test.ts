import assert, { fail } from "assert";
import test, { describe } from "node:test";
import fs from "fs/promises";
import FormData from "form-data";
import NodeFetch from "node-fetch";
import path from "path";

// Needs `node-fetch` library because of browser api feature for sending form data
describe("Uploading different file types", () => {
  const formData = new FormData();

  test("Upload Images", async () => {
    const file = await fs.readFile(
      path.join(
        process.cwd(),
        "tests",
        "./test_files/leaves_green_dark_145996_3840x2400.jpg",
      ),
    );
    formData.append("file_upload", file, {
      filename: "leaves_green_dark_145996_3840x2400.jpg",
      contentType: "image/jpeg",
    });
    try {
      const post = await NodeFetch("http://localhost:8081/api/upload/ses123", {
        method: "POST",
        body: formData,
      });
      const data = await post.text();
      console.log(data);
    } catch (err) {
      console.error((err as Error).message);
      console.error("Unable to upload image");
      //fail("Failed to upload image");
    }
  });
});
