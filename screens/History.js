import React, { useState, useEffect } from 'react';
import { Text, View, Image, Dimensions, StyleSheet, FlatList, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const config = {
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height
}

const getProducts = async () => {
    try {
        const fetchStorage = await AsyncStorage.getItem('store');
        let list = JSON.parse(fetchStorage);
        return list;
    } catch (error) {
        console.log(error);
    }
};

const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <View style={{
            flexDirection: 'row', justifyContent: 'flex-start',
            alignItems: 'flex-start', marginBottom: config.deviceHeight * 0.01
        }}>
            <Image
                source={{ uri: item.image_small_url }}
                style={{ width: 100, height: 100, borderRadius: 16, borderWidth: 1, borderColor: '#eaffd0' }}
            />
            <View style={{ flexDirection: 'column', margin: config.deviceWidth * 0.03 }} >
                <Text>{item.product_name}</Text>
                <Text>{item.brands}</Text>
                <Text>{item.quantity}</Text>
            </View>
        </View><View style={{ flexDirection: 'column' }} >
        </View>
    </TouchableOpacity>
);

const History = ({ navigation }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [data, setData] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            (async () => {
                const products = await getProducts();
                setData(products);
            })();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#f38181" : "#95e1d3";

        return (
            <Item
                item={item}
                onPress={() => {
                    setSelectedId(item.code);

                    navigation.navigate('Details', {
                        params: { productData: item }
                    });
                }}
                style={{ backgroundColor, borderColor: '#eaffd0', borderWidth: 1, borderRadius: 16 }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingRight: 20, width: '100%' }}>
                <TouchableOpacity style={{borderColor: '#000', borderWidth: 1, borderRadius: 50}}>
                    <Icon name="delete" onPress={() => {
                        setData([]);
                        AsyncStorage.removeItem('store');
                    }} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                extraData={selectedId}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 10,
        marginVertical: 6,
        marginHorizontal: 15,
    },
    scrollView: {
        marginHorizontal: 20
    },
    text: {
        fontSize: 42,
    },
});

export default History;