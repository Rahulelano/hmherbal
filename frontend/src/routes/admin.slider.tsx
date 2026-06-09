import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiFetchSlidersAdmin, apiUpdateSliders, apiUploadImage } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X, Sliders, Image as ImageIcon, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { useAdminToken } from "./admin";

export const Route = createFileRoute("/admin/slider")({
  component: AdminSlider,
});

function AdminSlider() {
  const token = useAdminToken();
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Edit / Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form State
  const [form, setForm] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    link: "/shop",
    active: true,
  });

  const loadSliders = async () => {
    try {
      const data = await apiFetchSlidersAdmin(token);
      setSlides(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadSliders();
    }
  }, [token]);

  const openAddModal = () => {
    setEditingIndex(null);
    setForm({
      imageUrl: "",
      title: "",
      subtitle: "",
      link: "/shop",
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (index: number) => {
    const slide = slides[index];
    setEditingIndex(index);
    setForm({
      imageUrl: slide.imageUrl,
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      link: slide.link || "/shop",
      active: slide.active !== undefined ? slide.active : true,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await apiUploadImage(file, token);
      setForm((prev) => ({ ...prev, imageUrl: res.imageUrl }));
      toast.success("Slide image uploaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.error("Please upload or provide a slide image URL");
      return;
    }

    let updatedSlides = [...slides];
    if (editingIndex !== null) {
      updatedSlides[editingIndex] = form;
    } else {
      updatedSlides.push(form);
    }

    await saveSlidesToDatabase(updatedSlides);
    setModalOpen(false);
  };

  const saveSlidesToDatabase = async (newSlides: any[]) => {
    try {
      const res = await apiUpdateSliders(newSlides, token);
      setSlides(res);
      toast.success("Slider settings saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save slider settings");
    }
  };

  const handleDeleteSlide = async (index: number) => {
    if (!confirm("Are you sure you want to remove this slide?")) return;
    const updated = slides.filter((_, idx) => idx !== index);
    await saveSlidesToDatabase(updated);
  };

  const handleMoveSlide = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === slides.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    await saveSlidesToDatabase(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground">Hero Slider</h1>
          <p className="text-muted-foreground mt-1">Manage active slides on the homepage hero banner.</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-11 px-5 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-16 text-center text-muted-foreground">
          No slides added yet. The store will fallback to the default static hero section.
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div key={idx} className="bg-card border border-border rounded-3xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-soft relative overflow-hidden group">
              {/* Image box */}
              <div className="h-28 w-full md:w-48 bg-muted rounded-2xl overflow-hidden border border-border/50 shrink-0">
                <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>

              {/* Text box */}
              <div className="flex-1 text-sm space-y-1.5 w-full">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${slide.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {slide.active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">Slide index: #{idx + 1}</span>
                </div>
                {slide.title && <h3 className="font-display text-lg text-primary font-bold">{slide.title}</h3>}
                {slide.subtitle && <p className="text-xs text-muted-foreground line-clamp-2">{slide.subtitle}</p>}
                {slide.link && <p className="text-[10px] text-muted-foreground font-mono">Link: {slide.link}</p>}
              </div>

              {/* Controls */}
              <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                <div className="flex gap-2 flex-1 md:flex-none">
                  <button
                    onClick={() => handleMoveSlide(idx, "up")}
                    disabled={idx === 0}
                    className="h-9 w-9 rounded-full bg-muted hover:bg-primary-soft hover:text-primary flex items-center justify-center transition-colors disabled:opacity-40"
                    aria-label="Move Up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMoveSlide(idx, "down")}
                    disabled={idx === slides.length - 1}
                    className="h-9 w-9 rounded-full bg-muted hover:bg-primary-soft hover:text-primary flex items-center justify-center transition-colors disabled:opacity-40"
                    aria-label="Move Down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2 flex-1 md:flex-none">
                  <button
                    onClick={() => openEditModal(idx)}
                    className="flex-1 md:flex-none h-9 px-4 rounded-full bg-primary-soft hover:bg-primary hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold text-primary transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(idx)}
                    className="h-9 w-9 rounded-full bg-destructive/10 hover:bg-destructive hover:text-white flex items-center justify-center text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-card overflow-hidden animate-fade-up max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="font-display text-2xl text-primary">{editingIndex !== null ? "Edit Slide" : "Add Slide"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSaveSlide} className="p-6 space-y-4 text-sm overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Slide Heading (Title)</label>
                <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="100% Organic Products" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Slide Description (Subtitle)</label>
                <textarea name="subtitle" value={form.subtitle} onChange={handleFormChange} rows={3} className="w-full p-4 rounded-2xl bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="sun-dried and stone-ground ayurvedic remedies..." />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Redirect Button Link</label>
                  <input type="text" name="link" value={form.link} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="/shop" />
                </div>
                <div className="flex items-center pl-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="active" checked={form.active} onChange={handleFormChange} className="rounded text-primary focus:ring-primary" />
                    <span className="font-semibold text-muted-foreground">Active (Display in carousel)</span>
                  </label>
                </div>
              </div>

              {/* Upload image section */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Slide Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleFormChange} className="w-full h-11 px-4 rounded-full bg-muted outline-none focus:ring-2 focus:ring-primary/20" placeholder="Upload file or paste image link..." />
                  </div>
                  <label className="shrink-0 h-11 px-5 rounded-full border border-primary text-primary hover:bg-primary-soft hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto font-medium">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" /> Upload File
                      </>
                    )}
                  </label>
                </div>
                {form.imageUrl && (
                  <div className="mt-2 h-24 w-48 rounded-2xl overflow-hidden border border-border bg-muted">
                    <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-5 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 h-11 rounded-full border border-border bg-card font-medium text-foreground hover:bg-muted transition">Cancel</button>
                <button type="submit" className="flex-1 h-11 rounded-full bg-primary font-medium text-primary-foreground shadow-glow hover:scale-[1.01] transition-transform">Save Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
