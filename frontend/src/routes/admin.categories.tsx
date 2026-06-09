import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  apiFetchCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiUploadImage
} from "@/lib/api";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, FolderHeart, Tag, Loader2, Image as ImageIcon } from "lucide-react";
import { useAdminToken } from "./admin";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const token = useAdminToken();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<any | null>(null);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);

  // Subcategory helper state
  const [newSubName, setNewSubName] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    icon: "🌿",
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await apiUploadImage(file, token);
      setForm((prev) => ({ ...prev, icon: res.imageUrl }));
      toast.success("Category image uploaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiFetchCategories();
      setCategories(data);
      if (data.length > 0) {
        // Find if selected cat still exists
        const exists = selectedCat ? data.find((c) => c._id === selectedCat._id) : null;
        setSelectedCat(exists || data[0]);
      } else {
        setSelectedCat(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setForm({ name: "", icon: "🌿" });
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCat(cat);
    setForm({ name: cat.name, icon: cat.icon });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        const updated = await apiUpdateCategory(
          editingCat._id,
          { ...form, subcategories: editingCat.subcategories },
          token
        );
        toast.success("Category updated successfully");
        // Reload list
        await loadCategories();
      } else {
        const created = await apiCreateCategory({ ...form, subcategories: [] }, token);
        toast.success("Category created successfully");
        await loadCategories();
        setSelectedCat(created);
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"? This may affect products matching this category slug.`)) return;

    try {
      await apiDeleteCategory(id, token);
      toast.success("Category deleted");
      await loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  // Subcategory management helper calls
  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !selectedCat) return;

    const subName = newSubName.trim();
    if (selectedCat.subcategories.includes(subName)) {
      toast.error("Subcategory already exists");
      return;
    }

    const updatedSubcategories = [...selectedCat.subcategories, subName];
    try {
      const updated = await apiUpdateCategory(
        selectedCat._id,
        { name: selectedCat.name, icon: selectedCat.icon, subcategories: updatedSubcategories },
        token
      );
      setSelectedCat(updated);
      setCategories((prev) => prev.map((c) => (c._id === selectedCat._id ? updated : c)));
      setNewSubName("");
      toast.success(`Subcategory "${subName}" added`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add subcategory");
    }
  };

  const handleRemoveSubcategory = async (subName: string) => {
    if (!selectedCat) return;

    const updatedSubcategories = selectedCat.subcategories.filter((s: string) => s !== subName);
    try {
      const updated = await apiUpdateCategory(
        selectedCat._id,
        { name: selectedCat.name, icon: selectedCat.icon, subcategories: updatedSubcategories },
        token
      );
      setSelectedCat(updated);
      setCategories((prev) => prev.map((c) => (c._id === selectedCat._id ? updated : c)));
      toast.success(`Subcategory "${subName}" removed`);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove subcategory");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground">Categories & Subcategories</h1>
          <p className="text-muted-foreground mt-1">Manage store sections and filters.</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-11 px-5 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Categories List */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
          <h2 className="font-display text-xl text-primary border-b border-border pb-3 flex items-center gap-2">
            <FolderHeart className="h-5 w-5" /> Categories
          </h2>

          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-xs text-muted-foreground">No categories added yet.</div>
          ) : (
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCat(cat)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedCat && selectedCat._id === cat._id
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {cat.icon && (cat.icon.startsWith("/") || cat.icon.startsWith("http")) ? (
                      <img src={cat.icon} alt="" className="h-6 w-6 rounded-full object-cover shrink-0" />
                    ) : (
                      <span className="text-lg">{cat.icon || "🌿"}</span>
                    )}
                    <span>{cat.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCat && selectedCat._id === cat._id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>{cat.subcategories?.length || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Category subcategories details panel */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-6">
          {selectedCat ? (
            <div className="space-y-6">
              {/* Header Panel Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-5 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-primary-soft flex items-center justify-center text-3xl overflow-hidden shrink-0">
                    {selectedCat.icon && (selectedCat.icon.startsWith("/") || selectedCat.icon.startsWith("http")) ? (
                      <img src={selectedCat.icon} alt="" className="h-full w-full object-cover" />
                    ) : (
                      selectedCat.icon || "🌿"
                    )}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-foreground font-bold">{selectedCat.name}</h2>
                    <p className="text-xs font-mono text-muted-foreground">Slug matching path: /categories/{selectedCat.slug}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openEditModal(selectedCat)}
                    className="flex-1 sm:flex-none h-9 px-4 rounded-full bg-primary-soft hover:bg-primary hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold text-primary transition-all"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(selectedCat._id, selectedCat.name)}
                    className="h-9 w-9 rounded-full bg-destructive/10 hover:bg-destructive hover:text-white flex items-center justify-center text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories list */}
              <div className="space-y-4">
                <h3 className="font-display text-lg text-primary flex items-center gap-2 border-b border-border pb-2">
                  <Tag className="h-4 w-4" /> Subcategories
                </h3>

                {selectedCat.subcategories.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground bg-muted/10 rounded-2xl">
                    No subcategories under {selectedCat.name}. Add one below!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {selectedCat.subcategories.map((sub: string) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-soft text-primary font-medium text-xs border border-primary/15"
                      >
                        {sub}
                        <button
                          onClick={() => handleRemoveSubcategory(sub)}
                          className="h-4 w-4 rounded-full hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Subcategory Add Form */}
                <form onSubmit={handleAddSubcategory} className="flex gap-2 max-w-md pt-2">
                  <input
                    required
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    className="flex-1 h-10 px-4 rounded-full bg-muted text-xs outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter new subcategory name..."
                  />
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-muted-foreground">
              Create a Category to start managing subcategories and links.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-card overflow-hidden animate-fade-up">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="font-display text-2xl text-primary">{editingCat ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Category Name</label>
                <input required type="text" name="name" value={form.name} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="Raw Herbs" />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Category Image / Icon</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <input
                      required
                      type="text"
                      name="icon"
                      value={form.icon}
                      onChange={handleFormChange}
                      className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Emoji or paste image URL..."
                    />
                  </div>
                  <label className="shrink-0 h-11 px-5 rounded-full border border-primary text-primary hover:bg-primary-soft hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto font-medium">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" /> Upload Image
                      </>
                    )}
                  </label>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 block pl-2">Provide a single emoji (e.g. 🌿), upload an image, or paste a URL.</span>

                {form.icon && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Preview:</span>
                    <div className="h-16 w-16 rounded-2xl bg-primary-soft flex items-center justify-center text-3xl overflow-hidden border border-border">
                      {form.icon.startsWith("/") || form.icon.startsWith("http") ? (
                        <img src={form.icon} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        form.icon
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-5 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 h-11 rounded-full border border-border bg-card font-medium text-foreground hover:bg-muted transition">Cancel</button>
                <button type="submit" className="flex-1 h-11 rounded-full bg-primary font-medium text-primary-foreground shadow-glow hover:scale-[1.01] transition-transform">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
