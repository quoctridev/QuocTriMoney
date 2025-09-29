import { Telegraf } from "telegraf";
import { getBalance, updateBalance, parseVnd } from "../utils/balance.js";

let botInstance = null;
let launched = false;

export function getBot() {
  return botInstance;
}

export function botCommand() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.warn("BOT_TOKEN chưa cấu hình, bỏ qua bot.");
    return null;
  }
  if (botInstance) return botInstance;

  const bot = new Telegraf(BOT_TOKEN);

  bot.start((ctx) => {
    ctx.reply([
      "Sổ quỹ tối giản đang chạy.",
      "Lệnh:",
      "• /nap <sotien> [ghi chú]",
      "• /rut <sotien> [ghi chú]",
      "• /tongtien",
      "Ví dụ: /nap 100k Thu tiền mặt | /rut 50k cafe"
    ].join("\n"));
  });

  function handleAdjust(kind) {
    return async (ctx) => {
      try {
        const args = ctx.message.text.trim().split(/\s+/).slice(1);
        if (args.length === 0) return ctx.reply(`Thiếu số tiền. Ví dụ: /${kind} 100000 ghi chú`);
        const amount = parseVnd(args[0]);
        const note = args.slice(1).join(" ");

        let current = getBalance();
        if (kind === "rut" && current - amount < 0) {
            return ctx.reply(
                `❌ Không thể rút ${amount.toLocaleString("vi-VN")} VND vì số dư chỉ còn ${current.toLocaleString("vi-VN")} VND`
            );
        }
        const balance = updateBalance(amount, kind === "nap" ? "in" : "out");
        const sign = kind === "nap" ? "+" : "-";
        
        await ctx.reply([
          `${kind === "nap" ? "✅ Nạp" : "❌ Rút"}: ${sign}${amount.toLocaleString("vi-VN")} VND`,
          note ? `📝 ${note}` : null,
          `📊 Tổng: ${balance.toLocaleString("vi-VN")} VND`
        ].filter(Boolean).join("\n"));
      } catch (e) {
        await ctx.reply(`Lỗi: ${e.message || e}`);
      }
    };
  }

  bot.command("nap", handleAdjust("nap"));
  bot.command("rut", handleAdjust("rut"));
  bot.command("tongtien", (ctx) => {
    ctx.reply(`📊 Tổng hiện tại: ${getBalance().toLocaleString("vi-VN")} VND`);
  });
  bot.command('trogiup', (ctx)=>{
    ctx.reply([
      "Sổ quỹ tối giản đang chạy.",
      "Lệnh:",
      "• /nap <sotien> [ghi chú]",
      "• /rut <sotien> [ghi chú]",
      "• /tongtien",
      "Ví dụ: /nap 100k Thu tiền mặt | /rut 50k cafe"
    ].join("\n"))
  })

  if (!launched) {
    bot.launch()
      .then(() => {
        launched = true;
        console.log("Telegram bot polling...");
      })
      .catch((e) => console.error("Bot error:", e));

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }

  botInstance = bot;
  return bot;
}
