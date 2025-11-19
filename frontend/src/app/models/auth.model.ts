export interface Usuario {
  id: number;
  nombre: string;
  mail: string;
  rol: 'ADMIN' | 'EMPLEADO';
}

export interface LoginRequest {
  mail: string;
  contraseña: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    usuario: Usuario;
  };
}

export interface RegisterRequest {
  nombre_completo: string;
  mail: string;
  contraseña: string;
  rol: 'ADMIN' | 'EMPLEADO';
}
