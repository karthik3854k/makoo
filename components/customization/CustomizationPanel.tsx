'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload, X, Type, Palette, Image as ImageIcon, Check } from 'lucide-react';
import type { CustomizationOption, ProductCustomization } from '@/types';

interface CustomizationPanelProps {
  options: CustomizationOption[];
  onCustomizationChange: (customization: ProductCustomization) => void;
  previewImage?: string;
}

const fontStyles = [
  { name: 'Classic', value: 'serif' },
  { name: 'Modern', value: 'sans-serif' },
  { name: 'Elegant', value: 'cursive' },
  { name: 'Bold', value: 'bold' },
];

const colorOptions = [
  { name: 'Gold', value: '#D4AF37' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Black', value: '#1A1A1A' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Rose Gold', value: '#B76E79' },
  { name: 'Copper', value: '#B87333' },
];

export default function CustomizationPanel({
  options,
  onCustomizationChange,
  previewImage,
}: CustomizationPanelProps) {
  const [customText, setCustomText] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [fontStyle, setFontStyle] = useState('sans-serif');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomImage(result);
        onCustomizationChange({
          custom_text: customText,
          custom_color: customColor,
          custom_image: result,
          font_style: fontStyle,
          additional_notes: additionalNotes,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [customText, customColor, fontStyle, additionalNotes, onCustomizationChange]);

  const handleTextChange = (text: string) => {
    setCustomText(text);
    onCustomizationChange({
      custom_text: text,
      custom_color: customColor,
      custom_image: customImage || undefined,
      font_style: fontStyle,
      additional_notes: additionalNotes,
    });
  };

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    onCustomizationChange({
      custom_text: customText,
      custom_color: color,
      custom_image: customImage || undefined,
      font_style: fontStyle,
      additional_notes: additionalNotes,
    });
  };

  const handleFontChange = (font: string) => {
    setFontStyle(font);
    onCustomizationChange({
      custom_text: customText,
      custom_color: customColor,
      custom_image: customImage || undefined,
      font_style: font,
      additional_notes: additionalNotes,
    });
  };

  const textStyle = options.find((o) => o.field_type === 'text');
  const colorSelect = options.find((o) => o.field_type === 'color' || o.field_type === 'select');
  const imageUpload = options.find((o) => o.field_type === 'image');

  return (
    <div className="space-y-6 py-6 border-t border-brand-gray-dark/30">
      <div className="flex items-center gap-2 text-brand-primary">
        <Palette size={20} />
        <h3 className="font-semibold text-lg text-brand-dark">Customize Your Product</h3>
      </div>

      {/* Live Preview */}
      {(customText || customImage) && (
        <div className="relative aspect-[4/3] bg-brand-gray rounded-xl overflow-hidden">
          <Image
            src={previewImage || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600'}
            alt="Preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {customText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <span
                  className="text-2xl md:text-4xl font-bold drop-shadow-lg"
                  style={{
                    color: customColor || '#1A1A1A',
                    fontFamily: fontStyle,
                  }}
                >
                  {customText}
                </span>
              </motion.div>
            )}
            {customImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-4 right-4 w-24 h-24 rounded-lg overflow-hidden border-4 border-white shadow-lg"
              >
                <Image src={customImage} alt="Custom" fill className="object-cover" />
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Text Input */}
      {textStyle && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-brand-dark">
            <Type size={16} />
            {textStyle.label}
            {textStyle.required && <span className="text-brand-primary">*</span>}
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => handleTextChange(e.target.value)}
            maxLength={textStyle.max_length || 30}
            placeholder={`Enter ${textStyle.label.toLowerCase()}...`}
            className="input-field"
          />
          {textStyle.max_length && (
            <p className="text-xs text-brand-text-muted text-right">
              {customText.length}/{textStyle.max_length} characters
            </p>
          )}
        </div>
      )}

      {/* Font Style */}
      {textStyle && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-dark">Font Style</label>
          <div className="grid grid-cols-4 gap-2">
            {fontStyles.map((font) => (
              <button
                key={font.value}
                onClick={() => handleFontChange(font.value)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  fontStyle === font.value
                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                    : 'border-brand-gray-dark hover:border-brand-primary/50'
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colorSelect && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-brand-dark">
            <Palette size={16} />
            {colorSelect.label}
          </label>
          <div className="flex flex-wrap gap-3">
            {(colorSelect.options || colorOptions.map((c) => c.name)).map((color) => {
              const colorValue = colorOptions.find((c) => c.name === color)?.value || color;
              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(colorValue)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    customColor === colorValue
                      ? 'border-brand-primary scale-110 ring-2 ring-brand-primary/30'
                      : 'border-brand-gray-dark hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorValue }}
                  title={color}
                >
                  {customColor === colorValue && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {color === 'White' ? (
                        <Check size={16} className="text-brand-dark" />
                      ) : (
                        <Check size={16} className="text-white" />
                      )}
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Image Upload */}
      {imageUpload && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-brand-dark">
            <ImageIcon size={16} />
            {imageUpload.label}
            {imageUpload.required && <span className="text-brand-primary">*</span>}
          </label>

          {customImage ? (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-brand-gray-dark">
              <Image src={customImage} alt="Uploaded" fill className="object-cover" />
              <button
                onClick={() => {
                  setCustomImage(null);
                  onCustomizationChange({
                    custom_text: customText,
                    custom_color: customColor,
                    custom_image: undefined,
                    font_style: fontStyle,
                    additional_notes: additionalNotes,
                  });
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-brand-gray-dark rounded-xl cursor-pointer hover:border-brand-primary hover:bg-brand-gray/30 transition-colors">
              <Upload size={24} className="text-brand-text-muted" />
              <span className="text-sm text-brand-text-muted">Click to upload image</span>
              <span className="text-xs text-brand-text-muted">
                {imageUpload.allowed_file_types?.join(', ') || 'PNG, JPG up to 5MB'}
              </span>
              <input
                type="file"
                accept={imageUpload.allowed_file_types?.join(',') || 'image/png,image/jpeg'}
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* Additional Notes */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-brand-dark">Additional Notes (Optional)</label>
        <textarea
          value={additionalNotes}
          onChange={(e) => {
            setAdditionalNotes(e.target.value);
            onCustomizationChange({
              custom_text: customText,
              custom_color: customColor,
              custom_image: customImage || undefined,
              font_style: fontStyle,
              additional_notes: e.target.value,
            });
          }}
          placeholder="Any special instructions for your order..."
          rows={3}
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}
