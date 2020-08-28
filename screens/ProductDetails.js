import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { DataTable } from 'react-native-paper';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';

const config = {
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height
}

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('store')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        alert("WOAH " + e);
    }
}

const ProductDetails = ({ route }) => {

    const data = route.params.params.productData;

    getData().then((data) => {
        console.log(data.length);
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'flex-start',
                        alignItems: 'flex-start', padding: config.deviceWidth * 0.02, marginBottom: config.deviceHeight * 0.01
                    }}>
                        <Image
                            source={{ uri: data.image_small_url }}
                            style={{ width: 150, height: 150, borderRadius: 15, borderWidth: 2, borderColor: '#f4a261' }}
                        />
                        <View style={{ flexDirection: 'column', margin: config.deviceWidth * 0.03 }} >
                            <Text>{data.product_name}</Text>
                            <Text>{data.brands}</Text>
                            <Text>{data.quantity}</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: '#fff', padding: config.deviceWidth * 0.02, width: '95%', marginBottom: config.deviceHeight * 0.01 }}>
                        <Text>Caractéristiques du produit :</Text>

                        <Text style={{ margin: config.deviceWidth * 0.01 }}>{data.generic_name_fr ? data.generic_name_fr : ''}</Text>

                        <Text style={{ margin: config.deviceWidth * 0.01 }}>
                            <Text>Ingredients: </Text>
                            <Text>{data.ingredients_text_fr ? data.ingredients_text_fr : data.ingredients_text}</Text>
                        </Text>

                        <Text style={{ margin: config.deviceWidth * 0.01 }}>
                            <Text>Categories: </Text>
                            <Text>{data.categories}</Text>
                        </Text>

                        <Text style={{ margin: config.deviceWidth * 0.01 }}>Code barre: {data.code}</Text>
                    </View>

                    <View style={{ backgroundColor: '#fff', padding: config.deviceWidth * 0.02, width: '95%' }}>
                        <Text>Informations nutritionnelles</Text>
                        <Text style={{ padding: 10 }}>
                            <Text>Nutriscore: </Text>
                            <Text style={{ fontWeight: "bold" }}>{data.nutriscore_grade.toUpperCase()}</Text>
                        </Text>
                        <Text style={{ padding: 10 }}>Repères nutritionnels pour 100 g :</Text>
                        <DataTable>

                            <DataTable.Row>
                                <DataTable.Cell>Energie</DataTable.Cell>
                                <DataTable.Cell numeric>{data.nutriments.energy_value} {data.nutriments.energy_unit}</DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                                <DataTable.Cell>Matières grasses</DataTable.Cell>
                                <DataTable.Cell numeric>{data.nutriments.fat_100g} {data.nutriments.fat_unit}</DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                                <DataTable.Cell>Acides gras saturés</DataTable.Cell>
                                <DataTable.Cell numeric>{data.nutriments['saturated-fat_100g']} {data.nutriments.fat_unit}</DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                                <DataTable.Cell>Sucres</DataTable.Cell>
                                <DataTable.Cell numeric>{data.nutriments.sugars_100g} {data.nutriments.sugars_unit}</DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                                <DataTable.Cell>Sel</DataTable.Cell>
                                <DataTable.Cell numeric>{data.nutriments.salt_100g} {data.nutriments.salt_unit}</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    scrollView: {
        marginHorizontal: 20
    },
    text: {
        fontSize: 42,
    },
});

export default ProductDetails;