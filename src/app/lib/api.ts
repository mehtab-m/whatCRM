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

export async function getMeApi(): Promise<AuthUser> {
  const data = await apiFetch<{ user: AuthUser }>('/api/auth/me');
  return data.user;
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

export async function changePasswordApi(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmPassword,
    }),
  });
}

export async function forgotPasswordApi(
  email: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyResetOtpApi(
  email: string,
  otp: string,
): Promise<{ resetToken: string }> {
  return apiFetch<{ resetToken: string }>('/api/auth/verify-reset-otp', {
    method: 'POST',
    body: JSON.stringify({
      email,
      otp,
    }),
  });
}

export async function resetPasswordApi(
  resetToken: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({
      resetToken,
      newPassword,
      confirmPassword,
    }),
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
  mode: 'auto' | 'manual' | 'assist';
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

export type ConversationMode = 'auto' | 'manual' | 'assist';

export async function updateConversationModeApi(
  conversationId: string,
  mode: ConversationMode,
): Promise<ConversationDto> {
  const data = await apiFetch<{ conversation: ConversationDto }>(
    `/api/conversations/${conversationId}/mode`,
    { method: 'PATCH', body: JSON.stringify({ mode }) },
  );
  return data.conversation;
}

// ---------------------------------------------------------------------------
// Business settings
// ---------------------------------------------------------------------------

export interface BusinessSettingsDto {
  id: string;
  name: string;
  whatsappPhoneNumberId?: string;
  whatsappAccessToken?: string;
  whatsappBusinessAccountId?: string;
  notifyEmail?: string;
  aiInstructions?: string;
  aiAutoReplyEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBusinessSettingsInput {
  name?: string;
  whatsappPhoneNumberId?: string;
  whatsappAccessToken?: string;
  whatsappBusinessAccountId?: string;
  notifyEmail?: string;
  aiInstructions?: string;
  aiAutoReplyEnabled?: boolean;
}

export async function fetchBusinessSettingsApi(): Promise<BusinessSettingsDto> {
  const data = await apiFetch<{ business: BusinessSettingsDto }>('/api/businesses/settings');
  return data.business;
}

export async function updateBusinessSettingsApi(
  input: UpdateBusinessSettingsInput,
): Promise<BusinessSettingsDto> {
  const data = await apiFetch<{ business: BusinessSettingsDto }>('/api/businesses/settings', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return data.business;
}

export interface WhatsappConnectionTestResult {
  connected: boolean;
  displayPhoneNumber?: string;
  verifiedName?: string;
  error?: string;
}

export async function testWhatsappConnectionApi(): Promise<WhatsappConnectionTestResult> {
  return apiFetch<WhatsappConnectionTestResult>('/api/businesses/settings/test-whatsapp');
}

// ---------------------------------------------------------------------------
// Team members
// ---------------------------------------------------------------------------

export interface TeamMemberDto {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'business_employee';
  isActive: boolean;
  createdAt: string;
}

export interface CreateTeamMemberInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export async function fetchTeamMembersApi(): Promise<TeamMemberDto[]> {
  const data = await apiFetch<{ members: TeamMemberDto[] }>('/api/team');
  return data.members;
}

export async function createTeamMemberApi(input: CreateTeamMemberInput): Promise<TeamMemberDto> {
  const data = await apiFetch<{ member: TeamMemberDto }>('/api/team', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.member;
}

export async function deleteTeamMemberApi(id: string): Promise<void> {
  await apiFetch<void>(`/api/team/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// CRM owner (superadmin) - platform-wide stats
// ---------------------------------------------------------------------------

export interface PlatformStatsDto {
  totalBusinesses: number;
  totalUsers: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface BusinessOverviewDto {
  id: string;
  name: string;
  userCount: number;
  customerCount: number;
  orderCount: number;
  revenue: number;
  createdAt: string;
}

export async function fetchPlatformStatsApi(): Promise<PlatformStatsDto> {
  return apiFetch<PlatformStatsDto>('/api/crm-owner/stats');
}

export async function fetchBusinessOverviewsApi(): Promise<BusinessOverviewDto[]> {
  const data = await apiFetch<{ businesses: BusinessOverviewDto[] }>('/api/crm-owner/businesses');
  return data.businesses;
}
