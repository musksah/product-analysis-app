import React, { useEffect, useState,useRef } from 'react';
import {Camera,  useCameraDevice } from 'react-native-vision-camera';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const URL_API = 'https://3630-186-155-13-3.ngrok-free.app';

const ScanIngredientsComponent = ({navigation}) => {

  const [cameraPermission, setCameraPermission] = useState(null);
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
      checkCameraPermission();
    }, []);

  const checkCameraPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      console.log('status',status);
      console.log('statuscheck> ', status === 'denied');

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
    if (capturedPhoto) {
      const formData = new FormData();
      formData.append('file', {
        uri: capturedPhoto,
        name: 'temp_image.jpg',
        type: 'image/jpeg',
      });

      // try {
      //   const response = await axios.post(`${URL_API}/process_ingredients/`, formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      //   console.log('Response:', response.data);
      // } catch (error) {
      //   console.error('Error uploading photo:', error);
      // }
      navigation.navigate('ScanNutritionalFacts',{
        state: {
          photo: capturedPhoto
        }
      });
    } else {
      console.log('No photo to upload');
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
        console.log(photo);
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
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          device={device}
          isActive={true}
          ref={(ref) => onCameraReady(ref)}
          photo={true}
          video={true}
        />
         {showPreview && capturedPhoto ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: capturedPhoto }} // Assuming the photo is a valid URI
              style={{ width: 300, height: 300, marginBottom: 20 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Retake" onPress={retakePhoto} />
              <Button title="Confirmar" onPress={uploadPhoto} />
            </View>
          </View>
        ) : (
          <View style={styles.containerFloatButton}>
            <TouchableOpacity style={styles.floatingButton} onPress={takePhoto}>
              <Icon name="camera" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  }
});

export default ScanIngredientsComponent;
