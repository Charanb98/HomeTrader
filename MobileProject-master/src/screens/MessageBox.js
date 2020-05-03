import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  ScrollView
} from "react-native";
import * as firebase from "firebase";
import { Constants } from "expo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Header, Icon } from "react-native-elements";
var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

console.disableYellowBox = true;

export default class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    const leaseruid = this.props.navigation.getParam("leaseruid");
    this.state = {
      leaser: "",
      leaser_email: "",
      message: "",
      displayError: false,
      error: "",
      sender:""
    };
    setTimeout(()=>{
    firebase
      .database()
      .ref('users')
      .child('' + leaseruid)
      .on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("firstname: ",data.firstName);
        console.log("email: ",data.email);
        this.setState(() => ({
          leaser: data.firstName,
          leaser_email: data.email
        }));
      }
      );
      firebase.database().ref('users').child(''+firebase.auth().currentUser.uid).on('value',(snapshot) => {
        const data = snapshot.val();
        console.log('sender:', data.firstName);
        this.setState(() => 
        ({sender: data.firstName+' '+data.lastName}));
      });
    },150);
      console.log('state info: ', this.state);
  }
  sendMessage = () => {
    console.log('state info: ', this.state);
    this.setState({ displayError: false });
    var status_code = 0;
    var response = "";
    const url = `http://api.hometrader.xyz/sendmail.php?email=${this.state.leaser_email}&content=${this.state.message}&name=${this.state.leaser}&sender=${this.state.sender}`;
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
              backgroundColor: "#fff"
            }}
            centerComponent={{
              text: "Message User",
              style: { color: "#3498db", fontWeight: "bold", fontSize: 18 }
            }}
            leftComponent={
              <Icon
                name="md-arrow-back"
                type="ionicon"
                color="#3498db"
                onPress={() => this.props.navigation.pop()}
                underlayColor={"#64b5f6"}
              />
            }
          />
        </View>
        <KeyboardAwareScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid={true}
          scrollEnabled={false}
          contentContainerStyle={{
            alignItems: "center",
            marginTop: height * 0.03
          }}
          getTextInputRefs={() => {
            return [this.messageInput];
          }}
        >
          {this.state.displayError ? (
            <Text style={styles.errors}>{this.state.error}</Text>
          ) : null}
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Enter Message"
              multiline
              onChangeText={val => this.setState({ message: val })}
              placeholderTextColor="rgba(255,255,255,0.7)"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              ref={input => (this.messageInput = input)}
            />
            <TouchableOpacity
              onPress={this.sendMessage}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}> SEND MESSAGE </Text>
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
    backgroundColor: "#3498db",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight
  },
  input: {
    height: height * 0.4,
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: height * 0.05,
    color: "#FFF",
    paddingHorizontal: 10
  },
  errors: {
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: width * 0.8,
    padding: 5,
    marginTop: 10,
    color: "#fff",
    height: height * 0.1,
    marginBottom: height * 0.01,
    flex: 1
  },
  buttonContainer: {
    backgroundColor: "#2980b9",
    paddingVertical: 15
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF"
  }
});
