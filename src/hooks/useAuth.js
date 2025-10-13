import { useAuth as useAuthContext } from '../contextos/ContextoAuth';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Re-exporta el hook del contexto para facilitar su uso
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
