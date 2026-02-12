const { useState, useEffect } = React;

// Componente Helper para Ícones
const Icon = ({ children, size = 24, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
);

// Definição manual dos ícones para evitar erros de CDN
const Rocket = (props) => <Icon {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4-1 4-1"/><path d="M12 15v5s3.03-.55 4-2c1.1-1.62 1-4 1-4"/></Icon>;
const Brain = (props) => <Icon {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></Icon>;
const Database = (props) => <Icon {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></Icon>;
const Layout = (props) => <Icon {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></Icon>;
const BarChart3 = (props) => <Icon {...props}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></Icon>;
const BookOpen = (props) => <Icon {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>;
const Scissors = (props) => <Icon {...props}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></Icon>;
const FileJson = (props) => <Icon {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></Icon>;
const Code2 = (props) => <Icon {...props}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></Icon>;
const Wrench = (props) => <Icon {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></Icon>;
const Layers = (props) => <Icon {...props}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></Icon>;
const FolderGit2 = (props) => <Icon {...props}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"/><circle cx="12" cy="13" r="2"/><path d="M14 13h3"/><path d="M7 13h3"/></Icon>;
const ExternalLink = (props) => <Icon {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></Icon>;
const CheckCircle2 = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></Icon>;
const Clock = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const FlaskConical = (props) => <Icon {...props}><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></Icon>;
const Filter = (props) => <Icon {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Icon>;
const Moon = (props) => <Icon {...props}><path d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 1 0 21 12.79Z" /></Icon>;
const Sun = (props) => <Icon {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m5 5 1.5 1.5" /><path d="m17.5 17.5 1.5 1.5" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m5 19 1.5-1.5" /><path d="m17.5 6.5 1.5-1.5" /></Icon>;

const ICONS = { Brain, Database, Layers, BarChart3, BookOpen, Scissors, FileJson, Code2, Wrench, Layout, Rocket, FolderGit2 };

const RAW_PROJECTS = [
    { 
        title: "Brieflab",
        owners: [
            { name: "Daniel Hibarino", url: "https://arco.enterprise.slack.com/team/U082X549D2S" },
            { name: "Mariana Michels", url: "https://arco.enterprise.slack.com/team/U07PN0PFKMK" }
        ],
        type: "Automação / IA",
        problem: "Alto custo e tempo na terceirização de roteiros.",
        description: "IA que gera briefings e roteiros pedagógicos consistentes em segundos, integrando orientações e BNCC (requer uma chave API configurada).",
        benefit: "Redução de 2 semanas para 1h. Saving de ~R$15k/coleção.",
        status: "Em uso",
        icon: "Brain",
        link: "https://beamish-genie-625c30.netlify.app/"
    },
    { 
        title: "Acervo Digital",
        owners: [
            { name: "Andressa Landarim", url: "https://arco.enterprise.slack.com/team/U083GE2FDEV" },
            { name: "Luiz Stival", url: "https://arco.enterprise.slack.com/team/U0830TU216H" }
        ],
        type: "Plataforma / Gestão",
        problem: "Desorganização de conteúdos em planilhas dispersas.",
        description: "Plataforma unificada com busca inteligente e filtros para consulta de ODAs e audiovisuais.",
        benefit: "Escala na organização e agilidade na busca.",
        status: "Em desenvolvimento",
        icon: "Database",
        link: "https://acervo-digital-frontend.onrender.com/"
    },
    { 
        title: "Gerenciador RA (WebAR)",
        owners: [
            { name: "Breno Ribeiro", url: "https://arco.enterprise.slack.com/team/U08MM2RK78Q" }
        ],
        type: "Plataforma / CMS",
        problem: "Dependência de ferramentas externas caras (ZapWorks).",
        description: "Solução open-source para upload e gestão de Realidade Aumentada com recursos avançados.",
        benefit: "Liberdade tecnológica e redução de custos de licença.",
        status: "Em desenvolvimento",
        icon: "Layers",
        link: "https://servidor-ra.fly.dev/"
    },
    { 
        title: "Dash Qualidade Revisão",
        owners: [
            { name: "Danielle Souto", url: "https://arco.enterprise.slack.com/team/U056QJKH1B8" }
        ],
        type: "Dashboard / Analytics",
        problem: "Dificuldade em mapear erros e qualidade por revisor.",
        description: "Painel analítico para acompanhar evolução de qualidade e tipologia de erros.",
        benefit: "Gestão baseada em dados e alocação estratégica.",
        status: "Em uso",
        icon: "BarChart3",
        link: "https://lookerstudio.google.com/reporting/c78eff77-5149-4360-bbfc-ec8379763f70"
    },
    { 
        title: "Livro Digital Interativo",
        owners: [
            { name: "Nayara Gracioli", url: "https://arco.enterprise.slack.com/team/U06U7SX2FDF" },
            { name: "Mariana Michels", url: "https://arco.enterprise.slack.com/team/U07PN0PFKMK" }
        ],
        type: "Produto Digital",
        problem: "Materiais limitados ao PDF estático.",
        description: "Livro responsivo com redação online e gravação, feito com auxílio de IA, da Conquista.",
        benefit: "Inclusão digital do aluno e produção 100% interna.",
        status: "Em uso",
        icon: "BookOpen",
        link: "https://digital.solucaoconquista.com.br/LDS/2026/AF/6Ano/PRODTEXTO/CQT_2026_AF_V1_POR_PF_6ANO/"
    },
    { 
        title: "Divisor Automático PDFs",
        owners: [
            { name: "Luiz Donin", url: "https://arco.enterprise.slack.com/team/U09KKDE7740" },
            { name: "Mariana Michels", url: "https://arco.enterprise.slack.com/team/U07PN0PFKMK" }
        ],
        type: "Ferramenta / Automação",
        problem: "Processo manual e lento de divisão de arquivos.",
        description: "Automatiza a divisão de capítulos, remove marcas de corte e padroniza nomenclatura.",
        benefit: "Arquivos finais mais leves e sem erros.",
        status: "Em uso",
        icon: "Scissors",
        link: "https://divisor-pdf-59062.netlify.app/"
    },
    { 
        title: "Scripts Paginação Ampliados",
        owners: [
            { name: "Thiago Ribeiro", url: "https://arco.enterprise.slack.com/team/U056QMBQW2J" }
        ],
        type: "Script / Acessibilidade",
        problem: "Dificuldade de alunos localizarem páginas no material ampliado.",
        description: "Insere referências cruzadas indicando a localização exata do conteúdo original.",
        benefit: "Acessibilidade aprimorada e redução no tempo de diagramação.",
        status: "Piloto",
        icon: "FileJson"
    },
    { 
        title: "Plataforma LD (Códigos)",
        owners: [
            { name: "Luiz Stival", url: "https://arco.enterprise.slack.com/team/U0830TU216H" }
        ],
        type: "Repositório Técnico",
        problem: "Inconsistência na aplicação de códigos interativos.",
        description: "Biblioteca visual que permite visualizar o comportamento do código antes da implementação.",
        benefit: "Padronização técnica e redução de erros.",
        status: "Em desenvolvimento",
        icon: "Code2",
        link: "https://luizsb.github.io/Biblioteca_LD/"
    },
    { 
        title: "DIA LD",
        owners: [
            { name: "Daniel Hibarino", url: "https://arco.enterprise.slack.com/team/U082X549D2S" }
        ],
        type: "Ferramenta Interna",
        problem: "Criação de livros digitais complexa e difícil de escalar.",
        description: "Ferramenta visual unificada para produção de livros digitais independente da marca.",
        benefit: "Escalabilidade e padronização multimarcas.",
        status: "Em desenvolvimento",
        icon: "Wrench",
        link: "https://drive.google.com/file/d/1Mr0yz_gA_nUh2cqpuBFUCOYjwUtCh4R8/view?resourcekey"
    },
    { 
        title: "Dash Controle Produção",
        owners: [
            { name: "Luiz Stival", url: "https://arco.enterprise.slack.com/team/U0830TU216H" }
        ],
        type: "Ferramenta de Gestão",
        problem: "Visão fragmentada do status de produção.",
        description: "Sistema integrado com automações de status e dashboards por etapa.",
        benefit: "Rastreabilidade total e previsibilidade.",
        status: "Em uso",
        icon: "Layout"
    },
    { 
        title: "Destaques SAE Digital",
        owners: [
            { name: "Andressa Landarim", url: "https://arco.enterprise.slack.com/team/U083GE2FDEV" },
            { name: "Nayara Gracioli", url: "https://arco.enterprise.slack.com/team/U06U7SX2FDF" }
        ],
        type: "Hub de Conteúdo",
        problem: "Dificuldade na demonstração de valor das soluções.",
        description: "Interface que organiza Livros Digitais, ODAs e RAs para fácil navegação.",
        benefit: "Fortalecimento da marca e apoio comercial.",
        status: "Em desenvolvimento",
        icon: "Rocket"
    },
    { 
        title: "Fluxo Envios Clarizen",
        owners: [
            { name: "Danielle Souto", url: "https://arco.enterprise.slack.com/team/U056QJKH1B8" }
        ],
        type: "Processo / Workflow",
        problem: "Desorganização no recebimento de arquivos externos.",
        description: "Regras no Clarizen para centralizar uploads em pastas específicas.",
        benefit: "Segurança e organização no trânsito de arquivos.",
        status: "Piloto",
        icon: "FolderGit2"
    },
    { 
        title: "Ferramenta de mapa mental",
        owners: [
            { name: "Diego Renan", url: "https://arco.enterprise.slack.com/team/U056X5J6UFM" }
        ],
        type: "Ferramenta / IA",
        problem: "Alunos usam mapas mentais para estudar para provas, mas hoje não há uma forma escalável de gerar esses materiais a partir dos conteúdos.",
        description: "Gerador de mapas mentais com resumo de cada capítulo, usando IA para criar mapas automaticamente a partir dos conteúdos.",
        benefit: "Gera mapas mentais em escala para apoiar revisão de capítulos por alunos e professores.",
        status: "Em desenvolvimento",
        icon: "Brain"
    }
];

const projectsData = RAW_PROJECTS.map((p, i) => ({
    id: i + 1,
    owners: p.owners ?? null,
    owner: p.owner ?? (p.owners ? p.owners.map(o => o.name).join(", ") : "Interações Digitais Arco"),
    ...p,
    icon: ICONS[p.icon],
    link: p.link ?? null
}));

const StatusBadge = ({ status }) => {
    const getStatusColor = (s) => {
        switch(s) {
            case "Em uso": return "bg-green-100 text-green-700 border-green-200";
            case "Produção": return "bg-sky-100 text-sky-700 border-sky-200";
            case "Em desenvolvimento": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Piloto": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getIcon = (s) => {
         switch(s) {
            case "Em uso": return <CheckCircle2 size={14} className="mr-1 shrink-0" />;
            case "Produção": return <Rocket size={14} className="mr-1 shrink-0" />;
            case "Em desenvolvimento": return <Clock size={14} className="mr-1 shrink-0" />;
            case "Piloto": return <FlaskConical size={14} className="mr-1 shrink-0" />;
            default: return null;
        }
    }

    return (
        <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {getIcon(status)}
            {status}
        </span>
    );
};

const ProjectCard = ({ project, isDark }) => {
    const IconComponent = project.icon;

    return (
        <div
            className={`rounded-xl border p-6 flex flex-col h-full card-hover transition-all-custom ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${isDark ? "text-sky-400 bg-sky-500/10" : "text-indigo-600 bg-indigo-50"}`}>
                    <IconComponent size={24} />
                </div>
                <StatusBadge status={project.status} />
            </div>
            
            <div className={`mb-1 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-sky-400" : "text-indigo-600"}`}>
                {project.type}
            </div>

            <div className={`mb-1 text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                Responsável:{" "}
                {project.owners && project.owners.length > 0 ? (
                    <span className="font-medium">
                        {project.owners.map((owner, idx) => (
                            <a
                                key={owner.name}
                                href={owner.url}
                                target="_blank"
                                className={isDark ? "text-sky-300 hover:underline" : "text-sky-700 hover:underline"}
                            >
                                {idx > 0 ? `, ${owner.name}` : owner.name}
                            </a>
                        ))}
                    </span>
                ) : (
                    <span className="font-medium">{project.owner}</span>
                )}
            </div>
            
            <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-slate-50" : "text-gray-900"}`}>
                {project.title}
            </h3>
            
            <p className={`text-sm mb-4 line-clamp-3 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                {project.description}
            </p>
            
            <div className={`mt-auto pt-4 border-t ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                <div className="mb-4">
                    <span className={`text-xs font-bold uppercase block mb-1 ${isDark ? "text-slate-400" : "text-gray-400"}`}>Impacto Principal</span>
                    <p className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-gray-800"}`}>{project.benefit}</p>
                </div>
                
                {project.link ? (
                    <a 
                        href={project.link} 
                        target="_blank" 
                        className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDark ? "border-sky-500 text-sky-300 hover:bg-sky-500/10" : "border-sky-600 text-sky-600 hover:bg-sky-50"}`}
                    >
                        {project.status === "Em uso" ? "Acessar" : "Ver Demo / Link"} <ExternalLink size={16} className="ml-2" />
                    </a>
                ) : (
                    <button 
                        disabled 
                        className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium cursor-not-allowed ${isDark ? "border-slate-700 text-slate-500 bg-slate-800" : "border-gray-200 text-gray-400 bg-gray-50"}`}
                    >
                        Acesso Interno
                    </button>
                )}
            </div>
        </div>
    );
};

const getInitialTheme = () => {
    try {
        const stored = window.localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") return stored;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch {}
    return "light";
};

const App = () => {
    const [filter, setFilter] = useState("Todos");
    const [filteredProjects, setFilteredProjects] = useState(projectsData);
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", theme === "dark");
        }
        try {
            window.localStorage.setItem("theme", theme);
        } catch {}
    }, [theme]);

    const statusOptions = ["Todos", "Em uso", "Piloto", "Em desenvolvimento"];

    useEffect(() => {
        if (filter === "Todos") {
            setFilteredProjects(projectsData);
        } else {
            setFilteredProjects(projectsData.filter(p => p.status === filter));
        }
    }, [filter]);

    const stats = {
        total: projectsData.length,
        emUso: projectsData.filter(p => p.status === "Em uso").length,
        emDev: projectsData.filter(p => p.status === "Em desenvolvimento" || p.status === "Piloto").length
    };

    const isDark = theme === "dark";

    return (
        <div className={`min-h-screen pb-12 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-gray-900"}`}>
            {/* Header / Hero Section */}
            <div className={`border-b ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <img
                                    src="favicon.svg"
                                    alt="Logo Portfólio de Soluções Digitais"
                                    className="w-11 h-11 rounded-2xl shadow-sm"
                                />
                                <h1 className={`text-3xl md:text-4xl font-bold tracking-tight ${isDark ? "text-slate-50" : "text-gray-900"}`}>
                                    Portfólio de Soluções Digitais
                                </h1>
                            </div>
                            <p className={`text-lg max-w-2xl ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                                <span className={`${isDark ? "text-sky-400" : "text-indigo-600"} font-semibold`}>Soluções para problemas do dia a dia</span>,{" "}
                                <span className={`${isDark ? "text-sky-400" : "text-indigo-600"} font-semibold`}>automatizações</span> e{" "}
                                <span className={`${isDark ? "text-sky-400" : "text-indigo-600"} font-semibold`}>ferramentas</span> que simplificam o trabalho.
                            </p>
                        </div>
                        <div className="mt-6 md:mt-0 flex flex-col items-end gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border cursor-not-allowed opacity-60 ${
                                        isDark
                                            ? "bg-slate-800 border-slate-700 text-slate-300"
                                            : "bg-white border-gray-300 text-gray-500"
                                    }`}
                                    title="Em breve: cadastro de novas soluções"
                                >
                                    + Cadastrar nova solução
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme(isDark ? "light" : "dark")}
                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all-custom focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        isDark
                                            ? "bg-slate-800 border-slate-600 text-slate-100 focus:ring-sky-500 focus:ring-offset-slate-900"
                                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-sky-500 focus:ring-offset-gray-100"
                                    }`}
                                    aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
                                >
                                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                                    <span>Modo {isDark ? "claro" : "escuro"}</span>
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <div className={`rounded-lg p-4 text-center border ${isDark ? "bg-slate-900 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
                                    <div className={`text-2xl font-bold ${isDark ? "text-slate-50" : "text-gray-900"}`}>{stats.total}</div>
                                    <div className={`text-xs font-medium uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>Total de Iniciativas</div>
                                </div>
                                <div className={`rounded-lg p-4 text-center border ${isDark ? "bg-emerald-900/40 border-emerald-700" : "bg-green-50 border-green-100"}`}>
                                    <div className={`text-2xl font-bold ${isDark ? "text-emerald-300" : "text-green-700"}`}>{stats.emUso}</div>
                                    <div className={`text-xs font-medium uppercase ${isDark ? "text-emerald-300" : "text-green-600"}`}>Em uso</div>
                                </div>
                                <div className={`rounded-lg p-4 text-center border ${isDark ? "bg-blue-900/40 border-blue-700" : "bg-blue-50 border-blue-100"}`}>
                                    <div className={`text-2xl font-bold ${isDark ? "text-blue-300" : "text-blue-700"}`}>{stats.emDev}</div>
                                    <div className={`text-xs font-medium uppercase ${isDark ? "text-blue-300" : "text-blue-600"}`}>Em Dev / Piloto</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    <div className="flex items-center text-gray-500 mr-2">
                        <Filter size={18} className="mr-1" />
                        <span className="text-sm font-medium">Filtrar por status:</span>
                    </div>
                    {statusOptions.map(option => {
                        const help =
                            option === "Em uso"
                                ? "Já implantada e sendo utilizada em rotina."
                                : option === "Piloto"
                                ? "Em teste controlado com grupo menor, perto de ir para uso amplo."
                                : option === "Em desenvolvimento"
                                ? "Em construção ou validação inicial; ainda sem piloto ativo."
                                : undefined;
                        return (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all-custom ${
                                filter === option
                                ? (isDark ? 'bg-white text-gray-900 shadow-md' : 'bg-gray-900 text-white shadow-md')
                                : (isDark ? 'bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200')
                            }`}
                            title={help}
                        >
                            {option}
                        </button>
                    )})}
                </div>

                {/* Grid de Projetos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                        const IconComponent = project.icon;
                        return (
                            <div
                                key={project.id}
                                className={`rounded-xl border p-6 flex flex-col h-full card-hover transition-all-custom ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg ${isDark ? "text-sky-400 bg-sky-500/10" : "text-indigo-600 bg-indigo-50"}`}>
                                        <IconComponent size={24} />
                                    </div>
                                    <StatusBadge status={project.status} />
                                </div>
                                
                                <div className={`mb-1 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-sky-400" : "text-indigo-600"}`}>
                                    {project.type}
                                </div>

                                <div className={`mb-1 text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                                    Responsável:{" "}
                                    {project.owners && project.owners.length > 0 ? (
                                        <span className="font-medium">
                                            {project.owners.map((owner, idx) => (
                                                <a
                                                    key={owner.name}
                                                    href={owner.url}
                                                    target="_blank"
                                                    className={isDark ? "text-sky-300 hover:underline" : "text-sky-700 hover:underline"}
                                                >
                                                    {idx > 0 ? `, ${owner.name}` : owner.name}
                                                </a>
                                            ))}
                                        </span>
                                    ) : (
                                        <span className="font-medium">{project.owner}</span>
                                    )}
                                </div>
                                
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-slate-50" : "text-gray-900"}`}>
                                    {project.title}
                                </h3>
                                
                                <p className={`text-sm mb-4 line-clamp-3 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                                    {project.description}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="mb-4">
                                        <span className={`text-xs font-bold uppercase block mb-1 ${isDark ? "text-slate-400" : "text-gray-400"}`}>Impacto Principal</span>
                                        <p className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-gray-800"}`}>{project.benefit}</p>
                                    </div>
                                    
                                    {project.link ? (
                                        <a 
                                            href={project.link} 
                                            target="_blank" 
                                            className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isDark ? "border-sky-500 text-sky-300 hover:bg-sky-500/10" : "border-sky-600 text-sky-600 hover:bg-sky-50"}`}
                                        >
                                            {project.status === "Em uso" ? "Acessar" : "Ver Demo / Link"} <ExternalLink size={16} className="ml-2" />
                                        </a>
                                    ) : (
                                        <button 
                                            disabled 
                                            className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium cursor-not-allowed ${isDark ? "border-slate-700 text-slate-500 bg-slate-800" : "border-gray-200 text-gray-400 bg-gray-50"}`}
                                        >
                                            Acesso Interno
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Nenhum projeto encontrado com este filtro.</p>
                        <button onClick={() => setFilter("Todos")} className={`mt-4 font-medium hover:underline ${isDark ? "text-sky-400" : "text-indigo-600"}`}>
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>
            
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 Interações Digitais Arco. Uso interno.</p>
                    <p className="mt-2 md:mt-0">Inovação &amp; Tecnologia</p>
                </div>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

