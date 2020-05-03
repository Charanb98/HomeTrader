import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    KeyboardAvoidingView,
    TextInput, 
    TouchableOpacity,
    Dimensions} from 'react-native';
import * as firebase from 'firebase';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
console.disableYellowBox = true;

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "", 
            error: "",
            isHidden: false,
        }
    } 
    
    onLoginPress = () => {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() =>  {
        let user = firebase.auth().currentUser;
        if (user.emailVerified){
            this.setState({email: "", password: "", error: "", isHidden: false})
            this.props.navigation.navigate('Main');
        }
        else {
            this.setState({password: "", error: "Please verify your account!", isHidden: true})
        }
      },() => {
        this.setState({password: "", error: "Invalid E-mail/Password", isHidden: true})
      });
    }

    render() {
        return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.loginContainer}>
            <Image
            style={styles.logo}
            source={require('../img/HomeTrader.png')}
            />
        </View>
        <View style={styles.formContainer}>
            {this.state.isHidden?  <Text style={styles.errors}>{this.state.error}</Text> : null}
            <TextInput
                placeholder="E-mail"
                onChangeText={(val) => this.setState({email:val})}
                placeholderTextColor="rgba(255,255,255,0.7)"
                returnKeyType="next"
                onSubmitEditing={() => this.passwordInput.focus()}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                value = {this.state.email}
            />
            <TextInput
                placeholder="Password"
                onChangeText={(val) => this.setState({password:val})}
                placeholderTextColor="rgba(255,255,255,0.7)"
                blurOnSubmit={true}
                returnKeyType="go"
                autoCapitalize="none"
                secureTextEntry
                style={styles.input}
                ref = {(input) => this.passwordInput = input}
                value = {this.state.password}
            />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')} transparent style={[styles.buttonContainer,{backgroundColor: 'transparent', bottom: height * 0.05}]}>
                <Text style={styles.buttonText}> Forgot Password? </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onLoginPress} style={styles.buttonContainer}>
                <Text style={styles.buttonText}> LOGIN </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} style={[styles.buttonContainer,{backgroundColor: 'transparent',top: height * 0.06}]}>
                <Text style={[styles.buttonText,{alignSelf: 'flex-end'}]}> Sign Up </Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        marginTop: height * 0.20,
        width: 225,
        height: 225
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
    },
    formContainer: {
        padding: 20,
        marginBottom: height * 0.2
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

export default Login;
