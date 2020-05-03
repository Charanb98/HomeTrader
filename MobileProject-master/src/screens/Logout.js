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

class Logout extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: "",
        }
    } 
    
    onLogout = () => {
      firebase.auth().signOut().then(() =>  {
        this.props.navigation.navigate('Login');
      },() => {
        this.setState({error: "There was an error signing you out."});
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
            <Text style={styles.confirmHeader}>
                Confirmation
            </Text>
            <Text style={styles.confirmText}>
                Are you sure you want to sign out?
            </Text>
            <TouchableOpacity onPress={this.onLogout} style={styles.buttonContainer}>
                <Text style={styles.buttonText}> SIGN OUT </Text>
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
    confirmHeader: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    confirmText: {
        color: '#fff',
        marginBottom: 50
    },
    logo: {
        marginTop: height * 0.1,
        width: 150,
        height: 150
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

export default Logout;
