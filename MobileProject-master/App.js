import React, { Component } from 'react';
import * as firebase from 'firebase';
import Config from './config.js'
import Navigation from './src/screens'

console.ignoredYellowBox = [
  'Setting a timer'
  ];
  
export default class App extends Component {
  constructor(){
    super();
    if (!firebase.apps.length){
        firebase.initializeApp(Config.FirebaseConfig);
    }
  }
  
  render() {
    return (
      <Navigation/>
    );
  }
}