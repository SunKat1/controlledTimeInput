import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import Select from '../TemporarySelect'
import { NUMBER_VALIDATOR } from '../../utils/validators/regExp'
import s from './index.css'

export default class TimePicker extends Component {

  static propTypes = {
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      format12: PropTypes.bool,
      disabled: PropTypes.bool,
      onChange: PropTypes.func,
  }

  static defaultProps = {
      value: '',
      format12: false,
      onChange: null,
      disabled: false
  }

  constructor(props) {
      super(props)
      this.state = {
          time: '',
          amPmChose: [
              { label: 'am', value: 'am' },
              { label: 'pm', value: 'pm' },
          ],
          amPmValue: { label: '', value: ''},
      }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
      const { value, format12 } = nextProps
      if (prevState.time === '' || !prevState.time) {
          if (value === '' || !value) {
              return ({
                  time: '00:00',
                  amPmValue: { label: 'am', value: 'am'}
              })
          }
          if (value && value[2] === ':') {
              const timeArray = value.split(':')
              if (format12) {
                  return ({
                      time: `${timeArray[0] > 12 ? timeArray[0] - 12 < 10 ? `0${timeArray[0] - 12}` : `${timeArray[0] - 12}` : timeArray[0]}:${timeArray[1]}`,
                      amPmValue: { label: `${timeArray[0] >= 12 ? 'pm' : 'am'}`, value: `${timeArray[0] >= 12 ? 'pm' : 'am'}`}
                  })
              } return ({
                  time: `${timeArray[0]}:${timeArray[1]}`
              })
          }
          if (value && value[2] === '-') {
              const timeArray = value.split('-')
              if (format12) {
                  return ({
                      time: `${timeArray[0] >= 12 ? timeArray[0] - 12 : timeArray[0]}:${timeArray[1]}`,
                      amPmValue: { label: `${timeArray[0] >= 12 ? 'pm' : 'am'}`, value: `${timeArray[0] >= 12 ? 'pm' : 'am'}`}
                  })
              } return ({
                  time: `${timeArray[0]}:${timeArray[1]}`
              })
          }
      }
      return null
  }

  giveBackValueFormatter = (time, dayPart) => {
      if (dayPart === 'pm') {
          const splittedTime = time.split(':')
          if (splittedTime[0] < 12 && splittedTime[0] > 0) {
              return `${+splittedTime[0] + 12}:${splittedTime[1]}`
          }
          if (splittedTime[0] === '00') {
              return `${splittedTime[0]}:${splittedTime[1]}`
          } return `${splittedTime[0]}:${splittedTime[1]}`
      } return time
  }

  validateValue = (timeString) => {
      const { format12 } = this.props
      const timeArray = timeString.split(':')
      if (!format12) {
          if (timeArray[0].length > 1 && timeArray[0] !== '') {
              if (timeArray[0][0] && timeArray[0][0] > 2) {
                  timeArray[0] = `2${timeArray[0][1]}`
              }
              if (timeArray[0][1] && timeArray[0][1] > 3) {
                  timeArray[0] = `${timeArray[0][0]}3`
              }
          } else {
              timeArray[0] = '00'
          }
          if (timeArray[1] && timeArray[1].length > 1 && timeArray[1] !== '') {
              if (timeArray[1][0] && timeArray[1][0] > 5) {
                  timeArray[1] = `5${timeArray[1][1]}`
              }
          } else if (timeArray[1] && timeArray[1].length === 1) {
              timeArray[1] = `${timeArray[1][0]}0`
          } else {
              timeArray[1] = '00'
          }
          return `${timeArray[0]}:${timeArray[1]}`
      }

      if (format12) {
          if (timeArray[0].length > 1 && timeArray[0] !== '') {
              if (timeArray[0][0] && timeArray[0][0] > 1) {
                  timeArray[0] = `1${timeArray[0][1]}`
              }
              if (timeArray[0][0] && timeArray[0][0] === '0') {
                  if (timeArray[0][1]) {
                      timeArray[0] = `${timeArray[0][0]}${timeArray[0][1]}`
                  }
              }
              if (timeArray[0][0] && timeArray[0][0] >= '1') {
                  if (timeArray[0][1] && timeArray[0][1] >= '2') {
                      timeArray[0] = `${timeArray[0][0]}2`
                  } else {
                      timeArray[0] = `${timeArray[0][0]}${timeArray[0][1]}`
                  }
              }
          } else {
              timeArray[0] = '00'
          }
          if (timeArray[1] && timeArray[1].length > 1 && timeArray[1] !== '') {
              if (timeArray[1][0] && timeArray[1][0] > 5) {
                  timeArray[1] = `5${timeArray[1][1]}`
              }
          } else if (timeArray[1] && timeArray[1].length === 1) {
              timeArray[1] = `${timeArray[1][0]}0`
          } else {
              timeArray[1] = '00'
          }
          return `${timeArray[0]}:${timeArray[1]}`
      }
      return '00:00'
  }

  onInputChange = (e, formCallback) => {
      const { time, amPmValue } = this.state
      const { format12 } = this.props
      const { validateValue, giveBackValueFormatter } = this
      const oldValue = time
      const eventTarget = e.target
      const inputValue = eventTarget.value
      const endPosition = eventTarget.selectionEnd
      const isTyped = inputValue.length > oldValue.length
      const addedCharacter = isTyped ? inputValue[endPosition - 1] : null
      const removedCharacter = isTyped ? null : oldValue[endPosition]

      let newValue = oldValue
      let newPosition = endPosition

      if (addedCharacter !== null) {
          if (endPosition > 5) {
              newPosition = 5
          } else if (endPosition === 3 && NUMBER_VALIDATOR.test(addedCharacter)) {
              newValue = `${inputValue.substr(0, endPosition - 1)}:${addedCharacter}${inputValue.substr(endPosition + 2)}`
              newPosition += 1
          } else if (NUMBER_VALIDATOR.test(addedCharacter)) {
              newValue = `${inputValue.substr(0, endPosition - 1)}${addedCharacter}${inputValue.substr(endPosition + 1)}`
          } else if (endPosition >= 5) {
              newValue = oldValue
              newPosition = 5
          } else {
              newPosition -= 1
          }
      } else if (removedCharacter !== null) {
          if (endPosition === 2 && removedCharacter === ':') {
              newValue = `${inputValue.substr(0, endPosition)}:${inputValue.substr(endPosition)}`
          } else {
              newValue = `${inputValue.substr(0, endPosition).length === 1 ? inputValue.substr(0, endPosition) + '0:' : inputValue.substr(0, endPosition)}0${inputValue.substr(endPosition)}`
          }
      }

      const validatedValue = validateValue(newValue)
      const dayPartFormattedTime = giveBackValueFormatter(validatedValue, amPmValue.value)

      this.setState({
          time: validatedValue,
      }, () => {
          eventTarget.selectionEnd = newPosition
          formCallback && formCallback(format12 ? dayPartFormattedTime : validatedValue)
      })
      e.persist()
  }

  checkOnChange = (v) => {
      const { onChange } = this.props
      if (typeof onChange !== 'function') {
          return null
      } return onChange(v)
  }

  onDayPartChange = (value, formCallback) => {
      const { giveBackValueFormatter } = this
      const { time } = this.state
      const dayPartFormattedTime = giveBackValueFormatter(time, value.value)
      this.setState({
          amPmValue: value,
      }, () => {
          formCallback && formCallback(dayPartFormattedTime)
      })
  }

  render () {
      const { time, amPmChose, amPmValue } = this.state
      const { format12, disabled, ...restProps } = this.props
      const { onInputChange, checkOnChange, onDayPartChange } = this
      return (
          <div className={s.container} {...restProps}>
              <input
                  disabled={disabled}
                  type="text"
                  value={time}
                  onChange={(e) => {
                      onInputChange(e, checkOnChange)
                  }}
              />
              {format12 && (
                  <Select
                      disabled={disabled}
                      value={amPmValue}
                      options={amPmChose}
                      isSearchable={false}
                      onChange={value => {
                          onDayPartChange(value, checkOnChange)
                      }}
                  />
              )}
          </div>
      )
  }
}
