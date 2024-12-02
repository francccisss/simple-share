import express, { Request, Response } from "express";

function index(req: Request, res: Response) {
  res.send("Welcome to simple search");
}

export default { index };
