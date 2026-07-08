import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  createCategoryApi,
  createCustomerApi,
  createOrderApi,
  createProductApi,
  deleteProductApi,
  fetchCategoriesApi,
  fetchConversationsApi,
  fetchCustomersApi,
  fetchMessagesApi,
  fetchOrdersApi,
  fetchProductsApi,
  formatProductPrice,
  getOrCreateConversationApi,
  markConversationReadApi,
  sendMessageApi,
  updateConversationStatusApi,
  updateCustomerApi,
  updateOrderStatusApi,
  updateProductApi,
  type CategoryDto,
  type ConversationDto,
  type CreateOrderInput,
  type CustomerDto,
  type CustomerInput,
  type CustomerTier,
  type MessageDto,
  type OrderDto,
  type OrderStatus,
  type ProductDto,
} from '../lib/api';

// ---------------------------------------------------------------------------
// Types (frontend view models — all backed by the real API now)
// ---------------------------------------------------------------------------

export interface OrderItem {
  productId?: string;
  productName: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  ref: string;
  customerId: string;
  customer: string;
  phone: string;
  product: string;
  amount: string;
  amountValue: number;
  status: OrderStatus;
  date: string;
  createdAt: string;
  address: string;
  city: string;
  items: OrderItem[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  stock: number;
  category: string;
  status: 'active' | 'out_of_stock';
  description?: string;
  image?: string;
  images?: string[];
  orderCount: number;
  unitsSold: number;
  variants?: {
    colors?: string[];
    sizes?: string[];
    storage?: string[];
  };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  totalSpent: string;
  totalSpentValue: number;
  tier: CustomerTier;
}

export interface Chat {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'active' | 'pending' | 'resolved';
  lastMessageAt?: string;
}

export interface ChatMessage {
  id: string;
  from: 'customer' | 'ai' | 'agent';
  text: string;
  time: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

function relTime(iso?: string): string {
  if (!iso) return '';
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return '';
  }
}

function toProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: formatProductPrice(dto.price),
    priceValue: dto.price,
    stock: dto.stock,
    category: dto.category,
    status: dto.status,
    description: dto.description,
    image: dto.image,
    images: dto.images,
    orderCount: dto.orderCount ?? 0,
    unitsSold: dto.unitsSold ?? 0,
    variants: dto.variants,
  };
}

function toOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    ref: `#${dto.id.slice(0, 6).toUpperCase()}`,
    customerId: dto.customerId,
    customer: dto.customerName ?? 'Unknown',
    phone: dto.customerPhone ?? '',
    product: dto.product ?? '—',
    amount: formatProductPrice(dto.totalAmount),
    amountValue: dto.totalAmount,
    status: dto.status,
    date: formatDate(dto.createdAt),
    createdAt: dto.createdAt,
    address: dto.deliveryAddress ?? '',
    city: dto.city ?? '',
    items:
      dto.items?.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        qty: i.qty,
        price: i.price,
      })) ?? [],
  };
}

function toCustomer(dto: CustomerDto): Customer {
  return {
    id: dto.id,
    name: dto.name ?? 'Unknown',
    phone: dto.phoneNumber,
    email: dto.email ?? '',
    city: dto.city ?? '',
    orders: dto.orderCount,
    totalSpent: formatProductPrice(dto.totalSpent),
    totalSpentValue: dto.totalSpent,
    tier: dto.tier,
  };
}

function toChat(dto: ConversationDto): Chat {
  return {
    id: dto.id,
    customerId: dto.customerId,
    name: dto.customerName ?? dto.customerPhone ?? 'Unknown',
    phone: dto.customerPhone,
    lastMessage: dto.lastMessage ?? '',
    time: relTime(dto.lastMessageAt ?? dto.createdAt),
    unread: dto.unreadCount,
    status: dto.status,
    lastMessageAt: dto.lastMessageAt,
  };
}

function toChatMessage(dto: MessageDto): ChatMessage {
  return {
    id: dto.id,
    from: dto.senderType,
    text: dto.content,
    time: new Date(dto.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: dto.createdAt,
  };
}

function toCategory(dto: CategoryDto): Category {
  return { id: dto.id, name: dto.name };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DataContextType {
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  refreshOrders: () => Promise<void>;
  addOrder: (input: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;

  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (
    product: Omit<Product, 'id' | 'price' | 'priceValue' | 'status' | 'orderCount' | 'unitsSold'> & {
      priceValue: number;
      status?: Product['status'];
    },
  ) => Promise<void>;
  updateProduct: (
    id: string,
    updates: Partial<Omit<Product, 'id' | 'price' | 'priceValue' | 'orderCount' | 'unitsSold'>> & {
      priceValue?: number;
    },
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  categories: Category[];
  refreshCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<Category>;

  customers: Customer[];
  customersLoading: boolean;
  customersError: string | null;
  refreshCustomers: () => Promise<void>;
  addCustomer: (input: CustomerInput) => Promise<Customer>;
  updateCustomer: (id: string, updates: Partial<CustomerInput>) => Promise<void>;

  chats: Chat[];
  chatsLoading: boolean;
  chatsError: string | null;
  refreshChats: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<ChatMessage[]>;
  sendChatMessage: (conversationId: string, content: string) => Promise<ChatMessage>;
  markChatRead: (conversationId: string) => Promise<void>;
  updateChatStatus: (conversationId: string, status: Chat['status']) => Promise<void>;
  getOrCreateChat: (customerId: string) => Promise<Chat>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({
  children,
  isAuthenticated,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsError, setChatsError] = useState<string | null>(null);

  // ---- Products ----------------------------------------------------------
  const refreshProducts = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      return;
    }
    setProductsLoading(true);
    setProductsError(null);
    try {
      const data = await fetchProductsApi();
      setProducts(data.map(toProduct));
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, [isAuthenticated]);

  const addProduct: DataContextType['addProduct'] = async (product) => {
    const created = await createProductApi({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      images: product.images,
      price: product.priceValue,
      stock: product.stock,
      status: product.status,
      variants: product.variants,
    });
    setProducts((prev) => [toProduct(created), ...prev]);
  };

  const updateProduct: DataContextType['updateProduct'] = async (id, updates) => {
    const updated = await updateProductApi(id, {
      name: updates.name,
      category: updates.category,
      description: updates.description,
      image: updates.image,
      images: updates.images,
      price: updates.priceValue,
      stock: updates.stock,
      status: updates.status,
      variants: updates.variants,
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? toProduct(updated) : p)));
  };

  const deleteProduct = async (id: string) => {
    await deleteProductApi(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---- Categories --------------------------------------------------------
  const refreshCategories = useCallback(async () => {
    if (!isAuthenticated) {
      setCategories([]);
      return;
    }
    try {
      const data = await fetchCategoriesApi();
      setCategories(data.map(toCategory));
    } catch {
      setCategories([]);
    }
  }, [isAuthenticated]);

  const addCategory = async (name: string): Promise<Category> => {
    const created = toCategory(await createCategoryApi(name));
    setCategories((prev) => (prev.some((c) => c.id === created.id) ? prev : [...prev, created]));
    return created;
  };

  // ---- Customers ---------------------------------------------------------
  const refreshCustomers = useCallback(async () => {
    if (!isAuthenticated) {
      setCustomers([]);
      return;
    }
    setCustomersLoading(true);
    setCustomersError(null);
    try {
      const data = await fetchCustomersApi();
      setCustomers(data.map(toCustomer));
    } catch (error) {
      setCustomersError(error instanceof Error ? error.message : 'Failed to load customers');
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  }, [isAuthenticated]);

  const addCustomer = async (input: CustomerInput): Promise<Customer> => {
    const created = toCustomer(await createCustomerApi(input));
    setCustomers((prev) => [...prev, created]);
    return created;
  };

  const updateCustomer = async (id: string, updates: Partial<CustomerInput>) => {
    const updated = toCustomer(await updateCustomerApi(id, updates));
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  // ---- Orders ------------------------------------------------------------
  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await fetchOrdersApi();
      setOrders(data.map(toOrder));
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : 'Failed to load orders');
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [isAuthenticated]);

  const addOrder = async (input: CreateOrderInput): Promise<Order> => {
    const created = toOrder(await createOrderApi(input));
    setOrders((prev) => [created, ...prev]);
    // Order counts / totals for the customer changed.
    void refreshCustomers();
    return created;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const updated = toOrder(await updateOrderStatusApi(id, status));
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
  };

  // ---- Chats / conversations --------------------------------------------
  const refreshChats = useCallback(async () => {
    if (!isAuthenticated) {
      setChats([]);
      return;
    }
    setChatsLoading(true);
    setChatsError(null);
    try {
      const data = await fetchConversationsApi();
      setChats(data.map(toChat));
    } catch (error) {
      setChatsError(error instanceof Error ? error.message : 'Failed to load chats');
      setChats([]);
    } finally {
      setChatsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    const data = await fetchMessagesApi(conversationId);
    return data.map(toChatMessage);
  };

  const sendChatMessage = async (conversationId: string, content: string): Promise<ChatMessage> => {
    const msg = toChatMessage(await sendMessageApi(conversationId, content));
    setChats((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: content, time: relTime(msg.createdAt), lastMessageAt: msg.createdAt }
          : c,
      ),
    );
    return msg;
  };

  const markChatRead = async (conversationId: string) => {
    setChats((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)));
    try {
      await markConversationReadApi(conversationId);
    } catch {
      // non-fatal; the badge will re-sync on next refresh
    }
  };

  const updateChatStatus = async (conversationId: string, status: Chat['status']) => {
    setChats((prev) => prev.map((c) => (c.id === conversationId ? { ...c, status } : c)));
    await updateConversationStatusApi(conversationId, status);
  };

  const getOrCreateChat = async (customerId: string): Promise<Chat> => {
    const chat = toChat(await getOrCreateConversationApi(customerId));
    setChats((prev) => (prev.some((c) => c.id === chat.id) ? prev : [chat, ...prev]));
    return chat;
  };

  useEffect(() => {
    void refreshProducts();
    void refreshCategories();
    void refreshCustomers();
    void refreshOrders();
    void refreshChats();
  }, [refreshProducts, refreshCategories, refreshCustomers, refreshOrders, refreshChats]);

  return (
    <DataContext.Provider
      value={{
        orders,
        ordersLoading,
        ordersError,
        refreshOrders,
        addOrder,
        updateOrderStatus,
        products,
        productsLoading,
        productsError,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        refreshCategories,
        addCategory,
        customers,
        customersLoading,
        customersError,
        refreshCustomers,
        addCustomer,
        updateCustomer,
        chats,
        chatsLoading,
        chatsError,
        refreshChats,
        fetchMessages,
        sendChatMessage,
        markChatRead,
        updateChatStatus,
        getOrCreateChat,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
