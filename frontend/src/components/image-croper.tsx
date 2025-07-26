'use client';
import Cropper from 'react-easy-crop';
import { useState } from 'react';
import getCroppedImg from '@/lib/cropimage';
import { Button } from '@/components/ui/button';

export default function ImageCropper({
  file,
  onDone,
  onCancel,
}: {
  file: File;
  onDone: (file: File) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDone = async () => {
    const croppedFile = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels);
    onDone(croppedFile);
  };

  return (
    <div className="fixed w-[300px] h-[300px] z-50 bg-black">
      <Cropper
        image={URL.createObjectURL(file)}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button type="button" onClick={onCancel} variant="destructive">
          Cancel
        </Button>
        <Button type="button" onClick={handleDone}>
          Done
        </Button>
      </div>
    </div>
  );
}
