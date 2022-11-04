'use-strict'

document.addEventListener('DOMContentLoaded', () => {
  const inputs = {}

  const getInputsAndInitListeners = () => {
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        perform(e.target)
      })

      inputs[input.getAttribute('data-id')] = input
    })

    console.log(inputs)
  }

  const perform = (target) => {
    let startCapital = parseFloat(inputs['start-capital'].value),
      startPercentFromCapital = parseFloat(inputs['start-percent-from-capital'].value),
      stepsAmount = parseFloat(inputs['steps-amount'].value),
      profitInPercent = parseFloat(inputs['profit-in-percent'].value),
      possibilityToGetProfit = parseFloat(inputs['possibility-to-get-profit'].value),
      possibilityToLoseMoney = parseFloat(inputs['possibility-to-lose-money'].value),
      firstPositionOpenPrice = parseFloat(inputs['first-position-open-price'].value),
      positionAmount = parseFloat(inputs['position-amount'].value),
      marketPrice = parseFloat(inputs['market-price'].value),
      positionAmountToExtraBuy = parseFloat(inputs['position-amount-to-extra-buy'].value),
      positionInRealUSDT = parseFloat(inputs['position-in-real-USDT'].value),
      shoulder = parseFloat(inputs['shoulder'].value)

    const profitability = possibilityToGetProfit * (profitInPercent - 1) * startPercentFromCapital - (possibilityToLoseMoney * startCapital)

    if (target.getAttribute('data-id') === 'possibility-to-lose-money' && !isNaN(possibilityToLoseMoney)) {
      inputs['possibility-to-get-profit'].value = (100 - possibilityToLoseMoney).toFixed(2)
    }

    if (target.getAttribute('data-id') === 'possibility-to-get-profit' && !isNaN(possibilityToGetProfit)) {
      inputs['possibility-to-lose-money'].value = (100 - possibilityToGetProfit).toFixed(2)
    }

    renderProfitabilityLabel(profitability)
  }

  const renderProfitabilityLabel = (result) => {
    const circle = document.querySelector('.widget__result-circle'),
      percentLabel = document.querySelector('.widget__result-percent')

    if (!isNaN(result)) {
      if (result > 0) {
        circle.classList.remove('widget__result-circle_lose')
        circle.classList.add('widget__result-circle_profitable')
        percentLabel.textContent = `+${result.toFixed(1)}%`
      } else if (result < 0) {
        circle.classList.remove('widget__result-circle_profitable')
        circle.classList.add('widget__result-circle_lose')
        percentLabel.textContent = `${result.toFixed(1)}%`
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