const input = []
let display

window.addEventListener('load', () => {
  const buttons = document.querySelectorAll('button')
  buttons.forEach(button => button.addEventListener('click', clickButton))
  display = document.querySelector('.display')
})

document.addEventListener('keydown', (event) => {
  console.log(event.key)
  if (event.key > -1 && event.key < 10) {
    return clickButton({
      target: {
        innerHTML: event.key.toString()
      }
    })
  }
  switch (event.key) {
    case '+':
    case '-':
    case '*':
    case '/':
      return clickButton({
        target: {
          'data-operation': event.key,
          innerHTML: event.key
        }
      })
    case '=':
    case '.':
      return clickButton({
        target: {
          innerHTML: event.key
        }
      })
    case 'Backspace':
      return clickButton({
        target: {
          innerHTML: 'Backspace'
        }
      })
    case 'Delete':
    case 'Escape':
      return clickButton({
        target: {
          innerHTML: 'Clear'
        }
      })
  }
})

function clickButton(event) {
  console.log('clicked', event.target.innerHTML)
  const lastItem = input[input.length - 1]
  const operation = event.target.getAttribute ? event.target.getAttribute('data-operation') : event.target['data-operation'] || undefined
  if (operation) {
    if (lastItem && isNumber(lastItem)) {
      input.push(operation)
    } else {
      input[input.length - 1] = operation
    }
  } else {
    switch (event.target.innerHTML) {
      case 'Clear':
        input.length = 0
        break
      case 'Backspace':
        if (lastItem && isNumber(lastItem)) {
          input[input.length - 1] = lastItem.substring(0, lastItem.length - 1)
        } else {
          input.pop()
        }
        break
      case '&equals;':
      case '=':
        if (!lastItem) {
          break
        }
        if (lastItem === '=') {
          input.pop()
          if (input.length > 1) {
            input.push(input[input.length - 2], input[input.length - 1], '=')
          }
        }
        if (isNumber(lastItem)) {
          input.push('=')
        }
        break
      case '&period;':
      case '.':
        if (lastItem && isNumber(lastItem)) {
          if (input[input.length - 1].indexOf('.') === -1) {
            input[input.length - 1] = lastItem + '.'
          }
        } else {
          input.push('0.')
        }
        break
      default:
        console.log('appending', event.target.innerHTML)
        if (input.length && isNumber(lastItem)) {
          input[input.length - 1] = lastItem + event.target.innerHTML
        } else {
          input.push(event.target.innerHTML)
        }
        break
    }
  }
  console.log('input', input, 'answer', calculateAnswer())
  displayOutput()
}

function calculateAnswer () {
  if (input.length === 0) {
    return 0
  }
  let total, operator
  input.forEach(input => {
    if (isNumber(input)) {
      if (total === undefined) {
        total = parseFloat(input)
        return
      } else {
        switch (operator) {
          case '+':
            total += parseFloat(input)
            break
          case '-':
            total -= parseFloat(input)
            break
          case '*':
            total *= parseFloat(input)
            break
          case '/':
            if (input === '0') {
              // show error in display
              return
            }
            total /= parseFloat(input)
            break
        }
        return
      }
    } else {
      operator = input
    }
  })
  if (total === undefined) {
    return 0
  }
  total = total.toString()
  if (total.length > 10 && total.indexOf('.') > -1 && total.indexOf('.') < 10) {
    return total.substring(0, 10)
  } else if (total.length > 10) {
    return total.substring(3 + 'x10e3')
  }
  return total
}

function isNumber (item) {
  try {
    const float = parseFloat(item)
    return float.toString() === item || `${float}.` === item
  } catch (error) {
    return false
  }
}

function displayOutput () {
  if (!input.length) {
    display.innerHTML = '0'
  } else if (input.length === 1) {
    display.innerHTML = input[0]
  } else {
    if (isNumber(input[input.length - 1])) {
      display.innerHTML = input[input.length - 1]
    } else {
      let calculation = calculateAnswer().toString()
      if (calculation.length > 10) {
        const decimal = calculation.indexOf('.')
        if (decimal > -1 && decimal < 10) {
          calculation = calculation.substring(0, 10)
        } else {
          calculation = calculation.substring(0, 5) + 'e10^' + (calculation.length - 5)
        }
      }
      display.innerHTML = calculation
    }
  }
}