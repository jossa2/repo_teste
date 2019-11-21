import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, TouchableHighlight, ScrollView, Button } from 'react-native';
import PropTypes from 'prop-types';
import {  ListItem, SearchBar} from 'react-native-elements';
import axios from 'axios';

import TimeslotScreen from '../screens/TimeslotScreen';

export default class FlatListBasics extends React.Component {

  // static propTypes = {
  //       newarrs: PropTypes.array,
  // }
  // static defaultProps = {
  //   newarrs: [
  //           {name: 'Devinddddddddddd', location:'India'},
  //           {name: 'Dan', location:'India'},
  //           {name: 'Dominic', location:'India'},
  //           {name: 'Jackson', location:'India'},
  //           {name: 'James', location:'India'},
  //           {name: 'Joel', location:'India'},
  //           {name: 'John', location:'India'},
  //           {name: 'Jillian', location:'India'},
  //           {name: 'Jimmy', location:'India'},
  //           {name: 'Julie', location:'India'},
  //         ],
  // }
  constructor(props){
    super(props);
      this.state = {
        user:'',
        loading: false,
        refreshing: false,
        users: [] // we are setting the initial state with the data you import
      }
  }

  filterSearch(text) {
      if(text !== null){
        const newData = this.state.newarrs.filter((item)=>{
        const itemData = item.name.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData)>-1
      });
      this.setState({
        text:text,
        users: newData // after filter we are setting users to new array
      });
    }else
    {
      this.setState({
        text:text,
        users: this.state.newarrs // after filter we are setting users to new array
      });
    }
    
  }
   renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };
  componentDidMount(){
   return fetch('http://192.168.43.55:3000/get_sellers', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'access-control-allow-origin':'*'
     },
     // body: JSON.stringify({
     //   id : ?,
     //   imagename : ?,

     // })

     }).then((response) => response.json())
         .then((responseJson) => {
          this.setState({ users: responseJson.data , newarrs:responseJson.data, loading: false });
     }).catch((error) => {
       console.log(error);
    })
 }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        
        <View >
            <SearchBar style={styles.search}
                placeholder="Find sellers"
                onChangeText={(text) => this.filterSearch(text)}
                value={this.state.text}
            />
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>

          <FlatList
          data={this.state.users}
          renderItem={({item}) => {
              return(
                    <>
                     <ListItem icon onPress={() => navigate('Timeslot', {name: item.name, id:item.id})}
                      roundAvatar
                      title={`${item.name}`}
                      subtitle={`${item.locations}`}
                      avatar={{ uri: '../assets/images/logo.png' }}
                      chevron
                      containerStyle={{ borderBottomWidth: 0 }}
                    />  
                   </>
                  
              )
            }
          }
          
          ItemSeparatorComponent={this.renderSeparator}

        />
        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    alignSelf:'flex-start'
  },
  icon:{
    alignSelf:'flex-end',
    fontSize: 18,
    backgroundColor: '#ccc',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
      padding: 10,
  },
  input: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      backgroundColor: '#fff',
      color: '#424242',
  },
  scrollView: {
    backgroundColor: '#ccc',
  },
})
