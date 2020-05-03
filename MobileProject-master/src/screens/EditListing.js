import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
  View,
  Platform
} from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';
import uuid from 'uuid';
import * as firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Icon } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import {GetNotification, PostNotification} from './Notifications';


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
console.disableYellowBox = true;

export default class App extends React.Component {
    constructor(props){
        super(props);
        const key = this.props.navigation.getParam('key');
        this.state = {
          title: null,
          address: null,
          type: 0, 
          description: null,
          price: null,
          bedrooms: null,
          bathrooms: null,
          uploaded_photos: [],
          uploading: false,
          key: key
        }
        setTimeout(()=>{
        firebase.database().ref('listings').child(''+key).on('value',(snapshot) =>{
          const data = snapshot.val();
          var photoarr = data.photos;
          this.setState({
            title: data.title, 
            address: data.address, 
            type: data.type, 
            description: data.description,
            price: data.price,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,})
          if(photoarr == undefined){
            this.setState({
              uploaded_photos: [],
              uploading: false
              })
          }else{
            this.setState({
              uploaded_photos: data.photos,
              uploading: false,
              })
          }
        }
      
        );},150);
        
        console.log(this.state.title);
        console.log(this.state.address);
        console.log(this.state.type);
        console.log(this.state.description);
        console.log(this.state.bedrooms);
        console.log(this.state.bathrooms);
        console.log(this.state.uploaded_photos);
    } 
  
  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
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
                        text: 'Edit Listing',
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
                    return [this.titleInput,this.priceInput,this.descriptionInput,this.addressInput,this.bedroomsInput,this.bathroomsInput];
                    }} 
                >
                    <TextInput 
                        placeholder = "Title"
                        value = {this.state.title}
                        onChangeText={(val) => this.setState({title:val})}
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.titleInput = input}
                        style={styles.input}
                    /> 
                    <TextInput
                        style={styles.inputStyle}
                        placeholder = "Price (CAD)"
                        value = {this.state.price}
                        onChangeText={(val) => this.setState({price:val})}
                        keyboardType = 'numeric'
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.priceInput = input}
                        style={styles.input}
                    />
                    <View style={{marginTop: 10, marginBottom: 10,}}>
                        <RadioForm
                            radio_props={[
                                {label: 'SELL  ', value: 0 },
                                {label: 'RENT', value: 1 }
                            ]}
                            initial={this.state.type}
                            formHorizontal={false}
                            onPress={(value) => {this.setState({type:value})}}
                            ref = {(input) => this.typeInput = input}
                            buttonColor={'white'}
                            buttonSize={4}
                            selectedButtonColor ={'white'}
                            labelColor={'white'}
                            selectedLabelColor = {'white'}
                        />
                    </View>
                    <TextInput 
                        placeholder = "Description"
                        multiline
                        value = {this.state.description}
                        onChangeText={(val) => this.setState({description:val})}
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.descriptionInput = input}
                        style={styles.input}
                    />
                    <TextInput 
                        placeholder = "Address"
                        value = {this.state.address}
                        onChangeText={(val) => this.setState({address:val})}
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.addressInput = input}
                        style={styles.input}
                    /> 
                    <TextInput 
                        placeholder = "How many bedrooms?"
                        value = {this.state.bedrooms}
                        onChangeText={(val) => this.setState({bedrooms:val})}
                        keyboardType = 'numeric'
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.bedroomsInput = input}
                        style={styles.input}
                    /> 
                    <TextInput 
                        placeholder = "How many bathrooms?"
                        value = {this.state.bathrooms}
                        onChangeText={(val) => this.setState({bathrooms:val})}
                        keyboardType = 'numeric'
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        ref = {(input) => this.bathroomsInput = input}
                        style={styles.input}
                    /> 
                    <View style= {{flexDirection: 'row',flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>                
                            <TouchableOpacity onPress={this._pickImage} style={styles.buttonContainer}>
                                <Text style={styles.buttonText}> Add Image </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>                
                            <TouchableOpacity onPress={this._takePhoto} style={styles.buttonContainer}>
                                <Text style={styles.buttonText}> Take Photo </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>                
                        <TouchableOpacity onPress={this.checkInput} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}> Submit </Text>
                        </TouchableOpacity>
                    </View>
                    
                </KeyboardAwareScrollView>
          </View>
        </ScrollView>
    );
  }

  submitListing = () => {
    const listings = firebase.database().ref().child("listings").child(""+this.state.key);
    console.log(listings);
    console.log(this.state.uploaded_photos);
    listings.update({
        title: this.state.title,
        address: this.state.address,
        type: this.state.type, 
        description: this.state.description,
        price: this.state.price,
        bedrooms: this.state.bedrooms,
        bathrooms: this.state.bathrooms,
        photos: this.state.uploaded_photos,
    }).then(Alert.alert("Updated Successfully"), this.props.navigation.navigate('Main'))
    .catch(error => console.log(error))
  };

  checkInput = () => {
    if (this.state.title == null) alert('Enter a title please!');
    else if (this.state.address == null) alert('Enter an address please!');
    else if (this.state.description == null) alert('Enter a description please!');
    else if (this.state.price == null) alert('Enter a price please!');
    else if (this.state.bedrooms == null) alert('Enter a title please!');
    else if (this.state.bathrooms == null) alert('Enter a title please!');
    else {
      firebase.database().ref('listings').child(''+this.state.key).on('value',(snapshot) =>{
        const data = snapshot.val();
        if(this.state.title!=data.title || this.state.address != data.address || this.state.description != data.description ||
          this.state.price != data.price || this.state.bedrooms != data.bedrooms || this.state.bathrooms != data.bathrooms || this.state.type!= data.type){
            if(data.favorite_by!=undefined){
              favorite_persons = Object.keys(data.favorite_by);
              console.log("Info in favorite_persons:", favorite_persons)
              for (i = 0; i < favorite_persons.length; i++){
                console.log("uid?: ",favorite_persons[i])
                PostNotification(favorite_persons[i],`Your favorite list '${this.state.title}' information is changed!`);
              }
          }
      }});
      this.submitListing();
    }
  }; 

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    //this.state.photos.push(pickerResult);
    this._handleImagePicked(pickerResult);
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    //this._handleImagePicked(pickerResult);
    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        //this.setState({ image: uploadUrl });
        this.state.uploaded_photos.push(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

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
        marginTop: 15,
        marginBottom: 15
    },
    buttonText: {
        textAlign: 'center',
        color: "#FFFFFF"
    }
});