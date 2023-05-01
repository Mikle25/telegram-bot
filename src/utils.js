export const showProductList = (list) => {
  if (!list.length || !list) return 'Список продуктов пуст!'
  return `
            Список продуктов:\n\n${list
              .map(
                (product) =>
                  `${product.product} ` +
                  (product.checked ? '✅' : '🚫') +
                  '\n\n'
              )
              .join('')}
        `
}

export const formatNumber = (num) => {
  return (Number(num) * 100) / 100;
}
