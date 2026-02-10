## Portfólio de Soluções Digitais

Página em **português (pt-BR)** que apresenta o portfólio de iniciativas digitais da equipe **Interações Digitais Arco**.

O foco é dar visibilidade a soluções, automatizações, ferramentas e experimentos que:

- **simplificam o dia a dia operacional**;
- **aumentam a qualidade e a padronização**;
- **reduzem custos e retrabalho**.

### Tecnologias e arquitetura

- **Frontend**: React 18 (via CDN, com Babel no navegador).
- **Estilização**: Tailwind CSS (via CDN) + CSS simples em `styles.css`.
- **Tema**: suporte a **modo claro/escuro**, com:
  - detecção da preferência do sistema operacional;
  - persistência da escolha do usuário em `localStorage`.
- **Dados das soluções**: objeto JavaScript (`RAW_PROJECTS`) definido em `app.jsx`, sem backend ou banco de dados.
- **Build**: não há build complexo; o código JSX é transpilado em tempo de execução pelo Babel.
- **Hospedagem**: pensada para rodar em **GitHub Pages** como site estático, bastando publicar `index.html`, `app.jsx`, `styles.css` e `.nojekyll`.

### Resumo da ferramenta

Trata-se de uma **single page application (SPA)** que funciona como um **portfólio navegável de soluções digitais**, permitindo:

- filtrar projetos por **status** (Em uso, Produção, Em desenvolvimento, Piloto);
- visualizar **descrição, impacto principal, responsáveis e links** de cada solução;
- navegar de forma responsiva em modo claro ou escuro, mantendo boa legibilidade em ambos.
