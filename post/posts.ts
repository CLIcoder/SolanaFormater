import { Request, Response } from "express";
import { getMintData } from "../helper/index";
import jwt from "jsonwebtoken";

const getMint = async (req, res) => {
  jwt.verify(
    req.token,
    "vF9Xojd5ZZbY2gUjhmDBr3Uy93Lcc5ggk3LyDLoqefY",
    async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        // get the post id from the req.params
        console.log("oksssss");
        let response: any = await getMintData();
        console.log("ok");
        // return response
        return res.status(200).json(response);
      }
    }
  );
};

export default { getMint };
