import { Request, Response } from "express";
import { Op } from "sequelize";
import { clientes } from "../models";
import { parseId, pick } from "../utils/http";

const campos = ["nome", "cpf_cnpj", "telefone", "email", "ativo"] as const;


export const clientesController = {
  async index(req: Request, res: Response) {
    const busca =
      typeof req.query.busca === "string" ? req.query.busca.trim() : "";
    const where = busca
      ? {
          [Op.or]: ["nome", "cpf_cnpj", "telefone", "email"].map((campo) => ({
            [campo]: { [Op.iLike]: `%${busca}%` },
          })),
        }
      : {};
    res.json(await clientes.findAll({ where, order: [["id", "ASC"]] }));
  },

  async store(req: Request, res: Response) {
    const { cpf_cnpj } = req.body;
    if (cpf_cnpj && !isValidCPF(cpf_cnpj) && !validateCNPJ(cpf_cnpj)) {
      res.status(400).json({ error: "CPF/CNPJ inválido" });
      return;
    }
    const cliente = await clientes.create(pick(req.body, campos) as any);
    res.status(201).json(cliente);
  },

  async update(req: Request, res: Response) {
    const id = parseId(req, res);
    if (id === null) return;
    const cliente = await clientes.findByPk(id);
    if (!cliente) {
      res.status(404).json({ error: "Cliente nao encontrado" });
      return;
    }
    const { cpf_cnpj } = req.body;
    if (cpf_cnpj && !isValidCPF(cpf_cnpj) && !validateCNPJ(cpf_cnpj)) {
      res.status(400).json({ error: "CPF/CNPJ inválido" });
      return;
    }
    await cliente.update(pick(req.body, campos));
    res.json(cliente);
  },
};

function isValidCPF(cpf: string | string[]): boolean {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  cpf = cpf.split("");
  const validator = cpf
    .filter(
      (digit: string, index: number, array: string[]) =>
        index >= array.length - 2 && digit,
    )
    .map((el: string) => +el);
  const toValidate = (pop: number): number[] =>
    cpf
      .filter(
        (digit: string, index: number, array: string[]) =>
          index < array.length - pop && digit,
      )
      .map((el: string) => +el);
  const rest = (count: number, pop: number): number =>
    ((toValidate(pop).reduce(
      (soma: number, el: number, i: number) => soma + el * (count - i),
      0,
    ) *
      10) %
      11) %
    10;
  return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1]);
}

function validateCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  if (clean.length !== 14) return false;

  const dv1Received = parseInt(clean[12], 10);
  const dv2Received = parseInt(clean[13], 10);
  if (isNaN(dv1Received) || isNaN(dv2Received)) return false;

  const weightsDv1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weightsDv2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const getCharValue = (char: string): number => {
    const code = char.charCodeAt(0);
    return code >= 65 && code <= 90 ? code - 55 : code - 48;
  };

  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += getCharValue(clean[i]) * weightsDv1[i];
  }
  const rem1 = sum1 % 11;
  const dv1Calculated = rem1 < 2 ? 0 : 11 - rem1;

  if (dv1Calculated !== dv1Received) return false;

  let sum2 = 0;
  for (let i = 0; i < 12; i++) {
    sum2 += getCharValue(clean[i]) * weightsDv2[i];
  }
  sum2 += dv1Calculated * weightsDv2[12];

  const rem2 = sum2 % 11;
  const dv2Calculated = rem2 < 2 ? 0 : 11 - rem2;

  return dv2Calculated === dv2Received;
}