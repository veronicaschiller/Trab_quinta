import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
  } from 'react-native';
  import Constants from 'expo-constants';
  import { useState, useEffect } from 'react';
  import Item from './components/item.js';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export default function App() {
    const [produto, setProduto] = useState('');
    const [lista, setLista] = useState([]);
    const salvar = async (produtos) => {
      try {
        const jsonValue = JSON.stringify(produtos);
        await AsyncStorage.setItem('@storage_Key', jsonValue);
      } catch (e) {
        // error writing value
      }
    };
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key');
        const prods = jsonValue != null ? JSON.parse(jsonValue) : [];
        setLista(prods);
      } catch (e) {
        // error reading value
      }
    };
    useEffect(() => {
      getData();
    }, []);
    const adicionarProduto = async () => {
      const novo = {
        id: new Date().getTime().toString(),
        nome: produto ? produto : 'Arroz',
      };
      // faz uma nova atribuição à lista, com os elementos
      // já existentes (...lista) e o novo
      setLista([...lista, novo]);
      // limpa o conteúdo de produto (por consequência, o campo)
      setProduto('');
      salvar([...lista, novo]);
    };
    const removerProduto = (id) => {
      console.log(`Removido: ${id}`);
      setLista(lista.filter((prod) => prod.id != id));
    };
    const itemLista = ({ item }) => {
      return (
        <Item id={item.id} nome={item.nome} onDeleteProduto={removerProduto} />
      );
      // return (
      // <Text>{item.id} - {item.nome}</Text>
      // )
    };
    return (
      <View style={styles.container}>
        <View style={styles.novoProduto}>
          <TextInput
            placeholder="Informe o produto..."
            placeholderTextColor="#aaa"
            style={styles.textInput}
            onChangeText={(texto) => setProduto(texto)}
            value={produto}
          />
          <TouchableOpacity style={styles.button} onPress={adicionarProduto}>
            <Text style={styles.textButton}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.titulo}>Listagem dos Produtos</Text>
        {/* <ScrollView>
  {lista.map((prod) => (
  <Text key={prod.id} style={styles.lista}>
  {prod.id} - {prod.nome}
  </Text>
  ))}
  </ScrollView>
  */}
        <FlatList
          data={lista}
          renderItem={itemLista}
          keyExtractor={(prod) => prod.id}
        />
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingTop: Constants.statusBarHeight,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      width: '70%',
      padding: 10,
      marginRight: 8,
    },
    novoProduto: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
    },
    button: {
      width: 100,
      backgroundColor: '#00f',
      alignItems: 'center',
      padding: 5,
      borderRadius: 5,
    },
    textButton: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 6,
    },
    titulo: {
      fontSize: 22,
    },
  });
  