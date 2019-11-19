import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import {Calendar} from 'react-native-calendars';

 
export default class TimeslotScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	nextDays:[]
    };
    this.onDayPress = this.onDayPress.bind(this);
  }
  onDayPress(day) {
  	return fetch('http://192.168.43.55:3000/checkavailabledates', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'access-control-allow-origin':'*'
     },
     body: JSON.stringify({
       available_date : day.dateString,
     })

     }).then((response) => response.json())
         .then((responseJson) => {
         	if(responseJson.data[0].totalcount == 0){
         		alert('Date is not available !');
         		return false;
         	}else{
         		fetch('http://192.168.43.55:3000/bookrequest', {
			     method: 'POST',
			     headers: {
			       'Accept': 'application/json',
			       'Content-Type': 'application/json',
			       'access-control-allow-origin':'*'
			     },
			     body: JSON.stringify({
			       request_date : day.dateString,
			       seller_id: this.props.navigation.state.params.id,
			       seller_name: this.props.navigation.state.params.name
			     })

			     }).then((response) => response.json())
			         .then((responseJson) => {
			         	
			         	if(responseJson.data[0] && responseJson.data[0].totalcount == 1){
			         		alert('Already sent request this date is not available!');
			         		return false;
			         	}else {
			         		if(responseJson.data.insertId > 0){
			         			alert('Book request successfully!');
			         			return false;
			         		}
			         	}
			    }).catch((error) => {
       				console.log(error);
    			})

         	}
          //this.setState({ users: responseJson.data , newarrs:responseJson.data, loading: false });
     }).catch((error) => {
       console.log(error);
    })
    this.setState({
      selected: day.dateString,
    });
    this.props.navigation.navigate('Slot', { bookingDate : day })
  }
  _onPressBack(){
    const {goBack} = this.props.navigation
      goBack()
  }
  componentDidMount(){
   return fetch('http://192.168.43.55:3000/availabledates', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'access-control-allow-origin':'*'
     },
     }).then((response) => response.json())
         .then((responseJson) => {

         	let newDaysObject = {};
		    responseJson.data.forEach((day) => {
		      newDaysObject[day.available_date] = {
		          selected: true,
		          marked: true
		      };
		    });
          this.setState({ nextDays: newDaysObject });
     }).catch((error) => {
       console.log(error);
    })
 }
  render() {
  	const {nextDays} = this.state;
    return (
      <View style={styles.container}>
        <Text> {this.props.navigation.state.params.name} - Choose Time Slot to Request Book </Text>
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          markedDates={
          	nextDays
          }
          theme={{
            selectedDayBackgroundColor: 'green',
            todayTextColor: 'green',
            arrowColor: 'green',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    padding: 10, 
    fontSize:16,

  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 350
  }
});