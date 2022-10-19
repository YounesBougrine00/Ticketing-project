import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

import { BadRequestError,validateRequest } from "@stubguichet/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),

    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Passwort not strong enough"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;

    //Verify if Email already in use
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

    //Generate JWT

    const useJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );

    //Store it on session object
    req.session = {
      jwt: useJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
