import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import * as firebase from 'firebase';
import { Constants } from 'expo';
import { Header, Icon, Card, Button, CheckBox } from 'react-native-elements';
import { ScrollView } from 'react-native';
import LocalNotification from 'react-native-local-notification';
import {GetNotification, PostNotification} from './Notifications';
console.disableYellowBox = true;

export default class Main extends React.Component{
  constructor(props) {
    super(props);
    this.listingsRef = firebase.database().ref('listings');
    this.ref = firebase.database().ref('Notification');
    this.state = {
      listings: [],
      filters: {
        maxPrice: 9999999999999999,
        minBedrooms: -1,
        minBathrooms: -1,
        BorR: true
      }
    }
  }

  componentDidMount(){
    this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
      filters = this.props.navigation.getParam('filters',this.state.filters);
      this.setState({filters: filters}, function() {
        this.listenForListingsData(this.listingsRef);
        this.checkForDelete(this.listingsRef);
        //this.Notification(firebase.auth().currentUser.uid)
      });
    });
  }

  Notification(uid){
      msg = GetNotification(uid);
      setTimeout(() => {
        console.log("I am in main with msg: ",msg);
        if(msg != 0){
          console.log("Notification runs!");
          this.refs.localNotification.showNotification({
            title: "New Message!",
            text: `You got '${msg}' messages`
          });
        }
      },1000);
  }

  checkForDelete(listingsRef) {
    listingsRef.on("child_removed", snapshot => {
      var changedPost = snapshot.val();
      if(changedPost.uid.localeCompare(firebase.auth().currentUser.uid)==0){
        this.refs.localNotification.showNotification({
          title: "Listing Deleted",
          text: `Deleted Listing '${changedPost.title}'.`
        });
      }
    });
  }

  houseType(type) {
    if (type == 0) {
      return "Sale";
    }
    else if (type == 1) {
      return "Rent";
    }
  }

  _OnButtonPress(listing) {
    this.props.navigation.navigate('ListingInfo', {
      listing: listing,
    })
  }



  favPress = (listing) => {
    let user = firebase.auth().currentUser;
    let path = "listings/" + listing.key + "/favorite_by/" + user.uid;
    
    var ref = firebase.database().ref().child(path);
    ref.once("value")
    .then(function(snapshot) {
      if (snapshot.exists()){
        ref.remove()
      }
      else {  
        var updates = {};
        updates[path] = true;
        firebase.database().ref().update(updates);
      }
    });
  }

  isFav(listing) {
    var myId = firebase.auth().currentUser.uid;
    if(listing.favorite_by != undefined && myId in listing.favorite_by) return "star";
    else return "star-outlined";
  }

listenForListingsData(listingsRef) {
    listingsRef.on('value', (dataSnapshot) => {
      var listings = [];
      dataSnapshot.forEach((child) => {
        var str = JSON.stringify(child.val());
        var parsed = JSON.parse(str);
        if ((parseInt(parsed.price) <= this.state.filters.maxPrice) && (parseInt(parsed.bedrooms) >= this.state.filters.minBedrooms) && (parseInt(parsed.bathrooms) >= this.state.filters.minBathrooms) && ((this.state.filters.BorR == true) || (parsed.type == this.state.filters.BorR))){
          listings.push({
            key: child.key,
            title: parsed.title,
            address: parsed.address,
            description: parsed.description,
            price: parsed.price,
            bathrooms: parsed.bathrooms,
            bedrooms: parsed.bedrooms,
            photos: parsed.photos,
            type: this.houseType(parsed.type),
            uid: parsed.uid,
            favorite_by: parsed.favorite_by
          });
        }
        this.setState({
          listings: listings
        });
    });
  });
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
              text: 'House Listings',
              style: { color: '#3498db', fontWeight: 'bold', fontSize: 18 },
            }}
            rightComponent={
              <Icon
                name="ios-add-circle-outline"
                type="ionicon"
                color='#3498db'
                onPress={() => this.props.navigation.navigate('AddList')}
                underlayColor={'#64b5f6'}
              />
            }
            leftComponent={
                <Icon
                    name='ios-search'
                    type="ionicon"
                    color='#3498db'
                    onPress={() => this.props.navigation.navigate('SearchListingFilters')}
                    underlayColor={'#64b5f6'}
                />
            }
          />
        </View>
        <ScrollView onScroll={this.handleScroll}>
          {this.state.listings.map((u, i) => {
            if ((this.state.listings).length != 0) {
              return (
                <Card
                  key={i}
                  title={u.title}
                  image={(u.photos != undefined && (u.photos).length != 0) ? { uri: u.photos[0] } : require('../img/HomeTrader.png')}>
                  <Button
                    type="clear"                    
                    icon={
                      <Icon
                        name={this.isFav(u)}
                        type="entypo"
                        color='#FFD700'
                      />
                    }
                    onPress={() => {this.favPress(u);
                    
                      if (this.isFav(u) == "star-outlined" ){
                        this.refs.localNotification.showNotification({
                          title: 'Favorite',
                          text: `Favorite Listing '${u.title}'.`,
                        });
                      }
                      else{
                        this.refs.localNotification.showNotification({
                          title: 'Remove favorite',
                          text: `Removed Favorite Listing '${u.title}'.`,
                          
                        });
                      }
                    }}
                  /> 
                  <Text style={{ marginBottom: 10 }}>
                    {u.description}
                  </Text>
                  <Button
                    backgroundColor='#03A9F4'
                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title='CLICK HERE FOR MORE INFO'
                    onPress={() => this._OnButtonPress(u)}
                  />
                </Card>
              );
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