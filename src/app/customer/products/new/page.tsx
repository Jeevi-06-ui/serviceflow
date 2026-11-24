'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Repository } from '@/lib/api/repository';
import { ProductCategory } from '@/types';
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: ProductCategory[] = [
  'Television',
  'Air Conditioner',
  'Refrigerator',
  'Washing Machine',
  'Laptop',
  'Smartphone',
  'Microwave Oven',
  'Audio System',
];

export default function NewProductRegistrationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [category, setCategory] = useState<ProductCategory>('Television');
  const [brand, setBrand] = useState('Samsung');
  const [modelName, setModelName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2025-08-15');
  const [seller, setSeller] = useState('Croma Electronics - Indiranagar');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // Simulated Invoice upload validation
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit.');
      setFileName(null);
      return;
    }

    // Validate type (PDF, PNG, JPEG)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a PDF, PNG, or JPEG file.');
      setFileName(null);
      return;
    }

    setFileError(null);
    setFileName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      Repository.products.create({
        customerId: user.customerId || 'cust-1',
        customerName: user.name,
        category,
        brand,
        modelName,
        serialNumber: serialNumber.trim().toUpperCase(),
        purchaseDate,
        seller,
        invoiceNumber: invoiceNumber.trim() || `INV-${Date.now().toString().slice(-6)}`,
        simulatedInvoiceUrl: fileName ? `/invoices/${fileName}` : undefined,
      });

      toast.success('Product registered successfully! 1-Year standard warranty generated.');
      router.push('/customer/products');
    } catch (err: any) {
      toast.error(err.message || 'Error registering product.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/customer/products"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Register Appliance for Warranty</h1>
          <p className="text-xs text-slate-500">Provide official purchase invoice and serial number for warranty verification</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturer Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Samsung, LG, Sony"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name & Specifications</label>
            <input
              type="text"
              required
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. 55 Inch 4K OLED Smart TV (Model QN55)"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unique Serial Number</label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="SN-SAM-TV-XXXXX"
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white uppercase"
              />
              <span className="text-[10px] text-slate-400">Printed on the appliance barcode sticker</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Purchase</label>
              <input
                type="date"
                required
                value={purchaseDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Authorized Seller / Dealer</label>
              <input
                type="text"
                required
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                placeholder="e.g. Reliance Digital, Croma, Amazon India"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice / Receipt Number</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-2025-XXXX"
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white uppercase"
              />
            </div>
          </div>

          {/* Simulated Invoice Upload */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Simulated Invoice Attachment (PDF, PNG, JPG • Max 5MB)
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <input
                type="file"
                id="invoice-file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="invoice-file" className="cursor-pointer block">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-teal-600 hover:underline">
                  Click to choose simulated file
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Validated locally for size and MIME type</p>
              </label>

              {fileName && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Attached: {fileName}
                </div>
              )}

              {fileError && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600" /> {fileError}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Link
              href="/customer/products"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              Register & Generate Warranty Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
