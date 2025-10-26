import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../Pages/Login';
import { ProveedorAuth } from '../../contextos/ContextoAuth';
// Mock de la función de login (puedes mockear el contexto o el fetch)
vi.mock('../../services/api', () => ({
    authAPI: {
        login: vi.fn(() => Promise.resolve({
            token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InVzZXJzLXJzMjU2LXYxIiwidHlwIjoiSldUIn0.eyJzdWIiOiJjbGFxdWV0YV9jcml0aWNhIiwidXNlcl9pZCI6MiwibmFtZSI6IkFndXN0aW4iLCJsYXN0X25hbWUiOiJUb3JyZXMiLCJlbWFpbCI6ImNsYXJhLmNyaXRpY2FAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpbWFnZV91cmwiOiJodHRwczovL2V4YW1wbGUuY29tL3Byb2ZpbGVzL2FndXN0b3JyZXMuanBnIiwicGVybWlzc2lvbnMiOlsiY3JlYXRlX3VzZXIiLCJlZGl0X3VzZXIiLCJkZWxldGVfdXNlciIsInZpZXdfdXNlciIsImNyZWF0ZV9tb3ZpZSIsImVkaXRfbW92aWUiLCJkZWxldGVfbW92aWUiLCJlZGl0X2NvbW1lbnQiLCJkZWxldGVfY29tbWVudCJdLCJpc19hY3RpdmUiOnRydWUsImZ1bGxfbmFtZSI6IkFndXN0aW4gVG9ycmVzIiwiZXhwIjoxNzYxNDgzNTE5fQ.j_MCU80Y83YA_v-VxeoGyyqgQNnEWya0g1qyX5eQ18fkv9tNDqob6xSF5TNoETUN8ZJneM9wYJEAY6i5AIyeeS4dJzvcpJ8ROlp8-iQurFFT3LF1LsIqNBx-DOd8xOWAVcN5Dx26Zm-AXaMWyh1MaIkDnngMk1qy2-fNsrpayyQztoIZ6bSyKUvAbvCnpYjMjheMesaCiWLJImvGdJY7qLepWQNeLZKstMsjnmD1ePAbWiAptAQMElA_SCFeC3HS68FOFP56HJfhmOy85Oq4EfVsqmoyXaWnXVhdue_-fJNmznDUXakk4Cxu0_kWYO47rtpSp4cK9bA2zTUeC1kPjA',
            usuario: { id: 1, name: 'claqueta_critica', role: 'user' }
        }))
    }
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: null }),
        Link: actual.Link,
    };
});


describe('Login', () => {
    it('permite el login de un usuario', async () => {
        render(
            <MemoryRouter>
                <ProveedorAuth>
                    <Login />
                </ProveedorAuth>
            </MemoryRouter>
        );

        // Completa los campos
        fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'claqueta_critica' } });
        const passwordInput = screen.getByTestId('password-input');
        fireEvent.change(passwordInput, { target: { value: 'MiPassword123!' } });
        // Envía el formulario
        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        // Espera la respuesta y verifica que el usuario esté logueado
        await waitFor(() => {
            // const tituloHero = screen.getByRole('heading', { name: /Descubrí, Reseñá, Compartí/i });
            // expect(tituloHero).toBeInTheDocument();
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });

        });
    });
});