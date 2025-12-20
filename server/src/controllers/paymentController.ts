import type { Request, Response } from "express";
import Wallet from "../models/Wallet";
import Payment from "../models/Payment";

export const addMoney = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { amount } = req.body;

  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    { $inc: { balance: amount } },
    { new: true, upsert: true }
  );

  await Payment.create({
    user: userId,
    amount,
    status: "success",
    gateway: "mock",
  });

  res.json(wallet);
};

