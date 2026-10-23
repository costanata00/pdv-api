import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { usuarios } from '../models';
import { gerarToken, pick } from '../utils/http';

const campos = ['nome', 'email', 'senha', 'ativo'] as const;

const hashSenha = (senha: string) => createHash('md5').update(senha).digest('hex');

function comSenhaHash(dados: Partial<Record<(typeof campos)[number], any>>) {
  if (typeof dados.senha === 'string') dados.senha = hashSenha(dados.senha);
  return dados;
}

function toPublic(usuario: InstanceType<typeof usuarios>) {
  const { senha: _senha, ...resto } = usuario.get();
  return resto;
}

export const usuariosController = {
  async store(req: Request, res: Response) {
    const usuario = await usuarios.create(comSenhaHash(pick(req.body, campos)) as any);
    res.status(201).json(toPublic(usuario));
  },

  async login(req: Request, res: Response) {
    const { email, senha } = req.body ?? {};
    if (typeof email !== 'string' || typeof senha !== 'string') {
      res.status(400).json({ error: 'Email e senha devem ser strings' });
      return;
    }
    const usuario = await usuarios.findOne({ where: { email, senha: hashSenha(senha), ativo: true } });
    if (!usuario) {
      res.status(401).json({ error: 'Email ou senha invalidos' });
      return;
    }
    res.json({
      token: gerarToken({ id: usuario.id, email: usuario.email }),
      usuario: { id: usuario.id, nome: usuario.nome },
    });
    
  },
  async refresh(req: Request, res: Response) {
    const { id, email } = req.usuario!;
    const usuario = await usuarios.findOne({ where: { id, email, ativo: true } });
    if (!usuario) {
      res.status(401).json({ error: 'Usuario nao encontrado ou inativo' });
      return;
    }
    res.json({ token: gerarToken({ id, email }, 7200) });
  },

};