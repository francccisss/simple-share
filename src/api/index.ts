import express, { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { Files, Users } from "database/database";
import dr from "utils/dependency_registrar";
import compression from "middelwares/compression";
import { file } from "types";

const upload = multer();
const router = Router();

router.post(
  "/upload",
  upload.single("file_upload"),

  async (req: Request, res: Response, next: NextFunction) => {
    const sid = req.cookies.sid;
    try {
      if (req.file == undefined) {
        throw new Error(`Unable to upload file`);
      }
      console.log("Inserting uploaded file...");
      const files: Files = dr.getService("Files");
      const users: Users = dr.getService("Users");
      const fileBlob = new Blob([Buffer.from(JSON.stringify(req.file))], {
        type: req.file.mimetype,
      });
      const deflateFile = await compression.compress(fileBlob);
      const fileID = await files.insertFile(deflateFile, sid);
      console.log("Updating user's unique file limit");
      const user = await users.updateUserSession(sid, (userState) => ({
        fileSizeContained: userState.fileSizeContained + deflateFile.byteLength,
      }));
      console.log("File uploaded", req.file.originalname);
      res.status(201).send(`File uploaded by ${sid}`);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/dl/:fileID",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.fileID);
    try {
      const files: Files = dr.getService("Files");
      const queriedFile: file = await files.getFile(req.params.fileID.trim());
      const decompressFile = await compression.decompress(
        queriedFile.fileBuffer,
      );
      const parseFile = JSON.parse(decompressFile.toString("utf8"));
      res.setHeader("Content-Type", parseFile.mimetype);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${parseFile.originalname}"`,
      );
      res.setHeader("Content-Length", `${parseFile.size}`);
      console.log(parseFile.buffer.data);
      res.send(parseFile.buffer.data);
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/remove/:file", function index(req: Request, res: Response) {
  res.send(`File removed by user ${req.params.sID}`);
});

export default router;
