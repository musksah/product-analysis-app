import React, { useEffect, useState,useRef } from 'react';
import { Text, View ,Button,Image, StyleSheet, SafeAreaView, ActivityIndicator, Pressable, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';


const URL_API = 'https://c6d2-186-155-13-3.ngrok-free.app';

const ScanTotalSuggar = ({route, navigation}) => {
  const { photoIngredientsPath } = route.params;
  const [loading, setLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<any>(null);
  const [pathPhoto, setPathPhoto] = useState<any>(null);

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
      console.log('image: ',image);
      console.log('photoIngredientsPath: ',photoIngredientsPath);
      setCapturedPhoto(image.path)
    });
    return null;
  }

  const uploadPhoto = async () => {
    if (capturedPhoto || photoIngredientsPath) {
      const formData = new FormData();
      formData.append('files', {
        uri: photoIngredientsPath,
        name: 'ingredients_img.jpg',
        type: 'image/jpeg',
      });
      formData.append('files', {
        uri: capturedPhoto,
        name: 'nutrifacts_img.jpg',
        type: 'image/jpeg',
      });
      setLoading(true);
      try {
        const response = await axios.post(`${URL_API}/process_images/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const result_example = {
          "nova": 3,
          "diabetes_impact": "Medio"
        }
        setLoading(false);
        console.log('Response:', response);
        navigation.navigate('Review',{
          product: result_example
        });
      } catch (error) {
        setLoading(false);
        console.error('Error uploading photo:', error);
      }      
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
    {loading ? (
      <ActivityIndicator size="large" style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} color="#0a6801" />
    ) : (
      <>
        {capturedPhoto != null ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop:20, paddingBottom:20 }}>
            <Image
              source={{ uri: capturedPhoto }} // Assuming the photo is a valid URI
              style={{ width: 300, height: 300, marginBottom: 10 }}
            />
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => { setCapturedPhoto(null); confirmVideo();} } style={[styles.button, styles.buttonRetake]}>
                <Text style={styles.textButton}>Corregir Foto</Text>
              </Pressable>
              <Pressable onPress={uploadPhoto} style={[styles.button, styles.buttonComfirm]}>
                <Text style={styles.textButton}>Procesar Fotos</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Paso 2</Text>
            <Text style={styles.subTitle}>Escanear Tabla Nutricional</Text>
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
        )}
      </>
    )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  containerFloatButton:{
    position: 'absolute',
    width: '100%',
    bottom: 40,
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
  button: {
    borderRadius: 5,
    padding: 17,
    paddingBottom: 14,
    paddingTop: 14,
  },
  buttonRetake:{
    backgroundColor: '#444444'
  },
  buttonComfirm:{
    backgroundColor: '#0a6801'
  },
  textButton:{
    color: 'white',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 40,
    color: '#a6a7a7',
    textAlign:'center',
    marginTop: 40
  },
  subTitle: {
    fontSize: 27,
    color: '#4a4a4a',
    textAlign:'center',
    fontWeight: 'bold',
  },
  instructionsContainer: {
    marginTop: 80,
    paddingLeft: 45,
    paddingRight: 45
  },
});

export default ScanTotalSuggar;