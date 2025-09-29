# QuocTriMoney 💸

> Hệ thống tự động nhận thông báo giao dịch ngân hàng (qua **SePay webhook**) và gửi sang **Telegram**.
> Mục tiêu: thay vì phải tự check app ngân hàng, chỉ cần ngồi chill, có tiền vào/ra là bot nhắn liền.

---

## 🔥 Tính năng chính

* **Nhận webhook từ SePay**: hỗ trợ Vietcombank, MB Bank, Techcombank, v.v.
* **Phân tích giao dịch**: parse số tiền, loại giao dịch (in/out), nội dung chuyển khoản, số dư…
* **Push sang Telegram**: gửi vào user chat hoặc group chat.
* **Custom format**: thông báo đẹp, dễ đọc, có thể gắn emoji, highlight số tiền.


---

## 🛠️ Công nghệ sử dụng

* **Node.js + Express** → tạo REST API webhook nhận dữ liệu
* **Telegraf** → gửi message Telegram
* **dotenv** → quản lý biến môi trường

---

## 📂 Cấu trúc thư mục

```
.
├── main.js              # Entrypoint, khởi động server + bot
├── package.json
├── .env.example         # File mẫu config
├── controller/
│   └── getPayment.js    # Xử lý webhook /hooks/payment
│   └── botCommand.js    # Xử lí command telegram
└── utils/
    └── formatPaymentNotification.js # Format thông báo Telegram
```

---

## ⚙️ Config môi trường

Tạo file `.env`:

```env
PORT=3000

# Telegram
BOT_TOKEN=123456:ABC-your-bot-token #Token bot Telegram
CHAT_ID=-1001234567890   # ID group hoặc user
CODA_TOKEN= # Coda API trong https://coda.io/account
DOC_ID= # doc ID của coda 

```


## ▶️ Cài đặt & Chạy

Clone repo:

```bash
git clone git@github.com:quoctridev/quoctrimoney.git
cd quoctrimoney
npm install
```


Chạy chương trình:

```bash
npm start
```

Test webhook local (dev):

```bash
curl -X POST http://localhost:3000/hooks/payment \
  -H "Content-Type: application/json" \
  -d '{
    "gateway":"MBBank",
    "transactionDate":"2025-09-29 00:11:00",
    "accountNumber":"00412042007",
    "content":"Nap tien test",
    "transferType":"in",
    "transferAmount":500000,
    "accumulated": 10000000
  }'
```

Nếu bot config đúng → nó sẽ nhắn vào Telegram group/user.

---


## 📨 Format tin nhắn Telegram

Ví dụ khi có tiền vào:

```
💰 [MBBank] +500,000 VND
📅 2025-09-29 00:11:00
👤 Tài khoản: 00412042007
📝 Nội dung: Nap tien test
🏦 Số dư: 10,000,000 VND
```

Khi tiền ra (chuyển đi) thì đổi icon → 🔻, màu đỏ.

---

## 📈 Roadmap

* [ ] Log giao dịch vào MongoDB/Postgres
* [ ] Dashboard quản lý (React + Tailwind)
* [ ] Tích hợp Notion/Google Sheet để lưu lịch sử
* [ ] Rule tự động (ví dụ: nếu nội dung chứa “iphone” thì gắn tag `🛒 Mua sắm`)

---

## 📝 License

MIT — dùng thoải mái, nhớ credit nếu fork 😎

---

## 👤 Contact

**Nguyễn Quốc Anh (Nguyễn Quốc Trí)**  
📍 Hai Phong, Vietnam  
🎓 FPT Polytechnic – Software Development  
📧 quocanh1204.dev@gmail.com  
🔗 [https://github.com/quoctridev](https://github.com/quoctridev)  

<p>
  <a href="https://quoctri.dev">
    <img src="https://img.shields.io/badge/Website-000000?style=flat&logo=About.me&logoColor=white" alt="Website"/>
  </a>
  <a href="https://facebook.com/quoctris.dev/">
    <img src="https://img.shields.io/badge/Facebook-1877F2?style=flat&logo=facebook&logoColor=white" alt="Facebook"/>
  </a>
</p>

