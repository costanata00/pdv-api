import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  email: string;
}

// Disponibiliza o usuario autenticado em req.usuario nos controllers
declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET nao definida');
  return secret;
}

export function gerarToken(payload: TokenPayload): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: '1h' });
}

// Exige header "Authorization: Bearer <token>"; responde 401 se ausente, invalido ou expirado
export function autenticar(req: Request, res: Response, next: NextFunction) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Token nao informado' });
    return;
  }
  try {
    const { id, email } = jwt.verify(token, jwtSecret()) as TokenPayload;
    req.usuario = { id, email };
    next();
  } catch {
    res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}

// Converte o :id da URL; responde 400 e retorna null se nao for inteiro positivo
export function parseId(req: Request, res: Response, param = 'id'): number | null {
  const id = Number(req.params[param]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'id invalido' });
    return null;
  }
  return id;
}

// Mantem so os campos permitidos que vieram no body (id fica de fora).
// Os tipos sao validados pelo Sequelize/banco ao salvar.
export function pick<K extends string>(body: unknown, keys: readonly K[]): Partial<Record<K, any>> {
  const src = (body ?? {}) as Record<string, unknown>;
  const out: Partial<Record<K, any>> = {};
  for (const k of keys) if (src[k] !== undefined) out[k] = src[k];
  return out;
}
