import { Markup } from 'telegraf'
import { BUTTONS, PAIR_EXCHANGE, TYPE_COURSE } from './const.js'

export function BotCurrentExchange() {
  return Markup.keyboard(
    [
      Markup.button.callback(
        BUTTONS.current_exchange.text,
        BUTTONS.current_exchange.key
      ),
      Markup.button.callback(
        BUTTONS.product_list.text,
        BUTTONS.product_list.key
      ),
      Markup.button.callback(BUTTONS.done.text, BUTTONS.done.key),
      Markup.button.callback(BUTTONS.remove.text, BUTTONS.remove.key),
    ],
    { columns: 3 }
  ).resize()
}

export function BotTypeCourse() {
  return Markup.inlineKeyboard(
    TYPE_COURSE.map((type) => Markup.button.callback(type.text, type.key)),
    { columns: 2 }
  )
}

export function BotPairExchange() {
  return Markup.inlineKeyboard(
    PAIR_EXCHANGE.map((pair) => Markup.button.callback(pair.name, pair.key)),
    {
      columns: 2,
    }
  )
}

export function BtnProduct(products) {
  return Markup.inlineKeyboard(
    products.map((product) =>
      Markup.button.callback(product.product, product.id)
    ),
    { columns: 2 }
  )
}

export function Back() {
  return Markup.inlineKeyboard([Markup.button('Back')])
}
