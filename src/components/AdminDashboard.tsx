'use client';

import React, { useState } from 'react';
import { Supplier, RFQ } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Building2, 
  FileText, 
  Users, 
  Award, 
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  suppliers: Supplier[];
  rfqs: RFQ[];
  onToggleVerification: (supplierId: string) => void;
  onRouteRfq: (rfqId: string, supplierId: string) => void;
}

export function AdminDashboard({
  suppliers,
  rfqs,
  onToggleVerification,
  onRouteRfq,
}: AdminDashboardProps) {
  const [routingSelection, setRoutingSelection] = useState<Record<string, string>>({});
  const verifiedCount = suppliers.filter(s => s.verified).length;
  const pendingCount = suppliers.length - verifiedCount;
  const unmatchedRfqs = rfqs.filter(rfq => rfq.supplierId === 'marketplace');
  const quotedCount = rfqs.filter(r => r.status === 'quoted' || r.status === 'accepted').length;
  const quoteResponseRate = rfqs.length > 0 ? Math.round((quotedCount / rfqs.length) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-navy-900 to-navy-950 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-amber-900/40">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Operations & Trust Audit Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold">Admin Verification & Quality Control</h1>
          <p className="text-xs sm:text-sm text-navy-300 mt-1 max-w-2xl">
            Audit supplier registrations, enforce GST and ISO certification compliance, and issue authentic &quot;Verified Supplier Badges&quot;.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold">
            {verifiedCount} Verified Live
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-300 font-bold">
            {pendingCount} Pending Audit
          </span>
        </div>
      </div>

      {/* Demo workspace KPIs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-600">
              Workspace Overview
            </h2>
          </div>
          <span className="text-xs text-navy-400">Sample workspace data · not live telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">
            <span className="text-xs text-navy-500 font-medium block">Verified Supplier Base</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-navy-950">{verifiedCount}</span>
              <span className="text-xs text-emerald-600 font-bold">{suppliers.length} profiles loaded</span>
            </div>
            <p className="text-[10px] text-navy-400 mt-1">Sample supplier profiles</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">
            <span className="text-xs text-navy-500 font-medium block">RFQs Initiated</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-brand-600">{rfqs.length}</span>
              <span className="text-xs text-brand-700 font-bold">{quotedCount} Quoted</span>
            </div>
            <p className="text-[10px] text-navy-400 mt-1">Demand discovery activity</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">
            <span className="text-xs text-navy-500 font-medium block">RFQ Response Rate</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-600">{quoteResponseRate}%</span>
              <span className="text-xs text-navy-500 font-medium">sample RFQ data</span>
            </div>
            <p className="text-[10px] text-navy-400 mt-1">Direct value metric to buyers</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-navy-200 shadow-card">
            <span className="text-xs text-navy-500 font-medium block">AI Ranking CTR</span>
            <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-purple-600">{unmatchedRfqs.length}</span>
            <span className="text-xs text-purple-600 font-bold">Needs assignment</span>
            </div>
            <p className="text-[10px] text-navy-400 mt-1">Buyer requirements awaiting review</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-extrabold text-navy-950">Requirement review & supplier routing</h2>
            </div>
            <p className="mt-1 text-xs text-navy-500">Qualify incoming requirements, then assign a supplier to place the request in their RFQ inbox.</p>
          </div>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800">{unmatchedRfqs.length} awaiting match</span>
        </div>

        {unmatchedRfqs.length === 0 ? (
          <div className="rounded-xl border border-navy-200 bg-white p-6 text-center text-xs text-navy-500 shadow-card">No buyer requirements are waiting for supplier matching.</div>
        ) : (
          <div className="space-y-3">
            {unmatchedRfqs.map(rfq => (
              <article key={rfq.id} className="rounded-xl border border-navy-200 bg-white p-4 shadow-card sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-navy-400">{rfq.id}</span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">Admin review</span>
                    </div>
                    <h3 className="mt-1 text-sm font-extrabold text-navy-950">{rfq.title}</h3>
                    <p className="mt-1 text-xs text-navy-600">{rfq.buyerCompany} · {rfq.category} · {rfq.material} · Qty {rfq.quantity}</p>
                    <p className="mt-2 text-xs leading-5 text-navy-700">{rfq.specifications}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rfq.certificationsRequired.map(code => <span key={code} className="rounded bg-navy-100 px-2 py-1 text-[10px] font-bold text-navy-700">{code}</span>)}
                      {rfq.attachments.map((file, index) => <span key={file.name + index} className="rounded bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600">{file.name}</span>)}
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 lg:w-72">
                    <label className="text-[11px] font-bold text-navy-700" htmlFor={'route-' + rfq.id}>Assign a matching supplier</label>
                    <select id={'route-' + rfq.id} value={routingSelection[rfq.id] || ''} onChange={event => setRoutingSelection(current => ({ ...current, [rfq.id]: event.target.value }))} className="w-full rounded-lg border border-navy-300 bg-white px-3 py-2 text-xs text-navy-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                      <option value="">Choose supplier…</option>
                      {suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name} · {supplier.category}</option>)}
                    </select>
                    <button disabled={!routingSelection[rfq.id]} onClick={() => onRouteRfq(rfq.id, routingSelection[rfq.id])} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-extrabold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">Assign and route RFQ</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Supplier Verification Queue Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-navy-950">Supplier Verification Queue</h2>
          </div>
          <span className="text-xs text-navy-500">Toggle badges to simulate manual & automated audits</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-navy-200 bg-white shadow-card">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900 text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Company Name & Hub</th>
                <th className="p-3.5">GST / Legal Name</th>
                <th className="p-3.5">Certifications</th>
                <th className="p-3.5">Audit Status</th>
                <th className="p-3.5">Verification Badge Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-200">
              {suppliers.map((s, idx) => (
                <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-navy-50/40'}>
                  <td className="p-3.5">
                    <div className="font-bold text-navy-950 text-sm">{s.name}</div>
                    <div className="text-navy-500 text-[11px] mt-0.5">{s.category} • {s.location.city}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-bold text-navy-800">{s.verificationDetails.gstNumber}</div>
                    <div className="text-navy-500 text-[11px] mt-0.5">{s.verificationDetails.registeredLegalName}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.certifications.map(c => (
                        <span key={c.code} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy-100 text-navy-800">
                          {c.code}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3.5">
                    {s.verified ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Audit Pending</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleVerification(s.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-xs ${
                        s.verified
                          ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {s.verified ? (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Revoke Verified Badge</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Issue Badge</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
