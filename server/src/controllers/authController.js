import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import handlebars from "handlebars";
import { sendEmail } from "../utils/sendEmail.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, "Email exist'");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Bad credential");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, "Bad credentials");
  }

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, "Bad credentials");
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await session.deleteOne();
    res.clearCookie("sessionId");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw createHttpError(401, "Session expired");
  }

  await session.deleteOne();
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: "Session refreshed!" });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);

  // const templatePath = path.join(
  //   __dirname,
  //   "src/templates/reset-password-email.html",
  // );
  // const source = fs.readFileSync(templatePath, "utf8");
  // const template = handlebars.compile(source);

  if (!user) {
    return res
      .status(200)
      .json({ message: "Email with reset link has been sent" });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const frontendURL = `${process.env.FRONTEND_URL}?token=${resetToken}`;

  // const htmlToSend = template({
  //   email: email,
  //   resetLink: frontendURL,
  // });

  console.log(resetToken);

  await sendEmail({
    // htmlToSend,
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Password reset link",
    html: `<p>Email reset <a href=${frontendURL}>link</a> here!!!</p>`,
  });

  res.status(200).json({ message: "Email with reset link has been sent" });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log("JWT error:", error.name);
    console.log("JWT message:", error.message);
    throw createHttpError(401, "Bad token");
  }
  const user = await User.findOne({ _id: payload.sub, email: payload.email });
  console.log(user);
  if (!user) {
    throw createHttpError(404, "Not found");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  await Session.deleteMany({ _id: user._id });

  res.status(200).json({ message: "Password reset success" });
};
