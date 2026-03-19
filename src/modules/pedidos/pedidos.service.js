const supabase = require('../../config/supabase');
const AppError = require('../../errors/AppError');

async function list() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos(*)')
    .order('created_at', { ascending: false });
  if (error) throw new AppError('Erro ao listar pedidos.', 500);
  return data;
}

async function findById(id) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new AppError('Erro ao buscar pedido.', 500);
  if (!data) throw new AppError('Pedido não encontrado.', 404);
  return data;
}

async function create({ cliente, entrega, produtos = [] }) {
  const pedidoId = `PED-${Date.now()}`;
  const { error: pedErr } = await supabase.from('pedidos').insert({ id: pedidoId, cliente, entrega });
  if (pedErr) throw new AppError('Erro ao criar pedido.', 500);
  if (produtos.length) {
    const rows = produtos.map((p) => ({
      ...p, pedido_id: pedidoId,
      id: p.id ?? `PROD-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }));
    const { error: prodErr } = await supabase.from('produtos').insert(rows);
    if (prodErr) throw new AppError('Erro ao salvar produtos.', 500);
  }
  return findById(pedidoId);
}

async function update(id, { cliente, entrega, produtos }) {
  const patch = {};
  if (cliente !== undefined) patch.cliente = cliente;
  if (entrega !== undefined) patch.entrega = entrega;
  if (Object.keys(patch).length) {
    const { error } = await supabase.from('pedidos').update(patch).eq('id', id);
    if (error) throw new AppError('Erro ao atualizar pedido.', 500);
  }
  if (Array.isArray(produtos)) {
    await supabase.from('produtos').delete().eq('pedido_id', id);
    if (produtos.length) {
      const rows = produtos.map((p) => ({
        ...p, pedido_id: id,
        id: p.id ?? `PROD-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      }));
      const { error } = await supabase.from('produtos').insert(rows);
      if (error) throw new AppError('Erro ao atualizar produtos.', 500);
    }
  }
  return findById(id);
}

async function remove(id) {
  const { error, count } = await supabase.from('pedidos').delete({ count: 'exact' }).eq('id', id);
  if (error) throw new AppError('Erro ao excluir pedido.', 500);
  if (count === 0) throw new AppError('Pedido não encontrado.', 404);
}

async function updateEtapa(pedidoId, produtoId, setor, campo, valor) {
  const { data: produto, error: fetchErr } = await supabase
    .from('produtos').select('etapas').eq('id', produtoId).eq('pedido_id', pedidoId).maybeSingle();
  if (fetchErr) throw new AppError('Erro ao buscar produto.', 500);
  if (!produto) throw new AppError('Produto não encontrado.', 404);
  const etapas = produto.etapas ?? {};
  if (!etapas[setor]) throw new AppError(`Setor "${setor}" não existe.`, 400);
  etapas[setor][campo] = valor;
  const { data, error } = await supabase.from('produtos').update({ etapas }).eq('id', produtoId).select().single();
  if (error) throw new AppError('Erro ao atualizar etapa.', 500);
  return data;
}

module.exports = { list, findById, create, update, remove, updateEtapa };
