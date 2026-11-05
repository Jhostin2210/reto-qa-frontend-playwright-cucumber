export interface Credenciales {
  username: string;
  password: string;
}

const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

/** Usuarios de prueba provistos por el reto. */
export const usuarios: Record<string, Credenciales> = {
  standard_user: { username: 'standard_user', password: PASSWORD },
  locked_out_user: { username: 'locked_out_user', password: PASSWORD }
};

export function obtenerUsuario(tipo: string): Credenciales {
  const usuario = usuarios[tipo];
  if (!usuario) {
    throw new Error(`Usuario "${tipo}" no definido. Disponibles: ${Object.keys(usuarios).join(', ')}`);
  }
  return usuario;
}
