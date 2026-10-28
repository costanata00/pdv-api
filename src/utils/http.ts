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
  return jwt.sign({ ...payload, tipo: 'acesso' }, jwtSecret(), { expiresIn: '15m' });
}

export function gerarRefreshToken(payload: TokenPayload): string {
  return jwt.sign({ ...payload, tipo: 'refresh' }, jwtSecret(), { expiresIn: '30d' });
}

export function lerRefreshToken(token: unknown): TokenPayload | null {
  if (typeof token !== 'string') return null;
  try {
    const { id, email, tipo } = jwt.verify(token, jwtSecret()) as TokenPayload & { tipo?: string };
    if (tipo !== 'refresh') return null;
    return { id, email };
  } catch {
    return null;
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Token nao informado' });
    return;
  }
  try {
    const { id, email, tipo } = jwt.verify(token, jwtSecret()) as TokenPayload & { tipo?: string };
    if (tipo === 'refresh') throw new Error('refresh token nao vale como acesso');
    req.usuario = { id, email };
    next();
  } catch {
    res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}

export function parseId(req: Request, res: Response, param = 'id'): number | null {
  const id = Number(req.params[param]);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'id invalido' });
    return null;
  }
  return id;
}





// export function log((req, res, next) => {
//   res.on('finish', () => {
//     logs.create({
//       nome_tabela: req.originalUrl.split('/')[1],
//       coluna_pk: req.params.id ?? null,
//       operacao: req.method,
//       rota: req.originalUrl,
//       status: res.statusCode,
//     }).catch((err) => console.error('Falha ao gravar log:', err));
//   });
//   next();
// });




// Mantem so os campos permitidos que vieram no body.
export function pick<K extends string>(body: unknown, keys: readonly K[]): Partial<Record<K, any>> {
  const src = (body ?? {}) as Record<string, unknown>;
  const out: Partial<Record<K, any>> = {};
  for (const k of keys) if (src[k] !== undefined) out[k] = src[k];
  return out;
}
