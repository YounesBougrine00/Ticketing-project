import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

import { Password } from "../services/password";
import { BadRequestError, validateRequest } from "@stubguichet/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").trim().notEmpty().withMessage("Apply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(userExist.password, password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    //Generate JWT
    const userJWT = jwt.sign(
      {
        id: userExist.id,
        email: userExist.email,
      },
      process.env.JWT_SECRET!
    );

    //Store it on session object
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(userExist);
  }
);

export { router as signinRouter };
