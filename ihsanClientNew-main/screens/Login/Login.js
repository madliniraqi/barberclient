import React from 'react';
import { View, Text, AppRegistry, Button, StyleSheet, Image ,Alert} from 'react-native';
import Input from '../../shared/Input/Input';
import { login, getBarbers } from '../../Api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BarberLogo from '../../assets/BarberLogo';

import InputField from '../../shared/Input/InputField';

import {
    Container,
    FormArea,
    CustomButton,
    CustomButtonText,
    SignMessage,
    SignMessageText,
    SignMessageTextBold,
  } from './styles';






const styles = StyleSheet.create({
    container: {
        backgroundColor: "#dce8e1",
        flex: 3,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {

    }
})


export default class LoginComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            phoneNum: ""
        }
    }   

    // validate_field=()=>{
    //     const{name,phoneNum}=this.this.state
    //     if(name ==""){
    //         Alert.alert("name is empty");

    //     }else {
    //         return
    //         }
    // }



    async componentDidMount(){
        let token = await AsyncStorage.getItem('token');
        if(token == undefined){
            AsyncStorage.removeItem('token');
            return
        }
        if(token !== null){
            this.props.navigation.navigate('Home');
        }else{
            return
        }
    }

    getName = (data) => {
        this.setState({
            name: data

        });
        
    }
    
    getPhone = (data) => {
      // bphonenumber(data);
        this.setState({
            phoneNum: data
        })
        
    }

    sendUserData = async () => {
       
        try{
            await login(this.state);
            this.props.navigation.navigate('Home') 
        }catch(err){
            console.log(err)
        }
    }

//    export default function bphonenumber(inputtxt)
// {
//   var phoneno = /^\d{10}$/;
//   if((inputtxt.value.match(phoneno))
//         {
//       return true;
//         }
//       else
//         {
//         alert("message");
//         return false;
//         }
// }


    render(){
        return(
            <View style={styles.container}>
                <Image
                        style={{
                          resizeMode: "contain",
                          height: 400,
                          width: 350,
                          justifyContent: 'center',
                          alignItems: 'center',
                        
                       }}
                        source={require('../../assets/newlogo.png')}/>

                 <Input
                   
                    text = {"שם מלא"}
                    func = {this.getName.bind(this)}
                ></Input>
                <Input
                     
                    text = {"מספר טלפון נייד"}
                    func = {this.getPhone.bind(this)}
                ></Input>
                <Button
                    style={styles.button}
                    color="#268596"
                    title = {"המשך"}
                    onPress = {()=>{
                      
                        this.sendUserData()
                    }}
                >
                </Button> 
     
            </View>
        )
    }
}

AppRegistry.registerComponent('LoginComponent', () => LoginComponent)