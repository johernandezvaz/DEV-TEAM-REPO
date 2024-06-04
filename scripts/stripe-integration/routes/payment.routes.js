import { Router } from "express";
import { createSession } from "../controller/payment.controller.js";

const router = Router();

router.post("/create-checkout-session", createSession);

router.get("/success", (req, res) => res.redirect("/success.html"));

router.get("/cancel", (req, res) => res.redirect("/cancel.html"));

export default router;