import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import * as firebase from 'firebase';
import { Constants } from 'expo';
import { Header, Icon, Card, Button} from 'react-native-elements';
import { ScrollView } from 'react-native';
import LocalNotification from 'react-native-local-notification';

export default class FavouriteListings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: []
    }
  }

  componentDidMount(){
    let uid = firebase.auth().currentUser.uid;
    let listingsRef = firebase.database().ref('listings');
    this.listenForFavoriteListingsData(uid, listingsRef);
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

  listenForFavoriteListingsData(uid, listingsRef){
    listingsRef.on
    listingsRef.orderByChild('favorite_by/'+uid).equalTo(true).on('value', (dataSnapshot) => {
      var listings = [];
      dataSnapshot.forEach((child) => {
        listings.push({
          key: child.key,
          title: child.val().title,
          address: child.val().address,
          description: child.val().description,
          price: child.val().price,
          bathrooms: child.val().bathrooms,
          bedrooms: child.val().bedrooms,
          photos: child.val().photos,
          type: this.houseType(child.val().type)
        });
      });
      this.setState({
        listings: listings
      });
    });
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
                text: 'Your Favorites',
                style: { color: '#3498db', fontWeight: 'bold', fontSize: 18},
            }}
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
                        name="star"
                        type="entypo"
                        color='#FFD700'
                      />
                    }
                    onPress={() => {this.favPress(u) 
                      this.refs.localNotification.showNotification({
                        title: "Removed Favorite",
                        text: `Removed Favorite Listing '${u.title}'.`
                      });
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