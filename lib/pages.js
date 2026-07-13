const baseStyle = `
* { box-sizing: border-box; }
body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; background:#faf8f4; color:#2b2b2b; }
.container { max-width:720px; margin:0 auto; padding:48px 20px; text-align:center; }
h1 { font-size:28px; margin-bottom:12px; }
p { line-height:1.5; }
.small { font-size:13px; color:#888; margin-top:24px; }
.btn { display:inline-block; margin-top:20px; padding:14px 28px; background:#b5651d; color:#fff; text-decoration:none; border-radius:6px; font-weight:600; }
.video-wrapper { margin-top:24px; text-align:left; }
table { width:100%; border-collapse:collapse; margin-top:20px; font-size:13px; }
th, td { border:1px solid #ddd; padding:6px 8px; text-align:left; }
th { background:#eee; }
`;

function aulaPage({ nome }) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sua aula</title><style>${baseStyle}</style></head>
<body>
  <main class="container">
    <h1>Bem-vindo(a)${nome ? ', ' + nome : ''}!</h1>
    <p>Aproveite sua aula abaixo.</p>
    <div class="video-wrapper">
      <!-- ============================================================ -->
      <!-- COLE AQUI O CÓDIGO DE EMBED GERADO PELO PAINEL DO VTURB       -->
      <!-- ============================================================ -->
      <div id="vid_SEU_ID_AQUI" style="position:relative;width:100%;padding:56.25% 0 0;"></div>
      <script>/* Cole aqui o <script> fornecido pelo VTurb para este vídeo. */</script>
    </div>
    <p class="small">Este link é pessoal e intransferível.</p>
  </main>
</body>
</html>`;
}

function invalidPage({ motivo }) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Link inválido</title><style>${baseStyle}</style></head>
<body>
  <main class="container">
    <h1>Este link não é válido</h1>
    <p>${motivo}</p>
    <p>Se você já comprou e acha que isso é um erro, entre em contato com o suporte informando o e-mail usado na compra.</p>
  </main>
</body>
</html>`;
}

function adminPage({ rows }) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"><title>Admin - Tokens</title><style>${baseStyle}</style></head>
<body><main class="container" style="max-width:1000px">
  <h1>Acessos liberados</h1>
  <table>
    <tr><th>E-mail</th><th>Nome</th><th>Criado em</th><th>Expira em</th><th>Acessos</th><th>1º IP</th><th></th></tr>
    ${rows}
  </table>
</main></body></html>`;
}

module.exports = { aulaPage, invalidPage, adminPage };
