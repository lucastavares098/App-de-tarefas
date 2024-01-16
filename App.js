/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import CRUD from './assets/Banco/SQLiteConfig';
import Tarefas from './assets/Models/Tarefas';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tarefas: [],
      descricao: '',
      data_termino: '',
      prioridade: '',
      concluido: false,
    };
    this.listarTarefas();
  }

  listarTarefas = () => {
    const banco = new CRUD();
    banco.listarTarefas().then(tarefasCompletas => {
      this.setState({tarefas: tarefasCompletas});
      console.log(this.state.tarefas);
    });
  };

  inserirTarefa = item => {
    const {descricao, data_termino, prioridade, concluido} = item;
    console.log('Item:', item);
    const tarefa = new Tarefas(this.state.descricao, this.state.data_termino, this.state.prioridade, this.state.concluido);
    const banco = new CRUD();
    banco
      .inserirTarefa(tarefa)
      .then(() => {
        this.listarTarefas();
      })
      .catch(error => {
        console.log(error);
      });
  };

  removerTarefa = id => {
    const banco = new CRUD();
    banco
      .excluirTarefa(id)
      .then(() => {
        this.listarTarefas();
      })
      .catch(error => {
        console.log(error);
      });
  };

  atualizarTarefa = (id, concluido) => {
    const banco = new CRUD();
    banco
      .atualizarTarefa(id, concluido)
      .then(() => {
        this.listarTarefas();
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Aplicativo de Tarefas</Text>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={this.state.descricao}
          onChangeText={text => this.setState({descricao: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Término"
          value={this.state.data_termino}
          onChangeText={text => this.setState({data_termino: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Prioridade"
          value={this.state.prioridade}
          onChangeText={text => this.setState({prioridade: text})}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const novaTarefa = {
              descricao: this.state.descricao,
              data_termino: this.state.data_termino,
              prioridade: this.state.prioridade,
              concluido: this.state.concluido,
            };
            this.inserirTarefa(novaTarefa);
          }}>
          <Text style={styles.buttonText}>Inserir Tarefa</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Lista de tarefas</Text>
        <FlatList
          data={this.state.tarefas}
          renderItem={({item}) => {
            return (
              <View style={styles.item}>
                <Text style={styles.descricao}>{item.descricao}</Text>
                <Text style={styles.data}>{item.data_termino}</Text>
                <Text style={styles.prioridade}>{item.prioridade}</Text>
                <Text style={styles.concluido}>
                  {item.concluido ? 'Concluído' : 'Pendente'}
                </Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonRemove]}
                  onPress={() => this.removerTarefa(item.id)}>
                  <Text style={styles.buttonText}>Remover</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonComplete]}
                  onPress={() =>
                    this.atualizarTarefa(item.id, !item.concluido)
                  }>
                  <Text style={styles.buttonText}>
                    {item.concluido ? 'Desfazer' : 'Concluir'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
  },
  item: {
    backgroundColor: '#ADD8E6',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'column',
  },
  descricao: {
    fontSize: 18,
  },
  data: {
    fontSize: 14,
  },
  prioridade: {
    fontSize: 14,
  },

  concluido: {
    fontSize: 14,
  },

  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },

  buttonRemove: {
    backgroundColor: 'red',
  },
  buttonComplete: {
    backgroundColor: 'green',
  },
});
