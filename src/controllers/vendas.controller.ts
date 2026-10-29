import { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { vendas } from '../models';
import { parseId } from '../utils/http';
import { VendaError, vendasService } from '../services/vendas.service';

export const vendasController = {
  async index(req: Request, res: Response) {
    const busca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';

    const where: WhereOptions = {};
    if (busca) {
      Object.assign(where, {
        [Op.or]: [
          { '$cliente.nome$': { [Op.iLike]: `%${busca}%` } },
          { '$usuario.nome$': { [Op.iLike]: `%${busca}%` } },
        ],
      });
    }

    res.json(
      await vendas.findAll({
        where,
        include: [
          { association: 'cliente', attributes: ['nome'] },
          { association: 'usuario', attributes: ['nome'] },
          { association: 'itens_vendas', include: [{ association: 'mercadorium' }] },          
        ],
        order: [['id', 'ASC']],
      }),
    );
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

  async cancel(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      await vendasService.cancelarVenda(id);
      res.status(204).end();
    } catch (err) {
      if (err instanceof VendaError) {
        console.log(res.status(err.status).json({ error: err.message }));
        return;
      }
      throw err;
    }
  },
};