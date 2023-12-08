//6976536755:AAGgO9iTFbHbftXpuWg6aA7bnma37vlPrW4
const TelegramBot = require('node-telegram-bot-api');




const D5_go_1p = require("./autovngo/auto5dgo/5d_go_1p");
const D5_go_3p = require("./autovngo/auto5dgo/5d_go_3p");
const D5_go_5p = require("./autovngo/auto5dgo/5d_go_3p");
const D5_go_10p = require("./autovngo/auto5dgo/5d_go_10p");
// replace the value below with the Telegram token you receive from @BotFather

const token = '6976536755:AAGgO9iTFbHbftXpuWg6aA7bnma37vlPrW4';
const adminGroup = require('./admingroup')
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const axios = require("axios")
const replyMarkup = {
    keyboard: [
        [
            'Bắt đầu',
            'Cài DCA Thua'
        ],
        [
            "Đăng Nhập",
            "Cài Ngược",
            "Chốt lời/lỗ"
        ],
        [
            "Chiến lược",
            "Bật copy",
            "Lịch sử"
        ],
        [
            "Cài công thức",
            "Bật đợi gãy"
        ]

    ],

};
// Listen for any kind of message. There are different kinds of
// messages.
const help = require('./helpvngo/d5gohelp')
const Res = require("./json");

bot.on('message', async (msg) => {

    let type = msg.chat?.type
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    // send a message to the chat acknowledging receipt of their message
    let text = msg.text ? msg.text : false
    if (type == 'group') {
        if (text) {
            let check = text[0]
            if (check == '/') {

                return adminGroup.admingroup(chatId, msg, text, bot, messageId,"users_telegram_d5go" ,"copytinhieu_d5go")
            }
        }
        return

    }
    let checklogin = await help.check_login(chatId)
    let name = msg.from.first_name ? msg.from.first_name : msg.from.last_name ? msg.from.last_name : msg.from.username


    if (text) {
        if (text.includes('Login') || text.toLocaleLowerCase().includes('login')) {
            // đăng nhập
            help.login_telegram(text, chatId, bot, messageId, name)
        } else if (text.includes('/THEMCT') || text.includes('/themct')) {
            //  thêm công thức vào 

            if (checklogin) {
                help.themcongthuc(text, chatId, bot, checklogin, messageId)
            } else {
                bot.sendMessage(chatId, Res.dangnhap, {
                    reply_to_message_id: messageId,
                })
            }

        }
        else if (text.includes('BET') || text.includes('bet')) {
            //  thêm chiến lược chọn 

            if (checklogin) {
                help.themchienluoc(text, chatId, bot, checklogin, messageId)
            } else {
                bot.sendMessage(chatId, Res.dangnhap, {
                    reply_to_message_id: messageId,
                })
            }
        }
        else if (text.includes('/CT') || text.includes('/ct')) {
            //  chọn theo công thức nào
            if (checklogin && checklogin.activeacc == 0) {
                return bot.sendMessage(chatId, "Tài khoản của bạn chưa được active, Liên hệ Hỗ trợ ")
            }
            if (checklogin) {
                help.choncongthuc(text, chatId, bot, checklogin, messageId)
            } else {
                bot.sendMessage(chatId, Res.dangnhap, {
                    reply_to_message_id: messageId,
                })
            }

        }
        else if (text.includes('/ADD') || text.includes('/Add') || text.includes('/add')) {
            //  chọn theo công thức nào
            if (checklogin && checklogin.activeacc == 0) {
                return bot.sendMessage(chatId, "Tài khoản của bạn chưa được active, Liên hệ Hỗ trợ ")
            }
            if (checklogin) {
                help.addthemso(text, chatId, bot, checklogin, messageId)
            } else {
                bot.sendMessage(chatId, Res.dangnhap, {
                    reply_to_message_id: messageId,
                })
            }

        }
        else if (text.includes('/STOP') || text.includes('/stop')) {
            //  chọn theo công thức nào

            if (checklogin) {
                help.stopthemso(text, chatId, bot, checklogin, messageId)
            } else {
                bot.sendMessage(chatId, Res.dangnhap, {
                    reply_to_message_id: messageId,
                })
            }

        }
        else if (text.includes('SLTP') || text.includes('sltp')) {
            //   chốt lời cắt lỗi

            if (checklogin) {
                help.dunglocatloi(text, chatId, bot, checklogin, messageId)
            } else {
                bot.sendMessage(chatId, Res.dangnhap, {
                    reply_to_message_id: messageId,
                })
            }
        }
        else {
            switch (text) {
                case "/START":
                    // code block
                    if (checklogin) {
                        help.batdau(text, chatId, bot, checklogin, messageId)
                    } else {
                        Res.send_dang_nhap(name, chatId, messageId, bot)

                        // bot.sendMessage(chatId, Res.dangnhap, {
                        //     reply_to_message_id: messageId,
                        // })
                    }

                    break;
                case "Bắt đầu":
                    // code block
                    if (checklogin) {
                        help.batdau(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }


                    break;
                case "Cài DCA Thua":
                    // code block caiDCA cài DCA thắng
                    if (checklogin) {
                        help.caiDCA(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }

                    break;
                case "Cài DCA Thắng":
                    // code block caiDCA cài DCA thắng
                    if (checklogin) {
                        help.caiDCA(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }

                    break;
                case "Đăng Nhập":

                    bot.sendMessage(chatId, Res.dangnhap, {
                        reply_to_message_id: messageId,
                    })
                    // code block
                    break;
                case "Cài Ngược":
                    // code block 

                    if (checklogin) {
                        help.cainguoc(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }
                    break;
                case "Cài thuận":
                    // code block 

                    if (checklogin) {
                        help.cainguoc(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }
                    break;
                case "Chốt lời/lỗ":
                    // code block
                    bot.sendMessage(chatId, Res.chot_loi, {
                        reply_to_message_id: messageId,
                    })
                    break;
                case "Chiến lược":
                    // code block
                    bot.sendMessage(chatId, Res.chienluoc, {
                        reply_to_message_id: messageId,
                        parse_mode: "HTMl"
                    })
                    break;
                case "BẬT copy":
                    // code block coppy
                    if (checklogin && checklogin.activeacc == 0) {
                        return bot.sendMessage(chatId, "Tài khoản của bạn chưa được active, Liên hệ Hỗ trợ ")
                    }
                    if (checklogin) {
                        help.batcopy(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }
                    break;
                case "TẮT copy":
                    // code block coppy
                    if (checklogin && checklogin.activeacc == 0) {
                        return bot.sendMessage(chatId, "Tài khoản của bạn chưa được active, Liên hệ Hỗ trợ ")
                    }
                    if (checklogin) {
                        help.batcopy(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }
                    break;
                case "TẮT công thức":
                    // code block coppy
                    if (checklogin) {
                        help.tatcongthuc(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }
                    break;
                case "Lịch sử":
                    // code block
                    break;
                case "Cài công thức":
                    // code block congthuc
                    if (checklogin) {

                        help.caicongthuc(text, chatId, bot, checklogin, messageId)


                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }

                    break;
                case "Bật đợi gãy":
                    // code block ✅ Đã đổi trạng thái chờ gãy sang ON
                    if (checklogin) {
                        help.battatdoigay(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }

                    break;
                case "Tắt đợi gãy":
                    // code block ✅ Đã đổi trạng thái chờ gãy sang ON
                    if (checklogin) {
                        help.battatdoigay(text, chatId, bot, checklogin, messageId)
                    } else {
                        bot.sendMessage(chatId, Res.dangnhap, {
                            reply_to_message_id: messageId,
                        })
                    }
                    break;
                default:
                    bot.sendMessage(chatId, `Cú pháp sai
/START để quay lại`, {
                        reply_to_message_id: messageId,
                    })

                // code block
            }
        }
    }

});

D5_go_1p.runbot(bot)
D5_go_3p.runbot(bot)
D5_go_5p.runbot(bot)
D5_go_10p.runbot(bot)

