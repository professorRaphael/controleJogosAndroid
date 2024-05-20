import { openDatabase }  from 'expo-sqlite';

const db = openDatabase('ControleJogos.db');

db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS jogos 
     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      nome TEXT, 
      plataforma TEXT, 
      genero TEXT, 
      nota REAL, 
      sobre TEXT);`
  );
});

const adicionarJogo = (nome, plataforma, genero, nota, sobre, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO jogos (nome, plataforma, genero, nota, sobre) VALUES (?, ?, ?, ?, ?)',
      [nome, plataforma, genero, nota, sobre],
      (_, result) => {
        callback(result.insertId);
      },
      (_, error) => {
        console.error('Erro ao adicionar jogo:', error);
        callback(null);
      }
    );
  });
};

const listarJogos = (callback) => {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM jogos', [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};

const encontrarJogoPorNome = (nome, callback) => {
  db.transaction((tx) => {
    tx.executeSql('SELECT * FROM jogos WHERE nome = ?', [nome], (_, { rows }) => {
      if (rows.length > 0) {
        callback(rows._array[0]);
      } else {
        callback(null);
      }
    });
  });
};

const alterarJogo = (id, nome, plataforma, genero, nota, sobre, callback) => {
  db.transaction((tx) => {
    const sql = 'UPDATE jogos SET nome = ?, plataforma = ?, genero = ?, nota = ?, sobre = ? WHERE id = ?';
    const params = [nome, plataforma, genero, nota, sobre, id];

    tx.executeSql(
      sql,
      params,
      (_, result) => {
        callback(result.rowsAffected);
      },
      (_, error) => {
        console.error('Erro ao alterar jogo:', error);
        callback(0);
      }
    );
  });
};

const excluirJogo = (id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM jogos WHERE id = ?',
      [id],
      (_, result) => {
        callback(result.rowsAffected);
      },
      (_, error) => {
        console.error('Erro ao excluir jogo:', error);
        callback(0);
      }
    );
  });
};

export { adicionarJogo, listarJogos, alterarJogo, encontrarJogoPorNome, excluirJogo };