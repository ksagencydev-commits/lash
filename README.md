# ÉCLAT — Lash Studio / The Purple Collection

Redesign completo em violeta, lavanda e lilás, com foco em extensão de cílios. Seis pessoas diferentes ilustram Fox Eyes, Volume Luxo, Volume Russo, Volume Brasileiro, Wispy e Fio a Fio.

## Abrir localmente
`python3 scripts/build.py`

`python3 -m http.server 5173 --bind 127.0.0.1 --directory dist`

Abrir http://localhost:5173.

## Funcionalidades
- Catálogo com filtros Naturais, Alongados e Marcantes.
- Detalhes de cada efeito com intensidade visual e agendamento contextual.
- Quiz de duas etapas, resultado e reinício.
- Menu acessível, fechamento com Escape, diálogos nativos e FAQ.
- Galeria por toque, animações GSAP/ScrollTrigger e suporte a movimento reduzido.
- Fontes e imagens locais; retratos comprimidos em WebP.

## Configurar
`config.js` centraliza serviços, imagens, textos, contato e redes sociais. Preencher `whatsapp` com DDI + DDD + número, apenas dígitos. Com o número vazio, o agendamento abre um exemplo com mensagem copiável. Nenhum agendamento é enviado. Quando configurado, a mensagem inclui o efeito selecionado.

Definir `domain` para o canonical e completar URLs absolutas do Open Graph/sitemap quando houver domínio real.

## Imagens
Retratos ilustrativos criados com a ferramenta integrada ImageGen, comprimidos em WebP para o site. Não são clientes ou resultados reais. Prompts e caminhos finais em `docs/IMAGE_PROMPTS.md`. A fotografia de aplicação é de RDNE Stock project / Pexels, com link nos créditos do site. Confirmar serviços e nomenclaturas antes de uso comercial.

## Verificação
`npm test` após o build verifica arquivos públicos, imagens, catálogo e configuração demonstrativa.

`npm install` e `npm run test:browser` executam Playwright contra localhost:5173. Chrome esperado em `/usr/bin/google-chrome`; definir `CHROME_PATH` para outro executável. Screenshots ficam em `/tmp/eclat-purple-*.png`.

Cobertura: sete larguras de 375 a 1440 px; filtros; seis efeitos; mensagem de agendamento; quiz; menu/teclado; FAQ; reduced motion e carregamento de retratos.

## Movimento e escovinha 3D
A faixa de nomes e os símbolos de estrela foram removidos. Botões principais maiores, rolagem nativa observada por GSAP, máscaras de imagens, parallax e uma escovinha procedural Three.js percorrem a página conforme o scroll, com retorno reversível. 

`brush.js` modela cabo violeta, virola metálica, haste torcida e 780 cerdas em geometria instanciada. A cena redesenha durante mudanças de scroll/tamanho e pausa em abas ocultas. A escovinha fica invisível sobre menu e modais. Touch mantém a inércia nativa. Reduced motion desativa parallax e WebGL; o capítulo mostra uma escovinha estática. Falhas de WebGL usam o mesmo fallback.

Teste específico: `npm run test:motion`. Verifica rolagem da roda do mouse, canvas 3D, trajetória em ambos os sentidos, ausência dos ornamentos, sete larguras e reduced motion. Screenshots em `/tmp/eclat-brush-*.png`.

## Correção de rolagem
A rolagem usa agora mouse, toque e teclado nativos do navegador; os links internos mantêm a suavização CSS. Lenis foi retirado da página para eliminar a interceptação de entrada. GSAP e a escovinha seguem observando a posição de scroll. Foco ao fechar menu/modais usa `preventScroll`, evitando saltos. O canvas 3D tem pixel ratio limitado a 1,25 e redesenha no máximo cerca de 30 vezes por segundo, sem filtro de sombra, leituras de layout por frame ou redimensionamentos redundantes.

Regressão de travamentos: `npm run test:scroll` percorre as seções com a roda do mouse e verifica a retomada de scroll após menu e modal.

## Scroll suave e revelação — ajuste atual
Lenis foi restaurado com `lerp: 0.11`, um único ticker GSAP e bloqueio sincronizado ao estado real do menu e dos diálogos. A exclusão de entrada fica restrita aos diálogos; a galeria não interrompe a suavização vertical. O foco continua usando `preventScroll` e as otimizações da escovinha foram mantidas.

Fotos entram com até 8 px de desfoque (6 px no mobile) e títulos com 4,5 px. A nitidez acompanha o scroll entre a borda inferior e 45% da tela, de forma reversível. Reduced motion mantém conteúdo nítido e rolagem nativa.
