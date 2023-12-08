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
const axios = require('axios')
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

async function guigaytoicacuser(bot, len) {
    let list = await db(table).select("*").where('doigay', 'on').andWhere('k3go1', 1)
    await db(table).update('doigay', 'off').where('doigay', 'on').andWhere('k3go1', 1)
    for (let el of list) {
        bot.sendMessage(el.chatId, `🔂 Tín hiệu đã gãy K3-GO 1 phút, bắt đầu copy tín hiệu
Entry: 0
Len: ${len}`)
        await delay(300)
    }
}
async function tonghopphien(data, tinhieu, gay) {
    let lo = 0
    let lai = 0
    for (let el of data) {
        if (el.ketqua) {
            lai = lai + el.betcount
        } else {
            lo = lo + el.betcount
        }
    }
    await db('tonghopphien').insert({
        data: JSON.stringify(data),
        lai: lai.toString(),
        lo: lo.toString(),
        tinhieu: tinhieu,
        gay: gay,
        type: 'k3go1'
    })

}
async function test(bot) {
    try {
        let data = await axios.post("https://bdguubdg.com/api/webapi/GetGameIssueList", {
            type: 3,
            language: "vi"
        }, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })
        if (data.data && data.data.success) {
            let { datalist } = data.data.data

            let data_1phut = datalist.filter(e => e.Type == 9)[0]
            const timeToWait = targetTimestamp - currentTimestamp;
            if (timeToWait > 4000 && first_time) {
                //  gọi hàm đặt cược

                check_dk(issuenumber, bot)
            }
            if (timeToWait > 0) {
                // Sử dụng setTimeout để đợi đến thời gian cụ thể
                first_time = true
                setTimeout(function () {
                    test(bot)
                }, timeToWait + 3000);
            } else {
                // Nếu timestamp đã qua, bạn có thể xử lý ở đây nếu cần

                test(bot)
            }
        } else {
            setTimeout(function () {
                test(bot)
            }, 60000);
        }
    } catch (e) {
        console.log('loi ', e)
        await delay(5000)
        test(bot)
    }



}
function runAtFutureTime(targetTimestamp, currentTimestamp, issuenumber, bot) {
    // Lấy timestamp hiện tại
    // Tính thời gian cần đợi (tính bằng miligiây)

    const timeToWait = targetTimestamp - currentTimestamp;
    if (timeToWait > 4000 && first_time) {
        //  gọi hàm đặt cược

        check_dk(issuenumber, bot)
    }
    if (timeToWait > 0) {
        // Sử dụng setTimeout để đợi đến thời gian cụ thể
        first_time = true
        setTimeout(function () {
            test(bot)
        }, timeToWait + 3000);
    } else {
        // Nếu timestamp đã qua, bạn có thể xử lý ở đây nếu cần

        test(bot)
    }
}

async function check_dk(issuenumber, bot) {
    let list = await db(table).select("*")
        .where("status", 1)
        .andWhere('chienluoc_id', '<>', 0)
        .andWhere("k3go1", 1)
        .andWhere("chienluocdata", "<>", "NONE")
        .andWhere("chienluoc", "<>", "NONE")
        .andWhere("activeacc", 1)
    //  .where('status_trade', 1)

    let list2 = await db(table).select("*")
        .where("status", 1)
        .andWhere('coppy', "on")
        .andWhere("doigay", "off")
        .andWhere("k3go1", 1)
        .andWhere("chienluoc", "<>", "NONE")
        .andWhere("chienluocdata", "NONE")
        .andWhere("activeacc", 1)

    let data_copy = await db('copytinhieu_k3go').select('*').where('status', 1).first()
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


    let list_lich_su = await axios.post("https://bdguubdg.com/api/webapi/GetNoaverageK3EmerdList", {
        typeid: 9,
        pageno: 1,
        language: "vi"
    }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    // 3 4 5 6 - 7 8 9 - 10 | 11- 12 13 14 - 15 16 17 18

    if (list_lich_su.data && list_lich_su.data.data && list_lich_su.data.success) {
        let { gameslist } = list_lich_su.data.data;
        //  ["3L_N","3N_L"]
        let total = await xacdinhlichsu(gameslist, bot)
        let vaolenhcopy = false
        let dudoan = ""
        let dk_trung = ""
        let value_bet_coppy = 0
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
                        dudoan = 'small'
                    } else {
                        dudoan = "big"
                    }
                    dk_trung = check
                    vaolenhcopy = true
                    break
                }
                //   9359237.64 :9359237.64 9349237.64
            }

            if (vaolenhcopy) {

                phien_thu = phien_thu.map(e => {
                    if (e.ketqua == "NONE") {
                        let ketqu = gameslist.filter(el => el.IssueNumber == e.issuenumber)
                        if (ketqu && ketqu.length == 1) {
                            let ketqua = ketqu[0];

                            let ketquaxoso = parseInt(ketqua.SumCount) > 10 ? "big" : "small"
                            if (e.dudoan == ketquaxoso) {
                                e.ketqua = true
                            } else {
                                e.ketqua = false
                            }
                            e.xoso = ketquaxoso
                        }
                    }
                    return e
                })
                let chienluocvon = JSON.parse(data_copy.chienlucvon)
                let ketqua_last = phien_thu[phien_thu.length - 1]
                //  xem kết quả trước đó ntn
                if (phien_thu.length == 0) {
                    chienluocvon_index = 0
                } else {
                    if (ketqua_last.ketqua == "NONE") {
                        //     chưa có ket quả
                        vaolenhcopy = false
                    } else {
                        if (ketqua_last.ketqua) {
                            //  kì vừa rồi thắng
                            //   hết 1 phiên chốt phiên
                            chienluocvon_index = 0
                            tonghopphien(phien_thu, data_copy.chienluocdata, 0)
                            phien_thu = []
                        } else {
                            //  kì vừa rồi thua
                            if (chienluocvon_index >= (chienluocvon.length - 1)) {
                                chienluocvon_index = 0
                                // gãy  hết 1 phiên
                                guigaytoicacuser(bot, chienluocvon.length)
                                tonghopphien(phien_thu, data_copy.chienluocdata, 1)
                                phien_thu = []
                            } else {
                                chienluocvon_index++
                                //  
                            }
                        }
                    }
                }

                value_bet_coppy = Math.round(parseInt(chienluocvon[chienluocvon_index]))
                phien_thu.push({
                    "issuenumber": issuenumber,
                    "dudoan": dudoan,
                    "ketqua": "NONE",
                    "dieukien": data_copy.chienluocdata,
                    "dk_trung": dk_trung,
                    "xoso": false,// false , "small";"big"
                    "betcount": value_bet_coppy //   betcount: Math.round(parseInt(chienluoc_von[data_bet[item.usersname]]) 
                })
            }
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
                    vaolenhtaikhoan(item, element, issuenumber, bot)
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
// uid: 245906
// sign: 34880B75749433B82F161E60998F716BC3E3091A7A2173FC74A49874E2309D43
// amount: 1000
// betcount: 1
// afew: 1
// gametype: 2
// selecttype: H
// typeid: 9
// issuenumber: 20231130090635
// language: vi
async function vaolenhtaikhoan(item, element, issuenumber, bot) {
    let last = element.slice(element.length - 1, element.length)
    let chienluoc_von = item.chienluoc.split(',')
    if (!data_bet[item.usersname]) {
        data_bet[item.usersname] = 0
    }
    let data = {
        uid: item.UserId,
        sign: item.Sign,
        gametype: 2,
        typeid: 9,
        language: "vi",
        afew: 1,
        amount: "1000",
        betcount: Math.round(parseInt(chienluoc_von[data_bet[item.usersname]]) / 1000),
        issuenumber: issuenumber

    }

    if (last == "N") {
        data.selecttype = "L"
    } else {
        data.selecttype = "H"
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

            bot.sendMessage(item.tele_id, `✅ Đã đặt cược K3-Go 1 ${data.selecttype == "H" ? "Lớn" : "Nhỏ"} - ${data.betcount}000đ - Kỳ xổ ${issuenumber}`,)
        }
    }


    // uid: 245906
    // sign: 34880B75749433B82F161E60998F716BC3E3091A7A2173FC74A49874E2309D43
    // amount: 1000
    // betcount: 1
    // afew: 1
    // gametype: 2
    // selecttype: H
    // typeid: 9
    // issuenumber: 20231130090635
    // language: vi


}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

            bot.sendMessage(element.chatId, `🟢 Chúc mừng bạn đã thắng ${Math.round(parseInt(element.betcount) * 0.96 * 1000)}đ K3-Go 1 kì ${element.issuenumber}
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
                    await db(table).update('k3go1', 0).where('id', element.id)
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
            bot.sendMessage(element.chatId, `🔴 Rất tiếc bạn đã thua ${element.betcount}000đ K3-Go 1 kì ${element.issuenumber}`)
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
                    await db(table).update('k3go1', 0).where('id', element.id)
                    delete data_loi_nhuan[element.usersname]
                    delete data_bet[element.usersname]
                }
            }

        }
    }
    delete bonhotam[item.IssueNumber]
}
async function xacdinhlichsu(gameslist, bot) {
    let total = "";
    for (let item of gameslist) {
        let Number_one = parseInt(item.SumCount)
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