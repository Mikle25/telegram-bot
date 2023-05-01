import { BUTTONS } from './const.js'
import {deleteProduct, getProductList, setProduct, updateStatusProduct} from './supabase.js'
import { showProductList } from './utils.js'
import {BtnProduct} from "./bot.button.js";

export class Products {
  constructor(bot, INIT_SESSION) {
    this.bot = bot
    this.INIT_SESSION = INIT_SESSION
  }

  productList() {
    this.bot.hears(BUTTONS.product_list.text, async (ctx) => {
      try {
        const resp = await getProductList()
        ctx.deleteMessage()
        ctx.reply(showProductList(resp))
      } catch (e) {
        console.log(e.message)
      }
    })
  }

  productDone() {
    this.bot.hears(BUTTONS.done.text, async (ctx) => {
      ctx.session = ctx.session || this.INIT_SESSION
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
  }

  productRemove() {
    this.bot.hears(BUTTONS.remove.text, async (ctx) => {
      ctx.session = ctx.session || this.INIT_SESSION

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
  }

  handlerProductType() {
    this.bot.on('callback_query', async (ctx) => {
      ctx.session = ctx.session || this.INIT_SESSION
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
  }

  handlerMessage() {
    this.bot.on('message', async (ctx) => {
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
  }
}
