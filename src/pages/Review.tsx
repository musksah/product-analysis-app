import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Button,
    Image
} from 'react-native';
import React, { useState } from 'react';

const resultExample = {
    risk: 'Medio',
    nova: 4
}

const Review = ({navigation}) => {
    const [result, setResult] = useState(resultExample);
    const completeProcess = async () =>{
        navigation.navigate('home');
    }

    return(
        <View style={styles.container}> 
            <ScrollView>
                <View style={styles.cardContainer}>
                    <Text style={ styles.headerTitle } >Riesgo de Diabetes</Text>
                    <View style={styles.headerCard}>
                        <Text style={[styles.headerValue, result.risk === 'Alto' ?  styles.valueHigh : result.risk === 'Medio' ? styles.valueMedium : styles.valueLow
                            
                        ]}>{ result.risk }</Text>
                        {result.risk === 'Alto' || result.risk === 'Medio'   ? (
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
                        <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}>Nota:</Text> la medida del riesgo de diabetes está basada en una evaluación del nivel procesado del producto y su nivel de ázucar, por lo que estos resultados no indican que los productos con un nivel alto no se puedan consumir sino que el alto consumo de estos productos, es factor importante para contraer diabetes.</Text>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <Text style={styles.headerTitle}>Nova</Text>
                    <View style={styles.headerCard}>
                        <Text style={styles.headerValueNova}> Nova { result.nova }</Text>
                    </View>
                    <View style={styles.containerNoteNova}>
                        <Text><Text style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 'bold' }}>Nota:</Text> la medida del riesgo de diabetes está basada en una evaluación del nivel procesado del producto y su nivel de ázucar, por lo que estos resultados no indican que los productos con un nivel alto no se puedan consumir sino que el alto consumo de estos productos, es factor importante para contraer diabetes.</Text>
                    </View>
                </View>
                
            </ScrollView>
            <View style={styles.containerButton}>
                <Button title="Confirmar" onPress={completeProcess} color="#0a6801" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 16,
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
        backgroundColor: '#fff'
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
        marginLeft: 16,
        marginRight: 16
    }
});

export default Review;