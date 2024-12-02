import fs from "fs/promises";
import FormData from "form-data";
import NodeFetch from "node-fetch";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function uploadFile(
  formData: FormData,
  filePath: string,
  fileContents: FormData.AppendOptions,
) {
  const file = await fs.readFile(path.join(__dirname, "test_files", filePath));
  formData.append("file_upload", file, fileContents);
  const post = await NodeFetch("http://localhost:8081/api/upload/ses123", {
    method: "POST",
    body: formData,
  });
  if (post.status !== 201) {
    throw new Error();
  }
  const data = await post.text();
  console.log(data);
}
