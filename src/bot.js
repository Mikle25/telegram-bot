import { session, Telegraf } from 'telegraf'
import {
  BotCurrentExchange,
  BotPairExchange,
  BotTypeCourse,
  BtnProduct,
} from './bot.button.js'
import * as dotenv from 'dotenv'
import { getCurrentExchange } from './api.js'
import { commands, BUTTONS, PAIR_EXCHANGE, TYPE_COURSE } from './const.js'
import {
  deleteProduct,
  getProductList,
  setProduct,
  updateStatusProduct,
} from './supabase.js'
import { showProductList } from './utils.js'
import axios from 'axios'

const binanceP2P = async () => {
  const resp = await axios.post(
    'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
    {
      proMerchantAds: false,
      page: 1,
      rows: 5,
      payTypes: ['Monobank'],
      countries: [],
      publisherType: null,
      tradeType: 'SELL',
      asset: 'USDT',
      fiat: 'UAH',
    },
    {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    }
  )

  return resp.data.data
}

const INIT_SESSION = {
  type: '',
}

dotenv.config()

const bot = new Telegraf(process.env.TOKEN)

bot.use(session())

bot.start((ctx) => {
  ctx.session = INIT_SESSION
  ctx.reply(`Привет ${ctx.from.first_name})`)
  ctx.reply('Что ты хочешь сделать?', BotCurrentExchange())
})

bot.help((ctx) => {
  ctx.session = INIT_SESSION
  ctx.reply(commands)
})

//Current exchange
bot.hears(BUTTONS.current_exchange.text, async (ctx) => {
  // ctx.reply('Выбири пару', BotPairExchange())
  ctx.reply('Выбири тип', BotTypeCourse())
})

bot.action([...TYPE_COURSE.map((e) => e.key)], async (ctx) => {
  if (ctx.update.callback_query.data === TYPE_COURSE[0].key) {
    ctx.deleteMessage()

    ctx.reply('Выбири пару', BotPairExchange())
  } else if (ctx.update.callback_query.data === TYPE_COURSE[1].key) {
    const resp = await binanceP2P()
    ctx.reply(`
    ${resp
      .map(
        (elem) =>
          `${elem.advertiser.nickName}\n${elem.adv.price}${elem.adv.fiatSymbol}\n\n`
      )
      .join('')}`)
  }
})

bot.action(['USDTUAH', 'ATOMUSDT', 'NEARUSDT'], async (ctx) => {
  const resp = await getCurrentExchange(ctx.update.callback_query.data)

  const pair =
    PAIR_EXCHANGE.find((p) => p.key === ctx.update.callback_query.data) ??
    'Not found pair'

  await ctx.reply(`${pair?.name}: ${(Number(resp.price) * 100) / 100}$`)
})

bot.action('back', (ctx) => {
  ctx.deleteMessage()
  ctx.reply('Выбири тип', BotTypeCourse())
})

//products
bot.hears(BUTTONS.product_list.text, async (ctx) => {
  try {
    const resp = await getProductList()
    ctx.reply(showProductList(resp))
  } catch (e) {
    console.log(e.message)
  }
})

bot.hears(BUTTONS.done.text, async (ctx) => {
  ctx.session = ctx.session || INIT_SESSION
  try {
    const resp = await getProductList()
    if (!resp.length) return

    ctx.deleteMessage()
    ctx.session.type = 'done'
    ctx.reply('Изменить статус продукта', BtnProduct(resp))
  } catch (e) {
    console.log(e.message)
  }
})

bot.hears(BUTTONS.remove.text, async (ctx) => {
  ctx.session = ctx.session || INIT_SESSION

  try {
    const resp = await getProductList()
    if (!resp.length) return
    ctx.deleteMessage()

    ctx.session.type = 'remove'
    ctx.reply('Удалить продукт', BtnProduct(resp))
  } catch (e) {
    console.log(e.message)
  }
})

bot.on('callback_query', async (ctx) => {
  ctx.session = ctx.session || INIT_SESSION
  try {
    const resp = await getProductList()
    const product = resp.find((p) => p.id === Number(ctx.callbackQuery.data))

    if (ctx.session.type === 'done') {
      if (!product) {
        ctx.reply('Продукт не найден!')
      }

      product.checked = !product.checked

      await updateStatusProduct(product)
    } else if (ctx.session.type === 'remove') {
      if (!product) {
        ctx.reply('Продукт не найден!')
      }
      await deleteProduct(ctx.callbackQuery.data)
    }
  } catch (e) {
    console.log(e.message)
  } finally {
    const resp = await getProductList()
    ctx.reply(showProductList(resp))
  }
})

bot.on('message', async (ctx) => {
  try {
    const reg = new RegExp('^[А-я]', 'g')
    if (reg.test(ctx.message.text)) {
      await setProduct({
        product: ctx.message.text,
        checked: false,
      })

      const resp = await getProductList()

      ctx.deleteMessage()
      ctx.reply(showProductList(resp))
    }
  } catch (e) {
    console.log(e.message)
  }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
