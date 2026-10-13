/**
 * Lấy chuỗi ngày hiện tại định dạng YYYY-MM-DD.
 * Hỗ trợ nhận ngày theo múi giờ client nếu client gửi lên.
 */
export function getTodayFormatted(clientDate?: string): string {
  if (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate)) {
    return clientDate;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
