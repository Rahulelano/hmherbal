import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  apiFetchProducts,
  apiFetchCategories,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiUploadImage
} from "@/lib/api";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Loader2, Star } from "lucide-react";
import { useAdminToken } from "./admin";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const token = useAdminToken();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    tamil: "",
    category: "",
    subcategory: "",
    price: "",
    mrp: "",
    image: "",
    images: [] as string[],
    rating: "4.8",
    reviews: "15",
    organic: false,
    trending: false,
    bestseller: false,
    description: "",
    stock: "99",
  });

  const [urlInput, setUrlInput] = useState("");

  const loadData = async () => {
    try {
      const prods = await apiFetchProducts();
      const cats = await apiFetchCategories();
      setProducts(prods);
      setCategories(cats);
      
      // Select first category by default if form is empty
      if (cats.length > 0 && !form.category) {
        setForm((f) => ({ ...f, category: cats[0].slug }));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      tamil: "",
      category: categories[0]?.slug || "raw-herbs",
      subcategory: "",
      price: "",
      mrp: "",
      image: "",
      images: [],
      rating: "4.8",
      reviews: "15",
      organic: false,
      trending: false,
      bestseller: false,
      description: "",
      stock: "99",
    });
    setModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      tamil: prod.tamil || "",
      category: prod.category,
      subcategory: prod.subcategory || "",
      price: prod.price.toString(),
      mrp: prod.mrp.toString(),
      image: prod.image,
      images: prod.images || (prod.image ? [prod.image] : []),
      rating: prod.rating.toString(),
      reviews: prod.reviews.toString(),
      organic: prod.organic || false,
      trending: prod.trending || false,
      bestseller: prod.bestseller || false,
      description: prod.description,
      stock: (prod.stock || 99).toString(),
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await apiUploadImage(file, token);
      setForm((prev) => {
        const nextImages = [...prev.images, res.imageUrl];
        return {
          ...prev,
          images: nextImages,
          image: prev.image || res.imageUrl,
        };
      });
      toast.success("Image uploaded and added to gallery");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setForm((prev) => {
      const nextImages = [...prev.images, urlInput.trim()];
      return {
        ...prev,
        images: nextImages,
        image: prev.image || urlInput.trim(),
      };
    });
    setUrlInput("");
    toast.success("Image URL added to gallery");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error("Please upload or provide at least one product image");
      return;
    }

    try {
      if (editingProduct) {
        const updated = await apiUpdateProduct(editingProduct._id, form, token);
        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? updated : p)));
        toast.success("Product updated successfully");
      } else {
        const created = await apiCreateProduct(form, token);
        setProducts((prev) => [created, ...prev]);
        toast.success("Product added successfully");
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await apiDeleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.tamil && p.tamil.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage catalog details, pricing, and tags.</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-11 px-5 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search products by English or Tamil name..."
          />
        </div>
        <div className="text-xs text-muted-foreground shrink-0">{filtered.length} products found</div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-16 text-center text-muted-foreground">
          No products matched your search. Click "Add Product" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            return (
              <div key={product._id} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-card transition-all flex flex-col group relative">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.organic && <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">Organic</span>}
                    {product.trending && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Trending</span>}
                    {product.bestseller && <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Bestseller</span>}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary">{product.category.replace("-", " ")}</span>
                    <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 mt-1">{product.name}</h3>
                    {product.tamil && <p className="text-xs text-muted-foreground italic mt-0.5">{product.tamil}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{product.rating}</span>
                      <span>({product.reviews})</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-lg text-primary font-bold">₹{product.price}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                      {discount > 0 && <span className="text-[10px] text-amber-600 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">{discount}% OFF</span>}
                    </div>

                    <div className="text-[10px] text-muted-foreground mt-1">Stock: {product.stock} units</div>
                  </div>
                </div>

                <div className="border-t border-border p-3 flex gap-2 bg-muted/20">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 h-9 rounded-full bg-primary-soft hover:bg-primary hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold text-primary transition-all"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    className="h-9 w-9 rounded-full bg-destructive/10 hover:bg-destructive hover:text-white flex items-center justify-center text-destructive transition-all"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl shadow-card max-h-[90vh] flex flex-col animate-fade-up">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="font-display text-2xl text-primary">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Product Name (English)</label>
                  <input required type="text" name="name" value={form.name} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="Amla Root Powder" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Product Name (Tamil - Optional)</label>
                  <input type="text" name="tamil" value={form.tamil} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="நெல்லி" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20">
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Subcategory (Optional)</label>
                  <input type="text" name="subcategory" value={form.subcategory} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="Powders" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Selling Price (₹)</label>
                  <input required type="number" name="price" value={form.price} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="299" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">MRP Price (₹)</label>
                  <input required type="number" name="mrp" value={form.mrp} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="399" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Stock Quantity</label>
                  <input required type="number" name="stock" value={form.stock} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="99" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Description</label>
                <textarea required name="description" value={form.description} onChange={handleFormChange} rows={3} className="w-full p-4 rounded-2xl bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="Write benefits, usage, and dosage here..." />
              </div>

              {/* Multiple Image uploads and URLs */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Product Gallery Images (Multiple)</label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 w-full flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      placeholder="Paste image link/URL..."
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-4 h-11 rounded-full bg-primary-soft text-primary font-semibold text-xs transition"
                    >
                      Add URL
                    </button>
                  </div>
                  <label className="shrink-0 h-11 px-5 rounded-full border border-primary text-primary hover:bg-primary-soft hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto font-medium text-xs">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" /> Upload & Add File
                      </>
                    )}
                  </label>
                </div>

                {form.images.length > 0 ? (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold pl-1">Gallery Preview (Hover & click trash to delete)</span>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {form.images.map((imgUrl, index) => (
                        <div key={index} className="relative h-20 w-20 rounded-2xl overflow-hidden border border-border group bg-muted">
                          <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => {
                                const nextImages = prev.images.filter((_, idx) => idx !== index);
                                return {
                                  ...prev,
                                  images: nextImages,
                                  image: prev.image === imgUrl ? (nextImages[0] || "") : prev.image,
                                };
                              });
                            }}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white rounded-2xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl">
                    No images added to gallery yet. Upload files or paste URLs above.
                  </div>
                )}
              </div>

              {/* Mock Analytics Fields */}
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-2xl">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Initial Rating</label>
                  <input type="text" name="rating" value={form.rating} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Reviews Count</label>
                  <input type="number" name="reviews" value={form.reviews} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              {/* Checkbox tags */}
              <div className="flex flex-wrap gap-6 border-t border-border pt-4 justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="organic" checked={form.organic} onChange={handleFormChange} className="rounded text-primary focus:ring-primary" />
                  <span className="font-medium">Organic Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="trending" checked={form.trending} onChange={handleFormChange} className="rounded text-primary focus:ring-primary" />
                  <span className="font-medium">Trending Now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleFormChange} className="rounded text-primary focus:ring-primary" />
                  <span className="font-medium">Bestseller Tag</span>
                </label>
              </div>

              <div className="border-t border-border pt-5 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 h-12 rounded-full border border-border bg-card font-medium text-foreground hover:bg-muted transition">Cancel</button>
                <button type="submit" className="flex-1 h-12 rounded-full bg-primary font-medium text-primary-foreground shadow-glow hover:scale-[1.01] transition-transform">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
