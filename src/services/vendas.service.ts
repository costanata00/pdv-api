import { Op } from 'sequelize';
import { clientes, itens_venda, mercadorias, sequelize, vendas } from '../models';

export class VendaError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}
// modelo para os itens da venda recebidos do app
export interface ItemVendaInput {
  mercadoria_id: number;
  quantidade: number;
}

// modelo de venda que chega do app usado na validação
export interface VendaInput {
  cliente_id?: number;
  forma_pag?: string;
  pago?: boolean;
  itens: ItemVendaInput[];
}

const inteiroPositivo = (v: unknown): v is number => Number.isInteger(v) && (v as number) > 0;
const emCentavos = (valor: unknown) => Math.round(Number(valor) * 100);

// Validar os dados recebidos
function validar(body: any): VendaInput {
  if (!body || typeof body !== 'object') throw new VendaError('Corpo da requisicao invalido');

  const { cliente_id, forma_pag, pago, itens } = body;

  if (cliente_id !== undefined && cliente_id !== null && !inteiroPositivo(cliente_id)) {
    throw new VendaError('cliente_id invalido');
  }
  if (forma_pag !== undefined && typeof forma_pag !== 'string') throw new VendaError('forma_pag invalida');
  if (pago !== undefined && typeof pago !== 'boolean') throw new VendaError('pago deve ser true ou false');

  if (!Array.isArray(itens) || itens.length === 0) throw new VendaError('A venda precisa de pelo menos um item');

  // Agrupa itens repetidos da mesma mercadoria somando as quantidades
  const agrupados = new Map<number, number>();
  for (const item of itens) {
    if (!inteiroPositivo(item?.mercadoria_id)) throw new VendaError('mercadoria_id invalido nos itens');
    if (!inteiroPositivo(item?.quantidade)) throw new VendaError('quantidade deve ser um inteiro maior que zero');
    agrupados.set(item.mercadoria_id, (agrupados.get(item.mercadoria_id) ?? 0) + item.quantidade);
  }

  return {
    cliente_id: cliente_id ?? undefined,
    forma_pag,
    pago,
    itens: [...agrupados].map(([mercadoria_id, quantidade]) => ({ mercadoria_id, quantidade })),
  };
}

export const vendasService = {
  async criar(body: unknown, usuarioId: number) {
    const dados = validar(body);

    // Começo da transação sql
    const vendaId = await sequelize.transaction(async (transaction) => {
      if (dados.cliente_id) {
        const cliente = await clientes.findByPk(dados.cliente_id, { transaction });
        if (!cliente || cliente.ativo === false) throw new VendaError('Cliente nao encontrado ou inativo', 404);
      }

      //select for update: bloqueia as linhas encontradas ate o fim da transacao,
      //evitando que outro usuario altere o estoque antes de atualizar
      const ids = dados.itens.map((i) => i.mercadoria_id);
      const encontradas = await mercadorias.findAll({
        where: { id: { [Op.in]: ids } },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      const porId = new Map(encontradas.map((m) => [m.id, m]));

      // Verificar estoque dos items e calcula os valores nas mercadorias
      let totalCentavos = 0;
      const linhas = dados.itens.map(({ mercadoria_id, quantidade }) => {
        const mercadoria = porId.get(mercadoria_id);
        if (!mercadoria || mercadoria.ativo === false) {
          throw new VendaError(`Mercadoria ${mercadoria_id} nao encontrada ou inativa`, 404);
        }
        const estoque = mercadoria.estoque ?? 0;
        if (estoque < quantidade) {
          throw new VendaError(
            `Estoque insuficiente para "${mercadoria.descricao}" (disponivel: ${estoque}, solicitado: ${quantidade})`,
            409,
          );
        }
        const precoCentavos = emCentavos(mercadoria.preco);
        const itemCentavos = precoCentavos * quantidade;
        totalCentavos += itemCentavos;
        return {
          mercadoria,
          quantidade,
          preco_unitario: precoCentavos / 100,
          valor_total: itemCentavos / 100,
        };
      });

      // Criar a venda
      const venda = await vendas.create(
        {
          cliente_id: dados.cliente_id,
          usuario_id: usuarioId,
          valor_total: totalCentavos / 100,
          status: 'finalizada',
          pago: dados.pago ?? false,
          forma_pag: dados.forma_pag,
        },
        { transaction },
      );

      // Cria os itens da venda
      await itens_venda.bulkCreate(
        linhas.map((l) => ({
          venda_id: venda.id,
          mercadoria_id: l.mercadoria.id,
          quantidade: l.quantidade,
          preco_unitario: l.preco_unitario,
          valor_total: l.valor_total,
        })),
        { transaction },
      );

      // atualiza o estoque
      for (const l of linhas) {
        await l.mercadoria.decrement('estoque', { by: l.quantidade, transaction });
      }

      return venda.id;
    });

    // envia a venda criada para o app
    return vendas.findByPk(vendaId, {
      include: [
        { association: 'cliente' },
        { association: 'usuario', attributes: { exclude: ['senha'] } },
        { association: 'itens_vendas', include: [{ association: 'mercadorium' }] },
      ],
    });
  },
};