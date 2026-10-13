import { Request, Response } from 'express';
import { itens_venda } from '../models';
import { parseId, pick } from '../utils/http';

const campos = ['venda_id', 'mercadoria_id', 'quantidade', 'preco_unitario', 'valor_total'] as const;

export const itensVendaController = {
  // GET /vendas/:id/itens
  async indexByVenda(req: Request, res: Response) {
    const vendaId = parseId(req, res);
    if (vendaId === null) return;
    res.json(await itens_venda.findAll({ where: { venda_id: vendaId }, order: [['id', 'ASC']] }));
  },

  async show(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const item = await itens_venda.findByPk(id);
    if (!item) {
      res.status(404).json({ error: 'Item nao encontrado' });
      return;
    }
    res.json(item);
  },

  async store(req: Request, res: Response) {
    const item = await itens_venda.create(pick(req.body, campos) as any);
    res.status(201).json(item);
  },

  async update(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const item = await itens_venda.findByPk(id);
    if (!item) {
      res.status(404).json({ error: 'Item nao encontrado' });
      return;
    }
    await item.update(pick(req.body, campos));
    res.json(item);
  },

  async destroy(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const apagados = await itens_venda.destroy({ where: { id } });
    if (!apagados) {
      res.status(404).json({ error: 'Item nao encontrado' });
      return;
    }
    res.status(204).end();
  },
};
