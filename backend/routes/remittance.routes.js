import express from "express";
import {
  sendMoney,
  claimRemittance,
  checkStatus,
} from "../controllers/remittance.controller.js";

const router = express.Router();

// POST /send
router.post("/send", sendMoney);

// GET /status/:txHash
router.get("/status/:txHash", checkStatus);

// PATCH /claim/:txHash
router.patch("/claim/:txHash", claimRemittance);

export default router;
