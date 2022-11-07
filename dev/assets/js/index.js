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

class Widget {
  constructor(database, labelSelector) {
    this.profitabilityLabel = document.querySelector(labelSelector)
    this.inputs = {}
    this.database = database
  }

  init() {
    [...document.querySelectorAll('input'), ...document.querySelectorAll('select')].forEach(input => {
      this.inputs[input.getAttribute('data-id')] = input

      input.addEventListener('input', () => {
        this.performProfitability()
        this.performHoldable()
      })
    })

    this.performProfitability()
    this.performHoldable()
  }

  performProfitability() {
    const possibilityToGetProfit = parseFloat(this.inputs['possibility-to-get-profit'].value),
      startPercentFromCapital = parseFloat(this.inputs['start-percent-from-capital'].value),
      profitInPercent = parseFloat(this.inputs['profit-in-percent'].value)

    const calculateEfficiency = () => {
      const stepsAmount = parseFloat(this.inputs['steps-amount'].value),
        buffer = [startPercentFromCapital]

      let counter = 1

      while (counter <= stepsAmount) {
        buffer.push(startPercentFromCapital * Math.pow(2, counter))
        counter++
      }

      return buffer.reduce((prev, next) => prev + next, 0)
    }

    if (calculateEfficiency() >= 90) {
      this.renderProfitabilityLabel(-999999)
      return
    }

    const profitability = possibilityToGetProfit * (profitInPercent - 1) * startPercentFromCapital
      - ((100 - possibilityToGetProfit) * startPercentFromCapital)

    this.renderProfitabilityLabel(profitability)
  }

  performHoldable() {
    let startCapital = parseFloat(this.inputs['start-capital'].value),
      profitInPercent = parseFloat(this.inputs['profit-in-percent'].value),
      shoulder1 = parseFloat(this.inputs['shoulder-1'].value),
      positionInRealUSDT1 = parseFloat(this.inputs['position-in-real-USDT-1'].value),
      firstPositionOpenPrice = parseFloat(this.inputs['first-position-open-price'].value),
      usdtPosition1 = shoulder1 * positionInRealUSDT1 || parseFloat(this.inputs['USDT-position-1'].value),
      marketPrice = parseFloat(this.inputs['market-price'].value),
      positionAmount = usdtPosition1 / firstPositionOpenPrice,
      buyRateRealUSDT = (usdtPosition1 / 100) * this.database.buyOrderRates.VIP0.taker,
      sellRate = (positionAmount * marketPrice) / 100 * this.database.buyOrderRates.VIP0.taker,
      profitValue = startCapital * (profitInPercent - 1), //Здесь праааавильно :)
      profit = (positionAmount * marketPrice) - (buyRateRealUSDT + sellRate),
      takeProfit = 0,
      counter = 1

    this.inputs['USDT-position-1'].value = usdtPosition1.toFixed(1)
    this.inputs['position-amount'].value = positionAmount

    do {
      if (profit < profitValue) {
        marketPrice = marketPrice + (100 * counter)
        sellRate = (positionAmount * marketPrice) / 100 * this.database.buyOrderRates.VIP0.taker
        profit = (positionAmount * marketPrice) - (buyRateRealUSDT + sellRate)
      }

      if (profit >= profitValue) {
        takeProfit = marketPrice
        console.log(111)
        break;
      }

      counter++
    }
    while (profit < profitValue)

    this.inputs['take-profit'].value = takeProfit

    console.dir({buyRateRealUSDT, sellRate, profitValue, marketPrice, profit, takeProfit})
  }

  renderProfitabilityLabel(result) {
    const circle = this.profitabilityLabel.querySelector('.widget__result-circle'),
      percentLabel = this.profitabilityLabel.querySelector('.widget__result-percent')

    if (!isNaN(result)) {
      circle.classList.remove('widget__result-circle_profitable', 'widget__result-circle_lose')
      percentLabel.textContent = `0`
    }
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
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const widget = new Widget({
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
  }, '.widget__result-wrap')

  widget.init()
})