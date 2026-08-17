import { useRef, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Edit, Trash2, Package, Loader2, X, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useData, type Product } from '../../context/DataContext';
import { uploadImagesApi } from '../../lib/api';

interface ProductFormState {
  name: string;
  category: string;
  priceValue: string;
  stock: string;
  description: string;
  images: string[];
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
  images: [],
  colors: '',
  sizes: '',
  storage: '',
};

const MAX_IMAGES = 5;

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
    images: product.images ?? (product.image ? [product.image] : []),
    colors: product.variants?.colors?.join(', ') ?? '',
    sizes: product.variants?.sizes?.join(', ') ?? '',
    storage: product.variants?.storage?.join(', ') ?? '',
  };
}

interface AdminProductsProps {
  // business_employee can create/edit products but not delete them
  // (backend already 403s the DELETE call; this just hides the button).
  canDelete?: boolean;
}

export function AdminProducts({ canDelete = true }: AdminProductsProps) {
  const {
    products,
    productsLoading,
    productsError,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
  } = useData();
  const [search, setSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
    );
  });

  const openAddDialog = () => {
    setForm(emptyForm);
    setFormError(null);
    setShowAddCategory(false);
    setShowAddProduct(true);
  };

  const openEditDialog = (product: Product) => {
    setForm(productToForm(product));
    setFormError(null);
    setShowAddCategory(false);
    setSelectedProduct(product);
  };

  const closeDialog = () => {
    setShowAddProduct(false);
    setSelectedProduct(null);
    setForm(emptyForm);
    setFormError(null);
    setShowAddCategory(false);
    setNewCategory('');
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) {
      setFormError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    setFormError(null);
    try {
      const urls = await uploadImagesApi(toUpload);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, MAX_IMAGES) }));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));
  };

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    setAddingCategory(true);
    try {
      const created = await addCategory(name);
      setForm((prev) => ({ ...prev, category: created.name }));
      setNewCategory('');
      setShowAddCategory(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
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
        image: form.images[0],
        images: form.images,
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

  // Ensure the product's own category is always selectable even if not in the list.
  const categoryOptions = Array.from(
    new Set([...categories.map((c) => c.name), form.category].filter(Boolean)),
  );

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
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{productsError}</div>
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
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="py-3 px-4 text-sm font-medium">Product</th>
                  <th className="py-3 px-4 text-sm font-medium">Category</th>
                  <th className="py-3 px-4 text-sm font-medium">Price</th>
                  <th className="py-3 px-4 text-sm font-medium">Stock</th>
                  <th className="py-3 px-4 text-sm font-medium">Status</th>
                  <th className="py-3 px-4 text-sm font-medium">Orders</th>
                  <th className="py-3 px-4 text-sm font-medium">Units Sold</th>
                  <th className="py-3 px-4 text-sm font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground opacity-50" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{product.category}</td>
                    <td className="py-3 px-4 text-sm">{product.price}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={product.stock === 0 ? 'text-destructive' : ''}>{product.stock}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={product.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                        {product.status === 'active' ? 'Active' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{product.orderCount}</td>
                    <td className="py-3 px-4 text-sm">{product.unitsSold}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditDialog(product)}
                          className="p-2 bg-secondary rounded-lg hover:bg-accent"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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
                <div className="flex items-center justify-between">
                  <Label className="text-sm md:text-base">Category</Label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory((v) => !v)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Category
                  </button>
                </div>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm md:text-base"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {showAddCategory && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="New category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          void handleAddCategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => void handleAddCategory()}
                      disabled={addingCategory || !newCategory.trim()}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"
                    >
                      {addingCategory && <Loader2 className="w-3 h-3 animate-spin" />}
                      Save
                    </button>
                  </div>
                )}
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
                <Label className="text-sm md:text-base">Images (up to {MAX_IMAGES}, from your device)</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.images.map((url) => (
                    <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border group">
                      <img src={url} alt="product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-20 h-20 rounded-lg border border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent gap-1 disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span className="text-[10px]">Upload</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelected}
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

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <button
                onClick={() => void handleSubmit()}
                disabled={saving || uploading}
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
