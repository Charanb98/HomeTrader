import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert, Platform, ScrollView } from 'react-native';
import { Constants } from 'expo';
import { Header, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
console.disableYellowBox = true;

class Support extends React.Component {

  constructor() {
    super();
    this.state = {
        adminEmail: "hassan.aborasheed@gmail.com",
        adminName: "Hassan",
        firstName: "",
        lastName: "",
        sender: "",
        email: "",
        message: "",
        displayError: false,
        error: "",
    }
  }


  componentDidMount() {
    var user = firebase.auth().currentUser;
    const userPath = "users/" + user.uid;
    var ref = firebase.database().ref().child(userPath);
    ref.on('value', (snapshot) => {
      var fname = snapshot.child("firstName").val();
      var lname = snapshot.child("lastName").val();

      if (user != null) {
        if (fname) {
          this.setState({ firstName: fname });
        }
        if (lname) {
          this.setState({ lastName: lname });
        }
        if (user.email) {
          this.setState({ email: user.email });
        }
        if(fname && lname)
            this.setState({ sender: fname + lname});
      }
    })
  }

  sendMessage = () => {
    console.log('state info: ', this.state);
    this.setState({ displayError: false });
    var status_code = 0;
    var response = "";
    const url = `http://api.hometrader.xyz/supportEmail.php?email=${this.state.adminEmail}&content=${this.state.message}&name=${this.state.adminName}&sender=${this.state.sender}`;
    console.log('name on states: ',this.state.sender);
    console.log('Generated URL: ', url);
    if (this.state.message != "") {
     fetch(url).then((Response)=>{ 
       status_code = Response.status;
       response = Response.text();
      }).then(() =>{
      setTimeout(()=>{
        console.log('response code: ', status_code);
     if(status_code != 403 && status_code == 200){
      Alert.alert('Success!',
      "Message Sent",
      [{text: 'OK', onPress: () => this.props.navigation.pop()}]
      );
     }else {
      this.setState({ displayError: true });
      this.setState({ error: "Error happened for sending email! \n Error detail: \n" + response});
      console.log('error details: ', response);
     }
      },
        100);});
    
    }else{
    this.setState({ displayError: true });
    this.setState({ error: "Message is Empty" });
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Header
              containerStyle={{
                backgroundColor: '#fff',
              }}
              centerComponent={{
                text: 'SUPPORT PAGE',
                style: { color: '#3498db', fontWeight: 'bold', fontSize: 18 },
              }}
              leftComponent={
                <Icon
                  name="md-arrow-back"
                  type="ionicon"
                  color='#3498db'
                  onPress={() => this.props.navigation.pop()}
                  underlayColor={'#64b5f6'}
                />
              }
            />
          </View>
          <KeyboardAwareScrollView
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            resetScrollToCoords={{ x: 0, y: 0 }}
            enableOnAndroid={true}
            enableAutoAutomaticScroll={(Platform.OS === 'ios')}
            scrollEnabled={(Platform.OS === 'ios')}
            contentContainerStyle={{ alignItems: 'center', marginTop: height * 0.03 }}
            getTextInputRefs={() => {
              return [this.firstNameInput, this.lastNameInput, this.emailInput, this.passwordInput, this.confirmPasswordInput];
            }}
          >
            {this.state.displayError ? <Text multiline style={styles.errors}>{this.state.error}</Text> : null}
            <View style={styles.formContainer}>
                <TextInput
                    placeholder = "Ask a question or describe your issue ..."
                    onChangeText={(val) => this.setState({message:val})}
                    multiline = {true}
                    numberOfLines = {10}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    ref = {(input) => this.messageInput = input}
                    style={styles.input}
                />
                

                <TouchableOpacity onPress={this.sendMessage} style={styles.buttonContainer}>
                <Text style={styles.buttonText}> SEND </Text>
                </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
    //alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  topMenu: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  profileContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    marginTop: 20,
    width: width * 0.8,
    fontSize: 25,
    textAlign: 'center',
    opacity: 0.9
  },
  formContainer: {
    padding: 20,
    marginBottom: height * 0.2
  },
  errors: {
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: width * 0.8,
    padding: 5,
    marginTop: 10,
    color: '#fff',
    height: height * 0.05,
    marginBottom: height * 0.01,
    flex: 1
  },
  input: {
    textAlignVertical: 'top',
    height: height * 0.5,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: height * 0.05,
    paddingTop: 10,
    color: '#FFF',
    paddingHorizontal: 10
  },
  buttonContainer: {
    backgroundColor: '#2980b9',
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: "#FFFFFF"
  },
});

export default Support;