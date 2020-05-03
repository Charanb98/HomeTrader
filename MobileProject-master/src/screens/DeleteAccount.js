import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions
} from "react-native";
import * as firebase from "firebase";
import { Constants } from "expo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Header, Icon } from "react-native-elements";
var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

console.disableYellowBox = true;

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      displayError: false,
      error: ""
    };
  }

  deleteAccount = () => {
    var that = this;
    var user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(this.state.email, this.state.password);
    
    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
      that.props.navigation.navigate("Login")
      user.delete();
    }).catch(function(error) {
      that.setState({ displayError: true });
      that.setState({ error: error });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            containerStyle={{
              backgroundColor: "#fff"
            }}
            centerComponent={{
              text: "Delete Account",
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
            return [this.emailInput];
          }}
        >
          {this.state.displayError ? (
            <Text style={styles.errors}>{this.state.error}</Text>
          ) : null}
          <View style={styles.formContainer}>
            <TextInput
              placeholder="E-mail"
              onChangeText={val => this.setState({ email: val })}
              placeholderTextColor="rgba(255,255,255,0.7)"
              returnKeyType="next"
              keyboardType="email-address"
              autoCapitalize="none"
              onSubmitEditing={() => this.passwordInput.focus()}
              autoCorrect={false}
              style={styles.input}
              ref={input => (this.emailInput = input)}
            />
            <TextInput
              placeholder="Password"
              onChangeText={val => this.setState({ password: val })}
              placeholderTextColor="rgba(255,255,255,0.7)"
              returnKeyType="go"
              keyboardType="password"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              ref={input => (this.passwordInput = input)}
            />
            <TouchableOpacity
              onPress={() => this.deleteAccount()}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}> DELETE ACCOUNT </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
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
    height: height * 0.05,
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
    height: height * 0.05,
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
