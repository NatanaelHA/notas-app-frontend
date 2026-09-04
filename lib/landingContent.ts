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
      'Invitados: cada hora elimina cuentas con más de **24h**. Usuarios reales: cada domingo elimina solo sus notas.',
    descripcionExtendida:
      'Para invitados, **EventBridge Scheduler** ejecuta `limpiarInvitados` cada hora y detecta las cuentas con más de 24 horas. La función publica **InvitadoEliminado** en **EventBridge** y elimina la cuenta de **Cognito**. La regla correspondiente ejecuta `eliminarNotasInvitado`, que consulta las notas activas en **DynamoDB**, publica un resumen de auditoría en **SQS** y luego elimina todas las notas del invitado. Para usuarios reales, **EventBridge Scheduler** ejecuta `limpiarUsuarios` cada domingo. La función publica **UsuarioParaLimpieza** en **EventBridge**, que activa `eliminarNotasUsuario`: consulta las notas activas, publica el resumen de auditoría en **SQS** y elimina las notas, pero conserva la cuenta de **Cognito**. En ambos casos, el servicio de notificaciones consume el mensaje y solicita a **SES** que envíe el resumen al correo de auditoría verificado.',
  },
  {
    icono: Layers,
    titulo: 'Frontend',
    descripcion:
      '**Next.js 16**, TypeScript, **Context API**, hooks personalizados y animaciones con Motion.',
    descripcionExtendida:
      'Construido con **Next.js 16** (App Router) y **Tailwind CSS v4**. El estado de las notas se maneja con **Context API**, separando la lógica (hooks) de la presentación (componentes). Incluye contadores para la limpieza horaria de invitados y la limpieza semanal de notas de usuarios reales, además de la descarga de notas en **PDF** generada completamente en el navegador. También incorpora el efecto typewriter del modo invitado y animaciones con **Motion** en modales, cards y transiciones de página.',
  },
  {
    icono: CloudCog,
    titulo: 'Backend serverless',
    descripcion:
      '**3 microservicios** independientes: notas, usuarios y notificaciones, comunicados por eventos.',
    descripcionExtendida:
      'Arquitectura formada por 3 microservicios independientes: **notas-app** administra las notas y sus datos con **Lambda**, **DynamoDB** y S3; **notas-app-usuarios** gestiona las cuentas y los procesos de limpieza con **Lambda**, **Cognito** y **EventBridge**; y **notas-app-notifications** consume mensajes de **SQS** y envía auditorías mediante **SES**. El mailer ya no genera un correo por cada nota creada: ahora envía resúmenes útiles cuando expira un invitado y durante la limpieza semanal de usuarios reales. Los servicios se comunican mediante los eventos InvitadoEliminado y UsuarioParaLimpieza publicados en **EventBridge**, y cada repositorio cuenta con su propio despliegue automatizado mediante **GitHub Actions**.',
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
    titulo: 'Pruebas la app sin registrarte',
    descripcion:
      'No necesitas entregar datos personales ni crear una cuenta manualmente.',
  },
  {
    numero: 2,
    titulo: 'Recibes una cuenta temporal',
    descripcion:
      'La aplicación genera automáticamente un email y una contraseña para tu sesión.',
  },
  {
    numero: 3,
    titulo: 'Inicias sesión al instante',
    descripcion:
      'Puedes copiar las credenciales para volver a entrar mientras la cuenta siga activa.',
  },
  {
    numero: 4,
    titulo: 'Usas la app con normalidad',
    descripcion:
      'Puedes crear, editar y eliminar hasta 20 notas, además de descargarlas en PDF.',
  },
  {
    numero: 5,
    titulo: 'La cuenta expira después de 24 horas',
    descripcion:
      'El sistema revisa las cuentas cada hora. Cuando la tuya vence, envía un resumen de auditoría de las notas activas y luego elimina la cuenta y todas sus notas.',
  },
]
