import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import LocalNotification from 'react-native-local-notification';
  export function GetNotification(uid){
    ref = firebase.database().ref('Notification');
    var msg = 0;
    console.log("I ran!");
    console.log("Current UID: ", uid);
    this.ref.on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        var str = JSON.stringify(child.val());
        var parsed = JSON.parse(str);
        console.log("record uid: ", parsed.uid);
        console.log("Compare Value: ",parsed.uid.localeCompare(uid));
        console.log("status: ",parsed.notify)
        if (parsed.uid.localeCompare(uid)==0 && parseInt(parsed.notify == 0)){
          childid = child.key;
          console.log("number of msg", msg);
          console.log("The code is almost end!");
          msg += 1;
          firebase.database().ref().child('Notification').child(""+childid).update({
            notify : 1
        }).catch(error => console.log(error));
        }
        return msg;
      });
    });
}

export function PostNotification(uid, content) {
  var notif = firebase.database().ref("Notification");
  console.log("I ran!");
  console.log("Current UID: ", uid);
  notif.push({
    content: content,
    read: 0,
    uid: uid,
    notify: 0
  });
}



