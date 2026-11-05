export interface DatosEnvio {
  nombre: string;
  apellido: string;
  codigoPostal: string;
}

/** Datos de envío válidos por defecto para el checkout. */
export const clienteValido: DatosEnvio = {
  nombre: 'Juan',
  apellido: 'Pérez',
  codigoPostal: '15001'
};
