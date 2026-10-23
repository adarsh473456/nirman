'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, LockKeyhole, Paperclip, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { RFQ } from '../types';
import { CERTIFICATIONS_LIST, POPULAR_MATERIALS } from '../data/defaultCategories';

type RequirementData = Omit<RFQ, 'id' | 'createdAt' | 'status' | 'supplierId' | 'supplierName'>;

interface PostRequirementModalProps {
  onClose: () => void;
  onSubmit: (requirement: RequirementData) => RFQ;
}

const SPACE_CATEGORIES = [
  'Space-grade materials',
  'Satellite subsystems',
  'Precision manufacturing',
  'Test & qualification',
  'Propulsion & launch',
  'Mission & ground systems',
];

export function PostRequirementModal({ onClose, onSubmit }: PostRequirementModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(SPACE_CATEGORIES[0]);
  const [material, setMaterial] = useState('Aluminum 6061-T6');
  const [quantity, setQuantity] = useState(1);
  const [targetDeliveryDays, setTargetDeliveryDays] = useState(30);
  const [targetUnitBudget, setTargetUnitBudget] = useState<number | undefined>();
  const [specifications, setSpecifications] = useState('');
  const [buyerName, setBuyerName] = useState('Vikram Mehta');
  const [buyerCompany, setBuyerCompany] = useState('Asterion Satellite Systems');
  const [buyerEmail, setBuyerEmail] = useState('v.mehta@asterion.example');
  const [certificationsRequired, setCertificationsRequired] = useState<string[]>(['AS9100D']);
  const [attachments, setAttachments] = useState<RFQ['attachments']>([]);
  const [submittedRfq, setSubmittedRfq] = useState<RFQ | null>(null);

  const toggleCertification = (code: string) => {
    setCertificationsRequired(current => current.includes(code)
      ? current.filter(item => item !== code)
      : [...current, code]
    );
  };

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(current => [
      ...current,
      ...files.map(file => ({
        name: file.name,
        sizeKb: Math.max(1, Math.round(file.size / 1024)),
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      })),
    ]);
    event.target.value = '';
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = onSubmit({
      buyerId: 'buyer-demo',
      buyerName,
      buyerCompany,
      buyerEmail,
      title,
      category,
      material,
      quantity: Number(quantity),
      targetUnitBudget: targetUnitBudget ? Number(targetUnitBudget) : undefined,
      targetDeliveryDays: Number(targetDeliveryDays),
      specifications,
      certificationsRequired,
      attachments,
    });
    setSubmittedRfq(created);
  };

  const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-100';
  const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="requirement-title">
      <div className="my-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 bg-[#102448] px-5 py-5 text-white sm:px-7">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-sky-300"><FileText className="h-3.5 w-3.5" /> Constellar sourcing desk</span>
            <h2 id="requirement-title" className="mt-1 text-xl font-black sm:text-2xl">Post a space-industry requirement</h2>
            <p className="mt-1 text-xs text-slate-300">Give the sourcing team enough detail to qualify and route the request.</p>
          </div>
          <button onClick={onClose} aria-label="Close requirement form" className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {submittedRfq ? (
          <div className="px-6 py-12 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-8 w-8" /></div>
            <h3 className="mt-4 text-lg font-black text-slate-900">Requirement received for review</h3>
            <p className="mt-2 text-sm text-slate-600">Reference <strong>{submittedRfq.id}</strong> is now in the admin matching queue. The sourcing team can assign suitable suppliers from the admin workspace.</p>
            <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-slate-500">Prototype note: this request is stored in local demo state. No supplier has been contacted and no call or email has been sent.</p>
            <button onClick={onClose} className="mt-6 rounded-xl bg-sky-800 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-sky-700">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="max-h-[78vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
            <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-sky-950">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p><strong>Private routing:</strong> your request goes to Constellar for review first. Suppliers see the technical requirement after assignment; buyer phone numbers are not shared in public listings.</p>
            </div>

            <section>
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">Requirement details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className={labelClass}>Part, material or service needed *</span><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 7075-T6 satellite panel, machined to drawing" className={inputClass} /></label>
                <label><span className={labelClass}>Space supply category *</span><select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>{SPACE_CATEGORIES.map(option => <option key={option}>{option}</option>)}</select></label>
                <label><span className={labelClass}>Material or subsystem</span><input list="space-material-options" value={material} onChange={e => setMaterial(e.target.value)} className={inputClass} /><datalist id="space-material-options">{POPULAR_MATERIALS.map(item => <option key={item} value={item} />)}</datalist></label>
                <label><span className={labelClass}>Quantity *</span><input type="number" min="1" required value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={inputClass} /></label>
                <label><span className={labelClass}>Target delivery (days) *</span><input type="number" min="1" required value={targetDeliveryDays} onChange={e => setTargetDeliveryDays(Number(e.target.value))} className={inputClass} /></label>
                <label><span className={labelClass}>Target unit budget (optional)</span><input type="number" min="0" step="0.01" value={targetUnitBudget ?? ''} onChange={e => setTargetUnitBudget(e.target.value ? Number(e.target.value) : undefined)} placeholder="Leave blank if unknown" className={inputClass} /></label>
                <div className="sm:col-span-2"><span className={labelClass}>Required standards or documentation</span><div className="flex flex-wrap gap-2">{CERTIFICATIONS_LIST.slice(0, 6).map(cert => <label key={cert.code} className={'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ' + (certificationsRequired.includes(cert.code) ? 'border-sky-400 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white text-slate-600')}><input type="checkbox" checked={certificationsRequired.includes(cert.code)} onChange={() => toggleCertification(cert.code)} className="accent-sky-700" />{cert.code}</label>)}</div></div>
                <label className="sm:col-span-2"><span className={labelClass}>Technical specification and intended use *</span><textarea required value={specifications} onChange={e => setSpecifications(e.target.value)} rows={4} placeholder="Include grade, form, dimensions, tolerances, operating environment, qualification level and delivery destination." className={inputClass + ' resize-y'} /></label>
                <div className="sm:col-span-2">
                  <span className={labelClass}>Drawings and supporting documents</span>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-600 transition hover:border-sky-400 hover:bg-sky-50"><UploadCloud className="h-4 w-4 text-sky-700" />Attach PDF, CAD or specification files<input type="file" multiple accept=".pdf,.dxf,.step,.stp,.iges,.xlsx,.csv" onChange={addFiles} className="sr-only" /></label>
                  {attachments.length > 0 && <div className="mt-2 space-y-1">{attachments.map((file, index) => <div key={file.name + index} className="flex items-center gap-2 text-[11px] text-slate-600"><Paperclip className="h-3.5 w-3.5" />{file.name} · {(file.sizeKb / 1024).toFixed(1)} MB<button type="button" onClick={() => setAttachments(current => current.filter((_, fileIndex) => fileIndex !== index))} className="ml-auto font-bold text-rose-700 hover:underline">Remove</button></div>)}</div>}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">Buyer contact for the sourcing team</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <label><span className={labelClass}>Contact name</span><input required value={buyerName} onChange={e => setBuyerName(e.target.value)} className={inputClass} /></label>
                <label><span className={labelClass}>Company</span><input required value={buyerCompany} onChange={e => setBuyerCompany(e.target.value)} className={inputClass} /></label>
                <label><span className={labelClass}>Work email</span><input type="email" required value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} className={inputClass} /></label>
              </div>
            </section>

            <div className="flex items-start gap-2 border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-500">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p>Supplier qualification, export-control review and any mission-critical compliance checks must be completed before purchase. A supplier profile badge is not a flight qualification.</p>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-xl bg-sky-800 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-sky-700">Submit for supplier matching</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
