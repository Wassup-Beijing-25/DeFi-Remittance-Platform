import remittanceModel from "../models/remittance.model.js";

export const sendMoney = async (req, res) => {
  try {
    const { sender, recipient, token, amount, txHash } = req.body;

    const newTx = new remittanceModel({
      sender,
      recipient,
      token,
      amount,
      txHash,
    });

    await newTx.save();
    res.status(201).json({ message: "Remittance recorded", tx: newTx });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating remittance", details: err.message });
  }
};

export const checkStatus = async (req, res) => {
  try {
    const tx = await remittanceModel.findOne({ txHash: req.params.txHash });
    if (!tx) return res.status(404).json({ error: "Transaction not found" });

    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: "Error fetching status" });
  }
};

export const claimRemittance = async (req, res) => {
  try {
    const tx = await remittanceModel.findOneAndUpdate(
      { txHash: req.params.txHash },
      { status: "claimed" },
      { new: true }
    );
    if (!tx) return res.status(404).json({ error: "Transaction not found" });

    res.json({ message: "Status updated to claimed", tx });
  } catch (err) {
    res.status(500).json({ error: "Error updating status" });
  }
};
