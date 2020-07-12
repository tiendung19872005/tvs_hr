import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import variables from '../../assets/styles/variables';
import { Text, theme } from "galio-framework";
import moment from "moment";

LocaleConfig.locales['vn'] = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  monthNamesShort: ['Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6', 'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12 '],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'],
  today: 'Hôm nay\'HN'
};
LocaleConfig.defaultLocale = 'vn';

export default class Calendars extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startingDay: moment(props.startingDay).format('YYYY-MM-DD'),
      endingDay: moment(props.endingDay).format('YYYY-MM-DD'),
      // marked: { [moment(new Date()).format('YYYY-MM-DD')]: { selected: true, marked: true, dotColor: 'red', color: variables.backgroundColorTV } },
      marked: {},
      currentMonth: moment(props.startingDay).format('YYYY-MM'),
    }
    this.marginTopSet = props.marginTopSet;

    this.onDayPress = this.onDayPress.bind(this);
    this.selectedDay = this.selectedDay.bind(this);
    this.followDay = this.followDay.bind(this);
    this.thisMonth = this.thisMonth.bind(this);
    this.thisWeek = this.thisWeek.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
  }

  componentDidMount() {
    this.renderDataForMarker(this.state.startingDay, this.state.endingDay);
  }

  onDayPress(day) {
    let that = this;
    if (that.state.startingDay == '') {
      that.setState({
        startingDay: moment(day.dateString).format('YYYY-MM-DD'),
        marked: { [moment(day.dateString).format('YYYY-MM-DD')]: { startingDay: true, selected: true, color: variables.backgroundColorTV } },
        endingDay: ''
      });
    }
    if (that.state.startingDay != '') {
      if (that.state.endingDay != '') {
        that.setState({
          startingDay: moment(day.dateString).format('YYYY-MM-DD'),
          marked: { [moment(day.dateString).format('YYYY-MM-DD')]: { startingDay: true, selected: true, color: variables.backgroundColorTV } },
          endingDay: ''
        });
      } else {
        that.setState({ endingDay: moment(day.dateString).format("YYYY-MM-DD") });
        if (this.state.startingDay > day.dateString) {
          that.setState({
            startingDay: moment(day.dateString).format('YYYY-MM-DD'),
            marked: { [moment(day.dateString).format('YYYY-MM-DD')]: { startingDay: true, selected: true, color: variables.backgroundColorTV } },
            endingDay: ''
          });
        } else {
          this.selectedDay(this.state.startingDay, moment(day.dateString).format("YYYY-MM-DD"))
        }
      }
    }
  }

  renderDataForMarker = (startingDay, endingDay) => {
    let nextDay = [];
    let startingDate;
    let stopDate;
    let obj;
    startingDate = moment(startingDay);
    stopDate = moment(endingDay);

    if (startingDate > stopDate) {
      while (stopDate <= startingDate) {
        nextDay.push(moment(stopDate).format('YYYY-MM-DD'))
        stopDate = moment(stopDate).add(1, 'days');
      }
      obj = nextDay.reduce((c, v) => Object.assign(c, {
        [v]:
          v == moment(startingDay).format('YYYY-MM-DD') ? { endingDay: true, selected: true, color: variables.backgroundColorTV }
            : v == moment(endingDay).format('YYYY-MM-DD') ? { startingDay: true, selected: true, color: variables.backgroundColorTV }
              : { selected: true, marked: true, color: variables.backgroundColorTV }
      }), {});
    } else {
      while (startingDate <= stopDate) {
        nextDay.push(moment(startingDate).format('YYYY-MM-DD'))
        startingDate = moment(startingDate).add(1, 'days');
      }
      obj = nextDay.reduce((c, v) => Object.assign(c, {
        [v]: nextDay.length == 1 ? { selected: true, marked: true, color: variables.backgroundColorTV }
          :
          v == moment(startingDay).format('YYYY-MM-DD') ? { startingDay: true, selected: true, color: variables.backgroundColorTV }
            : v == moment(endingDay).format('YYYY-MM-DD') ? { endingDay: true, selected: true, color: variables.backgroundColorTV }
              : { selected: true, marked: true, color: variables.backgroundColorTV }
      }), {});
    }
    this.setState({ marked: obj });
  }

  selectedDay(startingDay, endingDay, thisIsOnChangMonth) {
    this.renderDataForMarker(startingDay, endingDay);
    if (thisIsOnChangMonth == null) {
      startingDay > endingDay
        ? this.response(moment(endingDay).format('YYYYMMDD'), moment(startingDay).format('YYYYMMDD'))
        : this.response(moment(startingDay).format('YYYYMMDD'), moment(endingDay).format('YYYYMMDD'))
    }
  }

  followDay() {
    const startOfDay = moment(new Date()).format('YYYY-MM-DD');
    const endOfDay = moment(new Date()).format('YYYY-MM-DD');
    this.setState({
      currentMonth: moment(moment.timestamp).format('YYYY-MM'),
      startingDay: startOfDay,
      endingDay: endOfDay,
    })
    this.selectedDay(startOfDay, endOfDay);
  }

  thisMonth() {
    let currentMonth = this.state.currentMonth;
    let startOfMonth = this.state.currentMonth + '-01';
    let endOfMonth = this.state.currentMonth + '-' + moment(currentMonth, "YYYY-MM").daysInMonth();
    this.setState({
      startingDay: startOfMonth,
      endingDay: endOfMonth,
    })
    this.selectedDay(startOfMonth, endOfMonth);
  }

  thisWeek() {
    let monday =
      this.state.currentMonth != moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(0)).format('YYYY-MM')
        ? moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(0)).format('YYYY-MM') + moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(0)).format('-DD')
        : this.state.currentMonth + moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(0)).format('-DD');

    let betweenday = this.state.currentMonth != moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(4)).format('YYYY-MM')
      ? moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(4)).format('YYYY-MM') + moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(4)).format('-DD')
      : this.state.currentMonth + moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(4)).format('-DD');

    let sunday = this.state.currentMonth != moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(6)).format('YYYY-MM')
      ? moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(6)).format('YYYY-MM') + moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(6)).format('-DD')
      : this.state.currentMonth + moment(moment(this.state.startingDay, 'YYYY-MM-DD').clone().weekday(6)).format('-DD');

    this.setState({
      currentMonth: moment(betweenday).format('YYYY-MM'),
      startingDay: monday,
      endingDay: sunday,
    })
    this.selectedDay(monday, sunday);
  }

  onMonthChange(month) {
    let currentMonth = this.state.currentMonth;
    currentMonth = moment(month.timestamp).format('YYYY-MM')
    this.setState({ currentMonth })
    if (this.state.currentMonth != moment(month.timestamp).format('YYYY-MM')) {
      this.setState({
        startingDay: currentMonth + moment(this.state.startingDay).format('-DD'),
        endingDay: currentMonth + moment(this.state.startingDay).format('-DD'),
      })
      this.selectedDay(currentMonth + moment(this.state.startingDay).format('-DD'), currentMonth + moment(this.state.startingDay).format('-DD'), 'thisIsOnChangMonth');

    } else {
      this.setState({
        startingDay: currentMonth + moment(this.state.startingDay).format('-DD'),
        endingDay: currentMonth + moment(this.state.endingDay).format('-DD'),
      })
      this.selectedDay(currentMonth + moment(this.state.startingDay).format('-DD'), currentMonth + moment(this.state.endingDay).format('-DD'), 'thisIsOnChangMonth');
    }
  }

  response = (startingDay, endingDay) => {
    // console.log(startingDay + '*|*' + endingDay);
    const daySelected =
      startingDay > endingDay ? moment(endingDay).format('DD.MM') + " -> " + moment(startingDay).format('DD.MM')
        : startingDay == endingDay ? moment(startingDay).format('DD.MM')
          : moment(startingDay).format('DD.MM') + " -> " + moment(endingDay).format('DD.MM');
    this.props.callback({ startingDay: startingDay, endingDay: endingDay, daySelected: daySelected });
  }

  render() {
    return (
      <View style={[styles.modalBackground, { position: 'absolute', top: this.marginTopSet, left: '2%', borderRadius: 5, width: '90%', }]} >

        <View style={[GlobalStyles.row1, {}]}>
          <TouchableOpacity onPress={() => this.followDay()}
            style={{ bordercolor: variables.backgroundColorTV, borderWidth: 1, borderRadius: 5, }}>
            <Text style={{ fontSize: 15, color: variables.backgroundColorTV, textAlign: 'center', padding: 7 }}>Hôm nay</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => this.thisWeek()}
            style={{ bordercolor: variables.backgroundColorTV, borderWidth: 1, borderRadius: 5, }}>
            <Text style={{ fontSize: 15, color: variables.backgroundColorTV, textAlign: 'center', padding: 7 }}>Tuần này</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => this.thisMonth()}
            style={{ bordercolor: variables.backgroundColorTV, borderWidth: 1, borderRadius: 5, }}>
            <Text style={{ fontSize: 15, color: variables.backgroundColorTV, textAlign: 'center', padding: 7 }}>Tháng này</Text></TouchableOpacity>
        </View>

        <Calendar
          // style={styles.calendar}
          //maxDate={moment(new Date()).format("YYYY-MM-DD")}
          monthFormat={'MMMM - yyyy'}
          onDayPress={this.onDayPress}
          //onDayLongPress={this.onDayPress2}
          //onMonthChange={(month) => console.log('â' + month)}
          onMonthChange={(month) => {
            this.onMonthChange(month)
          }}
          hideDayNames={false}
          showWeekNumbers={false}
          hideExtraDays={false}
          firstDay={0}
          current={this.state.currentMonth}
          //current={this.state.currentMonth + moment(this.state.startingDay).format('-DD')}
          //markedDates={this.state.marked}

          markedDates={this.state.marked}
          markingType={'period'}
          style={{
            marginTop: 7,
            //borderWidth: 0.5,
            //borderRadius: 2,
            //height: 200
          }}
          theme={{
            'stylesheet.day.basic': {

            },
            'stylesheet.calendar.main': {
              week: {
                marginTop: 0,
                marginBottom: 0,
                flexDirection: 'row',
                justifyContent: 'space-around'
              },
            },
            'stylesheet.calendar.header': {
              'header': {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 0,
                alignItems: 'center'
              },
              week: {
                marginTop: 0,
                flexDirection: 'row',
                justifyContent: 'space-around'
              },
              arrow: {
                padding: 0,
              },
            },
            calendarBackground: 'white',
            selectedDayBackgroundcolor: variables.backgroundColorTV,
            selectedDayTextColor: '#ffffff',
            todayTextColor: variables.textValue,
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: variables.textValue,
            selectedDotColor: '#ffffff',
            arrowColor: variables.textValue,
            monthTextcolor: variables.backgroundColorTV,
            indicatorColor: variables.textValue,
            textDayFontWeight: '400',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '400',
            textDayFontSize: 14,
            textMonthFontSize: 14,
            textDayHeaderFontSize: 13
          }}
        />
      </View>

    )
  }
}


const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'white',
    padding: 10
  },
});

