export const showProductList = (list) => {
    return `
            Список продуктов:\n\n${list.map(product => `${product.product} ` + (product.checked ? '✅' : '🚫') + '\n\n').join('')}
        `
}