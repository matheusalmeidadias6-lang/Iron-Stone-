# IRON STONE

Loja virtual fictícia de streetwear masculino. Projeto final da disciplina **Desenvolvimento de Interfaces** (CEUB, 2/2026), Prof. Dr. Felipe Batista da Silva.
**Aluno:** Matheus Almeida De Paiva Dias, RA 22401945

> Projeto acadêmico: não há vendas, pagamentos nem autenticação reais. Login, formulários e sacola são demonstrações que rodam só no navegador.

## Como executar
Extraia o ZIP (ou clone o repositório) e abra `index.html` no navegador. **Não abra o arquivo de dentro do ZIP**: sem a pasta `css/` ao lado, a página aparece sem estilo.

```bash
git clone https://github.com/matheusalmeidadias6-lang/iron-stone.git
```

## Estrutura
```
index.html        página única (HTML5 semântico)
css/style.css     identidade visual, temas (claro, escuro, alto contraste), responsividade
js/app.js         catálogo, filtros, sacola, carrossel, acessibilidade, formulários
assets/images/    fotos (veja "Como adicionar fotos")
assets/CREDITS.md fonte, autor e licença de cada foto
tests/e2e.py      41 testes ponta a ponta (Playwright, opcional)
prints/           capturas de tela geradas pelos testes
```

## Funcionalidades
Faixa de anúncio; cabeçalho fixo com categorias, pesquisa, sacola e login; hero; 6 categorias clicáveis; carrossel de destaques; 12 produtos com filtros (categoria, preço, novidades, mais vendidos), busca e ordenação; visualização rápida; sacola com quantidade, remoção, subtotal e frete grátis acima de R$ 199, salva em localStorage; benefícios; sobre; contato com validação; login e recuperação de senha demonstrativos; painel de acessibilidade (fonte, claro/escuro, alto contraste, reduzir animações); menu móvel.

## Como adicionar fotos
O site ainda **não tem fotografias**: cada espaço mostra "Foto: nome.jpg". Para trocar:
1. Coloque a foto em `assets/images/` com o nome indicado (por exemplo `hero.jpg` ou `stone-cargo-pants.jpg`).
2. Em `js/app.js`, inclua o nome na lista `PHOTOS` (por exemplo `new Set(["hero.jpg"])`).
3. Registre fonte, autor e licença em `assets/CREDITS.md`.
Use apenas fotos que você tenha direito de usar (por exemplo, Unsplash ou Pexels, conforme a licença de cada uma). Não use fotos de produtos de outras marcas.

## Paleta (contrastes calculados pela fórmula da WCAG)
Preto `#111111`, branco gelo `#F5F4F0`, cinza escuro `#292929`, destaque `#A63C32`; texto secundário `#5A5A5A` (6,27:1 sobre o fundo claro). O cinza concreto `#858585` não é usado como texto, pois mede 3,35:1.

## Testes
```bash
pip install playwright && playwright install chromium
python3 tests/e2e.py
```
