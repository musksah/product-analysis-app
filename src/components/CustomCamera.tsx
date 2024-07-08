import React, { useEffect, useState,useRef } from 'react';
import type {PropsWithChildren} from 'react';
import {Camera,  useCameraDevice,  useCameraDevices, useCameraPermission} from 'react-native-vision-camera';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  PermissionsAndroid,
  Image,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const URL_API = 'https://06ce-186-155-14-67.ngrok-free.app';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const CustomCamera = ({navigation}) => {

    const [cameraPermission, setCameraPermission] = useState(null);
      const device = useCameraDevice('back'); // Set the initial camera device
      const camera = useRef<Camera>(null);
      const [capturedPhoto, setCapturedPhoto] = useState(null);
      const [showPreview, setShowPreview] = useState(false);

      useEffect(() => {
          checkCameraPermission();
        }, []);


    const checkCameraPermission = async () => {
        const status = await Camera.getCameraPermissionStatus();
        console.log('status',status);

        if (status === 'granted') {
          setCameraPermission(true);
        } else if (status === 'notDetermined') {
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
  
        try {
          const response = await axios.post(`${URL_API}/uploadfile/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Response:', response.data);
        } catch (error) {
          console.error('Error uploading photo:', error);
        }
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

    const confirmPhoto = () => {
      // User confirmed, further actions with the captured photo
      // For example, save the photo to storage, etc.
      console.log('Photo confirmed:', capturedPhoto);
      setShowPreview(false); // Hide the preview after confirmation
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
              <Button title="Confirm" onPress={confirmPhoto} />
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

export default CustomCamera;
