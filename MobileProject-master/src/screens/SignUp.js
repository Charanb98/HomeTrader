import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert, Platform} from 'react-native';
import { Constants } from 'expo';
import { Header, Icon} from 'react-native-elements';
import * as firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
console.disableYellowBox = true;

class SignUp extends React.Component {

  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      displayError: false,
      error: ""
    }
  }

  createAccount = () => {
    if(this.state.password != this.state.repeatPassword) {
      this.setState({displayError: true});
      this.setState({error: "Your passwords do not match."});
    } else {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        let user = firebase.auth().currentUser;
        firebase.database().ref("users").child(user.uid).update({
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        })

        user.sendEmailVerification().then(() => {
          Alert.alert(
            'Check your email',
            'We have sent a verification link, please verify your email address to login.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
          this.props.navigation.navigate('Login');
        },(error) => {
          this.setState({displayError: true});
          this.setState({error: error.message});
        }); 
        
      }, (error) => {
        this.setState({displayError: true});
        this.setState({error: error.message});
      });
    }
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
                text: 'Sign Up',
                style: { color: '#3498db', fontWeight: 'bold', fontSize: 18},
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
          contentContainerStyle={{alignItems: 'center', marginTop: height * 0.03}}
          getTextInputRefs={() => {
            return [this.firstNameInput,this.lastNameInput,this.emailInput,this.passwordInput,this.confirmPasswordInput];
          }} 
        >
            {this.state.displayError? <Text multiline style={styles.errors}>{this.state.error}</Text> : null}
            <View style={styles.formContainer}>
              <TextInput
                placeholder="First Name"
                onChangeText={(val) => this.setState({firstName:val})}
                placeholderTextColor="rgba(255,255,255,0.7)"
                returnKeyType="next"
                onSubmitEditing={() => this.lastNameInput.focus()}
                autoCapitalize="words"
                autoCorrect={false}
                ref = {(input) => this.firstNameInput = input}
                style={styles.input}
              />
              <TextInput
                placeholder="Last Name"
                onChangeText={(val) => this.setState({lastName:val})}
                placeholderTextColor="rgba(255,255,255,0.7)"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => this.emailInput.focus()}
                autoCorrect={false}
                style={styles.input}
                ref = {(input) => this.lastNameInput = input}
              />
              <TextInput
                placeholder="E-mail"
                onChangeText={(val) => this.setState({email:val})}
                placeholderTextColor="rgba(255,255,255,0.7)"
                returnKeyType="next"
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => this.passwordInput.focus()}
                autoCorrect={false}
                style={styles.input}
                ref = {(input) => this.emailInput = input}
              />
              <TextInput
                  placeholder="Password"
                  onChangeText={(val) => this.setState({password:val})}
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  blurOnSubmit={true}
                  returnKeyType="go"
                  autoCapitalize="none"
                  onSubmitEditing={() => this.confirmPasswordInput.focus()}
                  secureTextEntry
                  style={styles.input}
                  ref = {(input) => this.passwordInput = input}
              />
              <TextInput
                  placeholder="Repeat Password"
                  onChangeText={(val) => this.setState({repeatPassword:val})}
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  blurOnSubmit={true}
                  returnKeyType="go"
                  autoCapitalize="none"
                  secureTextEntry
                  style={styles.input}
                  ref = {(input) => this.confirmPasswordInput = input}
              />
              <TouchableOpacity onPress={this.createAccount} style={styles.buttonContainer}>
                  <Text style={styles.buttonText}> CREATE ACCOUNT </Text>
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
    backgroundColor: '#3498db',
    //alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  topMenu: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  signupContainer: {
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
      height: height * 0.05,
      width: width * 0.8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'rgba(255,255,255,0.2)',
      marginBottom: height * 0.05,
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
  }	
});

export default SignUp;