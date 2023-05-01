import { session, Telegraf } from 'telegraf'
import { BotMainButtons, BotProducts } from './bot.button.js'
import * as dotenv from 'dotenv'
import { commands, BUTTONS, MAIN_BTN } from './const.js'
import { Exchange } from './Exchange.js'
import { Products } from './Products.js'

const INIT_SESSION = {
  type: '',
}

dotenv.config()

const bot = new Telegraf(process.env.TOKEN)

bot.use(session())

bot.start((ctx) => {
  ctx.session = INIT_SESSION
  ctx.reply(`Привет ${ctx.from.first_name})`)
  ctx.reply('Что ты хочешь сделать?', BotMainButtons())
})

bot.help((ctx) => {
  ctx.session = INIT_SESSION
  ctx.reply(commands)
})

bot.hears(MAIN_BTN.products.text, (ctx) => {
  ctx.deleteMessage()
  ctx.reply('Продукты!', BotProducts())
})

bot.hears(BUTTONS.back.text, (ctx) => {
  ctx.deleteMessage()
  ctx.reply('Что ты хочешь сделать?', BotMainButtons())
})

//Current exchange
const exchange = new Exchange(bot)
exchange.btnCurrentExchange()
exchange.btnCourseType()
exchange.btnSpotPair()
exchange.btnBack()

//products
const products = new Products(bot, INIT_SESSION)
products.productList()
products.productDone()
products.productRemove()
products.handlerProductType()
products.handlerMessage()

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
