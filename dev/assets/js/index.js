'use-strict'

/*
* объём позиции = цена открытия / позиция в USDT
* объём позиции = цена открытия / позиция в USDT
* позиция в USDT = позиция в реальных USDT * плечо
* дозакупка =
* кол-во реальных USDT =
*
* X = (Цена открытия 1ой позиции - цена по рынку) / (Цена открытия 1ой позиции / 100)
* Если позиция упала на 50% => нужно усреднить позицию
* Тейк-профит = объём позиции
* */

document.addEventListener('DOMContentLoaded', () => {
  const inputs = {},
    database = {
      buyOrderRates: {
        VIP0: {
          taker: 0.04, // покупка/продажа по рынку
          maker: 0.02  // покупка/продажа по своей цене
        }
      },
      leverageAndMargin: {
        level1: {
          positionPoolMin: 0,
          positionPoolMx: 50000,
          maxLeverage: 125,
          supportingMarginRate: 0.4,
          amountOfCollateral: 0
        },
        level2: {
          positionPoolMin: 50000,
          positionPoolMx: 250000,
          maxLeverage: 100,
          supportingMarginRate: 0.5,
          amountOfCollateral: 50
        },
        level3: {
          positionPoolMin: 250000,
          positionPoolMx: 1000000,
          maxLeverage: 50,
          supportingMarginRate: 1,
          amountOfCollateral: 1300
        },
        level4: {
          positionPoolMin: 1000000,
          positionPoolMx: 10000000,
          maxLeverage: 20,
          supportingMarginRate: 2.5,
          amountOfCollateral: 16300
        },
        level5: {
          positionPoolMin: 10000000,
          positionPoolMx: 20000000,
          maxLeverage: 10,
          supportingMarginRate: 5,
          amountOfCollateral: 266300
        },
      }
    }

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

    function calculateEfficiency() {
      const stepsAmount = parseFloat(inputs['steps-amount'].value),
        buffer = [startPercentFromCapital]

      let counter = 1

      while (counter <= stepsAmount) {
        buffer.push(startPercentFromCapital * Math.pow(2, counter))
        counter++
      }

      return buffer.reduce((prev, next) => prev + next, 0)
    }

    if (calculateEfficiency() >= 90) {
      renderProfitabilityLabel(-999999)
      return
    }

    const profitability = possibilityToGetProfit * (profitInPercent - 1) * startPercentFromCapital - ((100 - possibilityToGetProfit) * startPercentFromCapital)

    renderProfitabilityLabel(profitability)
  }

  const performHoldable = () => {
    let shoulder1 = parseFloat(inputs['shoulder-1'].value),
      positionInRealUSDT1 = parseFloat(inputs['position-in-real-USDT-1'].value),
      shoulder2 = parseFloat(inputs['shoulder-2'].value),
      firstPositionOpenPrice = parseFloat(inputs['first-position-open-price'].value),
      positionInRealUSDT2 = parseFloat(inputs['position-in-real-USDT-2'].value),
      usdtPosition1 = shoulder1 * positionInRealUSDT1 || parseFloat(inputs['USDT-position-1'].value),
      marketPrice = parseFloat(inputs['market-price'].value),
      positionAmount = usdtPosition1 / firstPositionOpenPrice

    inputs['USDT-position-1'].value = usdtPosition1.toFixed(1)
    inputs['position-amount'].value = positionAmount

    let buyRateRealUSDT = (usdtPosition1 / 100) * database.buyOrderRates.VIP0.taker//Здесь праааавильно :)

    let profit = 0,
      takeProfit = 0,
      sellRate = ((positionAmount * marketPrice) / 100) * database.buyOrderRates.VIP0.taker,
      counter = 1

    while (profit < 1) {

      profit = (positionAmount * (marketPrice + (100 * counter))) - (buyRateRealUSDT + sellRate)

      let sellRateStep1 = marketPrice + (100 * counter),
        sellRateStep2 = positionAmount * sellRateStep1,
        sellRateStep3 = sellRateStep2 / 100,
        sellRateFinalStep = sellRateStep3 * database.buyOrderRates.VIP0.taker

      sellRate = sellRateFinalStep

      if (profit >= 1) {
        takeProfit = marketPrice
        break;
      }

      // console.dir({sellRateStep1, sellRateStep2, sellRateStep3, sellRateFinalStep})
      counter++
    }

    console.dir({buyRateRealUSDT, sellRate, profit, takeProfit})
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