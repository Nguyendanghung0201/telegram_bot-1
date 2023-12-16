const db = require('../db/db');
const axios = require('axios')
axios.defaults.timeout = 4000;

var randomstring = require("randomstring");
const json = require('../../json')
let table = "users_telegram_k3go"
let first_time = false;
let data_bet = {

}

let bonhotam = {

}
let data_loi_nhuan = {

}



let chienluocvon_index = 0
let phien_thu = []
function resetlai(){
    
}
async function guigaytoicacuser(len, bot) {
    let list = await db(table).select("*").where('doigay', 'on').andWhere('k3go5', 1)
    await db(table).update('doigay', 'off').where('doigay', 'on').andWhere('k3go5', 1)
    for (let el of list) {
        bot.sendMessage(el.chatId, `🔂 Tín hiệu đã gãy K3-GO 5 phút, bắt đầu copy tín hiệu
Entry: 0
Len: ${len}`)
        await delay(300)
    }
}
const moment = require('moment-timezone');
function getCurrentTime() {
    const now = new Date();

    // Lấy giờ và phút
    const currentTimeHanoi = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm');

    return currentTimeHanoi;
}
async function tonghopphien(data_copy, gay, tim_kiem, tinhieu, bot) {
    try {
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
            type: 'k3go5',
            "currentTime": currentTime
        })
        let result = await db("lichsu_tong_hop").select('*')
        .where('group_id', data_copy.id_group).andWhere("type", 'k3go5')
        .orderBy('id', 'desc')
        .paginate({ perPage: 50, currentPage: 1 });
        let list_send  = result.data
        let total =result.pagination.total
        let text = `❇️ 𝐓𝐡ố𝐧𝐠 𝐤ê ${list_send.length} 𝐩𝐡𝐢ê𝐧 𝐠ầ𝐧 𝐧𝐡ấ𝐭  ....
    `;
       let sophien_ban_dau= total -list_send.length+1
        for (let item of list_send.reverse()) {
          
            let soduong = Math.round((item.lai * 0.96 - item.lo) * 100) / 100

            text = text + `🕗 ${item.currentTime}: Phiên ${sophien_ban_dau} -${soduong > 0 ? " -THẮNG 🟢" : "THUA 🟡"}  ${soduong}\n`
            sophien_ban_dau++
        }

        text = text + `
    
    ${data_copy.datatext}`

        bot.sendMessage(data_copy.id_group, text, {
            parse_mode: "HTML"
        })
    } catch (e) {
        console.log('tonghopphien err : ', e)
    }

}

async function test(bot) {
    let timeout = 1000

    try {
        let data = await axios.post("https://bdguubdg.com/api/webapi/GetGameIssueList", {
            type: 3,
            language: "vi"
        }, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },

        })
        if (data.data && data.data.success) {
            let { datalist } = data.data.data

            let data_1phut = datalist.filter(e => e.Type == 11)[0]
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
        console.log('loi test : ', e)
        timeout = 5000

    }
    first_time = true
    setTimeout(function () {
        test(bot)
    }, timeout);

}


async function guitinnhantunggroup(gameslist, bot, total, issuenumber) {
    try {
        let list_thang_da_chon = await db("lichsu_ma_group")
            .select('*').where('status', 0)
            .andWhere("type", "5phut")
            .andWhere("name", "k3go")
            .andWhere("xoso", "NONE")
        // .andWhere('issuenumber', IssueNumber_old)


        let update = false
        for (let item of list_thang_da_chon) {
            let gan_nhat = gameslist.filter(e => e.IssueNumber == item.issuenumber)
            if (gan_nhat && gan_nhat.length > 0) {
                let Number_one = parseInt(gan_nhat[0].SumCount)
                let ketqua = Number_one > 10 ? "H" : 'L'
                if (update == false) {
                    if (list_thang_da_chon.filter(e => e.issuenumber == gan_nhat[0].IssueNumber).length == list_thang_da_chon.length) {
                        await db('lichsu_ma_group').update({
                            "xoso": ketqua,
                            status: 1
                        }).where("type", "5phut")
                            .andWhere("name", "k3go")
                            .andWhere('issuenumber', gan_nhat[0].IssueNumber)
                        update = true
                    } else {
                        await db('lichsu_ma_group').update({
                            "xoso": ketqua,
                            status: 1
                        }).where("type", "5phut")
                            .andWhere("name", "k3go")
                            .andWhere('issuenumber', gan_nhat[0].IssueNumber)
                    }
                    await delay(500)
                }
                let data_copy = await db("copytinhieu_k3go").select("*").where('start', 1).andWhere("type", "5").andWhere("id_group", item.group_id).first()
                if (!data_copy) {
                    continue
                }
                let chienluocvon = JSON.parse(data_copy.chienlucvon)
              

                if (item.dudoan == ketqua) {
                    //  gửi tin nhắn thắng
                    bot.sendMessage(item.group_id, "🔊 🟢 THẮNG")

                    await tonghopphien(data_copy, true, item, chienluocvon.length, bot)
                    await delay(500)
                } else {
                    //  gửi tin nhắn thua
                    // (chienluocvon.length - 1)
                    // if (data_copy.status == 1) {
                    //     guigaytoicacuser(chienluocvon.length, bot)
                    // }
                    bot.sendMessage(item.group_id, "🔊 🟡 THUA")
                    if (item.chienluocvon_index >= (chienluocvon.length - 1)) {
                        await delay(500)
                        await tonghopphien(data_copy, true, item, chienluocvon.length, bot)
                        //  gãy rồi
                        if (data_copy.status == 1) {
                            guigaytoicacuser(chienluocvon.length, bot)
                        }
                    }
                }
            }
        }
        await delay(2000)
        let check_curent = await db("lichsu_ma_group").select('*')
            .where("issuenumber", issuenumber)
            .andWhere("type", "5phut")
            .andWhere("name", "k3go")
            .first()
        if (check_curent) {
            return
        }

        let list = await db("copytinhieu_k3go").select("*").where('start', 1).andWhere("type", "5")
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
                        let tim_kiem = await db('lichsu_ma_group').select('*')
                            .where('group_id', data_copy.id_group)
                            .andWhere("type", "5phut")
                            .andWhere("name", "k3go")
                            .andWhere("status", "1")
                            .orderBy('id', 'desc')
                            .first()
                        let chienluocvon_index = 0
                        let session_moi
                        let chienluocvon = JSON.parse(data_copy.chienlucvon)

                        if (tim_kiem && tim_kiem.dudoan) {
                            if (tim_kiem.dudoan == tim_kiem.xoso) {
                                //  ket quả đúng r
                                //   reset sesion
                                session_moi = randomstring.generate({
                                    length: 12,
                                    charset: 'alphabetic'
                                });
                                chienluocvon_index = 0

                            } else {
                                //  cộng thêm
                                let old_index = tim_kiem.chienluocvon_index
                                if (old_index >= (chienluocvon.length - 1)) {
                                    //  gãy rồi
                                    session_moi = randomstring.generate({
                                        length: 12,
                                        charset: 'alphabetic'
                                    });
                                    chienluocvon_index = 0
                                } else {
                                    session_moi = tim_kiem.session
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
                            name: "k3go",
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

    } catch (e) {
        console.log("gui tn group ", e)

    }


}

async function check_dk(issuenumber, bot) {

    try {
        let list = []

        let list_lich_su = await axios.post("https://bdguubdg.com/api/webapi/GetNoaverageK3EmerdList", {
        typeid: 11,
        pageno: 1,
        language: "vi"
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })


        if (list_lich_su.data && list_lich_su.data.data && list_lich_su.data.success) {
            let { gameslist } = list_lich_su.data.data;
            //  ["3L_N","3N_L"]


            let total = await xacdinhlichsu(gameslist, bot)
            guitinnhantunggroup(gameslist, bot, total, issuenumber)
            let trybonhotam = await db('bonhotam').select('*').where('issuenumber', issuenumber).andWhere('type', 'k3go5').andWhere("status", 1).first()
            if (trybonhotam) {
                return
            }

            list = await db(table).select("*")
                .where("status", 1)
                .andWhere('chienluoc_id', '<>', 0)
                .andWhere("k3go5", 1)
                .andWhere("chienluocdata", "<>", "NONE")
                .andWhere("chienluoc", "<>", "NONE")
                .andWhere("activeacc", 1)
            //  .where('status_trade', 1)

            let list2 = await db(table).select("*")
                .where("status", 1)
                .andWhere('coppy', "on")
                .andWhere("doigay", "off")
                .andWhere("k3go5", 1)
                .andWhere("chienluoc", "<>", "NONE")
                .andWhere("chienluocdata", "NONE")
                .andWhere("activeacc", 1)

            let data_copy = await db('copytinhieu_k3go').select('*').where('status', 1).andWhere("type", "5").first()
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
            type: 'k3go5',
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
            gametype: 2,
            typeid: 11,
            afew: 1,
            language: "vi",
            amount: "1000",
            betcount: Math.round(parseInt(chienluoc_von[data_bet[item.usersname]]) / 1000),
            issuenumber: issuenumber

        }

        if (last == "N") {
            if (item.cainguoc == 'on') {
                data.selecttype = "H"
            } else {
                data.selecttype = "L"
            }

        } else {
            if (item.cainguoc == 'on') {
                data.selecttype = "L"
            } else {
                data.selecttype = "H"
            }

        }

        let result = await axios.post("https://bdguubdg.com/api/webapi/SetGameK3Betting", data, {
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

                bot.sendMessage(item.tele_id, `✅ Đã đặt cược K3-GO 5 ${data.selecttype == "H" ? "Lớn" : "Nhỏ"} - ${data.betcount}000đ - Kỳ xổ ${issuenumber}`,)
            } else {
                //  đặt cược lỗi
                let msg = result.data.msg
                if (msg == "Số tiền không đủ") {
                    await db(table).update('k3go5', 0).where('id', item.id)
                    bot.sendMessage(chatId, `❌ Dừng copy vì lý do: Số tiền không đủ
Kỳ này: ${issuenumber}`)

                }
                if (msg == "sign error") {
                    await db(table).update('k3go5', 0).where('id', item.id)
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

            bot.sendMessage(element.chatId, `🟢 Chúc mừng bạn đã thắng ${Math.round(parseInt(element.betcount) * 0.96 * 1000)}đ K3-GO 5 kì ${element.issuenumber}
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
                    await db(table).update('k3go5', 0).where('id', element.id)
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
            bot.sendMessage(element.chatId, `🔴 Rất tiếc bạn đã thua ${element.betcount}000đ K3-GO 5 kì ${element.issuenumber}`)
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
                    await db(table).update('k3go5', 0).where('id', element.id)
                    delete data_loi_nhuan[element.usersname]
                    delete data_bet[element.usersname]
                }
            }

        }
    }
    delete bonhotam[item.IssueNumber]
    await db("bonhotam").update('status', 0).where('issuenumber', item.IssueNumber).andWhere('type', 'k3go5').andWhere("status", 1)
}
async function xacdinhlichsu(gameslist, bot) {
    let total = "";
    for (let item of gameslist) {
        let Number_one = parseInt(item.SumCount)
        if (!bonhotam[item.IssueNumber]) {
            let trybonhotam = await db('bonhotam').select('*').where('issuenumber', item.IssueNumber).andWhere('type', 'k3go5').andWhere("status", 1).first()
            if (trybonhotam) {
                bonhotam[trybonhotam.issuenumber] = JSON.parse(trybonhotam.data)
            }
        }

        if (bonhotam[item.IssueNumber] && bonhotam[item.IssueNumber].length > 0) {
            let ketqua = Number_one > 10 ? "H" : 'L'
            await ketqua_run_bot(ketqua, item, bot, Number_one)
        }
        if (Number_one > 10) {
            //  số lớn
            total = total + "L"

        } else {
            //  số nhỏ
            total = total + "N"
        }
    }

    return total
}