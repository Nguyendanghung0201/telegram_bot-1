
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

async function setuptinhieugroup(chatId, array, bot, messageId, text) {

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
    let group_id = array[0].replace('/setup_bot', "").trim()
    let check = await db("copytinhieu").select('*').where('id_group', group_id).first()
    if (check) {

        await db("copytinhieu").update({
            id_group: group_id,
            chatid: chatId,
            chienlucvon: JSON.stringify(list_von),
            chienluocdata: JSON.stringify(list),
            chienluocdata_goc: JSON.stringify(list_tin_hieu),
            datatext: text
        }).where('id', check.id)
    } else {
        await db("copytinhieu").insert({
            id_group: group_id,
            chatid: chatId,
            chienlucvon: JSON.stringify(list_von),
            chienluocdata: JSON.stringify(list),
            chienluocdata_goc: JSON.stringify(list_tin_hieu),
            datatext: text
        })
    }



}

async function trade(chatId, array, bot, messageId, text, group_id ,table_copy) {
    if (array.length != 1) {
        return bot.sendMessage(chatId, "❌ Cú pháp sai", {
            reply_to_message_id: messageId
        })
    }
    let check = await db(table_copy).select('*').where('id_group', group_id).first()
    if (check) {
        await db(table_copy).update('status', 0)
        await db(table_copy).update('status', 1).where('id', check.id)
        let arr = JSON.parse(check.chienlucvon)
        let text_von = arr.toString().replace(',', "-")
        let text_cong_thuc = ""
        let data = JSON.parse(check.chienluocdata_goc)
        for (let element of data) {
            text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
        }
        bot.sendMessage(chatId, `✅ Đã cập nhật chiến lược
Bot copy theo setup:
${text_cong_thuc}
Quản lý vốn : ${text_von}`, {
            reply_to_message_id: messageId,
            parse_mode: "HTML"
        })
    } else {
        return bot.sendMessage(chatId, "❌ ID group không đúng", {
            reply_to_message_id: messageId
        })
    }

}
async function list(chatId, bot, messageId) {
    let list = await db("copytinhieu").select("*")
    let text = "Danh sách tín hiệu setup:\n"
    for (let el of list) {
        let text_cong_thuc = ""
        let data = JSON.parse(el.chienluocdata_goc)
        for (let element of data) {
            text_cong_thuc = text_cong_thuc + '<code style="color:blue"> ' + element + '</code>' + '\n'
        }
        let arr = JSON.parse(el.chienlucvon)
        let text_von = arr.toString().replace(',', "-")
        text = text + `Group ID ${el.id_group} ${el.status == 1 ? "(Đang chọn)" : ""}:
${text_cong_thuc}
QUản lý Vốn: ${text_von}
`
    }
    bot.sendMessage(chatId, text, {
        reply_to_message_id: messageId,
        parse_mode: "HTML"
    })
}
exports.admingroup = async function (chatId, msg, text, bot, messageId,table , table_copy) {

    let array = text.split("\n")
 
    if (array.length > 0) {

        let key_work = array[0]
        if (key_work.includes('/setup_bot')) {
            array = array.map(e => {
                return e.trim()
            })
            return setuptinhieugroup(chatId, array, bot, messageId, text)
        }
        if (key_work.includes('/trade')) {
            array = array.map(e => {
                return e.trim()
            })
            let group_id = key_work.replace('/trade', "").trim()
            return trade(chatId, array, bot, messageId, text, group_id,table_copy)
        }
        if (key_work.includes('/list')) {

            return list(chatId, bot, messageId)
        }
        if (key_work == '/check id') {
            return bot.sendMessage(chatId, "ID group là " + chatId, {
                reply_to_message_id: messageId
            })
        }
        let arr = key_work.split(' ')
       
        // Active 12345 on
        if (arr[0] == "Active" && arr.length == 3) {
            if(arr[2]=='on'){
                await db(table).update('activeacc',1).where("usersname",arr[1])
                return  bot.sendMessage(chatId, "✅ Đã Active thành công", {
                    reply_to_message_id: messageId
                })
            }
            if(arr[2]=='off'){
                await db(table).update('activeacc',0).where("usersname",arr[1])
                return  bot.sendMessage(chatId, "✅ Đã off tài khoản thành công", {
                    reply_to_message_id: messageId
                })
            }
            
           
           
        }
    }


}
