import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Edit, Trash2, Package, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useData, type Product } from '../../context/DataContext';

interface ProductFormState {
  name: string;
  category: string;
  priceValue: string;
  stock: string;
  description: string;
  image: string;
  colors: string;
  sizes: string;
  storage: string;
}

const emptyForm: ProductFormState = {
  name: '',
  category: '',
  priceValue: '',
  stock: '0',
  description: '',
  image: '',
  colors: '',
  sizes: '',
  storage: '',
};

function parseCommaList(value: string): string[] | undefined {
  const items = value.split(',').map((item) => item.trim()).filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function productToForm(product: Product): ProductFormState {
  return {
    name: product.name,
    category: product.category,
    priceValue: String(product.priceValue),
    stock: String(product.stock),
    description: product.description ?? '',
    image: product.image ?? '',
    colors: product.variants?.colors?.join(', ') ?? '',
    sizes: product.variants?.sizes?.join(', ') ?? '',
    storage: product.variants?.storage?.join(', ') ?? '',
  };
}

export function AdminProducts() {
  const { products, productsLoading, productsError, addProduct, updateProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const openAddDialog = () => {
    setForm(emptyForm);
    setFormError(null);
    setShowAddProduct(true);
  };

  const openEditDialog = (product: Product) => {
    setForm(productToForm(product));
    setFormError(null);
    setSelectedProduct(product);
  };

  const closeDialog = () => {
    setShowAddProduct(false);
    setSelectedProduct(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async () => {
    const priceValue = Number(form.priceValue);
    const stock = Number(form.stock);

    if (!form.name.trim() || !form.category.trim()) {
      setFormError('Name and category are required');
      return;
    }
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setFormError('Enter a valid price');
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setFormError('Enter a valid stock quantity');
      return;
    }

    const variants = {
      colors: parseCommaList(form.colors),
      sizes: parseCommaList(form.sizes),
      storage: parseCommaList(form.storage),
    };
    const hasVariants = variants.colors || variants.sizes || variants.storage;

    setSaving(true);
    setFormError(null);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        priceValue,
        stock,
        description: form.description.trim() || undefined,
        image: form.image.trim() || undefined,
        variants: hasVariants ? variants : undefined,
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      closeDialog();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={openAddDialog}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {productsError && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {productsError}
        </div>
      )}

      {productsLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg mb-2">No products yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Add your first product to start selling through WhatsApp.
          </p>
          <button
            onClick={openAddDialog}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-0 overflow-hidden">
              {product.image ? (
                <div className="w-full h-48 bg-muted relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground opacity-50" />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
                  </div>
                  <Badge variant={product.status === 'active' ? 'default' : 'destructive'}>
                    {product.status === 'active' ? 'Active' : 'Out of Stock'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span>{product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Stock</span>
                    <span className={product.stock === 0 ? 'text-destructive' : ''}>
                      {product.stock} units
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEditDialog(product)}
                    className="flex-1 px-3 py-2 bg-secondary rounded-lg hover:bg-accent flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {(showAddProduct || selectedProduct) && (
        <Dialog open={showAddProduct || !!selectedProduct} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-full sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 md:space-y-4">
              <div>
                <Label className="text-sm md:text-base">Product Name</Label>
                <Input
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Category</Label>
                <Input
                  placeholder="Enter category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 text-sm md:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label className="text-sm md:text-base">Price (PKR)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.priceValue}
                    onChange={(e) => setForm({ ...form, priceValue: e.target.value })}
                    className="mt-1 text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label className="text-sm md:text-base">Stock</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="mt-1 text-sm md:text-base"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm md:text-base">Image URL (optional)</Label>
                <Input
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="mt-1 text-sm md:text-base"
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Description</Label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-lg bg-input-background min-h-[100px] text-sm md:text-base"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="border-t pt-3 md:pt-4">
                <h4 className="mb-2 md:mb-3 text-sm md:text-base">Product Variants (Optional)</h4>
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <Label className="text-sm md:text-base">Colors</Label>
                    <Input
                      placeholder="e.g., Black, White, Blue"
                      value={form.colors}
                      onChange={(e) => setForm({ ...form, colors: e.target.value })}
                      className="mt-1 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm md:text-base">Sizes</Label>
                    <Input
                      placeholder="e.g., Small, Medium, Large"
                      value={form.sizes}
                      onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                      className="mt-1 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm md:text-base">Storage / Other</Label>
                    <Input
                      placeholder="e.g., 128GB, 256GB"
                      value={form.storage}
                      onChange={(e) => setForm({ ...form, storage: e.target.value })}
                      className="mt-1 text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <button
                onClick={() => void handleSubmit()}
                disabled={saving}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
