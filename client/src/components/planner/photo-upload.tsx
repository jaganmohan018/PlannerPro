import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Camera, X, Upload, Image } from "lucide-react";

interface PhotoUploadProps {
  plannerEntryId: number;
  photos: Array<{
    id: string;
    filename: string;
    uploadedAt: string;
    category: string;
    url?: string;
  }>;
  onUpdate: (updates: any) => void;
}

const PHOTO_CATEGORIES = [
  { value: "store_condition", label: "Store Condition" },
  { value: "product_display", label: "Product Display" },
  { value: "inventory", label: "Inventory Check" },
  { value: "team_photo", label: "Team Photo" },
  { value: "customer_service", label: "Customer Service" },
  { value: "before_after", label: "Before/After" },
  { value: "other", label: "Other" },
];

export default function PhotoUpload({ plannerEntryId, photos = [], onUpdate }: PhotoUploadProps) {
  const [selectedCategory, setSelectedCategory] = useState("store_condition");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadPhotoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Photo upload failed");
      }
      return response.json();
    },
    onSuccess: (uploadedPhoto) => {
      const updatedPhotos = [...photos, uploadedPhoto];
      onUpdate({ photos: updatedPhotos });
      toast({
        title: "Photo uploaded successfully",
        description: `${uploadedPhoto.filename} has been added to your planner`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      await apiRequest("DELETE", `/api/photo/${photoId}`);
      return photoId;
    },
    onSuccess: (deletedPhotoId) => {
      const updatedPhotos = photos.filter(photo => photo.id !== deletedPhotoId);
      onUpdate({ photos: updatedPhotos });
      toast({
        title: "Photo deleted",
        description: "Photo has been removed from your planner",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('category', selectedCategory);
      formData.append('plannerEntryId', plannerEntryId.toString());

      await uploadPhotoMutation.mutateAsync(formData);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhotoMutation.mutate(photoId);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Camera className="h-5 w-5 text-salon-purple" />
        <h3 className="text-lg font-semibold text-salon-purple">Store Photos</h3>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="category" className="text-sm font-medium mb-2 block">
              Photo Category
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PHOTO_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={triggerFileSelect}
              disabled={uploading}
              className="bg-salon-purple hover:bg-salon-purple/90"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </>
              )}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                
                {/* Delete button */}
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={deletePhotoMutation.isPending}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              
              {/* Photo info */}
              <div className="mt-2 text-xs">
                <div className="font-medium text-gray-700 truncate">{photo.filename}</div>
                <div className="text-gray-500 capitalize">
                  {PHOTO_CATEGORIES.find(cat => cat.value === photo.category)?.label || photo.category}
                </div>
                <div className="text-gray-400">
                  {new Date(photo.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No photos uploaded yet</p>
          <p className="text-xs">Add photos to document store conditions and activities</p>
        </div>
      )}
    </Card>
  );
}