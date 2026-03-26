import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Property } from "@/hooks/useProperties";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";

const PROPERTY_TYPES = ["House", "Apartment", "Villa", "Townhouse", "Condo", "Cottage"] as const;

interface PropertyFormProps {
  property?: Property | null;
  onClose: () => void;
}

const emptyForm = {
  title: "",
  price: "",
  location: "",
  type: "House" as string,
  bedrooms: "",
  bathrooms: "",
  area: "",
  description: "",
  features: "",
  featured: false,
};

const PropertyForm = ({ property, onClose }: PropertyFormProps) => {
  const isEditing = !!property;
  const [form, setForm] = useState(() =>
    property
      ? {
          title: property.title,
          price: String(property.price),
          location: property.location,
          type: property.type,
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          area: String(property.area),
          description: property.description,
          features: property.features.join(", "),
          featured: property.featured,
        }
      : emptyForm
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(property?.image || null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file, { contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from("property-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location || !form.description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!isEditing && !imageFile && !imagePreview) {
      toast({ title: "Please upload a property image", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = property?.image || "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const propertyData = {
        title: form.title,
        price: Number(form.price),
        location: form.location,
        type: form.type,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        description: form.description,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        image: imageUrl,
        featured: form.featured,
      };

      if (isEditing && property) {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", property.id);
        if (error) throw error;
        toast({ title: "Property updated successfully" });
      } else {
        const { error } = await supabase.from("properties").insert(propertyData);
        if (error) throw error;
        toast({ title: "Property created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onClose();
    } catch (err: any) {
      toast({ title: "Error saving property", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const selectClass = "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground w-full h-10";

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">
          {isEditing ? "Edit Property" : "Add New Property"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Property Image *</label>
          <div className="flex items-start gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-28 rounded-lg border-2 border-dashed border-border hover:border-accent cursor-pointer flex items-center justify-center overflow-hidden transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon size={24} className="mx-auto mb-1" />
                  <span className="text-xs">Click to upload</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="text-muted-foreground"
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Title *</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Property title" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Price ($) *</label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="450000" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Location *</label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Downtown" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Bedrooms</label>
            <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="3" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Bathrooms</label>
            <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="2" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Area (sqft)</label>
            <Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="1800" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Description *</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the property..." rows={4} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Features (comma-separated)</label>
          <Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="City View, Gym, Parking, Pool" />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded border-input"
          />
          <label htmlFor="featured" className="text-sm text-foreground">Mark as featured property</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>
            {saving && <Loader2 className="animate-spin mr-2" size={16} />}
            {isEditing ? "Update Property" : "Create Property"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
