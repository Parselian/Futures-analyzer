'use-strict'

document.addEventListener('DOMContentLoaded', () => {
  const inputs = {}

  const getInputsAndInitListeners = () => {
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        performProfitability(e.target)
      })

      inputs[input.getAttribute('data-id')] = input
    })

    console.log(inputs)
  }

  const performProfitability = (target) => {
    let startCapital = parseFloat(inputs['start-capital'].value),
      possibilityToGetProfit = parseFloat(inputs['possibility-to-get-profit'].value),
      startPercentFromCapital = parseFloat(inputs['start-percent-from-capital'].value),
      profitInPercent = parseFloat(inputs['profit-in-percent'].value),
      possibilityToLoseMoney = parseFloat(inputs['possibility-to-lose-money'].value)

    let stepsAmount = parseFloat(inputs['steps-amount'].value),
      firstPositionOpenPrice = parseFloat(inputs['first-position-open-price'].value),
      shoulder = parseFloat(inputs['shoulder'].value),
      positionAmountToExtraBuy = parseFloat(inputs['position-amount-to-extra-buy'].value),
      marketPrice = parseFloat(inputs['market-price'].value),
      positionAmount = parseFloat(inputs['position-amount'].value),
      positionInRealUSDT = parseFloat(inputs['position-in-real-USDT'].value)

    const profitability = possibilityToGetProfit * (profitInPercent - 1) * startPercentFromCapital - (possibilityToLoseMoney * startPercentFromCapital)

    if (target.getAttribute('data-id') === 'possibility-to-lose-money' && !isNaN(possibilityToLoseMoney)) {
      inputs['possibility-to-get-profit'].value = (100 - possibilityToLoseMoney).toFixed(2)
    }

    if (target.getAttribute('data-id') === 'possibility-to-get-profit' && !isNaN(possibilityToGetProfit)) {
      inputs['possibility-to-lose-money'].value = (100 - possibilityToGetProfit).toFixed(2)
    }

    const firstPart = possibilityToGetProfit * (profitInPercent - 1) * startPercentFromCapital,
      secondPart = possibilityToLoseMoney * startPercentFromCapital,
      result = firstPart - secondPart

    console.log(result)

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