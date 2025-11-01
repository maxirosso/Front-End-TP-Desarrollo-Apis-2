import apiService, {
  authAPI,
  reviewsAPI,
  usersAPI,
  moviesAPI,
  socialAPI,
  handleApiError,
  checkBackendHealth,
} from '../../services/api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockToken = 'mock-token';
vi.mock('../../utils/auth', () => ({
  getToken: () => mockToken,
}));

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authAPI.login', () => {
    it('devuelve token si login es exitoso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ access_token: 'abc123' }),
      });
      const res = await authAPI.login({ email: 'test@mail.com', password: '123' });
      expect(res.token).toBe('abc123');
    });

    it('lanza error si no hay token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ error: 'No token' }),
      });
      await expect(authAPI.login({ email: 'fail@mail.com', password: '123' })).rejects.toThrow();
    });

    it('lanza error si login falla', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        json: async () => ({ error: 'Unauthorized' }),
      });
      await expect(authAPI.login({ email: 'fail@mail.com', password: '123' })).rejects.toThrow();
    });
  });

  describe('reviewsAPI', () => {
    it('create envía POST y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: { get: () => 'application/json' },
        json: async () => ({ id: 1 }),
      });
      const res = await reviewsAPI.create({ titulo: 'Test' });
      expect(res.id).toBe(1);
    });

    it('getById envía GET y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ id: 2 }),
      });
      const res = await reviewsAPI.getById(2);
      expect(res.id).toBe(2);
    });

    it('delete envía DELETE y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: { get: () => 'application/json' },
        text: async () => '',
      });
      const res = await reviewsAPI.delete(3);
      expect(res).toBeNull();
    });

    it('update envía PUT y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ id: 4, titulo: 'Editado' }),
      });
      const res = await reviewsAPI.update(4, { titulo: 'Editado' });
      expect(res.titulo).toBe('Editado');
    });

    it('getAll llama filter con defaults', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ data: [1, 2] }),
      });
      const res = await reviewsAPI.getAll();
      expect(res.data).toEqual([1, 2]);
    });
  });

  describe('usersAPI', () => {
    it('getById envía GET y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ id: 5 }),
      });
      const res = await usersAPI.getById(5);
      expect(res.id).toBe(5);
    });

    it('getAll envía GET y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ([{ id: 6 }, { id: 7 }]),
      });
      const res = await usersAPI.getAll();
      expect(res[0].id).toBe(6);
    });
  });

  describe('moviesAPI', () => {
    it('getById envía GET y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ id: 8 }),
      });
      const res = await moviesAPI.getById(8);
      expect(res.id).toBe(8);
    });

    it('search envía GET y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ([{ id: 9 }]),
      });
      const res = await moviesAPI.search('matrix');
      expect(res[0].id).toBe(9);
    });
  });

  describe('socialAPI', () => {
    it('getAllLikes envía GET y devuelve respuesta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ([{ id: 10 }]),
      });
      const res = await socialAPI.getAllLikes();
      expect(res[0].id).toBe(10);
    });
  });

  describe('handleApiError', () => {
    it('devuelve mensaje para error 401', () => {
      expect(handleApiError({ status: 401 })).toMatch(/No autorizado/i);
    });
    it('devuelve mensaje para error 404', () => {
      expect(handleApiError({ status: 404 })).toMatch(/no encontrado/i);
    });
    it('devuelve mensaje para error 500', () => {
      expect(handleApiError({ status: 500 })).toMatch(/interno/i);
    });
    it('devuelve mensaje para error de conexión', () => {
      expect(handleApiError({ message: 'Failed to fetch' })).toMatch(/conexión/i);
    });
    it('devuelve mensaje genérico', () => {
      expect(handleApiError({ message: 'Otro error' })).toMatch(/Otro error/i);
    });
  });

  describe('checkBackendHealth', () => {
    it('devuelve true si el backend responde', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ([{ id: 11 }]),
      });
      const res = await checkBackendHealth();
      expect(res).toBe(true);
    });

    it('devuelve false si el backend no responde', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fail'));
      const res = await checkBackendHealth();
      expect(res).toBe(false);
    });
  });
});