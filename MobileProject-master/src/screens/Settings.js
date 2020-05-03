import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import { Constants } from 'expo';
import { Header } from 'react-native-elements';

console.disableYellowBox = true;
var height = Dimensions.get('window').height;


export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  onLogout = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.popToTop();
    }, () => {
      this.setState({ error: "There was an error signing you out." });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            containerStyle={{
              backgroundColor: '#fff',
            }}
            centerComponent={{
              text: 'Settings',
              style: { color: '#3498db', fontWeight: 'bold', fontSize: 18 },
            }}
          />
        </View>
        <ScrollView style={{marginTop: 20}} onScroll={this.handleScroll}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfilePage')} style={styles.buttonContainer}>
            <Text style={styles.buttonText}> YOUR PROFILE </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('DeleteAccount')} style={styles.buttonContainer}>
            <Text style={styles.buttonText}> DELETE ACCOUNT </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Support')} style={styles.buttonContainer}>
            <Text style={styles.buttonText}> SUPPORT </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('LogOut')} style={styles.buttonContainer}>
            <Text style={styles.buttonText}> LOG OUT </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  topMenu: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonContainer: {
    backgroundColor: '#2980b9',
    paddingVertical: 15,
    marginTop: height * 0.025,
  },
  buttonText: {
    textAlign: 'center',
    color: "#FFFFFF"
  }
});