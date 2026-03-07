import { useNavigate } from "@tanstack/react-router";
import { Camera, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddProduct, useGetAllCategories } from "../hooks/useQueries";
import CameraCapture from "./CameraCapture";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export default function ProductForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>("");

  const { data: categories, isLoading: categoriesLoading } =
    useGetAllCategories();
  const addProduct = useAddProduct();
  const navigate = useNavigate();

  const handleCameraCapture = async (file: File) => {
    try {
      // Create a local preview URL
      const previewUrl = URL.createObjectURL(file);

      setPhotoFile(file);
      setPhotoPreviewUrl(previewUrl);
      setShowCamera(false);
      toast.success("Photo captured successfully!");
    } catch (error: any) {
      toast.error("Failed to process photo");
      console.error("Photo capture error:", error);
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setPhotoFile(null);
    setPhotoPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !price || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    const priceNum = Number.parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      let photoUrl = "";

      // Convert photo to base64 data URL if present
      if (photoFile) {
        const reader = new FileReader();
        photoUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });
      }

      await addProduct.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        price: BigInt(Math.round(priceNum * 100)),
        category,
        photoUrl,
      });

      // Clean up preview URL
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }

      toast.success("Product listed successfully!");
      navigate({ to: "/" });
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
    }
  };

  // Filter out "All" category from the dropdown since it's not a valid product category
  const selectableCategories =
    categories?.filter((cat) => cat.name !== "All") || [];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="space-y-2.5">
          <Label
            htmlFor="title"
            className="text-sm font-medium text-foreground"
          >
            Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Vintage Bicycle"
            required
            className="h-11 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item in detail..."
            rows={5}
            required
            className="bg-background border-input focus:border-primary focus:ring-primary/20 transition-all duration-200 resize-none"
          />
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="price"
            className="text-sm font-medium text-foreground"
          >
            Price ($) *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
            className="h-11 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-foreground"
          >
            Category *
          </Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger
              id="category"
              className="h-11 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              ) : selectableCategories.length > 0 ? (
                selectableCategories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-medium text-foreground">
            Product Photo
          </Label>

          {photoPreviewUrl ? (
            <div className="relative rounded-lg overflow-hidden border bg-muted/30">
              <img
                src={photoPreviewUrl}
                alt="Product preview"
                className="w-full h-64 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 shadow-lg"
                onClick={handleRemovePhoto}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200"
              onClick={() => setShowCamera(true)}
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Take Photo</span>
              </div>
            </Button>
          )}
        </div>

        <Button
          type="submit"
          disabled={addProduct.isPending}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-200 font-medium"
        >
          {addProduct.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Listing...
            </>
          ) : (
            "List Item"
          )}
        </Button>
      </form>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
