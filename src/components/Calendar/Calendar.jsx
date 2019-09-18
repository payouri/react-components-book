import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { daysInMonth, getLastDayOfTheMonth, getFirstDayOfTheMonth, weekdaysFormats } from '../../commons/js/date';

import styles from './Calendar.scss';

const DayHeading = function({ date, locale, format }) {

    const wd = date.toLocaleDateString(locale, { weekday: format });
    return (
        <div className={styles["day-heading"]}>
            { wd[0].toUpperCase() + wd.substr(1) }
        </div>
    )

}
DayHeading.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    format: PropTypes.oneOf(weekdaysFormats),
    locale: PropTypes.string,
}
DayHeading.defaultProps = {
    format: 'long',
    locale: 'fr-FR'
}

const Day = function({ day }) {

    return (
        <div data-day={day}>
            { day }
        </div>
    );

}
Day.propTypes = {
    day: PropTypes.number,
}

const emptyPlaceholderDay = function() {

    return (
        <div data-day={''}></div>
    );

}
emptyPlaceholderDay.propTypes = {}

export default class Calendar extends Component {

    static Day = Day;
    static DayHeading = DayHeading;

    constructor(props) {
        super(props);

        const { initialDate } = this.props;
        initialDate.setHours(0, 0, 0, 0);


        this.state = {

            month: initialDate.getMonth(),
            year: initialDate.getFullYear()

        }

        this.setMonth = this.setMonth.bind(this);

    }
    setMonth(n) {

        const { month, year } = this.state;
        
        if(n + month > 11) {

            const newMonth = (n + month) % 11,
                addedYears = Math.floor((n + month) / 11);

            this.setState({
                month: newMonth - 1,
                year: year + addedYears,
            })
        } else {

            this.setState({
                month: month + n,
            })
        }
    }
    render() {

        const { initialDate, startingDay, locale, headingFormat } = this.props;
        const { month, year } = this.state;
        
        const renderDays = function() {
            
            const c = daysInMonth(month, year),
                days = new Array(c);
            
            for(let i = 0, n = c; i < n; i++) {
            
                days[i] = <Day key={i} day={i + 1}/>

            }

            return days;

        }
        const renderHeadings = function() {

            const c = 7,
                dayHeadings = new Array(c);

            const d = new Date(initialDate.getTime() - (initialDate.getDay() - startingDay) * 24 * 60 * 60 * 1000);
            for(let i = 0; i < 7; i++) {
                dayHeadings[i] = <DayHeading key={i} date={new Date(d.getTime() + 24 * 60 * 60 * 1000 * i)} format={headingFormat} locale={locale} />
            }

            return dayHeadings;

        }

        return (
            <div className={styles["calendar-wrapper"]}>
                <div className={styles["header"]}>
                    <div className={styles["toolbar"]}>
                        <button onClick={() => {this.setMonth(-1)}}>
                            Mois Moins
                        </button>
                        <button onClick={() => {this.setMonth(1)}}>
                            Mois Plus
                        </button>
                    </div>
                    <div className="headings-wrapper">
                        { renderHeadings() }
                    </div>
                </div>
                <div className={styles["day-grid"]}>
                    { renderDays() }
                </div>
            </div>
        )
    }
}

Calendar.propTypes = {
    initialDate: PropTypes.instanceOf(Date),
    startingDay: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    onDayClick: PropTypes.func,
    locale: PropTypes.string,
    headingFormat: PropTypes.oneOf(weekdaysFormats),
}

Calendar.defaultProps = {
    initialDate: new Date(),
    startingDay: 1,
    locale: 'fr-FR',
    headingFormat: 'short',
}