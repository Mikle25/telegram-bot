import { Markup } from 'telegraf'
import { BUTTONS, PAIR_EXCHANGE, COURSE_TYPE, MAIN_BTN } from './const.js'

export function BotMainButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback(MAIN_BTN.products.text, MAIN_BTN.products.key),
      Markup.button.callback(MAIN_BTN.exchange.text, MAIN_BTN.exchange.key),
    ],
    { columns: 2 }
  ).resize()
}

export function BotProducts() {
  return Markup.keyboard(
    [
      Markup.button.callback(
        BUTTONS.product_list.text,
        BUTTONS.product_list.key
      ),
      Markup.button.callback(BUTTONS.done.text, BUTTONS.done.key),
      Markup.button.callback(BUTTONS.remove.text, BUTTONS.remove.key),
      Markup.button.callback(BUTTONS.back.text, BUTTONS.remove.key),
    ],
    { columns: 3 }
  ).resize()
}

export function BotTypeCourse() {
  return Markup.inlineKeyboard(
    COURSE_TYPE.map((type) => Markup.button.callback(type.text, type.key)),
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
