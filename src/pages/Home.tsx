import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image,
  Button
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createTable, deleteTable, getDBConnection, getProducts, saveTodoItems } from '../services/db-service';
import { Product } from '../models/Product';

const productsList = [
  {
    id: 1,
    name: 'Aceite',
    dates: '08/02/2024',
    level: 'Alto',
    nova: 1,
  },
  {
    id: 2,
    name: 'Kellogs',
    dates: '10/02/2024',
    level: 'Medio',
    nova: 2,
  },
  {
    id: 3,
    name: 'Milo',
    dates: '09/02/2024',
    level: 'Bajo',
    nova: 3,
  }
];

const Home = ({navigation}) => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadDataCallback = useCallback(async () => {
    try {
      const initProducts = [
        { id: 1, name: 'Leche de Almendras', brand:'Colanta', nova: 3, diabetes_risk: 'Alto', date: '07-20-2024' }, 
        { id: 2, name: 'Chocorramo', nova: 2, brand:'Ramo', diabetes_risk: 'Medio', date: '04-06-2024' }, 
        { id: 3, name: 'Leche Entera', nova: 1, brand:'Alqueria', diabetes_risk: 'Bajo', date: '02-04-2024' }, 
      ];
      const db = await getDBConnection();
      // await deleteTable(db);
      await createTable(db);
      const storedProducts = await getProducts(db);
      console.log('Products:');
      console.log(storedProducts);
      if (storedProducts.length) {
        setProducts(storedProducts);
      } else {
        await saveTodoItems(db, initProducts);
        setProducts(initProducts);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  return(
      <View style={styles.container}>
        {products.length > 0 ? (
          <ScrollView contentContainerStyle={styles.content}>
            {products.map(
              ({ id, name, date, diabetes_risk, nova }, index) => {
                return (
                <View style={styles.card} key={index}>
                  <View style={styles.cardColumnOne}>
                    <Image
                      style={styles.imageIconProduct}
                      source={require('../img/product.png')}
                    />
                  </View>
                  <View style={styles.cardColumnTwo}>
                    <Text style={styles.nameProduct}>{ name }</Text>
                    <Text style={styles.labelLevel}>Riesgo diabétes</Text>
                    <Text style={styles.novaText}>Nova { nova }</Text>
                  </View>
                  <View style={styles.cardColumnThree}>
                    <Text style={styles.dateText}>{ date }</Text>
                    <Text style={[styles.levelText, diabetes_risk === 'Alto' ? styles.redText : diabetes_risk === 'Medio' ? styles.orangeText : styles.greenText ]} >{ diabetes_risk }</Text>
                  </View>
                </View>
                );
              }
            )}
          </ScrollView>) : (
          <View style={styles.contentNoProducts}>
            <View style={styles.subContentNoProducts}>
              <Image
                    style={styles.imageProducts}
                    source={require('../img/market.png')}
                  />
              <Text style={{ fontSize: 16, width: '80%', color: '#b1b2b5' }} >No hay productos escaneados, por favor escanea un producto.</Text>
            </View>
          </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
  },
  contentNoProducts: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContentNoProducts:{
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card:{
    display: 'flex',
    height: 90,
    width: '100%',
    borderBottomColor: '#b1b2b5',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
  },
  imageProducts:{
    width: 178,
    height: 135,
    marginBottom: 10,
  },
  imageIconProduct:{
    width: 50,
    height: 50
  },
  cardColumnOne:{
    padding: 10,
    paddingLeft: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardColumnTwo:{
    padding: 10,
    flex: 2,
  },
  nameProduct: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'  
  },
  labelLevel:{
    color: '#000'
  },
  novaText:{
    color: '#7b7b7b'
  },
  dateText:{
    textAlign:'right'
  },
  levelText:{
    fontSize: 18,
    color: '#000',  
    fontWeight: 'bold',
    textAlign:'right'
  },
  cardColumnThree:{
    padding: 10,
    paddingRight: 0,
    flex: 1,
  },
  redText:{
    color: '#f10f0f'
  },
  orangeText:{
    color: '#ff9e00'
  },
  greenText:{
    color: '#20f10f'
  }
});

export default Home;