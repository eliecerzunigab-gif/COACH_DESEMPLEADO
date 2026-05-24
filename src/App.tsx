import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard,
  User,
  Bot,
  Users,
  Briefcase,
  Menu,
  X,
  Plus,
  Minus,
  Sparkles,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  FileText,
  MessageSquare,
  Send,
  BarChart3,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  BrainCircuit,
  HeartHandshake,
  Star,
  Quote,
  Database,
  Building2,
} from 'lucide-react'


// ─── Tipos ───────────────────────────────────────────────────────────────────
type TabId = 'dashboard' | 'perfil' | 'auditor' | 'networking' | 'cazador'

interface Perfil {
  nombre: string
  cargo: string
  habilidades: string
  experiencia: string
  extracto: string
}

interface Metricas {
  diasBusqueda: number
  cvsEnviados: number
  entrevistas: number
}

interface Toast {
  id: number
  mensaje: string
  tipo: 'success' | 'error' | 'info'
}

interface ResultadoAuditoria {
  puntosFuertes: string
  erroresCriticos: string
  propuestaOptimizada: string
}

// ─── Constantes ──────────────────────────────────────────────────────────────
const CONSEJOS = [
  "El mejor momento para buscar trabajo fue ayer. El segundo mejor momento es AHORA. 🚀",
  "Tu LinkedIn no es un currículum estático: es tu historia profesional en evolución constante.",
  "El 85% de los trabajos se consiguen a través de networking. ¡Conecta!",
  "Personaliza cada CV para la oferta. Un CV genérico es un CV ignorado.",
  "Practica tus respuestas en entrevistas. La confianza se construye con preparación.",
  "No te tomes el rechazo como algo personal. Es parte del proceso, no el final.",
  "Actualiza tu perfil de LinkedIn cada semana. La actividad constante atrae reclutadores.",
  "Invierte en aprender una nueva habilidad cada mes. El conocimiento es tu mejor carta de presentación.",
]

const TONOS_NETWORKING = ['Formal', 'Directo', 'Rompehielos'] as const

const PERFIL_DEFAULT: Perfil = {
  nombre: '',
  cargo: '',
  habilidades: '',
  experiencia: '',
  extracto: '',
}

const METRICAS_DEFAULT: Metricas = {
  diasBusqueda: 0,
  cvsEnviados: 0,
  entrevistas: 0,
}

// ─── Datos de perfiles de ejemplo (TI) ──────────────────────────────────────
const PERFILES_TI = {
  arquitectoBD: {
    nombre: 'Carlos Mendoza',
    cargo: 'Arquitecto de Base de Datos',
    habilidades: 'SQL, PostgreSQL, MongoDB, Oracle, Data Modeling, ETL, Snowflake, AWS RDS, Performance Tuning, Data Warehousing, Python, Apache Spark',
    experiencia: '12 años',
    extracto: 'Arquitecto de Bases de Datos con más de 12 años de experiencia diseñando soluciones de datos escalables y de alto rendimiento. Especialista en modelado de datos relacionales y no relacionales, optimización de consultas y migraciones a la nube.',
  },
  gerenteOperaciones: {
    nombre: 'María Fernanda López',
    cargo: 'Gerente de Operaciones',
    habilidades: 'Gestión de equipos, Lean Six Sigma, ERP SAP, KPIs, Mejora Continua, Supply Chain, Presupuestos, CRM Salesforce, Power BI, Jira, OKRs',
    experiencia: '10 años',
    extracto: 'Gerente de Operaciones con 10 años de experiencia liderando equipos multifuncionales y optimizando procesos operativos. Experta en implementación de sistemas ERP, reducción de costos y mejora de eficiencia operativa.',
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generarId(): number {
  return Date.now() + Math.random()
}

function detectarPerfil(cargo: string): 'arquitectoBD' | 'gerenteOperaciones' {
  const c = cargo.toLowerCase()
  if (c.includes('arquitecto') || c.includes('base de datos') || c.includes('dba') || c.includes('data architect') || c.includes('database')) {
    return 'arquitectoBD'
  }
  return 'gerenteOperaciones'
}

function simularAuditoria(perfil: Perfil): Promise<ResultadoAuditoria> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tipo = detectarPerfil(perfil.cargo)
      const datos = PERFILES_TI[tipo]

      if (tipo === 'arquitectoBD') {
        resolve({
          puntosFuertes:
            '✅ Sólida experiencia en modelado de datos relacionales y no relacionales (PostgreSQL, MongoDB, Oracle).\n' +
            '✅ Dominio de tecnologías cloud (AWS RDS, Snowflake) alineadas con tendencias del mercado.\n' +
            '✅ Capacidad demostrada en optimización de rendimiento y tuning de consultas complejas.\n' +
            '✅ Experiencia en ETL y Data Warehousing, perfil muy demandado en el sector.',
          erroresCriticos:
            '⚠️ El extracto no menciona certificaciones clave (AWS Certified, MongoDB, Snowflake).\n' +
            '⚠️ Falta incluir métricas de impacto: ¿cuánto mejoraste el rendimiento? ¿qué % de reducción de costos lograste?\n' +
            '⚠️ No se menciona experiencia con bases de datos NoSQL a escala ni manejo de Big Data.\n' +
            '⚠️ El titular de LinkedIn es genérico. Debe incluir palabras clave como "Cloud", "Data Architect", "Scalability".',
          propuestaOptimizada:
            '🏆 Titular sugerido:\n' +
            '"Arquitecto de Base de Datos Senior | Cloud & On-Premise | Especialista en PostgreSQL, MongoDB, AWS RDS | Data Warehousing & Performance Tuning"\n\n' +
            '📝 Extracto optimizado:\n' +
            '"Arquitecto de Bases de Datos con +12 años diseñando infraestructuras de datos que procesan más de 5M de transacciones/día. ' +
            'He liderado migraciones cloud que redujeron costos de infraestructura en un 40% y mejoraron tiempos de consulta en un 60%. ' +
            'Apasionado por transformar datos complejos en activos estratégicos, busco aportar mi experiencia en arquitectura de datos escalable ' +
            'a una organización innovadora que valore la excelencia técnica."',
        })
      } else {
        resolve({
          puntosFuertes:
            '✅ Amplia experiencia en gestión de equipos multifuncionales y liderazgo operativo.\n' +
            '✅ Conocimiento profundo de ERP SAP y CRM Salesforce, herramientas críticas para operaciones.\n' +
            '✅ Enfoque en mejora continua con metodologías Lean Six Sigma y OKRs.\n' +
            '✅ Habilidad para traducir datos en decisiones estratégicas usando Power BI y KPIs.',
          erroresCriticos:
            '⚠️ El extracto no cuantifica logros: ¿cuánto redujiste costos? ¿qué % de mejora en eficiencia lograste?\n' +
            '⚠️ Falta mencionar experiencia en transformación digital o automatización de procesos.\n' +
            '⚠️ No se destacan habilidades blandas clave como negociación con stakeholders o gestión del cambio.\n' +
            '⚠️ El perfil de LinkedIn no incluye recomendaciones ni endorsements en áreas clave como Supply Chain.',
          propuestaOptimizada:
            '🏆 Titular sugerido:\n' +
            '"Gerente de Operaciones Senior | Transformación Digital & Mejora Continua | Lean Six Sigma | ERP SAP & CRM Salesforce | Optimización de Procesos"\n\n' +
            '📝 Extracto optimizado:\n' +
            '"Gerente de Operaciones con +10 años liderando equipos de hasta 50 personas y optimizando procesos que generan $20M+ en ingresos anuales. ' +
            'Implementé un sistema ERP que redujo costos operativos en un 25% y mejoró la eficiencia del equipo en un 35% en 18 meses. ' +
            'Apasionada por la innovación operativa y la transformación digital, busco un desafío donde pueda impulsar la excelencia operativa ' +
            'y generar impacto medible desde el primer día."',
        })
      }
    }, 1500)
  })
}

function simularMatch(jd: string, perfil: Perfil): Promise<{ match: number; keywords: string[] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tipo = detectarPerfil(perfil.cargo)
      const palabras = jd.toLowerCase().split(/[\s,;.]+/).filter((p) => p.length > 4)

      // Palabras clave específicas por perfil
      const comunesBD = [
        'base de datos', 'sql', 'nosql', 'postgresql', 'mongodb', 'oracle', 'aws',
        'cloud', 'data', 'etl', 'data warehouse', 'big data', 'arquitectura',
        'rendimiento', 'escalabilidad', 'modelado', 'migración',
      ]
      const comunesOps = [
        'operaciones', 'gestión', 'equipo', 'procesos', 'mejora continua',
        'supply chain', 'logística', 'kpi', 'indicadores', 'presupuesto',
        'proyectos', 'liderazgo', 'eficiencia', 'optimización', 'resultados',
      ]

      const comunes = tipo === 'arquitectoBD' ? comunesBD : comunesOps
      const encontradas = comunes.filter((c) => palabras.some((p) => p.includes(c) || c.includes(p)))
      const match = Math.min(95, Math.max(30, 35 + encontradas.length * 6 + Math.floor(Math.random() * 10)))

      const extras = tipo === 'arquitectoBD'
        ? ['arquitectura de datos', 'cloud computing', 'rendimiento', 'escalabilidad', 'big data', 'data modeling']
        : ['liderazgo', 'mejora continua', 'optimización de procesos', 'gestión del cambio', 'trabajo en equipo', 'orientación a resultados']

      const keywords = [...new Set([...encontradas, ...extras])].slice(0, 8)
      resolve({ match, keywords })
    }, 1500)
  })
}

function simularMensajeNetworking(tono: string, perfil: Perfil): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tipo = detectarPerfil(perfil.cargo)
      const sector = tipo === 'arquitectoBD' ? 'Arquitectura de Datos' : 'Operaciones'
      const especialidad = tipo === 'arquitectoBD' ? 'bases de datos escalables y cloud' : 'optimización de procesos y transformación digital'

      const mensajes: Record<string, string> = {
        Formal:
          `Estimado/a [Nombre del Reclutador],\n\n` +
          `Espero este mensaje le encuentre bien. Me pongo en contacto porque he seguido su trayectoria en [Empresa] y admiro el trabajo que realizan en el sector de ${sector}.\n\n` +
          `Actualmente me encuentro en búsqueda activa de nuevas oportunidades como ${perfil.cargo}. Con ${perfil.experiencia} de experiencia en ${especialidad}, creo que mi perfil podría aportar valor significativo a su organización.\n\n` +
          `Quedo atento/a a cualquier posibilidad de conversar y compartir más detalles sobre mi experiencia y logros.\n\n` +
          `Saludos cordiales,\n${perfil.nombre || '[Tu Nombre]'}`,
        Directo:
          `Hola [Nombre],\n\n` +
          `Soy ${perfil.nombre || '[Tu Nombre]'}, ${perfil.cargo} con ${perfil.experiencia} de experiencia en ${especialidad}. He estado siguiendo el trabajo de [Empresa] y creo que mi perfil encaja perfectamente con los retos que manejan.\n\n` +
          `¿Te parece si agendamos 10 minutos para conversar? Me encantaría compartir cómo he ayudado a otras empresas a [logro relevante] y cómo podría aportar valor a tu equipo.\n\n` +
          `Gracias,\n${perfil.nombre || '[Tu Nombre]'}`,
        Rompehielos:
          `¡Hola [Nombre]! 👋\n\n` +
          `Vi tu publicación sobre [tema relacionado con ${sector}] y me pareció increíble. Justo yo también soy apasionado/a de ${especialidad}.\n\n` +
          `Por cierto, soy ${perfil.nombre || '[Tu Nombre]'}, ${perfil.cargo} con ${perfil.experiencia} de experiencia. Estoy explorando nuevas oportunidades en ${sector}. Si conoces a alguien que busque talento con experiencia en ${especialidad}, ¡te agradecería la conexión! 😊\n\n` +
          `¡Sigamos en contacto!`,
      }
      resolve(mensajes[tono] || mensajes.Formal)
    }, 1500)
  })
}


// ─── Componente Toast ────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-in ${
            t.tipo === 'success'
              ? 'bg-emerald-50/95 border border-emerald-200 text-emerald-800'
              : t.tipo === 'error'
              ? 'bg-red-50/95 border border-red-200 text-red-800'
              : 'bg-indigo-50/95 border border-indigo-200 text-indigo-800'
          }`}
        >
          {t.tipo === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : t.tipo === 'error' ? <XCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium flex-1">{t.mensaje}</p>
          <button onClick={() => onRemove(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Componente Skeleton ─────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
}

// ─── Componente Sidebar ──────────────────────────────────────────────────────
function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggle,
}: {
  activeTab: TabId
  onTabChange: (t: TabId) => void
  collapsed: boolean
  onToggle: () => void
}) {
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'perfil', label: 'Mi Perfil', icon: <User className="w-5 h-5" /> },
    { id: 'auditor', label: 'Auditor IA', icon: <Bot className="w-5 h-5" /> },
    { id: 'networking', label: 'Networking', icon: <Users className="w-5 h-5" /> },
    { id: 'cazador', label: 'Cazador ATS', icon: <Briefcase className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-md shrink-0">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-slate-800 text-sm leading-tight">COUCH</h1>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">DESEMPLEADO</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id)
                if (window.innerWidth < 1024) onToggle()
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? tab.label : undefined}
            >
              {tab.icon}
              {!collapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`px-4 py-3 border-t border-slate-100 ${collapsed ? 'text-center' : ''}`}>
          <p className={`text-[10px] text-slate-400 ${collapsed ? 'hidden' : ''}`}>v1.0.0 • MVP</p>
        </div>
      </aside>
    </>
  )
}

// ─── Componente Dashboard ────────────────────────────────────────────────────
function Dashboard({
  metricas,
  onMetricaChange,
  perfil,
  onCargarPerfil,
}: {
  metricas: Metricas
  onMetricaChange: (m: Metricas) => void
  perfil: Perfil
  onCargarPerfil: (p: Perfil) => void
}) {
  const consejo = CONSEJOS[Math.floor(Math.random() * CONSEJOS.length)]

  const tarjetas = [
    {
      titulo: 'Días en Búsqueda',
      valor: metricas.diasBusqueda,
      icono: <Clock className="w-5 h-5" />,
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      key: 'diasBusqueda' as const,
    },
    {
      titulo: 'CVs Enviados',
      valor: metricas.cvsEnviados,
      icono: <FileText className="w-5 h-5" />,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      key: 'cvsEnviados' as const,
    },
    {
      titulo: 'Entrevistas',
      valor: metricas.entrevistas,
      icono: <Star className="w-5 h-5" />,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      textColor: 'text-amber-700',
      key: 'entrevistas' as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">¡Bienvenido a tu Couch!</h2>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed max-w-xl">
              Este es tu espacio personal para impulsar tu búsqueda laboral. Cada día es una nueva oportunidad para acercarte a ese trabajo que mereces. ¡Estoy aquí para ayudarte a lograrlo!
            </p>
          </div>
        </div>
      </div>

      {/* Perfiles Demo - Tarjetas destacadas */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-700">👥 Perfiles de demostración</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Carlos Mendoza */}
          <div className={`group relative bg-white rounded-2xl border-2 p-5 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg ${
            perfil.nombre === PERFILES_TI.arquitectoBD.nombre
              ? 'border-indigo-400 bg-indigo-50/30 shadow-md'
              : 'border-slate-200 hover:border-indigo-300'
          }`}
            onClick={() => onCargarPerfil(PERFILES_TI.arquitectoBD)}
          >
            {perfil.nombre === PERFILES_TI.arquitectoBD.nombre && (
              <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                ACTIVO
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-md shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-base">Carlos Mendoza</h4>
                <p className="text-sm text-indigo-600 font-medium">Arquitecto de Base de Datos</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px] font-medium">12 años exp.</span>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded-md text-[10px] font-medium">PostgreSQL</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-medium">MongoDB</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[10px] font-medium">AWS</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{PERFILES_TI.arquitectoBD.extracto}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onCargarPerfil(PERFILES_TI.arquitectoBD); }}
                className="shrink-0 p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all opacity-0 group-hover:opacity-100"
                title="Cargar este perfil"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* María F. López */}
          <div className={`group relative bg-white rounded-2xl border-2 p-5 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg ${
            perfil.nombre === PERFILES_TI.gerenteOperaciones.nombre
              ? 'border-emerald-400 bg-emerald-50/30 shadow-md'
              : 'border-slate-200 hover:border-emerald-300'
          }`}
            onClick={() => onCargarPerfil(PERFILES_TI.gerenteOperaciones)}
          >
            {perfil.nombre === PERFILES_TI.gerenteOperaciones.nombre && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                ACTIVO
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-base">María F. López</h4>
                <p className="text-sm text-emerald-600 font-medium">Gerente de Operaciones</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-medium">10 años exp.</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-[10px] font-medium">SAP</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-medium">Salesforce</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-medium">Lean Six Sigma</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{PERFILES_TI.gerenteOperaciones.extracto}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onCargarPerfil(PERFILES_TI.gerenteOperaciones); }}
                className="shrink-0 p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all opacity-0 group-hover:opacity-100"
                title="Cargar este perfil"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tarjetas.map((t) => (
          <div key={t.key} className={`${t.bg} rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-white shadow-sm ${t.textColor}`}>{t.icono}</div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    onMetricaChange({
                      ...metricas,
                      [t.key]: Math.max(0, metricas[t.key] - 1),
                    })
                  }
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-700 transition-all shadow-sm border border-slate-200"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    onMetricaChange({
                      ...metricas,
                      [t.key]: metricas[t.key] + 1,
                    })
                  }
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-700 transition-all shadow-sm border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{t.titulo}</p>
            <p className={`text-3xl font-bold ${t.textColor}`}>{t.valor}</p>
          </div>
        ))}
      </div>

      {/* Consejo + Acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 shrink-0">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">💡 Consejo del Couch del día</p>
              <p className="text-slate-700 text-sm leading-relaxed">{consejo}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">⚡ Acceso rápido</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => {}} className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all text-xs font-medium">
              <Bot className="w-4 h-4" /> Auditor IA
            </button>
            <button onClick={() => {}} className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-xs font-medium">
              <MessageSquare className="w-4 h-4" /> Networking
            </button>
            <button onClick={() => {}} className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all text-xs font-medium">
              <Target className="w-4 h-4" /> ATS Matcher
            </button>
            <button onClick={() => {}} className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all text-xs font-medium">
              <User className="w-4 h-4" /> Mi Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── Componente Selector Perfiles Demo ──────────────────────────────────────
function SelectorPerfilesDemo({ onCargar }: { onCargar: (p: Perfil) => void }) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 rounded-2xl border border-indigo-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-indigo-800 text-sm">🎯 Carga un perfil de demostración</h3>
      </div>
      <p className="text-xs text-slate-500 mb-3">Selecciona un perfil predefinido para probar las funcionalidades de IA al instante:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onCargar(PERFILES_TI.arquitectoBD)}
          className="flex items-start gap-3 p-3 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
        >
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-sm">Carlos Mendoza</p>
            <p className="text-xs text-slate-500 truncate">Arquitecto de Base de Datos</p>
            <p className="text-[10px] text-slate-400 mt-0.5">12 años • PostgreSQL • MongoDB • AWS</p>
          </div>
        </button>
        <button
          onClick={() => onCargar(PERFILES_TI.gerenteOperaciones)}
          className="flex items-start gap-3 p-3 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all text-left group"
        >
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-sm">María F. López</p>
            <p className="text-xs text-slate-500 truncate">Gerente de Operaciones</p>
            <p className="text-[10px] text-slate-400 mt-0.5">10 años • SAP • Salesforce • Lean Six Sigma</p>
          </div>
        </button>
      </div>
    </div>
  )
}

// ─── Componente Mi Perfil ────────────────────────────────────────────────────
function MiPerfil({
  perfil,
  onPerfilChange,
  onGuardar,
}: {
  perfil: Perfil
  onPerfilChange: (p: Perfil) => void
  onGuardar: () => void
}) {
  const campos: { label: string; key: keyof Perfil; placeholder: string; type: 'text' | 'textarea' }[] = [
    { label: 'Nombre Completo', key: 'nombre', placeholder: 'Ej: María García López', type: 'text' },
    { label: 'Cargo / Rol Actual', key: 'cargo', placeholder: 'Ej: Product Manager Senior', type: 'text' },
    { label: 'Habilidades / Tecnologías', key: 'habilidades', placeholder: 'Ej: Python, React, SQL, Liderazgo, Agile...', type: 'text' },
    { label: 'Años de Experiencia', key: 'experiencia', placeholder: 'Ej: 8 años', type: 'text' },
    { label: 'Extracto Profesional', key: 'extracto', placeholder: 'Escribe un resumen profesional impactante...', type: 'textarea' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mi Perfil Profesional</h2>
          <p className="text-sm text-slate-500">Mantén tus datos actualizados para obtener mejores recomendaciones</p>
        </div>
      </div>

      {/* Selector de perfiles demo */}
      <SelectorPerfilesDemo onCargar={onPerfilChange} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        {campos.map((campo) => (

          <div key={campo.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{campo.label}</label>
            {campo.type === 'textarea' ? (
              <textarea
                value={perfil[campo.key]}
                onChange={(e) => onPerfilChange({ ...perfil, [campo.key]: e.target.value })}
                placeholder={campo.placeholder}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm resize-none"
              />
            ) : (
              <input
                type="text"
                value={perfil[campo.key]}
                onChange={(e) => onPerfilChange({ ...perfil, [campo.key]: e.target.value })}
                placeholder={campo.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
              />
            )}
          </div>
        ))}

        <button
          onClick={onGuardar}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Guardar Perfil
        </button>
      </div>
    </div>
  )
}

// ─── Componente Auditor IA ───────────────────────────────────────────────────
function AuditorIA({ perfil }: { perfil: Perfil }) {
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoAuditoria | null>(null)

  const auditar = async () => {
    setCargando(true)
    setResultado(null)
    const res = await simularAuditoria(perfil)
    setResultado(res)
    setCargando(false)
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Auditor de LinkedIn & CV</h2>
          <p className="text-sm text-slate-500">Análisis inteligente de tu perfil profesional con IA</p>
        </div>
      </div>

      <button
        onClick={auditar}
        disabled={cargando}
        className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {cargando ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analizando perfil...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Auditar mi Perfil con IA
          </>
        )}
      </button>

      {cargando && (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-32" />
        </div>
      )}

      {resultado && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">✅ Puntos Fuertes</h3>
            </div>
            <p className="text-sm text-emerald-700 whitespace-pre-line leading-relaxed">{resultado.puntosFuertes}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">⚠️ Errores Críticos a Corregir</h3>
            </div>
            <p className="text-sm text-red-700 whitespace-pre-line leading-relaxed">{resultado.erroresCriticos}</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-indigo-800">⚡ Propuesta Optimizada</h3>
            </div>
            <p className="text-sm text-indigo-700 whitespace-pre-line leading-relaxed">{resultado.propuestaOptimizada}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente Networking ───────────────────────────────────────────────────
function Networking({ perfil }: { perfil: Perfil }) {
  const [tono, setTono] = useState<string>('Formal')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  const generar = async () => {
    setCargando(true)
    setMensaje(null)
    const res = await simularMensajeNetworking(tono, perfil)
    setMensaje(res)
    setCargando(false)
  }


  const copiar = () => {
    if (mensaje) {
      navigator.clipboard.writeText(mensaje)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Generador de Networking</h2>
          <p className="text-sm text-slate-500">Mensajes listos para conectar con reclutadores en LinkedIn</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Selecciona el tono del mensaje</label>
          <div className="flex flex-wrap gap-2">
            {TONOS_NETWORKING.map((t) => (
              <button
                key={t}
                onClick={() => setTono(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tono === t
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generar}
          disabled={cargando}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {cargando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando mensaje...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generar Mensaje para Reclutador
            </>
          )}
        </button>

        {cargando && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {mensaje && (
          <div className="relative animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12">
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{mensaje}</p>
            </div>
            <button
              onClick={copiar}
              className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
              title="Copiar mensaje"
            >
              {copiado ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Componente Cazador ATS ─────────────────────────────────────────────────
function CazadorATS({ perfil }: { perfil: Perfil }) {
  const [jd, setJd] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<{ match: number; keywords: string[] } | null>(null)

  const analizar = async () => {
    if (!jd.trim()) return
    setCargando(true)
    setResultado(null)
    const res = await simularMatch(jd, perfil)
    setResultado(res)
    setCargando(false)
  }


  const getMatchColor = (pct: number) => {
    if (pct >= 70) return 'text-emerald-600'
    if (pct >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const getMatchBg = (pct: number) => {
    if (pct >= 70) return 'bg-emerald-500'
    if (pct >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Cazador de Ofertas / ATS Matcher</h2>
          <p className="text-sm text-slate-500">Analiza la compatibilidad de tu perfil con cualquier oferta laboral</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Pega la descripción de la oferta (Job Description)</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Pega aquí la descripción completa de la oferta de trabajo..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm resize-none"
          />
        </div>

        <button
          onClick={analizar}
          disabled={cargando || !jd.trim()}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {cargando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analizando compatibilidad...
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              Analizar Compatibilidad
            </>
          )}
        </button>

        {cargando && (
          <div className="space-y-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-12" />
          </div>
        )}

        {resultado && (
          <div className="space-y-4 animate-fade-in">
            {/* Match percentage */}
            <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500 mb-2 font-medium">Compatibilidad estimada</p>
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(resultado.match / 100) * 339.292} 339.292`}
                    className={getMatchColor(resultado.match)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getMatchColor(resultado.match)}`}>{resultado.match}%</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                resultado.match >= 70 ? 'bg-emerald-100 text-emerald-700' : resultado.match >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}>
                {resultado.match >= 70 ? <CheckCircle2 className="w-3.5 h-3.5" /> : resultado.match >= 50 ? <AlertTriangle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {resultado.match >= 70 ? '¡Buen match!' : resultado.match >= 50 ? 'Match medio' : 'Baja compatibilidad'}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-800">Palabras clave recomendadas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resultado.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-indigo-700 border border-indigo-200 shadow-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Componente App Principal ────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Perfil state
  const [perfil, setPerfil] = useState<Perfil>(() => {
    const saved = localStorage.getItem('couch_perfil')
    return saved ? JSON.parse(saved) : PERFIL_DEFAULT
  })

  // Metricas state
  const [metricas, setMetricas] = useState<Metricas>(() => {
    const saved = localStorage.getItem('couch_metricas')
    return saved ? JSON.parse(saved) : METRICAS_DEFAULT
  })

  // Persistencia en LocalStorage
  useEffect(() => {
    localStorage.setItem('couch_perfil', JSON.stringify(perfil))
  }, [perfil])

  useEffect(() => {
    localStorage.setItem('couch_metricas', JSON.stringify(metricas))
  }, [metricas])

  // Toast helpers
  const addToast = useCallback((mensaje: string, tipo: Toast['tipo'] = 'success') => {
    const id = generarId()
    setToasts((prev) => [...prev, { id, mensaje, tipo }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const guardarPerfil = () => {
    addToast('✅ Perfil guardado correctamente', 'success')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard metricas={metricas} onMetricaChange={setMetricas} perfil={perfil} onCargarPerfil={setPerfil} />

      case 'perfil':
        return <MiPerfil perfil={perfil} onPerfilChange={setPerfil} onGuardar={guardarPerfil} />
      case 'auditor':
        return <AuditorIA perfil={perfil} />
      case 'networking':
        return <Networking perfil={perfil} />
      case 'cazador':
        return <CazadorATS perfil={perfil} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 sticky top-0 z-10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all lg:mr-3"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl border border-indigo-100">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-600">IA Lista</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App
