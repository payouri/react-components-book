import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './InputWithDropdown.scss';

//todo add loader

const DropdownOption = ({CustomComponent, label, tabIndex, index, onClick, ...rest}) => {

    if(!CustomComponent)
        return <li className={styles["option"]} onClick={onClick} tabIndex={tabIndex || Number(0)} data-index={index} >{label}</li>

    else
        return (
            <li tabIndex={tabIndex || Number(0)} onClick={onClick} data-index={index}>
                <CustomComponent label={label} tabIndex={tabIndex} index={index} {...rest} />
            </li>
        )
    
}
DropdownOption.propTypes = {
    CustomComponent: PropTypes.element,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    index: PropTypes.number.isRequired,
    label: PropTypes.string,
    onClick: PropTypes.func,
    tabIndex: PropTypes.number,
}

class InputWithDropdown extends Component {

    static DropdownOption = DropdownOption;

    constructor(props) {
        super(props)
        this.state = {
            value: '',
            hasFocus: false,
            suggestionIndex: -1,
            selectedIndex: -1,
        };
        this.inputRef = React.createRef();
        const sortBy = {
            label: (a, b) => {
                return a.label.localeCompare(b.label, this.props.locale, {sensitivity: 'base'})
            },
            value: (a, b) => {
                return a.value - b.value;
            }
        }
        this.props.options.sort(sortBy[this.props.sortBy])
    }
    handleSubmit = ({ key }) => {

        const { suggestionIndex, } = this.state;
        const { options } = this.props;

        if(key == 'Escape') {
            
            this.inputRef.current.blur();

        }
        if( key == 'Enter') {

            const { onSubmit } = this.props;

            this.inputRef.current.blur();

            if(suggestionIndex > -1) {
                this.setState({ 
                    selectedIndex: suggestionIndex,
                    value: options[suggestionIndex].label || options[suggestionIndex].value,
                });
            }

            onSubmit && onSubmit(this.state);

        }

    }
    handleInput = changeEvent => {

        this.setState({ selectedIndex: -1, value: changeEvent.target.value }, () => {
            
            const { options, onChange } = this.props,
                { value } = this.state;
            if(value.length > 0) {
                const optsByLabel = options.map(o => (o.label || o.value).substr(0, value.length).toLowerCase());

                this.setState({ suggestionIndex: optsByLabel.indexOf(value.toLowerCase())}, () => {onChange && onChange(this.state)});
            } else 
                this.setState({ suggestionIndex: -1 }, () => {onChange && onChange(this.state)});

        })

    }
    handleFocusBlur = FocusEvent => {

        const { type, relatedTarget } = FocusEvent,
            { options, autoCompleteOnBlur } = this.props;
        
        const newState = {

            hasFocus: type == 'focus',
            
        }

        // if(autoCompleteOnBlur) {

        let index = -1;

        if(relatedTarget && relatedTarget.dataset && relatedTarget.dataset.index) {
            index = Number(relatedTarget.dataset.index);
        }

        newState.selectedIndex = index;

        this.setState(newState, () => {
            if(this.state.selectedIndex > -1) {
                this.setState({ 
                    value: options[this.state.selectedIndex].label || options[this.state.selectedIndex].value,
                    suggestionIndex: this.state.selectedIndex,
                });
            }
        });

    }
    handleOptionClick = ({ optIndex }) => {

    }
    matchText = (s1, s2) => {
        
        s2 = s2.trim();
        s1 = s1.trim();

        s1 = s1.substr(0, s2.length).toLowerCase();

        return s1 === s2.toLowerCase();

    }
    render() {
        const { customOptionComponent, options } = this.props;
        const { hasFocus, value, suggestionIndex, selectedIndex } = this.state;

        return (
            <div className={styles["input-with-dropdown"]}>
                { hasFocus && 
                    <div className={styles["dropdown-wrapper"]}>
                        <div className={styles["suggestion"]}>
                            { suggestionIndex > -1 ? this.state.value + (options[suggestionIndex].label || options[suggestionIndex].value).substr(this.state.value.length) : '' }
                        </div>
                        <ul className={styles["dropdown-inner"]}>
                            {options.reduce((acc, option, index, optionsArr) => {
                    
                                let { value, label, ...otherProps } = option;

                                let toMatch = label || value;

                                if(this.matchText(toMatch, this.state.value) && index != suggestionIndex) {

                                    toMatch = this.state.value + toMatch.substr(this.state.value.length);

                                    acc.push(<DropdownOption key={ index } 
                                        label={toMatch}
                                        value={value}
                                        index={index}
                                        {...otherProps} 
                                        CustomComponent={customOptionComponent}
                                        onClick={e => this.handleOptionClick({ ...e, optIndex: index })} 
                                    />);
                                }
                                if(index == optionsArr.length - 1 && acc.length == 0 && suggestionIndex == -1) 

                                    acc.push(<DropdownOption key={ -1 } 
                                        label={'Aucun résultat'} 
                                        value={''}
                                        index={-1}
                                        CustomComponent={customOptionComponent} 
                                        onClick={e => this.handleOptionClick({ ...e, optIndex: -1 })} 
                                    />);
                                        
                                return acc;
                                
                            }, [])}
                        </ul>
                    </div>
                }
                <input 
                    onBlur={this.handleFocusBlur} 
                    onChange={this.handleInput} 
                    onFocus={this.handleFocusBlur}
                    onKeyDown={this.handleSubmit}
                    ref={this.inputRef}
                    value={selectedIndex > -1 ? options[selectedIndex].label || options[selectedIndex].value : value}
                    style={{
                        boxShadow: !value ? styles['input-shadow']['boxShadow'] : null,
                    }}
                    type="text">
                </input>
            </div>
        )
    }
}
InputWithDropdown.propTypes = {
    customOptionComponent: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    })),
    sortBy: PropTypes.oneOf(['label', 'value']).isRequired,
    locale: PropTypes.string,
    autoCompleteOnBlur: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
}
InputWithDropdown.defaultProps = {
    autoCompleteOnBlur: false,
    sortBy: 'value',
    options: [
        {
            value: 10,
            label: 'Ten',
        },
        {
            value: 9,
            label: 'Nine',
        },
        {
            value: 8,
            label: 'Eight',
        },
        {
            value: 7,
            label: 'Seven',
        },
        {
            value: 6,
            label: 'Six',
        },
        {
            value: 5,
            label: 'Five',
        },
        {
            value: 4,
            label: 'Four',
        },
        {
            value: 3,
            label: 'Three',
        },
        {
            value: 2,
            label: 'Two',
        },
        {
            value: 2,
            label: 'One',
        },
    ],
    locale: 'fr',
}

export default InputWithDropdown;