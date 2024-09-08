import React, { useEffect, useState,useRef } from 'react';
import { Text, View ,Button,Image, TouchableOpacity, StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const CameraCropper = ({route, navigation}) => {

  const confirmVideo = ()=>{
    ImagePicker.openCamera({
      cropping: true,
      // showCropFrame: true,
      // showCropGuidelines:true,
      // multiple:true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      // cropperToolbarTitle:'',
      // cropperCircleOverlay:true
      // showCropGuidelines:false,
      // showCropFrame:false,
      // hideBottomControls: true, //to hide bottom
    }).then(image => {
      console.log('image',image);
      navigation.navigate('ScanNutritionalFacts',{
        photoIngredientsPath: image.path
      });
    });
    return null;
  }
  
  return (
    <View style={{ flex: 1 }}>
        <Text style={styles.title}>Paso 1</Text>
        <Text style={styles.subTitle}>Escanear Ingredientes</Text>
        <View style={styles.instructionsContainer}>
          <Text style={{ marginBottom: 20, color: '#4a4a4a', fontSize: 17, fontWeight: 'bold' }}>Instrucciones
          </Text>
          <Text style={{ color: '#4a4a4a', fontSize: 17  }}>Busca la lista de ingredientes del producto y toma una foto donde se vean claramente.</Text>
          <Text style={{marginTop: 30, color: '#4a4a4a', fontSize: 17 }}><Text style={{fontWeight: 'bold'}}>Importante: </Text>para que el proceso seá efectivo, después de tomar la foto, edita y recorta solo la sección que tenga los ingredientes del producto.</Text>
        </View>
        <View style={styles.containerFloatButton}>
          <TouchableOpacity style={styles.floatingButton} onPress={confirmVideo}>
                <Icon name="camera" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
    </View>
  );
};


const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    color: '#b1b2b5',
    textAlign:'center',
    marginTop: 40
  },
  subTitle: {
    fontSize: 27,
    color: '#4a4a4a',
    textAlign:'center',
    fontWeight: 'bold'
  },
  instructionsContainer: {
    marginTop: 70,
    paddingLeft: 45,
    paddingRight: 45
  },
  containerFloatButton:{
    position: 'absolute',
    width: '100%',
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 30,
    backgroundColor: '#0a6801',
    borderRadius: 50
  },
});

export default CameraCropper;