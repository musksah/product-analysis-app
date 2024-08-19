import React, { useEffect, useState,useRef } from 'react';
import {Camera,  useCameraDevice } from 'react-native-vision-camera';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const URL_API = 'https://5f3f-186-155-13-3.ngrok-free.app';

const ScanNutriFactsComponent = ({route, navigation}) => {
  const { photo } = route.params;
  const [cameraPermission, setCameraPermission] = useState(null);
  const device = useCameraDevice('back'); // Set the initial camera device
  const camera = useRef<Camera>(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
      checkCameraPermission();
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
    if (capturedPhoto) {
      const formData = new FormData();
      formData.append('file', {
        uri: capturedPhoto,
        name: 'temp_image.jpg',
        type: 'image/jpeg',
      });

      // try {
      //   const response = await axios.post(`${URL_API}/uploadfile/`, formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      //   console.log('Response:', response.data);
      // } catch (error) {
      //   console.error('Error uploading photo:', error);
      // }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Review',{
          state: {
            photoNutritionFacts: capturedPhoto
          }
        });
      }, 3000);
      
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
    <SafeAreaView style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} color="#0a6801" />
      ) : (
        <>
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
                <Button title="Upload" onPress={uploadPhoto} />
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
  }
});

export default ScanNutriFactsComponent;
