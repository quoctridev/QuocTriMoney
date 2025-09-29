import fs from "fs";
import path from "path";

const BALANCE_FILE = path.resolve("./balance.json");

function ensureFile() {
  if (!fs.existsSync(BALANCE_FILE)) {
    fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: 0 }, null, 2));
  }
}

export function getBalance() {
  ensureFile();
  try {
    const { balance } = JSON.parse(fs.readFileSync(BALANCE_FILE, "utf8"));
    return Number.isFinite(balance) ? balance : 0;
  } catch {
    return 0;
  }
}

function setBalance(value) {
  ensureFile();
  fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: Math.round(value) }, null, 2));
}

export function parseVnd(input) {
  if (typeof input === "number") return Math.round(input);
  if (!input) return 0;
  const s = String(input)
    .replace(/\s+/g, "")
    .replace(/[₫,\.]/g, "")
    .replace(/vnd/i, "")
    .replace(/k$/i, "000"); // 50k -> 50000
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error("Số tiền không hợp lệ");
  return Math.round(n);
}

export function updateBalance(amount, type) {
  const amt = parseVnd(amount);
  let balance = getBalance();
  balance += type === "in" ? amt : -amt;
  setBalance(balance);
  return balance;
}
