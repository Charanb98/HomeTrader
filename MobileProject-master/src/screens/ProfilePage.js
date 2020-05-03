import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert, Platform, ScrollView } from 'react-native';
import { Constants } from 'expo';
import { Header, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
console.disableYellowBox = true;

class ProfilePage extends React.Component {

  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      curEmail: "",
      curFirstName: "",
      curLastName: "",
      currentPassword: "",
      password: "",
      repeatPassword: "",
      displayError: false,
      error: ""
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
          this.setState({ curFirstName: fname });
        }
        if (lname) {
          this.setState({ lastName: lname });
          this.setState({ curLastName: lname });
        }
        if (user.email) {
          this.setState({ email: user.email });
          this.setState({ curEmail: user.email });
        }
        //if(user.password) this.setState({curPassword: user.password});
        //console.log(user);
      }
    })
  }

  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  updateAccount = () => {
    var user = firebase.auth().currentUser;
    const profile = firebase.database().ref().child("users").child("" + user.uid);

    if (this.state.firstName == "" || this.state.lastName == "" || this.state.email == "" || this.state.currentPassword == "") {
      Alert.alert(
        'Oops!',
        'Fill the blank fields please.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } else {
      var updated = false;
      if (this.state.firstName != this.state.curFirstName) {
        profile.update({ firstName: this.state.firstName });
        updated = true;
      }
      if (this.state.lastName != this.state.curLastName) {
        profile.update({ lastName: this.state.lastName });
        updated = true;
      }
      if (this.state.email != this.state.curEmail) {
        this.reauthenticate(this.state.currentPassword).then(() => {
          var user = firebase.auth().currentUser;
          user.updateEmail(newEmail).then(() => {
            console.log("Email updated!");
            updated = true;
          }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
      }
      if (this.state.password != "") {
        if (this.state.password != this.state.repeatPassword) {
          this.setState({ displayError: true });
          this.setState({ error: "Your passwords do not match." });
        } else {
          user.updatePassword(this.state.password);
          updated = true;
        }
      }
      if (updated == true) {
        if (this.state.email != this.state.curEmail) {
          console.log(user.email);
          user.sendEmailVerification();
          Alert.alert(
            'Updated Successfully!',
            'We have sent a verification link, please verify your new email address to login.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
          this.props.navigation.navigate('Login');
        }
        else if (this.state.password != this.state.curPassword) {
          Alert.alert(
            'Updated Successfully!',
            'Your password has been changed, please login again.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
          this.props.navigation.navigate('Login');
        }
        else {
          Alert.alert(
            'Updated Successfully!',
            'Your profile has been updated successfully.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
        }
      }
    }
  }

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
                text: 'My Profile',
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
                value={this.state.firstName}
                onChangeText={(val) => this.setState({ firstName: val })}
                placeholderTextColor="rgba(255,255,255,0.7)"
                returnKeyType="next"
                onSubmitEditing={() => this.lastNameInput.focus()}
                autoCapitalize="words"
                autoCorrect={false}
                ref={(input) => this.firstNameInput = input}
                style={styles.input}
              />
              <TextInput
                value={this.state.lastName}
                onChangeText={(val) => this.setState({ lastName: val })}
                placeholderTextColor="rgba(255,255,255,0.7)"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => this.emailInput.focus()}
                autoCorrect={false}
                style={styles.input}
                ref={(input) => this.lastNameInput = input}
              />
              <TextInput
                value={this.state.email}
                onChangeText={(val) => this.setState({ email: val })}
                placeholderTextColor="rgba(255,255,255,0.7)"
                returnKeyType="next"
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => this.passwordInput.focus()}
                autoCorrect={false}
                style={styles.input}
                ref={(input) => this.emailInput = input}
              />
              <TextInput
                placeholder="Enter Current Password"
                onChangeText={(val) => this.setState({ currentPassword: val })}
                placeholderTextColor="rgba(255,255,255,0.7)"
                blurOnSubmit={true}
                returnKeyType="go"
                autoCapitalize="none"
                onSubmitEditing={() => this.confirmPasswordInput.focus()}
                secureTextEntry
                style={styles.input}
                ref={(input) => this.currentPasswordInput = input}
              />
              <TextInput
                placeholder="Change Password"
                onChangeText={(val) => this.setState({ password: val })}
                placeholderTextColor="rgba(255,255,255,0.7)"
                blurOnSubmit={true}
                returnKeyType="go"
                autoCapitalize="none"
                onSubmitEditing={() => this.confirmPasswordInput.focus()}
                secureTextEntry
                style={styles.input}
                ref={(input) => this.passwordInput = input}
              />
              <TextInput
                placeholder="Confirm New Password"
                onChangeText={(val) => this.setState({ repeatPassword: val })}
                placeholderTextColor="rgba(255,255,255,0.7)"
                blurOnSubmit={true}
                returnKeyType="go"
                autoCapitalize="none"
                secureTextEntry
                style={styles.input}
                ref={(input) => this.confirmPasswordInput = input}
              />
              <TouchableOpacity onPress={this.updateAccount} style={styles.buttonContainer}>
                <Text style={styles.buttonText}> UPDATE ACCOUNT </Text>
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
    height: height * 0.05,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
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

export default ProfilePage;