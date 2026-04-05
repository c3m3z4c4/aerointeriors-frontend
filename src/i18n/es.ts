import type { Translations } from './en'

export const es: Translations = {
  nav: { services: 'Servicios', projects: 'Proyectos', certifications: 'Certificaciones', team: 'Equipo', contact: 'Contacto', requestQuote: 'Cotizar' },
  hero: { scrollDown: 'Desplazar' },
  services: { sectionLabel: 'Lo Que Hacemos' },
  projects: {
    sectionLabel: 'Portafolio', filterAll: 'Todos', filterCompletions: 'Completaciones',
    filterRefurb: 'Renovación', filterVip: 'VIP', filterMilitary: 'Militar', filterCargo: 'Carga',
    featured: 'Destacado', aircraft: 'Aeronave', client: 'Cliente', year: 'Año', tags: 'Etiquetas',
  },
  certifications: {
    sectionLabel: 'Credenciales', showMore: 'Ver Más', showLess: 'Ver Menos',
    issued: 'Emitido', viewCredential: 'Ver Credencial',
  },
  team: { sectionLabel: 'Los Expertos', viewLinkedIn: 'Perfil LinkedIn' },
  contact: {
    sectionLabel: 'Contáctanos',
    namePlaceholder: 'Nombre Completo *', companyPlaceholder: 'Empresa',
    emailPlaceholder: 'Correo Electrónico *', phonePlaceholder: 'Teléfono',
    aircraftPlaceholder: 'Modelo de Aeronave', serviceLabel: 'Tipo de Servicio',
    selectService: 'Selecciona un servicio...', messagePlaceholder: 'Cuéntanos sobre tu proyecto *',
    submit: 'Enviar Mensaje', sending: 'Enviando...',
    successTitle: '¡Mensaje Enviado!', successMsg: 'Te responderemos en menos de 24 horas.',
    errorMsg: 'Error al enviar. Por favor intenta de nuevo.',
    required: 'Este campo es requerido', invalidEmail: 'Correo electrónico inválido',
  },
  footer: {
    quickLinks: 'Accesos Rápidos', followUs: 'Síguenos',
    allRights: 'Todos los derechos reservados.', builtWith: 'Construido con', builtFor: 'para la industria de aviación',
  },
  admin: {
    login: { title: 'Acceso Admin', subtitle: 'Aircraft Interiors Solutions', email: 'Correo', password: 'Contraseña', submit: 'Iniciar Sesión', error: 'Credenciales inválidas' },
    dashboard: { title: 'Panel', projects: 'Proyectos', messages: 'Mensajes', downloads: 'Descargas', services: 'Servicios', team: 'Equipo', unread: 'No leídos' },
    common: {
      add: 'Agregar', edit: 'Editar', delete: 'Eliminar', save: 'Guardar', cancel: 'Cancelar',
      visible: 'Visible', hidden: 'Oculto', dragToReorder: 'Arrastrar para reordenar',
      confirmDelete: '¿Estás seguro?', saved: 'Guardado', deleted: 'Eliminado', error: 'Algo salió mal',
    },
  },
}
