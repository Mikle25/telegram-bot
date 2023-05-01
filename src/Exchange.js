import { BUTTONS, PAIR_EXCHANGE, COURSE_TYPE } from './const.js'
import { BotPairExchange, BotTypeCourse } from './bot.button.js'
import { binanceP2P, getCurrentExchange } from './api.js'
import {formatNumber} from "./utils.js";

export class Exchange {
  constructor(bot) {
    this.bot = bot
  }

  btnCurrentExchange() {
    this.bot.hears(BUTTONS.current_exchange.text, async (ctx) => {
      ctx.reply('Выбири тип', BotTypeCourse())
    })
  }

  btnCourseType() {
    this.bot.action([...COURSE_TYPE.map((e) => e.key)], async (ctx) => {
      if (ctx.callbackQuery.data === COURSE_TYPE[0].key) {
        await ctx.deleteMessage()

        await ctx.reply('Выбири пару', BotPairExchange())
      } else if (ctx.callbackQuery.data === COURSE_TYPE[1].key) {
        const resp = await binanceP2P()
        await ctx.reply(`
    ${resp
      .map(
        (elem) =>
          `${elem.advertiser.nickName}\n${elem.adv.price}${elem.adv.fiatSymbol}\n\n`
      )
      .join('')}`)
      }
    })
  }

  btnSpotPair() {
    this.bot.action(['USDTUAH', 'ATOMUSDT', 'NEARUSDT'], async (ctx) => {
      const resp = await getCurrentExchange(ctx.callbackQuery.data)

      const pair =
        PAIR_EXCHANGE.find((p) => p.key === ctx.callbackQuery.data) ??
        'Not found pair'

      await ctx.reply(`${pair?.name}: ${formatNumber(resp.price)}$`)
    })
  }

  btnBack() {
    this.bot.action('back', (ctx) => {
      ctx.deleteMessage()
      ctx.reply('Выбири тип', BotTypeCourse())
    })
  }
}
