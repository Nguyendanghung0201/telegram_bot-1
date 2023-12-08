let db = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'bot_telegram'
    }
})
let table ="users_telegram_k3go"
let table_chien_luoc = "chienluoc_k3go"
// const replyMarkup = {
//     keyboard: [
//         [
//             'Bắt đầu',
//             'Cài DCA Thua'
//         ],
//         [
//             "Đăng Nhập",
//             "Cài Ngược",
//             "Chốt lời/lỗ"
//         ],
//         [
//             "Chiến lược",
//             // "Bật copy",
//             "Lịch sử"
//         ],
//         [
//             "Cài công thức",
//             "Bật đợi gãy"
//         ]

//     ],

// };
const Res = require("../json");

const axios = require('axios')
// function getreplyMarkup(checklogin) {
//     let replyMarkup = {
//         keyboard: [
//             [
//                 'Bắt đầu',
//                 'Cài DCA Thua'
//             ],
//             [
//                 "Đăng Nhập",
//                 "Cài Ngược",
//                 "Chốt lời/lỗ"
//             ],
//             [
//                 "Chiến lược vốn",
//                 "Bật copy",
//                 "Lịch sử"
//             ],
//             [
//                 "Cài công thức",
//                 "Bật đợi gãy"
//             ]

//         ],

//     };


//     return replyMarkup

// }
exports.login_telegram = async function (text, chatId, bot, messageId, name) {
    let arrary = text.split("\n")

    if (arrary.length != 3) {
        bot.sendMessage(chatId, "❌ Đăng nhập thất bại vì lý do: Cú pháp đăng nhập không đúng", {
            reply_to_message_id: messageId,
        })

    } else {
        // https://bdguubdg.com/api/webapi/UserLogin
        // 
        //          https://bdguubdg.com/api/webapi/UserExpired

        let user = await axios({
            method: 'post',
            url: 'https://bdguubdg.com/api/webapi/UserLogin',
            data: {
                username:"+84"+ arrary[1],
                pwd: arrary[2],
                regtype: "",
                phonetype: "0",
                language: "vi"
            },
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })

        if (user && user.data && user.data.success && user.data.data.Sign) {
            //  status 1 acc đang được login 1 nick
            let check = await db(table).select('*').where({
                tele_id: chatId,
                usersname: arrary[1]
            }).first()
            await db(table).update('status', 2).where('tele_id', chatId)
            await db(table).update('status', 3).where('usersname', arrary[1])
            if (check) {
                await db(table).update({
                    pass: arrary[2],
                    data: JSON.stringify(user.data.data),
                    Sign: user.data.data.Sign,
                    UserId: user.data.data.UserId,
                    NickName: user.data.data.NickName,
                    status: 1
                }).where('id', check.id)

            } else {
                //  thêm người chơi vào db
                let datainsert = {
                    tele_id: chatId,
                    usersname: arrary[1],
                    pass: arrary[2],
                    data: JSON.stringify(user.data.data),
                    Sign: user.data.data.Sign,
                    UserId: user.data.data.UserId,
                    NickName: user.data.data.NickName,
                    tele_name: name
                }
                await db(table).insert(datainsert)
            }
            let Amount = formatNumberWithCommas(user.data.data.Amount)
            let text_chat = `✅ Đăng nhập thành công tài khoản:

- User ID:  ${user.data.data.UserId}    
- Username:  ${arrary[1]}
- Nickname:  ${user.data.data.NickName}
- Amount:  ${Amount} đ`
            bot.sendMessage(chatId, text_chat, {
                reply_to_message_id: messageId,
            })

        } else {
            bot.sendMessage(chatId, "❌ Đăng nhập thất bại vì lý do: Tài khoản hoặc Mật khẩu không đúng", {
                reply_to_message_id: messageId,
            })
        }
    }
}
function formatNumberWithCommas(number) {
    if (typeof number == 'number') {
        return number.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

}
exports.check_login = async function (chatId) {
    return await db(table).select('*').where({
        tele_id: chatId,
        status: 1
    }).first()
}
exports.themchienluoc = async function (text, chatId, bot, checklogin, messageId) {
    let arrary = text.split("\n")
    if ((arrary[0] != 'bet' && arrary[0] != 'BET') || arrary.length <= 1) {
        bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
            reply_to_message_id: messageId,
        })

    } else {
        let check_ok = true
        let count = 0
        let new_array = []
        for (let item of arrary) {
            if (count === 0) {
                count++
            } else {
                item = item.trim()
                let check = isNumber(item)
                new_array.push(item)
                if (check === false) {
                    check_ok = false
                    break
                }
                count++
            }


        }
        if (check_ok) {
            //  đạt tiêu chuẩn

            await db(table).update({
                chienluoc: new_array.toString()
            }).where('id', checklogin.id)
            let count2 = 1
            let text_chat_item = ""

            for (let item of new_array) {
                text_chat_item = text_chat_item + `Lượt ${count2}: ${item} đ\n`
                count2++
            }
            let text_chat = `Đã cập nhật chiến lược:
${text_chat_item}`
            bot.sendMessage(chatId, text_chat, {
                reply_to_message_id: messageId,
            })
        } else {
            //  
            bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
                reply_to_message_id: messageId,
            })
        }
    }
}
exports.batdau = async function (text, chatId, bot, checklogin, messageId) {
    let amount = await axios.post("https://bdguubdg.com/api/webapi/GetUserAmount", {
        uid: checklogin.UserId,
        sign: checklogin.Sign,
        language: "vi"
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    if (amount && amount.data && amount.data.data && amount.data.data.Amount) {
        let json = checklogin.chienluoc.split(",");
        let text_cuoc = ""
        let count = 1
        let list_task_run = ""
        if (checklogin.chienluoc == "NONE") {
            text_cuoc = "<b><u>👉  Chưa cài chiến lược vốn</u></b>\n"
        } else {
            // 👉 Chiến lược:
            text_cuoc = "<b><u>👉 Chiến lược:</u></b>\n"
            for (let item of json) {
                text_cuoc = text_cuoc + `      <i>Cược ${count}: ${formatNumberWithCommas(item)}</i> đ\n`
                count++
            }
        }
        //     👉  Chưa cài chiến lược vốn
        //  💰 Tổng lợi nhuận: <code style="color:blue">-166,200 </code> đ
        let text_chienluoc = "TẮT";
        let text_cong_thuc = ""

        // if (checklogin.vngo1) {
        //     list_task_run = list_task_run + "| Vn-Go 1"
        // }
        // if (checklogin.vngo3) {
        //     list_task_run = list_task_run + " | Vn-Go 3"
        // }
        // if (checklogin.vngo5) {
        //     list_task_run = list_task_run + " | Vn-Go 5"
        // }
        // if (checklogin.vngo10) {
        //     list_task_run = list_task_run + " | Vn-Go 10"
        // }

        // if (checklogin.trxhash1) {
        //     list_task_run = list_task_run + " | Trx Hash"
        // }

        // if (checklogin["5dgo1"]) {
        //     list_task_run = list_task_run + "| 5D-Go 1"
        // }
        // if (checklogin["5dgo3"]) {
        //     list_task_run = list_task_run + " | 5D-Go 3"
        // }
        // if (checklogin["5dgo5"]) {
        //     list_task_run = list_task_run + " | 5D-Go 5"
        // }
        // if (checklogin["5dgo10"]) {
        //     list_task_run = list_task_run + " | 5D-Go 10"
        // }
        if (checklogin.k3go1) {
            list_task_run = list_task_run + " | K3-Go 1"
        }
        if (checklogin.k3go3) {
            list_task_run = list_task_run + " | K3-Go 3"
        }
        if (checklogin.k3go5) {
            list_task_run = list_task_run + " | K3-Go 5"
        }
        if (checklogin.k3go10) {
            list_task_run = list_task_run + " | K3-Go 10"
        }

        // 
        if (checklogin.chienluocdata != "NONE" && checklogin.chienluoc != "NONE" && list_task_run !== "") {
            text_chienluoc = "THEO CÔNG THỨC " + checklogin.chienluoc_id
            let data = JSON.parse(checklogin.chienluocdata_goc)
            for (let element of data) {
                text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
            }

        } else {
            if (checklogin.coppy == 'on') {
                text_chienluoc = "BẬT"
            }
        }


        let text = `Chào mừng <b>${checklogin.tele_name}</b> đến với Auto BDG!

🆔 ID của bạn là: <code style="color:blue">${checklogin.tele_id}</code>

🤵 Tài khoản: ${checklogin.usersname}
    - ID: ${checklogin.UserId} 
    - Số dư: ${formatNumberWithCommas(amount.data.data.Amount)}đ

👉 <b>Chiến lược:</b> <u> ${checklogin.cainguoc == 'off' ? 'Thuận' : "Ngược"} </u>
👉 <b><u>DCA:</u></b> Khi ${checklogin.caidca == 'thang' ? 'THẮNG' : "Thua"} 
👉 <b><u>ĐỢI GÃY:</u></b> ${checklogin.doigay == 'on' ? 'Đang đợi gãy' : 'Đã tắt'} 
${text_cuoc}
👉 <b>Dừng lỗ:</b> <code style="color:blue">${checklogin.lodung ? formatNumberWithCommas(checklogin.lodung) : "0"}</code> đ
👉 <b>Dừng lời:</b> <code style="color:blue">${checklogin.loidung ? formatNumberWithCommas(checklogin.loidung) : '0'}</code> đ

👉 <b>Trạng thái giao dịch: <u>${text_chienluoc}</u></b>
${text_cong_thuc}${list_task_run}

${checklogin.chienluoc == "NONE" ? "<b><u>Vui lòng cài đặt chiến lược và chiến lược vốn trước khi bắt đầu giao dịch</u></b>" : ""}`
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, text, {
            reply_to_message_id: messageId,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
        })
    } else {
        await db(table).update('status', 5).where('id', checklogin.id)
        bot.sendMessage(chatId, "❌ Lỗi hệ thống hoặc đăng nhập lại tài khoản", {
            reply_to_message_id: messageId,
        })
    }

}
function isNumber(str) {
    // Sử dụng biểu thức chính quy để kiểm tra xem chuỗi có phải là số không
    // ^: Bắt đầu chuỗi
    // \d*: Một hoặc nhiều chữ số
    // $: Kết thúc chuỗi
    // !: Phủ định để kiểm tra xem chuỗi không chứa kí tự chữ
    return /^\d*$/.test(str);
}
function checkgiatri(str) {
    //  2L1N_N
    // check xem dòng cuối có phải N hay L ko
    let count = 0
    let check = true
    for (let item of str) {
        if (count == (str.length - 1)) {
            //    phần tử cuối
            if (item != 'N' && item != "L") {
                check = false

            }
        } else if (count == (str.length - 2)) {
            if (item != '_') {
                check = false
                break
            }
        } else {
            if (count % 2 === 0) {
                //  chia hết cho 2  là số
                let test = isNumber(item)
                if (test === false) {
                    check = false
                }
            } else {
                //  ko chia hết cho 2 và là L hoặc N
                if (item != 'N' && item != "L") {
                    check = false

                }
            }

        }

        count++
    }
    return check

}
function getreplyMarkup(data) {
    let replyMarkup = {
        keyboard: [
            [
                'Bắt đầu',
                data.caidca == 'thang' ? 'Cài DCA Thua' : 'Cài DCA Thắng'
            ],
            [
                "Đăng Nhập",
                data.cainguoc == 'off' ? "Cài Ngược" : 'Cài thuận',
                "Chốt lời/lỗ"
            ],
            [
                "Chiến lược",
                data.chienluoc_id !== 0 ? "TẮT công thức" : data.coppy == "off" ? "BẬT copy" : "TẮT copy", // "Bật copy",
                "Lịch sử"
            ],
            [
                "Cài công thức",
                data.doigay == "off" ? "Bật đợi gãy" : "Tắt đợi gãy"
            ]

        ],

    };
    return replyMarkup
}

exports.dunglocatloi = async function (text, chatId, bot, checklogin, messageId) {
    let arrary = text.split("\n")

    if (arrary.length != 3 || (arrary[0] != 'sltp' && arrary[0] != 'SLTP')) {
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup
        })

    } else {
        let check1 = isNumber(arrary[1])
        let check2 = isNumber(arrary[2])
        if (check1 == false || check2 == false) {
            bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
                reply_to_message_id: messageId,
            })
        } else {
            // ✅ Đã cập nhật mức dừng lời/lỗ
            await db(table).update({
                lodung: arrary[1],
                loidung: arrary[2],
            }).where('id', checklogin.id)

            bot.sendMessage(chatId, "✅ Đã cập nhật mức dừng lời/lỗ", {
                reply_to_message_id: messageId,
            })
        }

    }
}

exports.themcongthuc = async function (text, chatId, bot, checklogin, messageId) {

    let arrary = text.split("\n")
    if ((arrary[0] != '/THEMCT' && arrary[0] != '/themct') || arrary.length <= 1) {
        bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
            reply_to_message_id: messageId,
        })

    } else {
        let kiemtra = await db(table_chien_luoc).select('*').where('tele_id', checklogin.id)
        if (kiemtra && kiemtra.length >= 15) {
            return bot.sendMessage(chatId, "❌ Bạn đã cài tối đa 15 công thức", {
                reply_to_message_id: messageId,
            })
        }
        //  kiểm tra cú pháp công thức
        let check_ok = true
        let count = 0
        let new_array = []

        for (let item of arrary) {
            if (count === 0) {
                count++
            } else {
                item = item.trim()
                let check = checkgiatri(item)
                new_array.push(item)
                if (check === false) {
                    check_ok = false
                    break
                }
                count++
            }
        }
        //  đã check xog
        if (check_ok) {

            // id	data	tele_id	status
            // ["1L2L_N","2N1L_L"]
            await db(table_chien_luoc).insert({
                data: JSON.stringify(new_array),
                tele_id: checklogin.id,
                status: 1
            })

            let text_chat = `✅ Đã thêm công thức thành công`
            bot.sendMessage(chatId, text_chat, {
                reply_to_message_id: messageId,
            })

        } else {
            bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
                reply_to_message_id: messageId,
            })
        }



    }
}

function convertdata(data) {
    let text = ""
    let current = ""
    let convert = data.split("").reverse().join("")
    for (let item of convert) {
        if (item === 'N') {
            current = "N"
            text = text + "N"
        }
        if (item === 'L') {
            current = "L"
            text = text + "L"
        }
        if (item !== "N" && item !== "L" && item !== '1') {
            let number = Number(item)

            for (let i = 1; i < number; i++) {
                text = text + current
            }

        }
    }
    return text
}
exports.choncongthuc = async function (text, chatId, bot, checklogin, messageId) {
    let arrary = text.split(" ")

    if (arrary.length != 4 || (arrary[0] != '/CT' && arrary[0] != '/ct')) {
        bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
            reply_to_message_id: messageId,
        })
    } else {

        let id = arrary[1]
        let check = await db(table_chien_luoc).select('*').where({
            id: id,
            tele_id: checklogin.id
        }).first()
        if (check) {
            let type = arrary[2].toLocaleLowerCase()
            let input_time = arrary[3]
            let time_auto = 0
            let type_id = 0
            let column = ""
            // if (type == 'vn-go') {
            //     type_id = 1
            //     if (['1', '3', '5', '10'].includes(input_time)) {
            //         time_auto = input_time
            //     }
            //     column = "vngo"
            // }
            // if (type == 'trx') {
            //     type_id = 2
            //     if (['1'].includes(input_time)) {
            //         time_auto = input_time
            //     }
            //     column = "trxhash"

            // }
            // if (type == '5d-go') {
            //     type_id = 3
            //     if (['1', '3', '5', '10'].includes(input_time)) {
            //         time_auto = input_time
            //     }
            //     column = "5dgo"
            // }
            if (type == 'k3-go') {
                type_id = 4
                if (['1', '3', '5', '10'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "k3go"
            }
            if (type_id == 0 || time_auto == 0) {
                return bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
                    reply_to_message_id: messageId,
                })
            }


            let chien_luoc_list = JSON.parse(check.data)
            let list = chien_luoc_list.map(element => {
                // 3L_N  2L2N_N
                let check = element.slice(0, element.length - 2);
                let check3 = convertdata(check)
                //     LLL
                let last = element.slice(element.length - 1, element.length)
                let text = check3 + "_" + last
                return text
            })
            column = column + time_auto
            let data_update = {
                "chienluocdata": JSON.stringify(list),
                "chienluocdata_goc": check.data,
                "chienluoc_id": check.id,
                "coppy": "off"
            }
            data_update[column] = 1
            await db(table).update(data_update).where("id", checklogin.id)
            checklogin.chienluocdata = check.data
            checklogin.chienluoc_id = check.id
            let replyMarkup = getreplyMarkup(checklogin)

            bot.sendMessage(chatId, `✅ Đã chọn công thức ${id}`, {
                reply_to_message_id: messageId,
                reply_markup: replyMarkup
            })
        } else {
            // ❌ Không tìm thấy công thức 10. Đã tắt công thức
            bot.sendMessage(chatId, `❌ Không tìm thấy công thức ${id}. Đã tắt công thức`, {
                reply_to_message_id: messageId,
            })
        }
    }
}


exports.battatdoigay = async function (text, chatId, bot, checklogin, messageId) {
    if (checklogin.doigay == 'off') {
        await db(table).update('doigay', 'on').where('id', checklogin.id)
        // ✅ Đã đổi trạng thái chờ gãy sang ON
        checklogin.doigay = "on"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "✅ Đã đổi trạng thái chờ gãy sang ON", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup
        })

    } else {
        await db(table).update('doigay', 'off').where('id', checklogin.id)
        // ✅ Đã đổi trạng thái chờ gãy sang ON
        checklogin.doigay = "off"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "✅ Đã đổi trạng thái chờ gãy sang OFF", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup
        })
    }

}

exports.cainguoc = async function (text, chatId, bot, checklogin, messageId) {
    if (checklogin.cainguoc == 'off') {
        await db(table).update('cainguoc', 'on').where('id', checklogin.id)
        // Đã đặt chiến lược đánh NGƯỢC
        checklogin.cainguoc = "on"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "✅ Đã đặt chiến lược đánh NGƯỢC", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup
        })

    } else {
        await db(table).update('cainguoc', 'off').where('id', checklogin.id)
        checklogin.cainguoc = "off"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "✅ Đã đặt chiến lược đánh THUẬN", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup
        })
    }
}
exports.caiDCA = async function (text, chatId, bot, checklogin, messageId) {
    if (checklogin.caidca == 'thang') {
        await db(table).update('caidca', 'thua').where('id', checklogin.id)
        checklogin.caidca = "thua"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "✅ Đã đổi trạng thái nhồi lệnh khi THUA", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup
        })
    } else {
        await db(table).update('caidca', 'thang').where('id', checklogin.id)
        checklogin.caidca = "thang"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "✅ Đã đổi trạng thái nhồi lệnh khi THẮNG", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup
        })

    }

}
exports.batcopy = async function (text, chatId, bot, checklogin, messageId) {
    if (checklogin.chienluoc == "NONE") {
        return bot.sendMessage(chatId, "❌ Bạn chưa cài đặt chiến lược vốn", {
            reply_to_message_id: messageId,
        })
    }
    if (checklogin.chienluocdata != "NONE") {
        return bot.sendMessage(chatId, "❌ Bạn phải tắt công thức trước", {
            reply_to_message_id: messageId,
        })
    }
    if (checklogin.coppy == 'off') {
        // ✅ Đã cập nhật trạng thái giao dịch sang BẬT COPY
        await db(table).update({
            'coppy': 'on',
            "chienluoc_id": 0,
            "chienluocdata": "NONE",
            "chienluocdata_goc": "NONE",
        }).where('id', checklogin.id)
        checklogin.coppy = "on"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, `✅ Đã cập nhật trạng thái giao dịch sang BẬT COPY
<code style="color:blue">/ADD K3-Go 3</code> <i>để chọn thêm xổ số K3-Go thời gian 3 phút cho lệnh copy</i>
<code style="color:blue">/STOP K3-Go 3</code> <i>để chọn dừng xổ số K3-Go thời gian 3 phút cho lệnh copy</i>`, {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup,
            parse_mode: "HTML"
        })

    } else {
        await db(table).update('coppy', 'off').where('id', checklogin.id)
        checklogin.coppy = "off"
        let replyMarkup = getreplyMarkup(checklogin)
        bot.sendMessage(chatId, "✅ Đã cập nhật trạng thái giao dịch sang Tắt COPY", {
            reply_to_message_id: messageId,
            reply_markup: replyMarkup,
            parse_mode: "HTML"
        })
    }
}

exports.caicongthuc = async function (text, chatId, bot, checklogin, messageId) {
    let list = await db(table_chien_luoc).select("*").where('tele_id', checklogin.id)
    //  <i>   </i>
    let congthuc = `<b>CÀI CÔNG THỨC</b>

<b><u>Chọn công thức:</u></b> <code style="color:blue">/CT [stt] [name] [time]</code>
<b>Ví dụ:</b> <code style="color:blue">/CT 1 K3-Go 1</code> <i>để chọn công thức 1 xổ K3-Go thời gian 1 phút</i>
              <code style="color:blue">/CT 1 K3-Go 3</code> <i>để chọn công thức 1 xổ K3-Go thời gian 3 phút</i>
              <code style="color:blue">/CT 1 K3-Go 5</code> <i>để chọn công thức 1 xổ K3-Go thời gian 5 phút</i>
              <code style="color:blue">/ADD K3-Go 3</code> <i>để chọn thêm xổ K3-Go thời gian 3 phút cho công thức đang chọn</i>
              <code style="color:blue">/STOP K3-Go 3</code> <i>để chọn dừng xổ K3-Go thời gian 3 phút cho công thức đang chọn</i>
🔸 Chú ý: Chọn công thức sẽ tự động bật Đánh theo công thức 
có thể chạy nhiều số khác nhau tại một thời điểm.        
chỉ có thể áp dụng một công thức tại một thời điểm cho nhiều số khác nhau

<b><u>Thêm công thức:</u></b> <i>(tối đa 15)</i>
        <code style="color:blue">/THEMCT</code>
        <code style="color:blue">[số][kqua][số][kqua]..._[đánh]</code>

<b>Ví dụ:</b>
        <code style="color:blue">/THEMCT</code>
        <code style="color:blue">2L1N_N</code>
        <code style="color:blue">2N1L_L</code>
<i>để thêm công thức 2 Lớn 1 Nhỏ đánh Nhỏ, 2 Nhỏ 1 Lớn đánh Lớn</i>

<b><u>Danh sách công thức:</u></b>\n`
    let text_ct = ""
    // CT 2 (Đang chọn):
    //  2L_N
    //  2N_L
    if (list.length == 0) {
        text_ct = "Chưa có công thức nào"
    } else {

        for (let item of list) {
            let data = JSON.parse(item.data)
            if (item.id == checklogin.chienluoc_id) {
                let cac_dk = ""
                for (let element of data) {
                    cac_dk = cac_dk + '<code style="color:blue">      ' + element + '</code>' + '\n'
                }
                text_ct = text_ct + `<code style="color:blue">CT ${item.id} ( Đang chọn) :</code>\n` + cac_dk
            } else {
                let cac_dk = ""
                for (let element of data) {

                    cac_dk = cac_dk + '<code style="color:blue">      ' + element + '</code>' + '\n'
                }


                text_ct = text_ct + `<code style="color:blue">CT ${item.id}  :</code>\n` + cac_dk
            }
        }

    }

    let congthuc_sau = congthuc + text_ct

    let replyMarkup = getreplyMarkup(checklogin)
    bot.sendMessage(chatId, congthuc_sau, {
        reply_to_message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
    })
}

exports.addthemso = async function (text, chatId, bot, checklogin, messageId) {
    let arrary = text.split(" ")

    if (arrary.length != 3 || (arrary[0] != '/Add' && arrary[0] != '/ADD' && arrary[0] != '/add')) {
        bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
            reply_to_message_id: messageId,
        })
    } else {
        if ((checklogin.chienluoc_id && checklogin.chienluocdata != "NONE") || checklogin.coppy == 'on') {
            let type = arrary[1].toLocaleLowerCase()
            let input_time = arrary[2]
            let time_auto = 0
            let type_id = 0
            let column = ""
            if (type == 'vn-go') {
                type_id = 1
                if (['1', '3', '5', '10'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "vngo"
            }
            if (type == 'trx') {
                type_id = 2
                if (['1'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "trxhash"

            }
            if (type == '5d-go') {
                type_id = 3
                if (['1', '3', '5', '10'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "5dgo"
            }
            if (type == 'k3-go') {
                type_id = 4
                if (['1', '3', '5', '10'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "k3go"
            }
            if (type_id == 0 || time_auto == 0) {
                return bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
                    reply_to_message_id: messageId,
                })
            }
            column = column + time_auto
            let data_update = {

            }
            data_update[column] = 1

            await db(table).update(data_update).where("id", checklogin.id)
            bot.sendMessage(chatId, `✅ Đã chọn xố sổ ${type} ${input_time}`, {
                reply_to_message_id: messageId,

            })

        } else {
            bot.sendMessage(chatId, "❌ Bạn chưa chọn công thức, hãy chọn một công thức trước khi thêm Xổ số", {
                reply_to_message_id: messageId,
            })
        }

    }
}
exports.stopthemso = async function (text, chatId, bot, checklogin, messageId) {
    let arrary = text.split(" ")

    if (arrary.length != 3 || (arrary[0] != '/STOP' && arrary[0] != '/stop')) {
        bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
            reply_to_message_id: messageId,
        })
    } else {
        if (checklogin.chienluoc_id && checklogin.chienluocdata != "NONE") {
            let type = arrary[1].toLocaleLowerCase()
            let input_time = arrary[2]
            let time_auto = 0
            let type_id = 0
            let column = ""
            if (type == 'vn-go') {
                type_id = 1
                if (['1', '3', '5', '10'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "vngo"
            }
            if (type == 'trx') {
                type_id = 2
                if (['1'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "trxhash"

            }
            if (type == '5d-go') {
                type_id = 3
                if (['1', '3', '5', '10'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "5dgo"
            }
            if (type == 'k3-go') {
                type_id = 4
                if (['1', '3', '5', '10'].includes(input_time)) {
                    time_auto = input_time
                }
                column = "k3go"
            }
            if (type_id == 0 || time_auto == 0) {
                return bot.sendMessage(chatId, "❌ Cú pháp sai /START để quay lại", {
                    reply_to_message_id: messageId,
                })
            }
            column = column + time_auto
            let data_update = {
                "coppy": "off"
            }
            data_update[column] = 0

            await db(table).update(data_update).where("id", checklogin.id)
            bot.sendMessage(chatId, `✅ Đã tắt xố sổ ${type} ${input_time}`, {
                reply_to_message_id: messageId,

            })


        } else {
            bot.sendMessage(chatId, "❌ Bạn chưa chọn công thức, hãy chọn một công thức trước khi thêm Xổ số", {
                reply_to_message_id: messageId,
            })
        }

    }
}

exports.tatcongthuc = async function (text, chatId, bot, checklogin, messageId) {
    await db(table).update({
        "chienluoc_id": 0,
        "chienluocdata": "NONE",
        "chienluocdata_goc": "NONE",
        "vngo1": 0,
        "vngo3": 0,
        "vngo5": 0,
        "vngo10": 0,
        "trxhash1": 0,
        "5dgo1": 0,
        "5dgo3": 0,
        "5dgo5": 0,
        "5dgo10": 0,
        "k3go1": 0,
        "k3go3": 0,
        "k3go5": 0,
        "k3go10": 0,
        "coppy": 'off'
    }).where('id', checklogin.id)
    checklogin.chienluoc_id = 0
    checklogin.chienluocdata = "NONE"
    let replyMarkup = getreplyMarkup(checklogin)
    bot.sendMessage(chatId, "✅ Đã cập nhật trạng thái giao dịch sang TẮT CÔNG THỨC", {
        reply_to_message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
    })

}
