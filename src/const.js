export const commands = `
    /start - Перезапустить бота
    /help - Помощь
`

export const BUTTONS = {
    current_exchange: {
        text: '🤑Курс валют',
        key: 'current_exchange'
    },
    product_list: {
        text: '🛒 Список продуктов',
        key: 'product_list'
    },
    done: {
        text: '✅Выполнить',
        key: 'done'
    },
    remove: {
        text: '❌Удалить',
        key: 'remove'
    }
}

export const PAIR_EXCHANGE = [
    {
        key: 'USDTUAH',
        name: 'USDT/UAH'
    },
    {
        key: 'ATOMUSDT',
        name: 'ATOM/USDT'
    },
    {
        key: 'NEARUSDT',
        name: 'NEAR/USDT'
    }
]