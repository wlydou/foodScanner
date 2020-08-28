import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-community/async-storage';

const Scanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            AsyncStorage.removeItem('store');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        fetch('https://world.openfoodfacts.org/api/v0/product/' + data)
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 1) {
                    (async () => {
                        /*
                        try {
                            let con = json.products;
                            const products = await AsyncStorage.getItem('list') || '[]';
                            console.log(products);
                            products = JSON.parse(products);
                            products.push(con);
                            console.log(products);

                            navigation.navigate('Details', {
                                params: { productData: product }
                            });
                        } catch (error) {
                            alert("AYYYY" + error)
                        }
                        */
                        try {
                            const fetchStorage = await AsyncStorage.getItem('store') || '[]';
                            let products = JSON.parse(fetchStorage);
                            
                            //Verify barcode exists in storage
                            if((products.findIndex(element => element.code === json.product.code)) < 0){
                                products.push(json.product);
                                await AsyncStorage.setItem('store', JSON.stringify(products));
                            };
                            
                            console.log("LENGTH : " + products.length)
                            
                            navigation.navigate('Details', {
                                params: { productData: json.product }
                            });

                        } catch (error) {
                            alert("AYY" + error);
                        }
                    })();

                } else {
                    Alert.alert(
                        "Error :",
                        "Product Not Found",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            })
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}>

            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject} >

                <View style={styles.layerTop} />
                <View style={styles.layerCenter}>
                    <View style={styles.layerLeft} />
                    <View style={styles.focused} />
                    <View style={styles.layerRight} />
                </View>
                <View style={styles.layerBottom} />

            </BarCodeScanner>

            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
};

const opacity = 'rgba(0, 0, 0, .5)';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    layerTop: {
        flex: 2,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 1,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity
    },
});

export default Scanner;