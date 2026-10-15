import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { mercadorias } from '../models';
import { parseId, pick } from '../utils/http';

const campos = ['codigo', 'descricao', 'preco', 'estoque', 'ativo'] as const;

export const mercadoriasController = {
  // GET /mercadorias?busca=arroz -> filtra por codigo ou descricao (sem diferenciar maiusculas).
  // Sem busca (ou busca vazia) lista todas.
  async index(req: Request, res: Response) {
    const busca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';
    const where = busca ? { [Op.or]: [{ codigo: { [Op.iLike]: `%${busca}%` } }, { descricao: { [Op.iLike]: `%${busca}%` } }] }
      : {};
    res.json(await mercadorias.findAll({ where, order: [['id', 'ASC']] }));
  },

  async show(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const mercadoria = await mercadorias.findByPk(id);
    if (!mercadoria) {
      res.status(404).json({ error: 'Mercadoria nao encontrada' });
      return;
    }
    res.json(mercadoria);
  },

  async store(req: Request, res: Response) {
    const mercadoria = await mercadorias.create(pick(req.body, campos) as any);
    res.status(201).json(mercadoria);
  },

  async update(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const mercadoria = await mercadorias.findByPk(id);
    if (!mercadoria) {
      res.status(404).json({ error: 'Mercadoria nao encontrada' });
      return;
    }
    await mercadoria.update(pick(req.body, campos));
    res.json(mercadoria);
  },

  async destroy(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const apagados = await mercadorias.destroy({ where: { id } });
    if (!apagados) {
      res.status(404).json({ error: 'Mercadoria nao encontrada' });
      return;
    }
    res.status(204).end();
  },

};