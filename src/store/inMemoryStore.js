/**
 * Armazenamento em memória — substituto temporário do banco de dados.
 * Para migrar ao DB: substituir getStore() por queries do ORM nos services.
 * Nenhum outro arquivo precisa mudar.
 */

const store = {
  usuarios: [],
  pedidos: [],
  terc: [],
  compras: [],
};

function getStore() {
  return store;
}

module.exports = { getStore };
