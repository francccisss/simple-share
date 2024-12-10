import { Request, Response, NextFunction } from "express";
import { deflate, inflate } from "zlib";

async function compress(file: Blob): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    deflate(Buffer.from(await file.arrayBuffer()), async (err, result) => {
      console.log("Compressing file buffer");
      if (err != null) {
        reject(err);
      }
      const filebuf = await file.bytes();
      console.log(
        "File size reduced from %d bytes, to %d bytes",
        filebuf.byteLength,
        result.byteLength,
      );
      resolve(result);
    });
  });
}
async function decompress(file: Buffer): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    inflate(file, (err, result) => {
      console.log("Decompressing file buffer");
      if (err != null) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export default { compress, decompress };
