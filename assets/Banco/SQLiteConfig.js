import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'Tarefas.db';
const database_version = '1.0';
const database_displayname = 'TarefasApp';
const database_size = 200000;

export default class CRUD {
  Conexao() {
    return new Promise(resolve => {
      SQLite.echoTest()
        .then(() => {
          return SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          );
        })
        .then(DB => {
          DB.executeSql('SELECT 1 FROM Tarefas LIMIT 1')
            .then(() => {
              console.log('Database conectada com SUCESSO');
              resolve(DB);
            })
            .catch(error => {
              console.log('Tabela Tarefas não existe, criando...');
              DB.transaction(tx => {
                tx.executeSql(
                  'CREATE TABLE IF NOT EXISTS Tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, data_termino TEXT, prioridade INTEGER, concluido INTEGER)',
                );
              })
                .then(() => {
                  console.log('Database criada com SUCESSO');
                  resolve(DB);
                })
                .catch(error => {
                  console.log('Erro ao criar a tabela Tarefas:', error);
                  reject(error);
                });
            });
        })
        .catch(error => {
          console.log('Erro ao abrir a database:', error);
          reject(error);
        });
    });
  }

  Desconectar(db) {
    if (db) {
      db.close()
        .then(status => {
          console.log('Database desconectada com SUCESSO');
        })
        .catch(error => {
          console.log('DB não está aberto');
        });
    }
  }

  listarTarefas = () => {
    return new Promise((resolve, reject) => {
      // Adicionado o parâmetro reject para a Promise
      const lista = [];
      this.Conexao()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM Tarefas',
              [],
              (tx, results) => {
                // Corrigido a ordem dos parâmetros para a função de sucesso
                const tarefas = [];
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  // Corrigida a desestruturação do objeto row
                  const {id, descricao, data_termino, prioridade, concluido} =
                    row;
                  lista.push({
                    id,
                    descricao,
                    data_termino,
                    prioridade,
                    concluido,
                  });
                }
                resolve(lista); // Resolve a promise com a lista de tarefas
              },
              (tx, error) => {
                // Corrigido a ordem dos parâmetros para a função de erro
                console.log(error);
                reject(error); // Rejeita a promise com o erro
              },
            );
          })
            .then(() => {
              this.Desconectar(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          reject(error); // Rejeita a promise se a conexão falhar
        });
    });
  };

  inserirTarefa(item) {
    return new Promise(resolve => {
      this.Conexao()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'INSERT INTO Tarefas (descricao, data_termino, prioridade, concluido) VALUES (?, ?, ?, ?)',
              [
                item.descricao,
                item.data_termino,
                item.prioridade,
                item.concluido,
              ],
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(results => {
              this.Desconectar(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  atualizarTarefa(id, concluido) {
    return new Promise((resolve, reject) => {
        this.Conexao()
            .then(db => {
                db.transaction(tx => {
                    tx.executeSql(
                        'UPDATE Tarefas SET concluido = ? WHERE id = ?',
                        [concluido, id],
                    ).then(([tx, results]) => {
                        resolve(results);
                    });
                })
                .then(() => {
                    this.Desconectar(db);
                })
                .catch(error => {
                    reject(error);
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}

  excluirTarefa(id) {
    return new Promise(resolve => {
      this.Conexao()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('DELETE FROM Tarefas WHERE id = ?', [id])
              .then(([tx, results]) => {
                resolve(results);
              })
              .catch(error => {
                console.log(error);
              });
          })
            .then(results => {
              this.Desconectar(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
}
