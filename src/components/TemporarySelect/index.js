import React from 'react'
import PropTypes from 'prop-types'
import SelectReact from 'react-select'

// import s from  './index.scss'

const Select = ({
    placeholder,
    options,
    onChange,
    value,
    onInputChange,
    disabled,
    isMenuOpened,
    isSearchable,
}) => (
    <div>
        <SelectReact
            placeholder={placeholder}
            options={options}
            isSearchable={isSearchable}
            classNamePrefix="Select"
            onChange={onChange}
            defaultMenuIsOpen={isMenuOpened}
            onInputChange={onInputChange}
            value={value}
            isDisabled={disabled}
        />
    </div>
)

Select.propTypes = {
    placeholder: PropTypes.string,
    isMenuOpened: PropTypes.bool,
    isSearchable: PropTypes.bool,
    onInputChange: PropTypes.func,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]).isRequired
        })
    ),
    onChange: PropTypes.func.isRequired,
    value: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]).isRequired,
    }),
    disabled: PropTypes.bool,
}

Select.defaultProps = {
    placeholder: null,
    isSearchable: true,
    options: [],
    disabled: false,
    isMenuOpened: false,
    onInputChange: null,
    value: null,
}

export default Select
