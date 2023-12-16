
let db = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'PokerVn@123P',
        database: 'bot_telegram'
    }
})
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
function isNumber(str) {
    // Sử dụng biểu thức chính quy để kiểm tra xem chuỗi có phải là số không
    // ^: Bắt đầu chuỗi
    // \d*: Một hoặc nhiều chữ số
    // $: Kết thúc chuỗi
    // !: Phủ định để kiểm tra xem chuỗi không chứa kí tự chữ
    return /^\d*$/.test(str);
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
function isNumber(str) {
    // Sử dụng biểu thức chính quy để kiểm tra xem chuỗi có phải là số không
    // ^: Bắt đầu chuỗi
    // \d*: Một hoặc nhiều chữ số
    // $: Kết thúc chuỗi
    // !: Phủ định để kiểm tra xem chuỗi không chứa kí tự chữ
    return /^\d*$/.test(str);
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function removeNonAlphanumeric(inputString) {
    const regex = /[a-zA-Z0-9À-ỹầấẩẫậằắẳẵặèéêëìíîïòóôõöùúûüỳỹỷ _@:\n-]+/gu;
                 
    return inputString.match(regex) ?inputString.match(regex).join(''):"";
}
async function setuptinhieugroup(chatId, array, bot, messageId, text, table_copy) {

    let list_tin_hieu = array.filter(e => {
        let check = e == "" ? false : true
        let checkthu = checkgiatri(e.toUpperCase())
        if (checkthu == false) {
            check = false
        }
        return check
    }).map(e => e.toUpperCase())
    let quanlyvon = array.filter(e => e.includes("Quản lý vốn"))

    if (quanlyvon.length != 1 || list_tin_hieu.length == 0) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    let listvon = quanlyvon[0].replace(/[^0-9\-]/g, '')
    let list_von = listvon.split("-").filter(e => isNumber(e))
    //  chưa có thêm vào
    let list = list_tin_hieu.map(element => {
        // 3L_N  2L2N_N
        let check = element.slice(0, element.length - 2);
        let check3 = convertdata(check)
        //     LLL
        let last = element.slice(element.length - 1, element.length)
        let text = check3 + "_" + last
        return text
    })
    let listfirst = array[0].split(' ').filter(e => e)
    if (listfirst.length != 3) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    if (!['1', '3', '5', '10'].includes(listfirst[2])) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    let group_id = listfirst[1]
    let ok_check_chat = false
    bot.getChat(group_id).then((chatInfo) => {

        ok_check_chat = true
    }).catch((error) => {


    });
    await delay(1000)

    if (!ok_check_chat) {
        return bot.sendMessage(chatId, "❌ Vui lòng kiểm tra lại id nhóm tín hiệu", {
            reply_to_message_id: messageId
        })
    }
    let check_last = array.indexOf('|Thông báo liệt kê phiên (sau):')
    let datatext = ""
    if (check_last == -1) {
        //  ko có last


    } else {
        let index = 0
        for (let item of array) {
            if (check_last < index) {
                datatext = datatext + item + '\n'
            }
            index++
        }

    }
    let check = await db(table_copy).select('*').where('id_group', group_id).first()

    if (check) {
      
        await db(table_copy).update({
            id_group: group_id,
            chatid: chatId,
            chienlucvon: JSON.stringify(list_von),
            chienluocdata: JSON.stringify(list),
            chienluocdata_goc: JSON.stringify(list_tin_hieu),
            datatext: removeNonAlphanumeric(datatext),
            type: listfirst[2]
        }).where('id', check.id)
        bot.sendMessage(chatId, "✅ Đã cập nhật tín hiệu thành công", {
            reply_to_message_id: messageId
        })
    } else {
        await db(table_copy).insert({
            id_group: group_id,
            chatid: chatId,
            chienlucvon: JSON.stringify(list_von),
            chienluocdata: JSON.stringify(list),
            chienluocdata_goc: JSON.stringify(list_tin_hieu),
            datatext: removeNonAlphanumeric(datatext),
            type: listfirst[2]
        })
        bot.sendMessage(chatId, "✅ Thêm tín hiệu thành công", {
            reply_to_message_id: messageId
        })
    }



}

async function trade(chatId, array, bot, messageId, text, group_id, table_copy) {
    if (array.length != 1) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    let check = await db(table_copy).select('*').where('id_group', group_id).first()
    if (check) {
        //  loại 1 3 5 10 cho status bang 0 hết
        await db(table_copy).update('status', 0).where('type', check.type)
        //  cho loại 1 3 5 10 
        await db(table_copy).update('status', 1).where('id', check.id)
        let arr = JSON.parse(check.chienlucvon)
        let text_von = arr.toString().replace(',', "-")
        let text_cong_thuc = ""
        let data = JSON.parse(check.chienluocdata_goc)
        for (let element of data) {
            text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
        }
        bot.sendMessage(chatId, `✅ Đã bật copy theo tín hiệu
Bot copy theo setup:
${text_cong_thuc}
Loại tín hiệu : ${check.type} phút
Quản lý vốn : ${text_von}`, {
            reply_to_message_id: messageId,
            parse_mode: "HTML"
        })
    } else {
        return bot.sendMessage(chatId, "❌ ID group hoặc loại xổ số không đúng", {
            reply_to_message_id: messageId
        })
    }

}
async function statusGroup(chatId, array, bot, messageId, text, group_id, table_copy) {
    if (array.length != 1) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    let check = await db(table_copy).select('*').where('id_group', group_id).first()
    if (check) {
        // await db(table_copy).update('start', 1).where('id', check.id)
        let text_cong_thuc = ""
        let data = JSON.parse(check.chienluocdata_goc)
        for (let element of data) {
            text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
        }
        let arr = JSON.parse(check.chienlucvon)
        let text_von = arr.toString().replace(',', "-")
        bot.sendMessage(chatId, `✅ Đã bật nhóm tín hiệu
Tín hiệu theo setup:
${text_cong_thuc}
Loại tín hiệu : ${check.type} phút
Trạng thái: ${check.start == 1 ? "Đang hoạt động" : " không hoạt động"}
Group copy: ${check.status == 1 ? "BẬT" : "TẮT"}
Quản lý vốn : ${text_von}`, {
            reply_to_message_id: messageId,
            parse_mode: "HTML"
        })
    } else {
        return bot.sendMessage(chatId, "❌ ID group hoặc loại xổ số không đúng", {
            reply_to_message_id: messageId
        })
    }
}
async function startGroup(chatId, array, bot, messageId, text, group_id, table_copy) {
    if (array.length != 1) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    let check = await db(table_copy).select('*').where('id_group', group_id).first()
    if (check) {
        await db(table_copy).update('start', 1).where('id', check.id)
        let text_cong_thuc = ""
        let data = JSON.parse(check.chienluocdata_goc)
        for (let element of data) {
            text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
        }
        let arr = JSON.parse(check.chienlucvon)
        let text_von = arr.toString().replace(',', "-")
        bot.sendMessage(chatId, `✅ Đã bật nhóm tín hiệu
Tín hiệu theo setup:
${text_cong_thuc}
Loại tín hiệu : ${check.type} phút
Quản lý vốn : ${text_von}`, {
            reply_to_message_id: messageId,
            parse_mode: "HTML"
        })
    } else {
        return bot.sendMessage(chatId, "❌ ID group hoặc loại xổ số không đúng", {
            reply_to_message_id: messageId
        })
    }

}

async function stopGroup(chatId, array, bot, messageId, text, group_id, table_copy) {
    if (array.length != 1) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    let check = await db(table_copy).select('*').where('id_group', group_id).first()
    if (check) {
        await db(table_copy).update('start', 0).where('id', check.id)
        await db("lichsu_ma_group").del().where("group_id", group_id)
        await db("lichsu_tong_hop").del().where("group_id", group_id)
        let text_cong_thuc = ""
        let data = JSON.parse(check.chienluocdata_goc)
        for (let element of data) {
            text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
        }
        let arr = JSON.parse(check.chienlucvon)
        let text_von = arr.toString().replace(',', "-")
        bot.sendMessage(chatId, `✅ Đã tắt nhóm tín hiệu 
Tín hiệu theo setup:
${text_cong_thuc}
Loại tín hiệu : ${check.type} phút
Quản lý vốn : ${text_von}`, {
            reply_to_message_id: messageId,
            parse_mode: "HTML"
        })
    } else {
        return bot.sendMessage(chatId, "❌ ID group hoặc loại xổ số không đúng", {
            reply_to_message_id: messageId
        })
    }
}
async function list(chatId, bot, messageId, table_copy) {
    let list = await db(table_copy).select("*")
    let text = "Danh sách tín hiệu setup:\n"
    for (let el of list) {
        let text_cong_thuc = ""
        let data = JSON.parse(el.chienluocdata_goc)
        for (let element of data) {
            text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
        }
        let arr = JSON.parse(el.chienlucvon)
        let text_von = arr.toString().replace(',', "-")
        text = text + `Group ID ${el.id_group} :
${text_cong_thuc}
Loại tín hiệu : ${el.type} phút
Trạng thái: ${el.start == 1 ? "Đang hoạt động" : " không hoạt động"}
Group copy: ${el.status == 1 ? "BẬT" : "TẮT"}
QUản lý Vốn: ${text_von}
`
    }
    bot.sendMessage(chatId, text, {
        reply_to_message_id: messageId,
        parse_mode: "HTML"
    })
}
exports.admingroup = async function (chatId, msg, text, bot, messageId, table, table_copy) {
    try {
        let array = text.split("\n")

        if (array.length > 0) {

            let key_work = array[0]

            if (key_work.includes('/setup_bot')) {
                array = array.map(e => {
                    return e.trim()
                })

                return setuptinhieugroup(chatId, array, bot, messageId, text, table_copy)
            }
            if (key_work.includes('/trade')) {
                array = array.map(e => {
                    return e.trim()
                })
                let listfirst = key_work.split(' ')
                if (listfirst.length != 2) {
                    return bot.sendMessage(chatId, "❌ Cú pháp sai", {
                        reply_to_message_id: messageId
                    })
                }
                let group_id = listfirst[1]


                return trade(chatId, array, bot, messageId, text, group_id, table_copy)
            }
            if (key_work.includes('/start')) {
                let listfirst = key_work.split(' ')
                if (listfirst.length != 2) {
                    return bot.sendMessage(chatId, "❌ Cú pháp sai", {
                        reply_to_message_id: messageId
                    })
                }
                let group_id = listfirst[1]


                return startGroup(chatId, array, bot, messageId, text, group_id, table_copy)
            }
            if (key_work.includes('/status')) {
                let listfirst = key_work.split(' ')
                if (listfirst.length != 2) {
                    return bot.sendMessage(chatId, "❌ Cú pháp sai", {
                        reply_to_message_id: messageId
                    })
                }
                let group_id = listfirst[1]


                return statusGroup(chatId, array, bot, messageId, text, group_id, table_copy)
            }
            if (key_work.includes('/stop')) {
                let listfirst = key_work.split(' ')
                if (listfirst.length != 2) {
                    return bot.sendMessage(chatId, "❌ Cú pháp sai", {
                        reply_to_message_id: messageId
                    })
                }
                let group_id = listfirst[1]


                return stopGroup(chatId, array, bot, messageId, text, group_id, table_copy)
            }
            if (key_work.includes('/list')) {

                return list(chatId, bot, messageId, table_copy)
            }

            let arr = key_work.split(' ')

            // Active 12345 on
            if (arr[0] == "Active" && arr.length == 3) {
                if (arr[2] == 'on') {
                    await db(table).update('activeacc', 1).where("UserId", arr[1])
                    return bot.sendMessage(chatId, "✅ Đã Active thành công", {
                        reply_to_message_id: messageId
                    })
                }
                if (arr[2] == 'off') {
                    await db(table).update('activeacc', 0).where("UserId", arr[1])
                    return bot.sendMessage(chatId, "✅ Đã off tài khoản thành công", {
                        reply_to_message_id: messageId
                    })
                }



            }
            if (key_work.includes('/huongdan')) {

                return bot.sendMessage(chatId, `Hướng dẫn dùng bot:
/list : để lấy danh sách các group tín hiệu bot đang quản lý
/start group_id : bật trạng thái hoạt động group
/stop id : chuyển trạng thái tắt
/trade id : đặt group làm tín hiệu chính để người chơi copy
/huongdan : danh sách cú pháp bot`)
            }

        }

    } catch (e) {
        console.log("admingroup ")
    }


}
