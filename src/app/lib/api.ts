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
  images?: string[];
  price: number;
  stock: number;
  status: 'active' | 'out_of_stock';
  orderCount?: number;
  unitsSold?: number;
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
      images: product.images,
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
  if (updates.images !== undefined) body.images = updates.images;
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

// ---------------------------------------------------------------------------
// Image uploads (multipart — let the browser set the multipart boundary)
// ---------------------------------------------------------------------------

export async function uploadImagesApi(files: File[]): Promise<string[]> {
  const token = getToken();
  const form = new FormData();
  files.forEach((file) => form.append('files', file));

  const response = await fetch(`${API_URL}/api/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(data.message ?? 'Upload failed', response.status);
  }

  const data = (await response.json()) as { urls: string[] };
  return data.urls;
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export interface CategoryDto {
  id: string;
  name: string;
  createdAt: string;
}

export async function fetchCategoriesApi(): Promise<CategoryDto[]> {
  const data = await apiFetch<{ categories: CategoryDto[] }>('/api/categories');
  return data.categories;
}

export async function createCategoryApi(name: string): Promise<CategoryDto> {
  const data = await apiFetch<{ category: CategoryDto }>('/api/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return data.category;
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export type CustomerTier = 'new' | 'regular' | 'vip';

export interface CustomerDto {
  id: string;
  businessId: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  city?: string;
  tier: CustomerTier;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  phoneNumber: string;
  email?: string;
  city?: string;
  tier?: CustomerTier;
}

export async function fetchCustomersApi(): Promise<CustomerDto[]> {
  const data = await apiFetch<{ customers: CustomerDto[] }>('/api/customers');
  return data.customers;
}

export async function createCustomerApi(input: CustomerInput): Promise<CustomerDto> {
  const data = await apiFetch<{ customer: CustomerDto }>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.customer;
}

export async function updateCustomerApi(
  id: string,
  updates: Partial<CustomerInput>,
): Promise<CustomerDto> {
  const data = await apiFetch<{ customer: CustomerDto }>(`/api/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return data.customer;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type OrderStatus = 'new' | 'confirmed' | 'dispatched' | 'delivered';

export interface OrderItemDto {
  id: string;
  productId?: string;
  productName: string;
  qty: number;
  price: number;
}

export interface OrderDto {
  id: string;
  businessId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress?: string;
  city?: string;
  product?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemDto[];
}

export interface CreateOrderInput {
  customerId: string;
  items: { productId?: string; productName: string; qty: number; price: number }[];
  deliveryAddress?: string;
  city?: string;
  status?: OrderStatus;
}

export async function fetchOrdersApi(): Promise<OrderDto[]> {
  const data = await apiFetch<{ orders: OrderDto[] }>('/api/orders');
  return data.orders;
}

export async function createOrderApi(input: CreateOrderInput): Promise<OrderDto> {
  const data = await apiFetch<{ order: OrderDto }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.order;
}

export async function updateOrderStatusApi(id: string, status: OrderStatus): Promise<OrderDto> {
  const data = await apiFetch<{ order: OrderDto }>(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data.order;
}

// ---------------------------------------------------------------------------
// Conversations / messages
// ---------------------------------------------------------------------------

export type ConversationStatus = 'active' | 'pending' | 'resolved';
export type SenderType = 'customer' | 'ai' | 'agent';

export interface ConversationDto {
  id: string;
  businessId: string;
  customerId: string;
  customerName?: string;
  customerPhone: string;
  status: ConversationStatus;
  unreadCount: number;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderType: SenderType;
  content: string;
  isCustomReply: boolean;
  createdAt: string;
}

export async function fetchConversationsApi(): Promise<ConversationDto[]> {
  const data = await apiFetch<{ conversations: ConversationDto[] }>('/api/conversations');
  return data.conversations;
}

export async function getOrCreateConversationApi(customerId: string): Promise<ConversationDto> {
  const data = await apiFetch<{ conversation: ConversationDto }>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ customerId }),
  });
  return data.conversation;
}

export async function fetchMessagesApi(conversationId: string): Promise<MessageDto[]> {
  const data = await apiFetch<{ messages: MessageDto[] }>(
    `/api/conversations/${conversationId}/messages`,
  );
  return data.messages;
}

export async function sendMessageApi(conversationId: string, content: string): Promise<MessageDto> {
  const data = await apiFetch<{ message: MessageDto }>(
    `/api/conversations/${conversationId}/messages`,
    { method: 'POST', body: JSON.stringify({ content }) },
  );
  return data.message;
}

export async function markConversationReadApi(conversationId: string): Promise<ConversationDto> {
  const data = await apiFetch<{ conversation: ConversationDto }>(
    `/api/conversations/${conversationId}/read`,
    { method: 'PATCH' },
  );
  return data.conversation;
}

export async function updateConversationStatusApi(
  conversationId: string,
  status: ConversationStatus,
): Promise<ConversationDto> {
  const data = await apiFetch<{ conversation: ConversationDto }>(
    `/api/conversations/${conversationId}/status`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
  );
  return data.conversation;
}
