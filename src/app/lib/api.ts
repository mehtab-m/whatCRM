const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(data.message ?? 'Request failed', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export interface AuthUser {
  email: string;
  fullName: string;
  role: 'crm_owner' | 'business_owner' | 'business_employee';
  businessName?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(data: {
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  phone?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface ProductDto {
  id: string;
  name: string;
  category: string;
  description?: string;
  image?: string;
  price: number;
  stock: number;
  status: 'active' | 'out_of_stock';
  variants?: {
    colors?: string[];
    sizes?: string[];
    storage?: string[];
  };
}

export function formatProductPrice(price: number): string {
  return `PKR ${price.toLocaleString('en-PK')}`;
}

export async function fetchProductsApi(): Promise<ProductDto[]> {
  const data = await apiFetch<{ products: ProductDto[] }>('/api/products');
  return data.products;
}

export async function createProductApi(
  product: Omit<ProductDto, 'id' | 'status'> & { status?: ProductDto['status'] },
): Promise<ProductDto> {
  const data = await apiFetch<{ product: ProductDto }>('/api/products', {
    method: 'POST',
    body: JSON.stringify({
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.image,
      price: product.price,
      stock: product.stock,
      status: product.status,
      variants: product.variants,
    }),
  });
  return data.product;
}

export async function updateProductApi(
  id: string,
  updates: Partial<Omit<ProductDto, 'id'>>,
): Promise<ProductDto> {
  const body: Record<string, unknown> = {};
  if (updates.name !== undefined) body.name = updates.name;
  if (updates.category !== undefined) body.category = updates.category;
  if (updates.description !== undefined) body.description = updates.description;
  if (updates.image !== undefined) body.imageUrl = updates.image;
  if (updates.price !== undefined) body.price = updates.price;
  if (updates.stock !== undefined) body.stock = updates.stock;
  if (updates.status !== undefined) body.status = updates.status;
  if (updates.variants !== undefined) body.variants = updates.variants;

  const data = await apiFetch<{ product: ProductDto }>(`/api/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return data.product;
}

export async function deleteProductApi(id: string): Promise<void> {
  await apiFetch<void>(`/api/products/${id}`, { method: 'DELETE' });
}
