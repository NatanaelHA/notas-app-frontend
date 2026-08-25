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
      'Un **EventBridge Scheduler** dispara la Lambda `limpiarInvitados` cada hora. Por cada invitado vencido, la Lambda lo elimina de **Cognito** y publica el evento **InvitadoEliminado** en EventBridge. Ese evento llega automáticamente a `eliminarNotasInvitado`, que borra sus notas en **DynamoDB** — sin que el servicio de usuarios toque la base de datos de notas directamente.',
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
      '**3 microservicios** independientes: notas, usuarios y notificaciones, comunicados por eventos.',
    descripcionExtendida:
      'Arquitectura separada en 3 repositorios con responsabilidades claras: **notas-app** (DynamoDB, S3, SQS), **notas-app-usuarios** (Cognito, EventBridge) y **notas-app-notifications** (SES). Los servicios se comunican mediante un contrato de evento (**InvitadoEliminado**) publicado en **EventBridge**, sin compartir código ni base de datos. El despliegue de cada servicio está automatizado con **GitHub Actions**.',
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
    descripcion:
      'El frontend llama a una ruta pública de **API Gateway** — no necesitas escribir ningún dato tuyo.',
  },
  {
    numero: 2,
    titulo: 'Se genera una cuenta temporal',
    descripcion:
      'Una **Lambda** usa **AdminCreateUser** de **Cognito** para crear el email y la contraseña, sin verificación de email.',
  },
  {
    numero: 3,
    titulo: 'Inicias sesión al instante',
    descripcion:
      'El frontend inicia sesión directo contra **Cognito** con esas credenciales. Puedes copiarlas para volver más tarde.',
  },
  {
    numero: 4,
    titulo: 'Usas la app con normalidad',
    descripcion:
      'Cada nota pasa por **API Gateway** y una **Lambda** antes de guardarse en **DynamoDB**. Hasta 20 notas por cuenta.',
  },
  {
    numero: 5,
    titulo: 'Se elimina en 24 horas',
    descripcion:
      'Un **EventBridge Scheduler** dispara una Lambda cada hora, que borra en Cognito y DynamoDB solo las cuentas ya vencidas.',
  },
]
