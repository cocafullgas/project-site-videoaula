const baseStyle = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');

:root {
  --cream: #FAF6F0;
  --cream-2: #F1EAE0;
  --charcoal: #2B2925;
  --charcoal-soft: #55524C;
  --terracotta: #C1704A;
  --terracotta-dark: #A85C39;
  --sage: #8FA893;
  --sage-dark: #6F8873;
  --line: #E4DCCF;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  background: var(--cream);
  color: var(--charcoal);
  -webkit-font-smoothing: antialiased;
}

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}

.card {
  width: 100%;
  max-width: 640px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 20px 50px -20px rgba(43,41,37,0.15);
}

.kicker {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage-dark);
  font-weight: 600;
  margin-bottom: 14px;
}

h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  margin: 0 0 14px;
  color: var(--charcoal);
}

p {
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--charcoal-soft);
  margin: 0 0 8px;
}

.small {
  font-size: 12.5px;
  color: #9A968D;
  margin-top: 28px;
}

.btn {
  display: inline-block;
  margin-top: 22px;
  padding: 15px 32px;
  background: var(--terracotta);
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.01em;
  transition: background 0.15s ease, transform 0.15s ease;
}
.btn:hover { background: var(--terracotta-dark); transform: translateY(-1px); }

.video-wrapper {
  margin: 28px 0 8px;
  background: var(--charcoal);
  border-radius: 14px;
  padding: 14px;
}
.video-wrapper vturb-smartplayer { border-radius: 8px; overflow: hidden; }

.icon-badge {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: var(--cream-2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px;
}

table { width:100%; border-collapse:collapse; margin-top:20px; font-size:13px; text-align:left; }
th, td { border-bottom:1px solid var(--line); padding:10px 8px; }
th { color: var(--sage-dark); font-weight:600; text-transform:uppercase; font-size:11px; letter-spacing:0.06em; }
td { color: var(--charcoal-soft); }
a { color: var(--terracotta); }
`;

function aulaPage({ nome }) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sua aula</title><style>${baseStyle}</style></head>
<body>
  <div class="page">
    <main class="card">
      <span class="kicker">Aula liberada</span>
      <h1>Bem-vindo(a)${nome ? ', ' + nome : ''}!</h1>
      <p>Aproveite sua aula abaixo com calma — o link é só seu.</p>

      <div class="video-wrapper">
        <vturb-smartplayer id="vid-6a22f5ea7a57d144b7394a2a" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 100% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer>
        <script type="text/javascript"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/b1623caf-b291-4ed7-a340-410413bcc3f8/players/6a22f5ea7a57d144b7394a2a/v4/player.js", s.async=!0,document.head.appendChild(s); </script>
      </div>

      <p class="small">Este link é pessoal e intransferível.</p>
    </main>
  </div>
</body>
</html>`;
}

function invalidPage({ motivo }) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Link inválido</title><style>${baseStyle}</style></head>
<body>
  <div class="page">
    <main class="card">
      <div class="icon-badge">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8v5M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#C1704A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1>Este link não é válido</h1>
      <p>${motivo}</p>
      <p>Se você já comprou e acha que isso é um erro, entre em contato com o suporte informando o e-mail usado na compra.</p>
    </main>
  </div>
</body>
</html>`;
}

function adminPage({ rows }) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"><title>Admin - Tokens</title><style>${baseStyle}</style></head>
<body>
  <div class="page" style="align-items:flex-start;">
    <main class="card" style="max-width:1000px; text-align:left;">
      <span class="kicker">Painel interno</span>
      <h1 style="font-size:24px;">Acessos liberados</h1>
      <table>
        <tr><th>E-mail</th><th>Nome</th><th>Criado em</th><th>Expira em</th><th>Acessos</th><th>1º IP</th><th></th></tr>
        ${rows}
      </table>
    </main>
  </div>
</body>
</html>`;
}

module.exports = { aulaPage, invalidPage, adminPage };

