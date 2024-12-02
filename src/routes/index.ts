import express, { NextFunction, Request, Response, Router } from "express";
import path from "path";
import multer from "multer";

const upload = multer();

const router = Router();

router.post(
  "/upload/:sID/",
  upload.single("file_upload"),
  function index(req: Request, res: Response) {
    console.log("Uploaded");
    console.log(req.file);
    res.send(`File uploaded by ${req.params.sID}`);
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
