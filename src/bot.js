import {session, Telegraf} from 'telegraf';
import {callbackQuery} from 'telegraf/filters'
import {BotCurrentExchange, BotPairExchange, BtnProduct} from "./bot.button.js"
import * as dotenv from 'dotenv'
import {getCurrentExchange} from "./api.js"
import {commands, BUTTONS, PAIR_EXCHANGE} from "./const.js"
import {deleteProduct, getProductList, setProduct, updateStatusProduct} from "./supabase.js";
import {showProductList} from "./utils.js";

const INIT_SESSION = {
    type: ''
}

dotenv.config();

const bot = new Telegraf(process.env.TOKEN);

bot.use(session())

bot.start((ctx) => {
    ctx.session = INIT_SESSION;
    ctx.reply(`Привет ${ctx.from.first_name})`)
    ctx.reply('Что ты хочешь сделать?', BotCurrentExchange())
})

bot.help(ctx => {
    ctx.session = INIT_SESSION;
    ctx.reply(commands)
})

bot.hears(BUTTONS.current_exchange.text, (ctx) => {
    ctx.reply('Выбири пару', BotPairExchange())
})

bot.hears(BUTTONS.product_list.text, async (ctx) => {
    try {
        const resp = await getProductList();

        ctx.reply(showProductList(resp))

    } catch (e) {
        console.log(e.message)
    }
})

bot.hears(BUTTONS.done.text, async (ctx) => {
    ctx.session = ctx.session || INIT_SESSION;
    try {
        const resp = await getProductList();

        ctx.session.type = 'done'
        ctx.reply('Выбирите продукт', BtnProduct(resp))
    } catch (e) {
        console.log(e.message)
    }
})

bot.hears(BUTTONS.remove.text, async (ctx) => {
    ctx.session = ctx.session || INIT_SESSION

    try {
        const resp = await getProductList();

        ctx.session.type = 'remove'
        ctx.reply('Удалить продукт', BtnProduct(resp))
    } catch (e) {
        console.log(e.message)
    }
})

bot.on('callback_query', async (ctx) => {
    ctx.session = ctx.session || INIT_SESSION
        try {
            const resp = await getProductList();
            const product = resp.find(p => p.id === Number(ctx.callbackQuery.data))

        if (ctx.session.type === 'done') {
            if (!product) {
                ctx.deleteMessage()
                ctx.reply('Продукт не найден!')
            }

            product.checked = !product.checked;

            await updateStatusProduct(product)
        }
        else if (ctx.session.type === 'remove') {
            if (!product) {
                ctx.deleteMessage()
                ctx.reply('Продукт не найден!')
            }
            await deleteProduct(ctx.callbackQuery.data)
        }

    } catch (e) {
        console.log(e.message)
    } finally {
        const resp = await getProductList();
        ctx.reply(showProductList(resp))
    }
})

bot.action(['USDTUAH', 'ATOMUSDT', 'NEARUSDT'], async (ctx) => {
    const resp = await getCurrentExchange(ctx.update.callback_query.data);

    const pair = PAIR_EXCHANGE.find(p => p.key === ctx.update.callback_query.data) ?? 'Not found pair'

    await ctx.reply(`${pair?.name}: ${(Number(resp.price) * 100) / 100}$`);
})

bot.on('message', async (ctx) => {
    try {
        const reg = new RegExp('[А-я]', 'g');
        if (reg.test(ctx.message.text)) {
            await setProduct({
                product: ctx.message.text,
                checked: false
            });

            const resp = await getProductList();

            ctx.reply(showProductList(resp))
        }
    } catch (e) {
        console.log(e.message)
    }
})



bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));