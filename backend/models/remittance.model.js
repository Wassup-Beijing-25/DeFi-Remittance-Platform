import mongoose from "mongoose";

const RemittanceSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  token: { type: String, required: true },
  amount: { type: String, required: true },
  txHash: { type: String, required: true },
  network: { type: String, default: "mumbai" },
  status: { type: String, default: "pending" }, // pending, claimed, failed
  createdAt: { type: Date, default: Date.now },
});

const Remittance = mongoose.model("Remittance", RemittanceSchema);
export default Remittance;
