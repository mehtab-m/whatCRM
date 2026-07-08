import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  createProductApi,
  deleteProductApi,
  fetchProductsApi,
  formatProductPrice,
  updateProductApi,
  type ProductDto,
} from '../lib/api';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'new' | 'confirmed' | 'dispatched' | 'delivered';
  date: string;
  phone: string;
  email: string;
  address: string;
  city: string;
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
  variants?: {
    colors?: string[];
    sizes?: string[];
    storage?: string[];
  };
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  totalSpent: string;
  tag: 'VIP' | 'Regular' | 'New';
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'active' | 'resolved' | 'pending';
}

interface DataContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'price' | 'priceValue' | 'status'> & { priceValue: number; status?: Product['status'] }) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'price' | 'priceValue'>> & { priceValue?: number }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;

  chats: Chat[];
  updateChatStatus: (id: number, status: Chat['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

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
    variants: dto.variants,
  };
}

const initialOrders: Order[] = [
  {
    id: '#1001',
    customer: 'Rahul Kumar',
    product: 'iPhone 15 Pro',
    amount: 'PKR 129,999',
    status: 'new',
    date: '2026-04-25',
    phone: '+92 300 1234567',
    email: 'rahul@example.com',
    address: 'House 123, Street 45, Block A',
    city: 'Karachi'
  },
  {
    id: '#1002',
    customer: 'Priya Sharma',
    product: 'Samsung TV',
    amount: 'PKR 45,000',
    status: 'confirmed',
    date: '2026-04-25',
    phone: '+92 301 2345678',
    email: 'priya@example.com',
    address: 'Flat 567, Garden Town',
    city: 'Lahore'
  },
  {
    id: '#1003',
    customer: 'Amit Patel',
    product: 'MacBook Pro',
    amount: 'PKR 189,000',
    status: 'dispatched',
    date: '2026-04-24',
    phone: '+92 302 3456789',
    email: 'amit@example.com',
    address: 'Plot 890, F-7 Markaz',
    city: 'Islamabad'
  },
  {
    id: '#1004',
    customer: 'Neha Gupta',
    product: 'AirPods Pro',
    amount: 'PKR 24,900',
    status: 'delivered',
    date: '2026-04-23',
    phone: '+92 303 4567890',
    email: 'neha@example.com',
    address: 'House 234, Canal Road',
    city: 'Faisalabad'
  },
  {
    id: '#1005',
    customer: 'Vikram Singh',
    product: 'iPad Air',
    amount: 'PKR 59,900',
    status: 'new',
    date: '2026-04-25',
    phone: '+92 304 5678901',
    email: 'vikram@example.com',
    address: 'Shop 12, Main Bazaar',
    city: 'Multan'
  },
];

const initialCustomers: Customer[] = [
  { id: 1, name: 'Rahul Kumar', phone: '+92 300 1234567', email: 'rahul@example.com', city: 'Karachi', orders: 12, totalSpent: 'PKR 245,000', tag: 'VIP' },
  { id: 2, name: 'Priya Sharma', phone: '+92 301 2345678', email: 'priya@example.com', city: 'Lahore', orders: 8, totalSpent: 'PKR 120,000', tag: 'Regular' },
  { id: 3, name: 'Amit Patel', phone: '+92 302 3456789', email: 'amit@example.com', city: 'Islamabad', orders: 15, totalSpent: 'PKR 380,000', tag: 'VIP' },
  { id: 4, name: 'Neha Gupta', phone: '+92 303 4567890', email: 'neha@example.com', city: 'Faisalabad', orders: 5, totalSpent: 'PKR 65,000', tag: 'Regular' },
  { id: 5, name: 'Vikram Singh', phone: '+92 304 5678901', email: 'vikram@example.com', city: 'Multan', orders: 3, totalSpent: 'PKR 45,000', tag: 'New' },
];

const initialChats: Chat[] = [
  { id: 1, name: 'Rahul Kumar', lastMessage: 'Do you have the product in stock?', time: '2m ago', unread: 3, status: 'active' },
  { id: 2, name: 'Priya Sharma', lastMessage: 'When will my order be delivered?', time: '15m ago', unread: 1, status: 'active' },
  { id: 3, name: 'Amit Patel', lastMessage: 'Thank you!', time: '1h ago', unread: 0, status: 'resolved' },
  { id: 4, name: 'Neha Gupta', lastMessage: 'I want to place an order', time: '2h ago', unread: 2, status: 'active' },
  { id: 5, name: 'Vikram Singh', lastMessage: 'What are the prices?', time: '3h ago', unread: 0, status: 'pending' },
];

export function DataProvider({
  children,
  isAuthenticated,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [chats, setChats] = useState<Chat[]>(initialChats);

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

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  const addOrder = (order: Omit<Order, 'id'>) => {
    const newId = `#${1000 + orders.length + 1}`;
    setOrders([...orders, { ...order, id: newId }]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status } : order
    ));
  };

  const addProduct = async (
    product: Omit<Product, 'id' | 'price' | 'priceValue' | 'status'> & {
      priceValue: number;
      status?: Product['status'];
    },
  ) => {
    const created = await createProductApi({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      price: product.priceValue,
      stock: product.stock,
      status: product.status,
      variants: product.variants,
    });
    setProducts((prev) => [...prev, toProduct(created)]);
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Omit<Product, 'id' | 'price' | 'priceValue'>> & { priceValue?: number },
  ) => {
    const updated = await updateProductApi(id, {
      name: updates.name,
      category: updates.category,
      description: updates.description,
      image: updates.image,
      price: updates.priceValue,
      stock: updates.stock,
      status: updates.status,
      variants: updates.variants,
    });
    setProducts((prev) => prev.map((product) => (product.id === id ? toProduct(updated) : product)));
  };

  const deleteProduct = async (id: string) => {
    await deleteProductApi(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newId = Math.max(...customers.map(c => c.id)) + 1;
    setCustomers([...customers, { ...customer, id: newId }]);
  };

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    setCustomers(customers.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const updateChatStatus = (id: number, status: Chat['status']) => {
    setChats(chats.map(chat =>
      chat.id === id ? { ...chat, status } : chat
    ));
  };

  return (
    <DataContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      products,
      productsLoading,
      productsError,
      refreshProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      customers,
      addCustomer,
      updateCustomer,
      chats,
      updateChatStatus,
    }}>
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
