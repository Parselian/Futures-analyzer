'use-strict'

/*
* Ком. На покупку = (позиция в ЮСДТ / 100) * ком. Тейкера
* Ком. На продажу = (объем позиции * цена по рынку) / 100 * 0.04
* Профит = ((объем позиции * цена по рынку) – (ком. На покупку + ком. На продажу)) – позиция в ЮСДТ
* Цена по рынку = позиция в ЮСДТ / объем дозакупки
* Объем дозакупки = Цена по рынку / позиция в ЮСДТ
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

    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', (e) => {
        const targetID = e.target.getAttribute('id')

        if (targetID === "widget-open-button") {
          this.inputs['market-price-position-now'].value = this.inputs['first-position-open-price'].value
          this.inputs['to-extra-buy-position-now'].value = this.inputs['position-amount'].value
          this.inputs['position-real-USDT-position-now'].value = this.inputs['position-in-real-USDT-open'].value
          this.inputs['USDT-position-position-now'].value = this.inputs['USDT-position-open'].value
        }

        if (targetID === "widget-averaging-button") {
          this.inputs['to-extra-buy-position-now'].value = parseFloat(this.inputs['to-extra-buy-position-now'].value)
            + parseFloat(this.inputs['position-amount-to-extra-buy-averaging'].value)
          this.inputs['position-real-USDT-position-now'].value = parseFloat(this.inputs['position-real-USDT-position-now'].value)
            + parseFloat(this.inputs['position-in-real-USDT-averaging'].value)
          this.inputs['USDT-position-position-now'].value = parseFloat(this.inputs['USDT-position-position-now'].value)
            + parseFloat(this.inputs['USDT-position-averaging'].value)

          console.log()
          const marketPrice = this.inputs['USDT-position-position-now'].value / this.inputs['to-extra-buy-position-now'].value
          this.inputs['market-price-position-now'].value = marketPrice.toFixed(2)
        }
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
      positionInRealUSDT1 = parseFloat(this.inputs['position-in-real-USDT-open'].value),
      shoulderAveraging = parseFloat(this.inputs['shoulder-averaging'].value),
      positionInRealUSDTAveraging = parseFloat(this.inputs['position-in-real-USDT-averaging'].value),
      typeOfPosition = this.inputs['type-of-position'].value,
      firstPositionOpenPrice = parseFloat(this.inputs['first-position-open-price'].value),
      usdtPositionOpen = shoulder1 * positionInRealUSDT1 || parseFloat(this.inputs['USDT-position-open'].value),
      usdtPositionAveraging = shoulderAveraging * positionInRealUSDTAveraging
        || parseFloat(this.inputs['USDT-position-averaging'].value),
      marketPriceClosing = parseFloat(this.inputs['market-price-closing'].value),
      positionAmount = usdtPositionOpen / firstPositionOpenPrice,
      buyRateRealUSDT = (usdtPositionOpen / 100) * this.database.buyOrderRates.VIP0.taker,
      sellRate = (positionAmount * marketPriceClosing) / 100 * this.database.buyOrderRates.VIP0.taker,
      profitValue = startCapital * (profitInPercent - 1), //Здесь праааавильно :)
      profit = ((positionAmount * marketPriceClosing) - usdtPositionOpen) - (buyRateRealUSDT + sellRate),
      takeProfit = null,
      stopLose = null

    this.inputs['USDT-position-averaging'].value = usdtPositionAveraging
    this.inputs['position-amount-to-extra-buy-averaging'].value = parseFloat(this.inputs['USDT-position-averaging'].value)
            / parseFloat(this.inputs['market-price-averaging'].value)

    this.inputs['USDT-position-open'].value = usdtPositionOpen.toFixed(1)
    this.inputs['position-amount'].value = positionAmount

    if (profit > 1) {
      this.inputs['judgement'].value = 'Да'
    } else {
      this.inputs['judgement'].value = 'Нет'
    }

    /*
    * ЗДЕСЬ БЫЛ ЦИКЛ FOR (ищи внизу )
    * */

    this.inputs['take-profit'].value = takeProfit
  }

  performMarketPriceOfPositionNowForm() {

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


/*
* ЭТО ЦИКЛ FOR, КОТОРЫЙ БЫЛ НАВЕРХУ ^
* */

/*
for (let counter = 0; ; counter++) {
  if (isNaN(profit) || isNaN(profitValue)) break

  if (profit < profitValue) {
    if (typeOfPosition === 'long') {
      marketPriceClosing = marketPriceClosing + (100 * counter)
    } else {
      marketPriceClosing = marketPriceClosing - (100 * counter)
    }


    sellRate = (positionAmount * marketPriceClosing) / 100 * this.database.buyOrderRates.VIP0.taker
    profit = ((positionAmount * marketPriceClosing) - usdtPositionOpen) - (buyRateRealUSDT + sellRate)
  }

  if (profit >= profitValue) {
    takeProfit = marketPriceClosing
    console.log(111)
    break
  }

  counter++
}*/
