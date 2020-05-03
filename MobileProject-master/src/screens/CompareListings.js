import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import * as firebase from 'firebase';
import { Constants } from 'expo';
import { Header, Icon, Card, Button} from 'react-native-elements';
import { ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class CompareListings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      compareLeft: undefined,   // the house in the left column to compare
      compareRight: undefined
    }
  }

  componentDidMount(){
    let uid = firebase.auth().currentUser.uid;
    let listingsRef = firebase.database().ref('listings');
    this.listenForListingsData(listingsRef);
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

  listenForListingsData(listingsRef){
    listingsRef.on('value', (dataSnapshot) => {
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

  setSelection(which, o) {
    if(which == "left") {
      this.setState({compareLeft: o})
    } else if(which == "right") {
      this.setState({compareRight: o})
    }
  }

  removeSelection(which) {
    if(which == "left") {
      this.setState({compareLeft: undefined})
    } else if(which == "right") {
      this.setState({compareRight: undefined})
    }
  }

  displayColumn(which) {
      // Display the column that allows selection of houses to compare.
      // which = left or right, whichever this column represents.

      if((which === "left" && !this.state.compareLeft) || (which === "right" && !this.state.compareRight)) {
        return (
          <ScrollView onScroll={this.handleScroll}>
          {this.state.listings.map((u, i) => {
            if ((this.state.listings).length != 0) {
              return (
                <TouchableOpacity onPress={() => this.setSelection(which, u)}>
                  <Card
                    key={i}
                    title={u.title}
                    image={(u.photos != undefined && (u.photos).length != 0) ? { uri: u.photos[0] } : require('../img/HomeTrader.png')}>
                  </Card>
                </TouchableOpacity>
              );
            }
          })}
        </ScrollView>
        )
      } else {

        let selection = undefined;

        if(which == "left") {
          selection = this.state.compareLeft;
        } else {
          selection = this.state.compareRight;
        }

        return (
          <View style={{height: height*.8}}>
            <Card
              title={selection.title}
              image={(selection.photos != undefined && (selection.photos).length != 0) ? { uri: selection.photos[0] } : require('../img/HomeTrader.png')}>
            </Card>
          </View>
        )
      }

  }

  displaySelection() {

    return (
        <View style={{flex: 1, flexDirection:"row"}}>
            <View style={{flex:1}}>
              <View style={{height: 37, backgroundColor: '#fff'}}>
                <Text style={{fontSize: 14, textAlign: 'center'}}>SELECTION 1</Text>
                {(this.state.compareLeft) ? <Text style={{fontSize: 14, textAlign: 'center', color: '#ff0000'}} onPress={() => this.removeSelection("left")}>x Remove</Text> : undefined}
              </View>
              <View>{this.displayColumn("left")}</View>
            </View>
            <View style={{flex:1}}>
              <View style={{height: 37, backgroundColor: '#fff'}}>
                <Text style={{fontSize: 14, textAlign: 'center'}}>SELECTION 2</Text>
                {(this.state.compareRight) ? <Text style={{fontSize: 14, textAlign: 'center', color: '#ff0000'}} onPress={() => this.removeSelection("right")}>x Remove</Text> : undefined}
              </View>
              <View>{this.displayColumn("right")}</View>
            </View>
        </View>
    );
  }

  displayComparison() {

    let left = this.state.compareLeft;
    let right = this.state.compareRight;

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, flexDirection:"row"}}>
          <View style={{flex:1}}>
            <View style={{backgroundColor: '#fff'}}>
              <Text style={{fontSize: 14, textAlign: 'center'}}>SELECTION 1</Text>
              <Text style={{fontSize: 14, textAlign: 'center', color: '#ff0000'}} onPress={() => this.removeSelection("left")}>x Remove</Text>
            </View>
            <View>
              <Card image={(left.photos != undefined && (left.photos).length != 0) ? { uri: left.photos[0] } : require('../img/HomeTrader.png')}></Card>
              <Text style={{fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center'}}>{left.title}</Text>
            </View>
          </View>
          <View style={{flex:1}}>
            <View style={{backgroundColor: '#fff'}}>
              <Text style={{fontSize: 14, textAlign: 'center'}}>SELECTION 2</Text>
              <Text style={{fontSize: 14, textAlign: 'center', color: '#ff0000'}} onPress={() => this.removeSelection("right")}>x Remove</Text>
            </View>
            <View>
              <Card image={(right.photos != undefined && (right.photos).length != 0) ? { uri: right.photos[0] } : require('../img/HomeTrader.png')}></Card>
              <Text style={{fontSize: 14, color: '#ffffff', fontWeight: 'bold', textAlign: 'center'}}>{right.title}</Text>
            </View>
          </View>
        </View>
        <View style={{flex:1}}>
          <View style={{flexDirection:'row', backgroundColor: '#ffffff', margin: 10, padding: 10}}>
            <Text style={{flex: 1, textAlign: 'center'}}>{left.type}</Text>
            <Text style={{flex: 1, width: width*.5, fontWeight: 'bold', textAlign: 'center'}}>TYPE</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>{right.type}</Text>
          </View>
          <View style={{flexDirection:'row', backgroundColor: '#ffffff', margin: 10, padding: 10}}>
            <Text style={{flex: 1, textAlign: 'center'}}>${left.price}</Text>
            <Text style={{flex: 1, width: width*.5, fontWeight: 'bold', textAlign: 'center'}}>PRICE</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>${right.price}</Text>
          </View>
          <View style={{flexDirection:'row', backgroundColor: '#ffffff', margin: 10, padding: 10}}>
            <Text style={{flex: 1, textAlign: 'center'}}>{left.bedrooms}</Text>
            <Text style={{flex: 1, width: width*.5, fontWeight: 'bold', textAlign: 'center'}}>BEDROOMS</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>{right.bedrooms}</Text>
          </View>
          <View style={{flexDirection:'row', backgroundColor: '#ffffff', margin: 10, padding: 10}}>
            <Text style={{flex: 1, textAlign: 'center'}}>{left.bathrooms}</Text>
            <Text style={{flex: 1, width: width*.5, fontWeight: 'bold', textAlign: 'center'}}>BATHROOMS</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>{right.bathrooms}</Text>
          </View>
        </View>
      </View>
      
    )
  }

  render() {

    let compareDisplay = undefined;

    if(!this.state.compareLeft || !this.state.compareRight) {
      compareDisplay = this.displaySelection();
    } else {
      compareDisplay = this.displayComparison();
    }


    return (
      <View style={styles.container}>
        <View>
          <Header
            containerStyle={{
            backgroundColor: '#fff',
            }}
            centerComponent={{
                text: 'Compare Listings',
                style: { color: '#3498db', fontWeight: 'bold', fontSize: 18},
            }}
          />
        </View>
        {compareDisplay}   
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