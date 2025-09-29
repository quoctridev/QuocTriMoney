function formatPaymentNotification(data) {

  const content = data.content.split("-")
  return `
💸 Giao dịch mới tại ${data.gateway}
📅 Thời gian: ${data.transactionDate}
💰 Số tiền: ${data.transferAmount.toLocaleString()} VND (${data.transferType === "in" ? "Vào ✅" : "Ra ❌"})
📝 Nội dung: ${content[0] || "Không có"}
Hãy vào: https://coda.io/d/My-first-Coda-doc_drxVLdWN37Z/Thu-chi-tien_sunGOMn3#_luHWjezk
  `;
}
export { formatPaymentNotification };