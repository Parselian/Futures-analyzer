'use-strict'

document.addEventListener('DOMContentLoaded', () => {
  const inputs = {}

  const getInputsAndInitListeners = () => {
    const allMixedInputs = [...document.querySelectorAll('input'), ...document.querySelectorAll('select')]
    allMixedInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        performProfitability()
        performHoldable()
      })

      inputs[input.getAttribute('data-id')] = input
    })

    performProfitability()
    performHoldable()
  }

  const performProfitability = () => {
    let possibilityToGetProfit = parseFloat(inputs['possibility-to-get-profit'].value),
      startPercentFromCapital = parseFloat(inputs['start-percent-from-capital'].value),
      profitInPercent = parseFloat(inputs['profit-in-percent'].value)

    const profitability = possibilityToGetProfit * (profitInPercent - 1) * startPercentFromCapital - ((100 - possibilityToGetProfit) * startPercentFromCapital)

    renderProfitabilityLabel(profitability)
  }

  /*
 * объём позиции = цена открытия / позиция в USDT
 * объём позиции = цена открытия / позиция в USDT
 * позиция в USDT = позиция в реальных USDT * плечо
 * дозакупка =
 * кол-во реальных USDT =
 * */

  const performHoldable = () => {
    let shoulder1 = parseFloat(inputs['shoulder-1'].value),
      positionInRealUSDT1 = parseFloat(inputs['position-in-real-USDT-1'].value),
      shoulder2 = parseFloat(inputs['shoulder-2'].value),
      firstPositionOpenPrice = parseFloat(inputs['first-position-open-price'].value),
      positionInRealUSDT2 = parseFloat(inputs['position-in-real-USDT-2'].value),
      usdtPosition1 = shoulder1 * positionInRealUSDT1 || parseFloat(inputs['USDT-position-1'].value)

    inputs['USDT-position-1'].value = usdtPosition1
    inputs['position-amount'].value = usdtPosition1 / firstPositionOpenPrice
  }

  const renderProfitabilityLabel = (result) => {
    const circle = document.querySelector('.widget__result-circle'),
      percentLabel = document.querySelector('.widget__result-percent')

    if (!isNaN(result)) {
      if (result > 0) {
        circle.classList.remove('widget__result-circle_lose')
        circle.classList.add('widget__result-circle_profitable')
        percentLabel.textContent = `+${result.toFixed(1)}`
      } else if (result < 0) {
        circle.classList.remove('widget__result-circle_profitable')
        circle.classList.add('widget__result-circle_lose')
        percentLabel.textContent = `${result.toFixed(1)}`
      } else if (result === 0) {
        circle.classList.remove('widget__result-circle_profitable', 'widget__result-circle_lose')
        percentLabel.textContent = result.toFixed(1)
      }
    } else {
      circle.classList.remove('widget__result-circle_profitable', 'widget__result-circle_lose')
      percentLabel.textContent = `0`
    }
  }
  getInputsAndInitListeners()
})