import express, { NextFunction, Request, Response, Router } from "express";
import path from "path";
import multer from "multer";
import { Files } from "database/database";
import dr from "utils/dependency_registrar";
import compression from "middelwares/compression";

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
      const fileBlob = new Blob([Buffer.from(JSON.stringify(req.file))], {
        type: req.file.mimetype,
      });
      const deflateFile = await compression.compress(fileBlob);
      const fileID = await files.insertFile(deflateFile, sid);
      console.log("File uploaded", req.file.originalname);
      res.status(201).send(`File uploaded by ${sid}`);
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/remove/:sID/:file",
  function index(req: Request, res: Response) {
    res.send(`File removed by user ${req.params.sID}`);
  },
);

router.get("/share/:file", function index(req: Request, res: Response) {
  res.send("File Retrieved");
});

export default router;
