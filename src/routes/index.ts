import express, { NextFunction, Request, Response, Router } from "express";
import path from "path";
import multer from "multer";
import { Files } from "database/database";
import dr from "utils/dependency_registrar";

const upload = multer();
const router = Router();

router.post(
  "/upload",
  upload.single("file_upload"),
  async (req: Request, res: Response, next: NextFunction) => {
    const sid = req.cookies.sid;
    console.log({ file_upload: req.file });
    console.log({ sid });

    try {
      if (req.file == undefined) {
        throw new Error(`Unable to upload file`);
      }
      console.log("Inserting uploaded file...");
      const files: Files = dr.getService("Files");
      const fileBlob = new Blob([Buffer.from(JSON.stringify(req.file))], {
        type: req.file.mimetype,
      });
      const fileBytes = await fileBlob.bytes();
      const fileID = await files.insertFile(fileBlob, sid);
      console.log("File uploaded", req.file.originalname);

      const retrievedFile = await files.getFile(sid, fileID);
      console.log(retrievedFile);
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
