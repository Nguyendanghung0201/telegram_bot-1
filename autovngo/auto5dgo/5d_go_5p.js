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
const axios = require('axios')
axios.defaults.timeout = 4000;
var randomstring = require("randomstring");
const json = require('../../json')
let table = "users_telegram_d5go"
let first_time = false;
let data_bet = {

}

let bonhotam = {

}
let data_loi_nhuan = {

}
let chienluocvon_index = 0
let phien_thu = []

async function guigaytoicacuser(bot, len) {
    let list = await db(table).select("*").where('doigay', 'on').andWhere('5dgo5', 1)
    await db(table).update('doigay', 'off').where('doigay', 'on').andWhere('5dgo5', 1)
    for (let el of list) {
        bot.sendMessage(el.chatId, `🔂 Tín hiệu đã gãy 5D-Go 5 phút, bắt đầu copy tín hiệu
Entry: 0
Len: ${len}`)
        await delay(300)
    }
}
function getCurrentTime() {
    const now = new Date();

    // Lấy giờ và phút
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Định dạng giờ và phút thành chuỗi
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Kết hợp giờ và phút thành định dạng "HH:mm"
    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
}
async function tonghopphien(data_copy, gay, tim_kiem, tinhieu, bot) {
    let list = await db("lichsu_ma_group").select('*').where("session", tim_kiem.session)
    let lo = 0
    let lai = 0
    for (let item of list) {

        if (item.dudoan == item.xoso) {
            lai = lai + item.betcount
        } else {
            lo = lo + item.betcount
        }
    }
    let currentTime = getCurrentTime();

    await db("lichsu_tong_hop").insert({
        group_id: data_copy.id_group,
        sophien: list.length,
        lo: lo,
        lai: lai,
        session: tim_kiem.session,
        type: '5dgo5',
        "currentTime": currentTime
    })
    let list_send = await db("lichsu_tong_hop").select('*')
        .where('group_id', data_copy.id_group).andWhere("type", '5dgo5')
        .orderBy('id', 'desc').limit(50)
    let text = `❇️ 𝐓𝐡ố𝐧𝐠 𝐤ê ${list_send.length} 𝐩𝐡𝐢ê𝐧 𝐠ầ𝐧 𝐧𝐡ấ𝐭  ....

`;
    let id = ""
    let batdau = false
    for (let item of list_send.reverse()) {
        if (batdau === false) {
            id = item.id
            batdau = true
        }
        let soduong = Math.round((item.lai * 0.96 - item.lo) * 100) / 100

        text = text + `🕗 ${item.currentTime}: Phiên ${id} -${soduong > 0 ? " -THẮNG 🟢" : "THUA 🟡"}  ${soduong}%\n`
        id = id + 1
    }

    text = text + `

- 𝐓í𝐧 𝐡𝐢ệ𝐮 ${tinhieu} 𝐥ệ𝐧𝐡 
- 𝐌ọ𝐢 𝐭𝐡ắ𝐜 𝐦ắ𝐜 𝐯𝐮𝐢 𝐥ò𝐧𝐠 𝐥𝐢ê𝐧 𝐡ệ @Boss_Ngoc_82vn`

    bot.sendMessage(data_copy.id_group, text)
}

async function test(bot) {
    let timeout = 1000

    try {
        let data = await axios.post("https://bdguubdg.com/api/webapi/GetGameIssueList", {
            type: 2,
            language: "vi"
        }, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },

        })
        if (data.data && data.data.success) {
            let { datalist } = data.data.data

            let data_1phut = datalist.filter(e => e.Type == 7)[0]
            // runAtFutureTime(data_1phut.EndTime, data_1phut.ServiceTime, data_1phut.IssueNumber, bot);

            const timeToWait = data_1phut.EndTime - data_1phut.ServiceTime;
            if (timeToWait > 4000) {
                //  gọi hàm đặt cược

                await check_dk(data_1phut.IssueNumber, bot)
            }
            if (timeToWait > 0) {

                // Sử dụng setTimeout để đợi đến thời gian cụ thể
                timeout = timeToWait + 3000

            } else {
                // Nếu timestamp đã qua, bạn có thể xử lý ở đây nếu cần
                timeout = 1000
            }
        } else {
            timeout = 60000

        }
    } catch (e) {
        console.log('loi ', e)
        timeout = 5000

    }
    first_time = true
    setTimeout(function () {
        test(bot)
    }, timeout);

}


async function guitinnhantunggroup(gameslist, bot, total, issuenumber) {
    let gan_nhat = gameslist[0]
    let IssueNumber_old = gan_nhat.IssueNumber
    let list_thang_da_chon = await db("lichsu_ma_group").select('*').where('status', 0)
        .andWhere("type", "5phut")
        .andWhere("name", "5dgo")
        .andWhere("xoso", "NONE")
        .andWhere('issuenumber', IssueNumber_old)
    let Number_one = parseInt(gan_nhat.SumCount)
    let ketqua = Number_one > 22 ? "H" : 'L'

    for (let item of list_thang_da_chon) {
        if (item.dudoan == ketqua) {
            //  gửi tin nhắn thắng
            bot.sendMessage(item.group_id, "🔊 🟢 THẮNG")

        } else {
            //  gửi tin nhắn thua
            bot.sendMessage(item.group_id, "🔊 🟡 THUA")
        }
    }
    await db('lichsu_ma_group').update({
        "xoso": ketqua,
        status: 1
    }).where("type", "5phut")
        .andWhere("name", "5dgo")
        .andWhere('issuenumber', IssueNumber_old)


    await delay(2000)

    let list = await db("copytinhieu_d5go").select("*").where('start', 1).andWhere("type", "5")
    for (let data_copy of list) {

        let dudoan = ""
        let dk_trung = ""

        if (data_copy && data_copy.chienluocdata) {
            let check_dk = JSON.parse(data_copy.chienluocdata)

            for (let element of check_dk) {
                // 3L_N  2L2N_N
                let check = element.slice(0, element.length - 2);

                let check2 = total.slice(0, check.length);

                if (check === check2) {
                    //  đúng dk
                    // vào lệnh
                    let last = element.slice(element.length - 1, element.length)
                    if (last == "N") {
                        dudoan = 'L'
                    } else {
                        dudoan = "H"
                    }
                    dk_trung = check
                    // "issuenumber": issuenumber,
                    // "dudoan": dudoan,
                    // "ketqua": "NONE",
                    // "dieukien": data_copy.chienluocdata,
                    // "dk_trung": dk_trung,
                    // "xoso": false,// false , "small";"big"
                    // "betcount": value_bet_coppy //   betcount: Mat
                    let tim_kiem = list_thang_da_chon.filter(e => e.group_id == data_copy.id_group)
                    let chienluocvon_index = 0
                    let session_moi
                    let chienluocvon = JSON.parse(data_copy.chienlucvon)
                    if (tim_kiem && tim_kiem.length > 0) {
                        if (tim_kiem[0].dudoan == ketqua) {
                            //  ket quả đúng r
                            //   reset sesion
                            session_moi = randomstring.generate({
                                length: 12,
                                charset: 'alphabetic'
                            });
                            chienluocvon_index = 0

                            await tonghopphien(data_copy, true, tim_kiem[0], chienluocvon.length, bot)
                            await delay(1000)

                        } else {
                            //  cộng thêm
                            let old_index = tim_kiem[0].chienluocvon_index
                            if (old_index >= (chienluocvon.length - 1)) {
                                //  gãy rồi
                                session_moi = randomstring.generate({
                                    length: 12,
                                    charset: 'alphabetic'
                                });
                                chienluocvon_index = 0
                                if(data_copy.status ==1){
                                    guigaytoicacuser(chienluocvon.length,bot)
                                }
                                await tonghopphien(data_copy, false, tim_kiem[0], chienluocvon.length, bot)
                                await delay(1000)
                            } else {
                                session_moi = tim_kiem[0].session
                                chienluocvon_index = old_index + 1
                            }
                        }


                    } else {
                        session_moi = randomstring.generate({
                            length: 12,
                            charset: 'alphabetic'
                        });
                    }

                    let dai = dudoan == 'H' ? "LỚN" : "NHỎ"
                    bot.sendMessage(data_copy.id_group, `🧏‍♀  ${dai} ${Math.round(parseInt(chienluocvon[chienluocvon_index]))}!
Kỳ xổ (${issuenumber})`)
                    await db("lichsu_ma_group").insert({
                        "issuenumber": issuenumber,
                        type: "5phut",
                        "dudoan": dudoan,
                        group_id: data_copy.id_group,
                        "ketqua": "NONE",
                        "dk_trung": check,
                        "xoso": "NONE",
                        "chienluocvon_index": chienluocvon_index,
                        "betcount": Math.round(parseInt(chienluocvon[chienluocvon_index])),
                        name: "5dgo",
                        session: session_moi,
                        status: 0

                    })
                    break
                }
                //   9359237.64 :9359237.64 9349237.64
            }
            await delay(1000)


        }
    }

}

async function check_dk(issuenumber, bot) {

    try {
        let list = []
        let list_lich_su = await axios.post("https://bdguubdg.com/api/webapi/GetNoaverage5DEmerdList", {
            typeid: 7,
            pageno: 1,
            language: "vi"
        }, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })


        if (list_lich_su.data && list_lich_su.data.data && list_lich_su.data.success) {
            let { gameslist } = list_lich_su.data.data;
            //  ["3L_N","3N_L"]


            let total = await xacdinhlichsu(gameslist, bot)
            let trybonhotam = await db('bonhotam').select('*').where('issuenumber', issuenumber).andWhere('type', '5dgo5').andWhere("status", 1).first()
            if (trybonhotam) {
                return
            }

            list = await db(table).select("*")
                .where("status", 1)
                .andWhere('chienluoc_id', '<>', 0)
                .andWhere("5dgo5", 1)
                .andWhere("chienluocdata", "<>", "NONE")
                .andWhere("chienluoc", "<>", "NONE")
                .andWhere("activeacc", 1)
            //  .where('status_trade', 1)

            let list2 = await db(table).select("*")
                .where("status", 1)
                .andWhere('coppy', "on")
                .andWhere("doigay", "off")
                .andWhere("5dgo5", 1)
                .andWhere("chienluoc", "<>", "NONE")
                .andWhere("chienluocdata", "NONE")
                .andWhere("activeacc", 1)

            let data_copy = await db('copytinhieu_d5go').select('*').where('status', 1).andWhere("type", "5").first()
            if (data_copy) {
                let list_copy = list2.map(e => {
                    e.chienluoc_id = 100
                    e.chienluocdata = data_copy.chienluocdata
                    e.chienluocdata_goc = data_copy.chienluocdata_goc
                    e.copystatus = true
                    return e
                })
                list = list.concat(list_copy)
            }


            guitinnhantunggroup(gameslist, bot, total, issuenumber)
            await delay(1000)
            for (let item of list) {

                let json = JSON.parse(item.chienluocdata)

                for (let element of json) {
                    // 3L_N  2L2N_N
                    let check = element.slice(0, element.length - 2);

                    let check2 = total.slice(0, check.length);

                    if (check === check2) {
                        //  đúng dk
                        // vào lệnh
                        await vaolenhtaikhoan(item, element, issuenumber, bot)
                        break
                    }
                    //   9359237.64 :9359237.64 9349237.64
                }

            }


        }

        let arr = Object.keys(data_loi_nhuan)
        let list_user = list.map(e => e.usersname)
        for (let el of arr) {
            if (list_user.includes(el)) {

            } else {
                delete data_loi_nhuan[el]
                delete data_bet[el]
            }
        }
    } catch (e) {
        console.log('loi vao lenh ', e)
    }
    if (bonhotam[issuenumber] && bonhotam[issuenumber].length > 0) {
        await db("bonhotam").insert({
            issuenumber: issuenumber,
            type: '5dgo5',
            data: JSON.stringify(bonhotam[issuenumber]),
            status: 1
        })
    }


}
//  status
//  1 là đang hoạt động
//  2 là user tele đó đã đăng nhập nick khác
//  3 là 1 user tele đã đăng nhập . bị đá ra
// status_trade
// 0 chưa hoạt động
//  1 đã chọn ct
//  2L1N

exports.runbot = async function (bot) {
    // https://bdguubdg.com/api/webapi/GetGameIssueList
    //     type: 1
    // language: vi
    test(bot)

}


async function vaolenhtaikhoan(item, element, issuenumber, bot) {
    try {
        let last = element.slice(element.length - 1, element.length)
        let chienluoc_von = item.chienluoc.split(',')
        if (!data_bet[item.usersname]) {
            data_bet[item.usersname] = 0
        }
        let data = {
            uid: item.UserId,
            sign: item.Sign,
            gametype: 6,
            typeid: 7,
            language: "vi",
            amount: "1000",
            betcount: Math.round(parseInt(chienluoc_von[data_bet[item.usersname]]) / 1000),
            issuenumber: issuenumber

        }

        if (last == "N") {
            data.selecttype = "L"
        } else {
            data.selecttype = "H"
        }

        let result = await axios.post("https://bdguubdg.com/api/webapi/SetGame5DBetting", data, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })
        if (result.data) {

            if (result.data && result.data.data && result.data.code == 0 && result.data.success) {
                if (bonhotam[issuenumber]) {
                    data.id = item.id
                    data.chatId = item.tele_id
                    data.usersname = item.usersname
                    data.lodung = item.lodung
                    data.loidung = item.loidung
                    data.caidca = item.caidca
                    data.chienluoc_von = chienluoc_von
                    bonhotam[issuenumber].push(data)
                } else {
                    data.id = item.id
                    data.chatId = item.tele_id
                    data.usersname = item.usersname
                    data.lodung = item.lodung
                    data.loidung = item.loidung
                    data.caidca = item.caidca
                    data.chienluoc_von = chienluoc_von
                    bonhotam[issuenumber] = [data]
                }

                bot.sendMessage(item.tele_id, `✅ Đã đặt cược 5D-Go 5 ${data.selecttype == "H" ? "Lớn" : "Nhỏ"} - ${data.betcount}000đ - Kỳ xổ ${issuenumber}`,)
            } else {
                //  đặt cược lỗi
                let msg = result.data.msg
                if (msg == "Số tiền không đủ") {
                    await db(table).update('5dgo5', 0).where('id', item.id)
                    bot.sendMessage(chatId, `❌ Dừng copy vì lý do: Số tiền không đủ
Kỳ này: ${issuenumber}`)

                }
                if (msg == "sign error") {
                    await db(table).update('5dgo5', 0).where('id', item.id)
                    bot.sendMessage(chatId, `❌ Dừng copy vì lý do: Tài khoản đã đăng xuất
Kỳ này: ${issuenumber}`)

                }


            }
        }

    } catch (e) {
        console.log("loi vao lenh ko duoc")
    }





}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// "Số tiền không đủ" "sign error"
async function ketqua_run_bot(ketqua, item, bot, Number_one) {
    for (let element of bonhotam[item.IssueNumber]) {
        await delay(200)
        if (element.selecttype == ketqua) {
            if (data_loi_nhuan[element.usersname]) {
                data_loi_nhuan[element.usersname] = data_loi_nhuan[element.usersname] + Math.round(parseInt(element.betcount) * 0.96 * 1000)
            } else {
                data_loi_nhuan[element.usersname] = Math.round(parseInt(element.betcount) * 0.96 * 1000)
            }
            //  chọn đúng
            if (element.caidca == 'thang') {
                if (data_bet[element.usersname] >= (element.chienluoc_von.length - 1)) {
                    data_bet[element.usersname] = 0
                } else {
                    data_bet[element.usersname] = data_bet[element.usersname] + 1
                }

            } else {
                data_bet[element.usersname] = 0
            }

            bot.sendMessage(element.chatId, `🟢 Chúc mừng bạn đã thắng ${Math.round(parseInt(element.betcount) * 0.96 * 1000)}đ 5D-Go 5 kì ${element.issuenumber}
Tổng lợi nhuận: ${data_loi_nhuan[element.usersname]}đ`)
            // await db('lichsu_ma').insert({
            //     "uid": element.uid,
            //     "usersid": element.id,
            //     "gametype": element.gametype,
            //     "typeid": element.typeid,
            //     "amount": element.amount,
            //     "betcount": element.betcount,
            //     "issuenumber": element.issuenumber,
            //     "ketqua": Number_one,
            //     "selecttype": element.selecttype,
            //     "session": 1,
            //     "thang": 1
            // })
            if (element.loidung) {

                if (data_loi_nhuan[element.usersname] > element.loidung) {
                    bot.sendMessage(element.chatId, `🟢 Chúc mừng bạn đã đạt tới mức lợi nhuận kỳ vọng để dừng bot`)
                    await db(table).update('5dgo5', 0).where('id', element.id)
                    delete data_loi_nhuan[element.usersname]
                    delete data_bet[element.usersname]

                }
            }

        } else {
            // kết quả sai
            // 🔴 Rất tiếc bạn đã thua 10000
            if (data_loi_nhuan[element.usersname]) {
                data_loi_nhuan[element.usersname] = data_loi_nhuan[element.usersname] - parseInt(element.betcount) * 1000
            } else {
                data_loi_nhuan[element.usersname] = -parseInt(element.betcount) * 1000
            }
            if (element.caidca == 'thua') {
                if (data_bet[element.usersname] >= (element.chienluoc_von.length - 1)) {
                    data_bet[element.usersname] = 0
                } else {
                    data_bet[element.usersname] = data_bet[element.usersname] + 1
                }

            } else {
                data_bet[element.usersname] = 0
            }
            bot.sendMessage(element.chatId, `🔴 Rất tiếc bạn đã thua ${element.betcount}000đ 5D-Go 5 kì ${element.issuenumber}`)
            // await db('lichsu_ma').insert({
            //     "uid": element.uid,
            //     "usersid": element.id,
            //     "gametype": element.gametype,
            //     "typeid": element.typeid,
            //     "amount": element.amount,
            //     "betcount": element.betcount,
            //     "issuenumber": element.issuenumber,
            //     "ketqua": Number_one,
            //     "selecttype": element.selecttype,
            //     "session": 1,
            //     "thang": 0
            // })
            if (element.lodung) {
                //  -10000 100000
                if (data_loi_nhuan[element.usersname] < 0 && Math.abs(data_loi_nhuan[element.usersname]) > element.lodung) {
                    bot.sendMessage(element.chatId, `🔴 Rất tiếc bạn đã thua đến điểm dừng lỗ để dừng bot`)
                    await db(table).update('5dgo5', 0).where('id', element.id)
                    delete data_loi_nhuan[element.usersname]
                    delete data_bet[element.usersname]
                }
            }

        }
    }
    delete bonhotam[item.IssueNumber]
    await db("bonhotam").update('status', 0).where('issuenumber', item.IssueNumber).andWhere('type', '5dgo5').andWhere("status", 1)
}
async function xacdinhlichsu(gameslist, bot) {
    let total = "";
    for (let item of gameslist) {
        let Number_one = parseInt(item.SumCount)
        if (!bonhotam[item.IssueNumber]) {
            let trybonhotam = await db('bonhotam').select('*').where('issuenumber', item.IssueNumber).andWhere('type', '5dgo5').andWhere("status", 1).first()
            if (trybonhotam) {
                bonhotam[trybonhotam.issuenumber] = JSON.parse(trybonhotam.data)
            }
        }

        if (bonhotam[item.IssueNumber] && bonhotam[item.IssueNumber].length > 0) {
            let ketqua = Number_one > 22 ? "H" : 'L'
            await ketqua_run_bot(ketqua, item, bot, Number_one)
        }
        if (Number_one > 22) {
            //  số lớn
            total = total + "L"

        } else {
            //  số nhỏ
            total = total + "N"
        }
    }

    return total
}