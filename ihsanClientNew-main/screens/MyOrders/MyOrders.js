import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, SafeAreaView, ScrollView, Image ,Alert} from 'react-native';
import { DataTable } from 'react-native-paper';
import BottomBar from '../../components/BottomTabBar/BottomBar';
import ModalDateTimePicker from '../../components/ModalDateTimePicker/ModalDateTimePicker';
import { getUserOrdersData, deleteOrderById, getUserToken, setOrderWithToken } from '../../Api/api';
import styled from 'styled-components/native';
import ExpandIcon from '../../assets/ExpandIcon';
import Input from '../../shared/Input/Input';
import axios from 'axios';

const ModalItem = styled.View`
  background-color: #fff;
  border-radius: 10px;
  margin-top: 15px;
  padding: 10px;
`;
const Modal = styled.Modal``;
const CloseButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
`;
const ModalArea = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;
const ModalBody = styled.View`
  background-color: #B8E2D6;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  min-height: 300px;
  padding: 10px 20px 40px 20px;
`;


const styles = StyleSheet.create({
    container: {
      paddingTop: 100,
      paddingHorizontal: 30,
      height: '100%'
    },
  });

export default class MyOrders extends Component {
    constructor(props ,{ navigation }) {
        super(props);
        this.state = {
          userOrders: false,
          isBarber: false,
          show: false,
          service: '',
          barberId: '',
          addUserModal: false,
          clientName: '',
          clientPhone: '',
          token: ''
        }
      }

      
     

      toggleModal(){
        let show = this.state.show;
        show = !show;
        this.setState({show})
      }
      toggleModalUser(){
        let addUserModal = this.state.addUserModal;
        addUserModal = !addUserModal;
        this.setState({addUserModal});
      }
      
      async componentDidMount(){
          try{
            let userOrders = await getUserOrdersData();
            let isBarber = userOrders.isBarber;
            if(isBarber){
              let service = userOrders.service;
              console.log(service)
              await this.setState({service});
              
            }
            userOrders = userOrders.data;
            await this.setState({
              userOrders
            })
            await this.setState({isBarber})
            console.log(userOrders);
          }catch(err){
              console.log(err);
          }
      }

      async deleteOrder(orderId){
        try{
          let userOrders = await deleteOrderById(orderId);
          console.log(userOrders)
          await this.setState({
            userOrders
          })
        }catch(err){
          console.log(err)
        }
      }


      renderTableData(data){
        let { isBarber } = this.state;
        console.log(data)
          return data.map((item, idx)=>{
         //    const item =item.filter(item.date.getdate()>24)
            console.log(item);
              return(
                <DataTable.Row 
                
                key={idx}>
                   <DataTable.Cell  style={{ justifyContent: 'center'}}>{new Date(item.date).getDate()+"/"+new Date(item.date).getMonth()+1}</DataTable.Cell>  
                    <DataTable.Cell  style={{ justifyContent: 'center'}}>{item.hours[0]}</DataTable.Cell>

                      {
	                      isBarber && item.userDetail && <DataTable.Cell   style={{ justifyContent: 'left'}}>{item.userDetail[0].name}</DataTable.Cell>
	
  	                  }
	                    {
	                      isBarber && item.userDetail && <DataTable.Cell   style={{ justifyContent: 'right'}}>{item.userDetail[0].phoneNum}</DataTable.Cell>
	                    }
                                        
                    <DataTable.Cell 
                      style={{ justifyContent: 'center'}}
                    onPress ={()=> this.deleteOrder(item._id) }
                     onPressOut ={()=> alert("התור שנקבע בוטל") }
                    >

                      <View style ={{  borderRadius: 5}}>
                      
                      {/* deletebutton */}
                       <View style={{ flexDirection: 'row', alignItems: 'center', width: 'auto', height: 60, marginTop: 10, justifyContent: 'center'}}>
                      <Image
                        style={{
                          resizeMode: "contain",
                          height: 30,
                          width: 30,
                           justifyContent: 'center',
                           alignItems: 'center',
                        
                       }}
                        source={require('../../assets/delb.png')}/>
                    </View>

                      </View>


                    </DataTable.Cell>
                </DataTable.Row>
              )
          })
      }

      getName = (data) => {
        this.setState({
          clientName: data
        });
      }
    
      getPhone = (data) => {
        this.setState({
          clientPhone: data
        })
      }


      sendUserData = async () => {
        try{
            let token = await getUserToken(this.state.clientName, this.state.clientPhone);
            this.setState({token});
            this.toggleModalUser();
            this.toggleModal();
            // await setOrderWithToken()
            console.log(token)
        }catch(err){
            console.log(err)
        }
    }

      renderAddUserModal(){
        let { addUserModal } = this.state;
        return(
          <Modal transparent visible={addUserModal} animationType="slide">
                <ModalArea>
                    <ModalBody>
                        <CloseButton onPress={()=>this.toggleModalUser()}>
                            <ExpandIcon/>
                        </CloseButton>


                        <ModalItem>
                        <Input
                            text = {"שם"}
                            func = {this.getName.bind(this)}
                        ></Input>
                        <Input
                            text = {"מספר טלפון"}
                            func = {this.getPhone.bind(this)}
                        ></Input>
                        <Button
                    style={styles.button}
                    color="#268596"
                    title = {"המשך לקביעת תור"}
                    onPress = {()=>{
                        this.sendUserData()
                    }}
                >
                </Button>
                        </ModalItem>
                    </ModalBody>
                    </ModalArea>
                    </Modal>
        )
      }

      render(){
        console.log(userOrders)
        let { userOrders, isBarber, show, service } = this.state;
        if(userOrders || userOrders?.length>0){
          return(
            <SafeAreaView style={{backgroundColor: "#dce8e1", flex: 1, height: '100%'}}>
              <View style={{borderRadius: 30, flexDirection: 'row', alignItems: 'center', width: 'auto', height: 200, marginTop: 10, justifyContent: 'center'}}>
                   
                 
                      <Image
                        style={{
                          resizeMode: "contain",
                          height: 400,
                          width: 350,
                          justifyContent: 'center',
                          alignItems: 'center',
                        
                       }}
                        source={require('../../assets/newlogoturim.png')}/>
              </View>

            


              <ScrollView style={styles.container}>
                  <DataTable  style={{ 
                        justifyContent: 'center'}}>
                  
                    <DataTable.Header  style={{ 
                        justifyContent: 'center'}}>
                      
                      <DataTable.Title  style={{ justifyContent: 'center'}}>תאריך</DataTable.Title>
                       <DataTable.Title  style={{ justifyContent: 'center'}}> שעה</DataTable.Title>
                      <DataTable.Title  style={{ justifyContent: 'center'}}> שם</DataTable.Title>
                      <DataTable.Title  style={{ justifyContent: 'center'}}> טלפון</DataTable.Title>
                       <DataTable.Title  style={{ justifyContent: 'center'}}>לבטל </DataTable.Title>
                    </DataTable.Header>

                    {
                        this.renderTableData(userOrders)
                    }

     

                </DataTable>
              
                {
                  isBarber && <ModalDateTimePicker 
                    show = {show}
                    func = {this.toggleModal.bind(this)}
                    service = { service[0] }
                    // avatar = { avatar }
                    barberId = { service[0].barberId }    
                    navigation = { this.props.navigation }
                    isBarber = { this.state.isBarber }
                    token = { this.state.token }
                />
                }
                {
                  this.renderAddUserModal()
                }
              </ScrollView>
  {/* addbutton */}
 { isBarber && <TouchableOpacity onPress={()=>this.toggleModalUser()}>
                   
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                      <Image
                        style={{
                          resizeMode: "contain",
                          height: 200,
                          width: 200,
                           justifyContent: 'center',
                           alignItems: 'center',
                        
                       }}
                        source={require('../../assets/addbutton.png')}/>
                    </View>


                </TouchableOpacity> }

                <BottomBar navigation = {this.props.navigation}/>
              </SafeAreaView>
          )
        }else{
          return(
            <Text>
              {/* gjghg */}
            </Text>
          )
        }
          
      }
    }


