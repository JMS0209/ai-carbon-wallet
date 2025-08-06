import generateBurnerWallet from "../../oracle/generateWallet";

export default function handler(req, res) {
  const wallet = generateBurnerWallet();
  res.status(200).json(wallet);
}
