import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  View,
  Platform
} from 'react-native';
import { Constants} from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Icon } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
console.disableYellowBox = true;

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            maxPrice: 9999999999999999,
            minBedrooms: -1,
            minBathrooms: -1,
            BorR: true
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
                        text: 'Apply Filters to Search',
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
                    return [this.priceInput,this.bedroomsInput,this.bathroomsInput];
                    }} 
                >
                <Text style={{marginBottom: 10, marginLeft: 5, marginRight: 5, color: "white"}}>
                    To filter listings, select if you are buying, renting or looking at both options and then enter one or more criteria in the text boxes below.
                </Text>

                        <View style={{marginTop: 10, marginBottom: 30}}>
                        <RadioForm
                            radio_props={[
                                {label: 'Buy a House  ', value: 0 },
                                {label: 'Rent a House ', value: 1 },
                                {label: 'Buying/Renting ', value: true}
                            ]}
                            formHorizontal={true}
                            onPress={(value) => {this.setState({BorR: value})}}
                            ref = {(input) => this.typeInput = input}
                            buttonColor={'white'}
                            buttonSize={4}
                            selectedButtonColor ={'white'}
                            labelColor={'white'}
                            selectedLabelColor = {'white'}
                        />
                    </View>

                    <TextInput
                        placeholder = "What is the Maximum Price (in CAD)?"
                        onChangeText={(val) => this.setState({maxPrice:val})}
                        keyboardType = "numeric"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.priceInput = input}
                        style={styles.input}
                    />
  
                    <TextInput 
                        placeholder = "How many bedrooms minimum?"
                        onChangeText={(val) => this.setState({minBedrooms:val})}
                        keyboardType = 'numeric'
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.bedroomsInput = input}
                        style={styles.input}
                    /> 
                    <TextInput 
                        placeholder = "How many bathrooms minimum?"
                        onChangeText={(val) => this.setState({minBathrooms:val})}
                        keyboardType = 'numeric'
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.bathroomsInput = input}
                        style={styles.input}
                    /> 
  
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>                
                        <TouchableOpacity style={styles.buttonContainer} onPress={this.submitFilters}>
                            <Text style={styles.buttonText} > Search Listings </Text>
                        </TouchableOpacity>
                    </View>
                    
                </KeyboardAwareScrollView>
          </View>
        </ScrollView>
    );
  }
  
  submitFilters = () => {
    this.props.navigation.navigate("Main", {filters: this.state});
}

};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
},
inputStyle: {
    flex: 1,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginTop: 100,
    marginBottom: 100,
    width: 300
},
buttonText: {
    textAlign: 'center',
    color: "#FFFFFF",
}
});
