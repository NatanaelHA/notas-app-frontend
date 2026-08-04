import {
  NotebookPen,
  UserRoundPlus,
  Timer,
  Layers,
  CloudCog,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react'

export interface TarjetaLanding {
  titulo: string
  descripcion: string
  descripcionExtendida: string
  icono: LucideIcon
}

export const tarjetasLanding: TarjetaLanding[] = [
  {
    icono: NotebookPen,
    titulo: 'Notas App',
    descripcion:
      'Una app de notas simple y rápida, construida como proyecto full-stack sobre **AWS**.',
    descripcionExtendida:
      'Un proyecto personal construido de principio a fin para practicar arquitectura **serverless** real en AWS, combinado con un frontend moderno en **Next.js**. Incluye autenticación, modo invitado, modo oscuro/claro y una experiencia de usuario pensada al detalle, no solo el CRUD básico.',
  },
  {
    icono: UserRoundPlus,
    titulo: 'Modo invitado',
    descripcion: 'Prueba la app sin registrarte, con una **cuenta temporal**.',
    descripcionExtendida:
      'Cada cuenta se crea con **AdminCreateUser** de Cognito (sin verificación de email), tiene un límite de **20 notas** y vive **24 horas**. Si en algún momento hay más de **50 invitados** simultáneos, se elimina automáticamente el más antiguo al crear uno nuevo — así el sistema nunca crece sin control.',
  },
  {
    icono: Timer,
    titulo: 'Limpieza automática',
    descripcion:
      'Un proceso revisa las cuentas cada hora, pero solo elimina las que ya superaron las **24h** — nunca las recién creadas.',
    descripcionExtendida:
      'Implementado con **Amazon EventBridge Scheduler**, disparando una Lambda cada hora en punto. Cada cuenta invitado eliminada también dispara la eliminación en cascada de sus notas en **DynamoDB**, evitando dejar datos huérfanos en la base de datos.',
  },
  {
    icono: Layers,
    titulo: 'Frontend',
    descripcion:
      '**Next.js 16**, TypeScript, **Context API**, hooks personalizados y animaciones con Motion.',
    descripcionExtendida:
      'Construido con **Next.js 16** (App Router) y **Tailwind CSS v4**. El estado de las notas se maneja con **Context API**, separando la lógica (hooks) de la presentación (componentes). Incluye hooks personalizados como el efecto typewriter del modo invitado o el cálculo del temporizador de limpieza, además de animaciones con **Motion** en modales, cards y transiciones de página.',
  },
  {
    icono: CloudCog,
    titulo: 'Backend serverless',
    descripcion:
      '**AWS Lambda**, **DynamoDB**, **Cognito**, SQS, SES y EventBridge, sin servidores que mantener.',
    descripcionExtendida:
      '8 funciones **Lambda** en Node.js, expuestas mediante **API Gateway**. **DynamoDB** almacena las notas con soft delete y expiración automática (**TTL**). **SQS** y **SES** manejan notificaciones por email de forma asíncrona. Todo el despliegue está automatizado con **GitHub Actions**.',
  },
  {
    icono: ShieldCheck,
    titulo: 'Seguridad',
    descripcion:
      'Autenticación **JWT**, rate limiting, límites de uso y **soft delete** con expiración automática.',
    descripcionExtendida:
      'La API está protegida con un autorizador de **Cognito** basado en **JWT** en todas las rutas privadas. La ruta pública de creación de invitados tiene **rate limiting** configurado en API Gateway (2 req/s) para prevenir abuso, además de los límites de uso ya mencionados en las otras tarjetas.',
  },
]

export interface PasoInvitado {
  numero: number
  titulo: string
  descripcion: string
}

export const pasosInvitado: PasoInvitado[] = [
  {
    numero: 1,
    titulo: 'Haces clic en "Probar como invitado"',
    descripcion: 'No necesitas escribir ningún dato tuyo.',
  },
  {
    numero: 2,
    titulo: 'Se genera una cuenta temporal',
    descripcion: 'Cognito crea un email y contraseña únicos, automáticamente.',
  },
  {
    numero: 3,
    titulo: 'Inicias sesión al instante',
    descripcion:
      'Puedes copiar esas credenciales por si quieres volver más tarde.',
  },
  {
    numero: 4,
    titulo: 'Usas la app con normalidad',
    descripcion: 'Hasta 20 notas, con todas las funciones disponibles.',
  },
  {
    numero: 5,
    titulo: 'Se elimina en 24 horas',
    descripcion:
      'Un proceso revisa cada hora y borra solo las cuentas ya vencidas.',
  },
]
