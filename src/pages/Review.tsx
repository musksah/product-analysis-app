import { View, ScrollView, Text, StyleSheet, Button, Image, Modal, Alert, Pressable, TextInput } from 'react-native';
import React, { useState } from 'react';
import { getDBConnection, saveTodoItems } from '../services/db-service';
import { Novas, SugarLevels } from '../shared/messages';

const product_example = {
    id: 7,
    name: 'Coca cola',
    brand: 'Coca cola',
    nova: 4,
    diabetes_impact: 'Alto',
    date: '07-21-2024'
}

const Review = ({route, navigation}) => {
    const { product } = route.params;
    const [textProduct, onChangeTextProduct] = useState('');
    const [textBrand, onChangeTextBrand] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [nameError, setNameError] = useState<string | null>('');
    
    const completeProcess = async () =>{
        navigation.navigate('home');
    }

    const SaveProduct = async () =>{
        if (textProduct.trim() === '') {
            setNameError('El nombre es requerido.')
            return;
        } else {
            setNameError(null)
        }

        const date = new Date();
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
        const new_product = {
            name: textProduct,
            brand: textBrand,
            nova: product.nova,
            diabetes_impact: product.diabetes_impact,
            date: formattedDate
        }
        const db = await getDBConnection();
        await saveTodoItems(db, [new_product]);
        setModalVisible(!modalVisible);
        navigation.navigate('home');
    }

    const renderNovaDescription = (nova_value: number) => {
        switch (nova_value) {
          case 1:
            return <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}></Text>{Novas.nova_1}</Text>;
          case 2:
            return <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}></Text>{Novas.nova_2}</Text>;
          case 3:
            return <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}></Text>{Novas.nova_3}</Text>;
          case 4:
            return <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}></Text>{Novas.nova_4}</Text>;
          default:
            return <Text></Text>;
        }
      };
    
      const renderSugarDescription = (sugarLevel:string) => {
        switch (sugarLevel) {
          case 'Alto':
            return <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}></Text>{ SugarLevels.alto }</Text>;
          case 'Medio':
            return <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}></Text>{ SugarLevels.medio }</Text>;
          case 'Bajo':
            return <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}></Text>{ SugarLevels.bajo }</Text>;
          default:
            return <Text></Text>;
        }
      };

    return(
        <View style={[styles.container, modalVisible ? styles.overlay: null]}> 
            <ScrollView style={{ marginBottom: 70, paddingLeft: 16, paddingRight: 16 }}>
                <View style={styles.cardContainer}>
                    <Text style={ styles.headerTitle } >Riesgo de Diabetes</Text>
                    <View style={styles.headerCard}>
                        <Text style={[styles.headerValue, product.diabetes_impact === 'Alto' ?  styles.valueHigh : product.diabetes_impact === 'Medio' ? styles.valueMedium : styles.valueLow
                            
                        ]}>{ product.diabetes_impact }</Text>
                        {product.diabetes_impact === 'Alto' || product.diabetes_impact === 'Medio'   ? (
                            <Image
                                style={styles.iconWarning}
                                source={require('../img/warning-icon.png')}
                            />) : (
                            <Image
                            style={styles.iconWarning}
                            source={require('../img/check-icon.png')}
                        />)}
                    </View>
                    <View style={styles.containerNote}>
                        {renderSugarDescription(product.diabetes_impact)}
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <Text style={styles.headerTitle}>Nova</Text>
                    <View style={styles.headerCard}>
                        <Text style={styles.headerValueNova}> Nova { product.nova }</Text>
                    </View>
                    <View style={styles.containerNoteNova}>
                        {renderNovaDescription(product.nova)}
                    </View>
                </View>
                
            </ScrollView>
            {!modalVisible ? (
                <View style={styles.containerButton}>
                    <Button title="Confirmar" onPress={() => setModalVisible(true)} color="#0a6801" />
                </View>) : null}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Quieres guardar el producto?</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeTextProduct}
                            value={textProduct}
                            placeholder="Digita el nombre del producto"
                        />
                        {(!!nameError && textProduct.length === 0) && (
                            <View style={{ width: '100%', marginTop: 0 }}>
                                <Text style={{ color: "red", textAlign: 'left', left: 5 }}>{nameError}</Text>
                            </View>
                        )}
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeTextBrand}
                            value={textBrand}
                            placeholder="Digita la marca (opcional)"
                        />
                        <View style={styles.buttonModalContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={completeProcess}>
                                <Text style={styles.textStyle}>No, solo continuar</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonSave]}
                                onPress={SaveProduct}>
                                <Text style={styles.textStyle}>Guardar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
        backgroundColor: '#fff'
    },
    overlay:{
        flex: 1,
        opacity: 0.3,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCard: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 15
    },
    headerTitle:{
        fontSize: 20, 
        color: '#505050', 
        textAlign: 'center'
    },
    headerValue:{
        fontSize: 50, 
        fontWeight: 'bold',
        textAlign: 'center'
    },
    valueHigh:{
        color: '#ff0000'
    },
    valueMedium:{
        color: '#ff8200'
    },
    valueLow:{
        color: '#10ce00'
    },
    headerValueNova:{
        fontSize: 50, 
        fontWeight: 'bold',
        color: '#a6a6a6'
    },
    cardContainer: {
        padding: 18,
        borderColor: '#b3b3b3',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 20
    },
    iconWarning:{
    },
    content:{
        display: 'flex',
        justifyContent: 'center'
    },
    containerNote:{
        padding: 16,
        backgroundColor: '#e4ffe3'
    },
    containerNoteNova:{
        padding: 16,
        backgroundColor: '#e3f1ff'
    },
    containerButton:{
        position: 'absolute',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        bottom: 16,
        paddingLeft: 16,
        paddingRight: 16
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: 280,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444444'
    },
    buttonModalContainer:{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 10,
        marginTop: 15
    },
    button: {
        borderRadius: 5,
        padding: 17,
        paddingBottom: 14,
        paddingTop: 14,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#444444',
    },
    buttonSave: {
        backgroundColor: '#0a6801',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 46,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: '#b1b2b5',
        marginBottom: 10
    },
});

export default Review;