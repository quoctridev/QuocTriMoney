import { updateBalance } from "../utils/balance.js";
import { getBot } from "./botCommand.js";
import { formatPaymentNotification } from "../utils/formatPaymentNotification.js";


export async function payment(req, res) {
  try {
    const d = req.body || {};
    if (!d.transferType || typeof d.transferAmount === "undefined") {
      return res.status(400).json({ success: false, error: "Thiếu transferType/transferAmount" });
    }

    // 1) Update tổng tiền
    const balance = updateBalance(d.transferAmount, d.transferType);

    // 2) Gửi Telegram
    const bot = getBot();
    const chatId = process.env.CHAT_ID;
    if (bot && chatId) {
      const msg = formatPaymentNotification(d) + `\n📊 Tổng: ${Number(balance).toLocaleString("vi-VN")} VND`;
      await bot.telegram.sendMessage(chatId, msg,{ disable_web_page_preview: true });
    }

    // 3) Ghi Coda 
    const codaToken = process.env.CODA_TOKEN;
    const docId = process.env.DOC_ID
    if (codaToken) {
      const endpoint =
        d.transferType === "in"
          ? `https://coda.io/apis/v1/docs/${docId}/tables/Thu/rows`
          : `https://coda.io/apis/v1/docs/${docId}/tables/Chi/rows`;

      const rows =
        d.transferType === "in"
          ? [
              { column: "c-WsHiAv-Ulp", value: d.transactionDate }, // Thời gian
              { column: "c-hBcWrtfjaO", value: d.transferAmount },  // Số tiền
              { column: "c-P0pNHjvj5c", value: d.content || "" }    // Nội dung
            ]
          : [
              { column: "c-b-inK9p6qt", value: d.transactionDate },
              { column: "c-9I3I97FwF4", value: d.transferAmount },
              { column: "c-HL792cmbHe", value: d.content || "" }
            ];

      try {
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${codaToken}`
          },
          body: JSON.stringify({ rows: [{ cells: rows }] })
        });
      } catch (e) {
        console.error("Coda error:", e.message || e);
        
      }
    }

    return res.status(200).json({ success: true, balance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}
