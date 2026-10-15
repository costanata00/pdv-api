import { Request, Response } from 'express';
import { vendas } from '../models';
import { parseId, pick } from '../utils/http';
import { VendaError, vendasService } from '../services/vendas.service';

const campos = ['cliente_id', 'usuario_id', 'valor_total', 'data_venda', 'status', 'pago', 'forma_pag'] as const;

export const vendasController = {
  async index(_req: Request, res: Response) {
    res.json(await vendas.findAll({ order: [['id', 'ASC']] }));
  },

  async show(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const venda = await vendas.findByPk(id, {
      include: [
        { association: 'cliente' },
        { association: 'usuario', attributes: { exclude: ['senha'] } },
        { association: 'itens_vendas', include: [{ association: 'mercadorium' }] },
      ],
    });
    if (!venda) {
      res.status(404).json({ error: 'Venda nao encontrada' });
      return;
    }
    res.json(venda);
  },

  // Venda completa: valida, confere estoque, calcula valores, grava venda + itens
  // e baixa o estoque numa unica transacao (ver services/vendas.service.ts).
  // Body: { cliente_id?, forma_pag?, pago?, itens: [{ mercadoria_id, quantidade }] }
  async store(req: Request, res: Response) {
    try {
      const venda = await vendasService.criar(req.body, req.usuario!.id);
      res.status(201).json(venda);
    } catch (err) {
      if (err instanceof VendaError) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  async update(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const venda = await vendas.findByPk(id);
    if (!venda) {
      res.status(404).json({ error: 'Venda nao encontrada' });
      return;
    }
    await venda.update(pick(req.body, campos));
    res.json(venda);
  },

  async destroy(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const apagados = await vendas.destroy({ where: { id } });
    if (!apagados) {
      res.status(404).json({ error: 'Venda nao encontrada' });
      return;
    }
    res.status(204).end();
  },


  
};