import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import * as firebase from 'firebase';
import { Constants } from 'expo';
import { Header, Icon, Card, Button} from 'react-native-elements';
import { ScrollView } from 'react-native';
import LocalNotification from 'react-native-local-notification';
import { ListItem } from 'react-native-elements';

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: []
    }
  }

  componentDidMount(){
    let uid = firebase.auth().currentUser.uid;
    let notificationRef = firebase.database().ref('Notification');
    this.listenForNotificationData(uid, notificationRef);
  }
  
  listenForNotificationData(uid, notificationRef){
    notificationRef.on('value', (dataSnapshot) => {
      var content = [];
      console.log("In content: ", content);
      dataSnapshot.forEach((child) => {
        if(child.val().uid == uid){
                content.push({
                content: child.val().content,
                read : child.val().read,
                key : child.key
                });
            }
        });
        this.setState({
            content: content
        });
    });
    console.log("Length: ",this.state.content.length)
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <View style={styles.container}>
        <View>
          <Header
            containerStyle={{
            backgroundColor: '#fff',
            }}
            centerComponent={{
                text: 'Your Notifications',
                style: { color: '#3498db', fontWeight: 'bold', fontSize: 18},
            }}
          />
        </View>
        <ScrollView onScroll={this.handleScroll}>
          {this.state.content.map((u, i) => {
            if ((this.state.content).length != 0) {
                if(parseInt(u.read)==0){
                return (
                    <ListItem
                        topDivider={true}
                        bottomDivider={true}
                        style={{ paddingBottom: 2}}
                        leftIcon = {{ name: "circle", color: "fff", type: "font-awesome"}}
                        key={i}
                        title={u.content}
                        button onPress={() =>{
                            firebase.database().ref().child('Notification').child(""+u.key).update({
                                read : 1
                            }).catch(error => console.log(error));
                            this.refs.localNotification.showNotification({
                                title: "Success!",
                                text: "You marked this message as read."
                            });
                        }}
                    />
                );
                }else{
                    return (
                    <ListItem
                        topDivider={true}
                        bottomDivider={true}
                        style={{ paddingBottom: 2}}
                        key={i}
                        title={u.content}
                    />
                );
                }
            }
          })}
        </ScrollView>
        </View>
      <LocalNotification ref="localNotification" />
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
});