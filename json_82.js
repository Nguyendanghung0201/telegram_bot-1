const chienluoc = `<b><u>👉 Cài đặt chiến lược vốn:</u></b>

<code style="color:blue">BET</code>
<code style="color:blue">{Bet 1}</code>
<code style="color:blue">{Bet 2}</code>
....
<code style="color:blue">{Bet n}</code>

<b>Ví dụ:</b>
Lệnh <b>1</b> đi vốn <i>1000đ</i>
Lệnh <b>2</b> đi vốn <i>2000đ</i>
Lệnh <b>3</b> đi vốn <i>3000đ</i>

<code style="color:blue">BET</code>
<code style="color:blue">1000</code>
<code style="color:blue">2000</code>
<code style="color:blue">3000</code>

<b><u>CHÚ Ý:</u></b> 
<b>0</b> : Bỏ lượt
<b>-1</b> : Đợi lượt thắng mới đánh tiếp - <b>Chỉ dành cho tín hiệu</b>`
const chot_loi = `👉 Cài đặt dừng lời / lỗ:

SLTP
Mức lỗ dừng
Mức lời dừng

Ví dụ:
Dừng khi lỗ 100.000
Dừng khi lời 200.000

SLTP
100000
200000

Mức dừng lời / lỗ bằng 0 -> không dừng`
const congthuc = `CÀI CÔNG THỨC

Chọn công thức: /CT [stt]
Ví dụ: /CT 1 để chọn công thức 1
🔸 Chú ý: Chọn công thức sẽ tự động bật Đánh theo công thức

Thêm công thức: (tối đa 10)
      /THEMCT
      [số][kqua][số][kqua]..._[đánh]

Ví dụ:
      /THEMCT
      2L1N_N
      2N1L_L
để thêm công thức 2 Lớn 1 Nhỏ đánh Nhỏ, 2 Nhỏ 1 Lớn đánh Lớn

Danh sách công thức: \n`
const dangnhap = `👉 Đăng nhập tài khoản theo cú pháp:

LOGIN
{username}
{password}

Ví dụ:
Tài khoản 0909000000, mật khẩu 123456789

LOGIN
0909000000
123456789`
const chuadangnhap = `Chào mừng Bạn đến với Auto 82VN!

🆔 ID của bạn là: 1036111895

💰 Tổng lợi nhuận: 0đ
👉 Đăng nhập tài khoản theo cú pháp:

     LOGIN
    {username}
    {password}`

class poker_repository {
    constructor() {
      
      
        this.chienluoc = chienluoc;
        this.chot_loi = chot_loi;
        this.congthuc = congthuc;
        this.dangnhap = dangnhap

    }

    async send_dang_nhap(name, chatId, messageId, bot) {
        let text = `Chào mừng ${name} đến với Auto 82VN!

🆔 ID của bạn là: ${chatId}

💰 Tổng lợi nhuận: 0đ
👉 Đăng nhập tài khoản theo cú pháp:

     LOGIN
    {username}
    {password}`
        bot.sendMessage(chatId, text, {
            reply_to_message_id: messageId,
        })

    }
    async send_cai_cong_thuc() {

    }

}
module.exports = new poker_repository();