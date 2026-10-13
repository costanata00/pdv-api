-- Dados de exemplo para o banco de vendas (Postgres)
-- Ordem respeita as FKs: usuarios/clientes/mercadorias -> vendas -> itens_venda

BEGIN;

INSERT INTO public.usuarios (id, nome, email, senha, ativo) VALUES (1, 'Administrador', 'admin@loja.com', md5('admin123'), true);
INSERT INTO public.usuarios (id, nome, email, senha, ativo) VALUES (2, 'Maria Souza', 'maria@loja.com', md5('maria123'), true);
INSERT INTO public.usuarios (id, nome, email, senha, ativo) VALUES (3, 'Joao Lima', 'joao@loja.com', md5('joao123'), false);

INSERT INTO public.clientes (id, nome, cpf_cnpj, telefone, email, ativo) VALUES (1, 'Carlos Pereira', '123.456.789-09', '(11) 98765-4321', 'carlos@email.com', true);
INSERT INTO public.clientes (id, nome, cpf_cnpj, telefone, email, ativo) VALUES (2, 'Ana Oliveira', '987.654.321-00', '(21) 99876-5432', 'ana@email.com', true);
INSERT INTO public.clientes (id, nome, cpf_cnpj, telefone, email, ativo) VALUES (3, 'Mercado Bom Preco Ltda', '12.345.678/0001-95', '(31) 3333-4444', 'contato@bompreco.com', true);
INSERT INTO public.clientes (id, nome, cpf_cnpj, telefone, email, ativo) VALUES (4, 'Pedro Santos', '111.222.333-96', NULL, NULL, false);

INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (1, 'P001', 'Arroz tipo 1 5kg', 27.90, 100, true);
INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (2, 'P002', 'Feijao carioca 1kg', 8.49, 150, true);
INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (3, 'P003', 'Acucar refinado 1kg', 4.99, 200, true);
INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (4, 'P004', 'Cafe torrado 500g', 18.90, 80, true);
INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (5, 'P005', 'Oleo de soja 900ml', 7.29, 120, true);
INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (6, 'P006', 'Leite integral 1L', 5.49, 300, true);
INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (7, 'P007', 'Macarrao espaguete 500g', 4.39, 180, true);
INSERT INTO public.mercadorias (id, codigo, descricao, preco, estoque, ativo) VALUES (8, 'P008', 'Sabao em po 1kg', 14.90, 0, false);

INSERT INTO public.vendas (id, cliente_id, usuario_id, valor_total, data_venda, status, pago, forma_pag) VALUES (1, 1, 1, 81.27, '2026-10-01 09:15:00', 'finalizada', true, 'pix');
INSERT INTO public.vendas (id, cliente_id, usuario_id, valor_total, data_venda, status, pago, forma_pag) VALUES (2, 2, 2, 51.84, '2026-10-02 14:30:00', 'finalizada', true, 'cartao_credito');
INSERT INTO public.vendas (id, cliente_id, usuario_id, valor_total, data_venda, status, pago, forma_pag) VALUES (3, 3, 1, 37.13, '2026-10-05 11:00:00', 'pendente', false, 'boleto');
INSERT INTO public.vendas (id, cliente_id, usuario_id, valor_total, data_venda, status, pago, forma_pag) VALUES (4, 4, 3, 14.90, '2026-10-06 16:45:00', 'cancelada', false, 'dinheiro');
INSERT INTO public.vendas (id, cliente_id, usuario_id, valor_total, data_venda, status, pago, forma_pag) VALUES (5, 1, 2, 46.80, '2026-10-08 10:20:00', 'finalizada', true, 'dinheiro');

INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (1, 1, 1, 2, 27.90, 55.80);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (2, 1, 2, 3, 8.49, 25.47);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (3, 2, 4, 1, 18.90, 18.90);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (4, 2, 6, 6, 5.49, 32.94);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (5, 3, 7, 4, 4.39, 17.56);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (6, 3, 5, 2, 7.29, 14.58);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (7, 3, 3, 1, 4.99, 4.99);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (8, 4, 8, 1, 14.90, 14.90);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (9, 5, 1, 1, 27.90, 27.90);
INSERT INTO public.itens_venda (id, venda_id, mercadoria_id, quantidade, preco_unitario, valor_total) VALUES (10, 5, 4, 1, 18.90, 18.90);

-- Ajusta as sequences para os proximos INSERTs via API nao colidirem com os ids acima
SELECT setval(pg_get_serial_sequence('public.usuarios', 'id'), (SELECT MAX(id) FROM public.usuarios));
SELECT setval(pg_get_serial_sequence('public.clientes', 'id'), (SELECT MAX(id) FROM public.clientes));
SELECT setval(pg_get_serial_sequence('public.mercadorias', 'id'), (SELECT MAX(id) FROM public.mercadorias));
SELECT setval(pg_get_serial_sequence('public.vendas', 'id'), (SELECT MAX(id) FROM public.vendas));
SELECT setval(pg_get_serial_sequence('public.itens_venda', 'id'), (SELECT MAX(id) FROM public.itens_venda));

COMMIT;
