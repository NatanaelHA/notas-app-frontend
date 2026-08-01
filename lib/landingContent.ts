export interface TarjetaLanding {
  titulo: string
  descripcion: string
  descripcionExtendida: string
  emoji: string
}

export const tarjetasLanding: TarjetaLanding[] = [
  {
    emoji: '📝',
    titulo: 'Notas App',
    descripcion: 'Una app de notas simple y rápida, construida como proyecto full-stack sobre AWS.',
    descripcionExtendida: 'Notas App es un proyecto personal construido de principio a fin para practicar arquitectura serverless real en AWS, combinado con un frontend moderno en Next.js. Permite crear, editar y eliminar notas, con soporte para modo oscuro/claro y una experiencia pensada al detalle.',
  },
  {
    emoji: '✨',
    titulo: 'Modo invitado',
    descripcion: 'Prueba la app sin registrarte. Se genera una cuenta temporal automáticamente, válida por 24 horas.',
    descripcionExtendida: 'Al hacer clic en "Probar como invitado" se crea automáticamente una cuenta de Cognito temporal, con email y contraseña generados en el momento. No necesitas registrarte con tus propios datos para explorar la app. Cada cuenta invitado tiene un límite de 20 notas.',
  },
  {
    emoji: '🧹',
    titulo: 'Limpieza automática',
    descripcion: 'Un proceso revisa las cuentas cada hora, pero solo elimina las que ya superaron las 24h — nunca las recién creadas.',
    descripcionExtendida: 'Una tarea programada (Amazon EventBridge Scheduler) se ejecuta cada hora y elimina únicamente las cuentas invitado que ya superaron las 24 horas de vida, junto con sus notas asociadas. Además, si en algún momento hay más de 50 invitados simultáneos, se elimina automáticamente el más antiguo al crear uno nuevo — así el sistema nunca crece sin control.',
  },
  {
    emoji: '⚛️',
    titulo: 'Frontend',
    descripcion: 'Next.js 16, TypeScript, Context API, hooks personalizados y animaciones con Motion.',
    descripcionExtendida: 'Construido con Next.js 16 (App Router), TypeScript y Tailwind CSS v4. El estado de las notas se maneja con Context API, separando la lógica de estado (hooks) de la presentación (componentes). Incluye hooks personalizados para efectos como el typewriter del modo invitado o el cálculo de temporizadores, además de animaciones fluidas con Motion en modales, cards y transiciones de página.',
  },
  {
    emoji: '☁️',
    titulo: 'Backend serverless',
    descripcion: 'AWS Lambda, DynamoDB, Cognito, SQS, SES y EventBridge, sin servidores que mantener.',
    descripcionExtendida: 'El backend está compuesto por 8 funciones Lambda en Node.js, expuestas mediante API Gateway. DynamoDB almacena las notas con soft delete y expiración automática (TTL). Cognito gestiona la autenticación con JWT. SQS y SES manejan notificaciones por email de forma asíncrona, y EventBridge Scheduler dispara la limpieza automática de cuentas invitado. Todo el despliegue está automatizado con GitHub Actions.',
  },
  {
    emoji: '🔒',
    titulo: 'Seguridad',
    descripcion: 'Autenticación JWT, rate limiting, límites de uso y soft delete con expiración automática.',
    descripcionExtendida: 'La API está protegida con un autorizador de Cognito basado en JWT en todas las rutas privadas. La ruta pública de creación de invitados tiene rate limiting configurado en API Gateway para prevenir abuso. Además, existen límites de uso (20 notas por cuenta, 50 invitados simultáneos) para proteger la infraestructura sin afectar la experiencia de uso normal.',
  },
]