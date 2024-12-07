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
    console.log(req.file);
    console.log(sid);
    try {
      if (req.file == undefined) {
        throw new Error(`Unable to upload file`);
      }
      const files: Files = dr.getService("Files");
      const file = await files.insert(Buffer.from("Coffee"), sid);
      res.status(201).send(`File uploaded by ${req.params.sID}`);
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
