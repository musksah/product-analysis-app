import React, { useEffect, useState,useRef } from 'react';
import {Camera,  useCameraDevice } from 'react-native-vision-camera';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Pressable 
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const URL_API = 'https://b736-186-155-13-3.ngrok-free.app';

const ScanNutriFactsComponent = ({route, navigation}) => {
  const { photoIngredientsPath } = route.params;
  const [cameraPermission, setCameraPermission] = useState(null);
  const device = useCameraDevice('back'); // Set the initial camera device
  const camera = useRef<Camera>(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
      checkCameraPermission();
      return () => {
        // Cleanup function to run when the component unmounts
        setCameraActive(false);
      };
    }, []);

  const checkCameraPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();

      if (status === 'granted') {
        setCameraPermission(true);
      } else if (status === 'notDetermined' || status === 'denied') {
        const permission = await Camera.requestCameraPermission();
        setCameraPermission(permission === 'authorized');
      } else {
        setCameraPermission(false);
      }
  };

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
        setLoading(false);
        console.log('Response:', response.data);
        setTimeout(() => {
          setCameraActive(false);
        }, 0);
        navigation.navigate('Review',{
          product: response.data
        });
      } catch (error) {
        setLoading(false);
        console.error('Error uploading photo:', error);
      }      
    }
  };

  if (cameraPermission === null) {
      return <Text>Checking camera permission...</Text>;
  } else if (!cameraPermission) {
      return <Text>Camera permission not granted</Text>;
  }

  if (!device) {
    return <Text>No camera device available</Text>;
  }

  const takePhoto = async () => {
      try {
        if (!camera.current) {
          console.error('Camera reference not available.', camera);
          return;
        }
        const photo = await camera.current.takePhoto();

        if (photo) {
          setCapturedPhoto(`file://${photo.path}`);
          setShowPreview(true);
        } else {
          console.error('Photo captured is undefined or empty.');
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
  };

  const retakePhoto = () => {
    // User wants to retake the photo
    setCapturedPhoto(null); // Clear the captured photo
    setShowPreview(false); // Hide the preview
  };

  const onCameraReady = (ref) => {
    // Camera component is ready, set the camera reference
    camera.current = ref;// Reference to the Camera component (e.g., obtained from ref prop)
  };

  return (
    <SafeAreaView style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} color="#0a6801" />
      ) : (
        <>
          {cameraActive && device ? (
          <Camera
            style={{ flex: 1 }}
            device={device}
            isActive={true}
            ref={(ref) => onCameraReady(ref)}
            photo={true}
            video={true}
          />
          ) : null}
          {showPreview && capturedPhoto ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop:20, paddingBottom:20 }}>
              <Image
                source={{ uri: capturedPhoto }} // Assuming the photo is a valid URI
                style={{ width: 300, height: 300, marginBottom: 10 }}
              />
              <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <Pressable onPress={retakePhoto} style={[styles.button, styles.buttonRetake]}>
                  <Text style={styles.textButton}>Corregir Foto</Text>
                </Pressable>
                <Pressable onPress={uploadPhoto} style={[styles.button, styles.buttonComfirm]}>
                  <Text style={styles.textButton}>Procesar Fotos</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.containerFloatButton}>
              <TouchableOpacity style={styles.floatingButton} onPress={takePhoto}>
                <Icon name="camera" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerFloatButton:{
    position: 'absolute',
    width: '100%',
    bottom: 0,
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
    backgroundColor: '#55AD9B',
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
});

export default ScanNutriFactsComponent;
