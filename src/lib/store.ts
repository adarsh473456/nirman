'use client';

import { useState } from 'react';
import { Supplier, RFQ, UserRole, SearchFilterState, RfqQuote, AppTheme, SourcingOrder, UserProfile } from '../types';
import { INITIAL_SUPPLIERS } from '../data/mockSuppliers';
import { rankSuppliers, RankedSupplierResult } from './rankingAlgorithm';

const INITIAL_FILTERS: SearchFilterState = {
  query: '',
  isAiQuery: false,
  categories: [],
  certifications: [],
  location: 'All Locations',
  verifiedOnly: false,
  materials: [],
};

const INITIAL_ORDERS: SourcingOrder[] = [
  {
    id: 'PO-2026-8901',
    rfqId: 'rfq-801',
    partName: 'Titanium Star Tracker Mount',
    supplierName: 'Orbital Precision Systems',
    buyerCompany: 'Asterion Satellite Systems',
    quantity: 50,
    unitPrice: 165,
    totalAmount: 8700,
    status: 'quality_inspection',
    orderDate: '2026-08-19',
    estDeliveryDate: '2026-08-31',
    trackingNumber: 'BLR-AERO-9921',
    inspectionCertAttached: true,
  },
  {
    id: 'PO-2026-8902',
    rfqId: 'rfq-802',
    partName: 'Aluminium Satellite Avionics Chassis',
    supplierName: 'Launchframe Structures',
    buyerCompany: 'Asterion Satellite Systems',
    quantity: 100,
    unitPrice: 62,
    totalAmount: 6200,
    status: 'in_production',
    orderDate: '2026-08-20',
    estDeliveryDate: '2026-09-05',
    trackingNumber: 'PUN-FEDEX-4410',
    inspectionCertAttached: false,
  },
];

const INITIAL_RFQS: RFQ[] = [
  {
    id: 'rfq-801',
    buyerId: 'buyer-demo',
    buyerName: 'Vikram Mehta',
    buyerCompany: 'Asterion Satellite Systems',
    buyerEmail: 'v.mehta@asterion.example',
    supplierId: 'sup-001',
    supplierName: 'Orbital Precision Systems',
    title: 'Titanium Star Tracker Mount (Qty 50)',
    category: 'CNC Machining',
    material: 'Titanium Gr5 (Ti-6Al-4V)',
    quantity: 50,
    targetUnitBudget: 180,
    targetDeliveryDays: 14,
    specifications: 'AS9100D compliance mandatory with 100% CMM inspection report. Surface finish Ra 0.8 µm.',
    certificationsRequired: ['AS9100D', 'ISO 9001:2015'],
    attachments: [
      { name: 'Gimbal_Bracket_RevB.step', sizeKb: 3450, type: 'STEP 3D' },
      { name: 'Quality_Inspection_Criteria.pdf', sizeKb: 820, type: 'PDF Spec' },
    ],
    status: 'quoted',
    createdAt: '2026-08-18T10:30:00Z',
    quote: {
      supplierId: 'sup-001',
      supplierName: 'Orbital Precision Systems',
      unitPrice: 165,
      currency: 'USD',
      toolingCost: 450,
      estimatedLeadDays: 12,
      notes: 'Raw material Ti-6Al-4V batch in stock. Zeiss CMM protocol included with first article inspection report (FAIR).',
      quotedAt: '2026-08-19T08:15:00Z',
      validUntil: '2026-09-19T00:00:00Z',
    },
  },
  {
    id: 'rfq-802',
    buyerId: 'buyer-demo',
    buyerName: 'Vikram Mehta',
    buyerCompany: 'Asterion Satellite Systems',
    buyerEmail: 'v.mehta@asterion.example',
    supplierId: 'sup-002',
    supplierName: 'Launchframe Structures',
    title: 'Aluminium Satellite Avionics Chassis',
    category: 'Sheet Metal & Fabrication',
    material: 'Aluminum 5052-H32',
    quantity: 100,
    targetUnitBudget: 65,
    targetDeliveryDays: 10,
    specifications: 'Lightweight formed chassis, controlled flatness, deburred edges, hardware inserts and material traceability required.',
    certificationsRequired: ['ISO 9001:2015'],
    attachments: [
      { name: 'Satellite_Avionics_Chassis_RevA.dxf', sizeKb: 2100, type: 'DXF' },
    ],
    status: 'submitted',
    createdAt: '2026-08-19T14:20:00Z',
  },
];

export function useAppStore() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('buyer');
  const [theme, setThemeState] = useState<AppTheme>('light');
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [activeSupplierId, setActiveSupplierId] = useState<string>('sup-001');
  const [filters, setFilters] = useState<SearchFilterState>(INITIAL_FILTERS);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['sup-001', 'sup-006']);
  const [comparedIds, setComparedIds] = useState<string[]>(['sup-001', 'sup-006']);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [orders, setOrders] = useState<SourcingOrder[]>(INITIAL_ORDERS);
  
  // Modals state
  const [selectedSupplierForProfile, setSelectedSupplierForProfile] = useState<Supplier | null>(null);
  const [selectedSupplierForRfq, setSelectedSupplierForRfq] = useState<Supplier | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isSupplierAuthOpen, setIsSupplierAuthOpen] = useState(false);
  const [isRequirementOpen, setIsRequirementOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-rfqs' | 'bookmarks'>('discover');

  // Handle Theme
  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Compute ranked suppliers
  const rankedResults = rankSuppliers(suppliers, filters);

  // Sign In / Authenticate User
  const signInUser = (
    newRole: UserRole, 
    profile?: Partial<UserProfile>,
    supplierId?: string
  ) => {
    setRole(newRole);
    if (supplierId) {
      setActiveSupplierId(supplierId);
    }
    setCurrentUser({
      name: profile?.name || (newRole === 'buyer' ? 'Vikram Mehta' : newRole === 'supplier' ? 'Rajesh Sharma' : 'Platform Auditor'),
      email: profile?.email || (newRole === 'buyer' ? 'v.mehta@asterion.example' : newRole === 'supplier' ? 'info@orbital.example' : 'audit@constellar.example'),
      company: profile?.company || (newRole === 'buyer' ? 'Asterion Satellite Systems' : newRole === 'supplier' ? 'Orbital Precision Systems' : 'Constellar Bureau'),
      role: newRole,
      industry: profile?.industry,
      categoryNeed: profile?.categoryNeed,
    });
    setIsAuthenticated(true);
    setActiveTab('discover');
  };

  // Bookmark actions
  const toggleBookmark = (supplierId: string) => {
    setBookmarkedIds(prev => 
      prev.includes(supplierId) ? prev.filter(id => id !== supplierId) : [...prev, supplierId]
    );
  };

  // Compare actions
  const toggleCompare = (supplierId: string) => {
    setComparedIds(prev => {
      if (prev.includes(supplierId)) return prev.filter(id => id !== supplierId);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, supplierId];
    });
  };

  // RFQ Submission
  const submitRfq = (newRfqData: Omit<RFQ, 'id' | 'createdAt' | 'status'>) => {
    const newRfq: RFQ = {
      ...newRfqData,
      id: `rfq-${Math.floor(100 + Math.random() * 900)}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    setRfqs(prev => [newRfq, ...prev]);
    return newRfq;
  };

  const submitGeneralRequirement = (
    requirement: Omit<RFQ, 'id' | 'createdAt' | 'status' | 'supplierId' | 'supplierName'>
  ) => {
    const newRfq: RFQ = {
      ...requirement,
      id: 'rfq-' + Date.now(),
      supplierId: 'marketplace',
      supplierName: 'Awaiting Constellar Match',
      status: 'under_review',
      createdAt: new Date().toISOString(),
    };
    setRfqs(prev => [newRfq, ...prev]);
    return newRfq;
  };

  const routeRfqToSupplier = (rfqId: string, supplierId: string) => {
    const target = suppliers.find(supplier => supplier.id === supplierId);
    if (!target) return;
    setRfqs(prev => prev.map(rfq => rfq.id === rfqId
      ? { ...rfq, supplierId: target.id, supplierName: target.name, status: 'submitted' }
      : rfq
    ));
  };

  // Supplier quote submit
  const respondToRfq = (rfqId: string, quote: RfqQuote) => {
    setRfqs(prev => prev.map(item => {
      if (item.id === rfqId) {
        return {
          ...item,
          status: 'quoted',
          quote,
        };
      }
      return item;
    }));
  };

  // Buyer accepts quote and creates an order!
  const acceptQuote = (rfqId: string) => {
    const targetRfq = rfqs.find(r => r.id === rfqId);
    if (targetRfq && targetRfq.quote) {
      const newOrder: SourcingOrder = {
        id: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        rfqId,
        partName: targetRfq.title,
        supplierName: targetRfq.supplierName,
        buyerCompany: targetRfq.buyerCompany,
        quantity: targetRfq.quantity,
        unitPrice: targetRfq.quote.unitPrice,
        totalAmount: targetRfq.quote.unitPrice * targetRfq.quantity + targetRfq.quote.toolingCost,
        status: 'in_production',
        orderDate: new Date().toISOString().split('T')[0],
        estDeliveryDate: new Date(Date.now() + (targetRfq.quote.estimatedLeadDays || 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        trackingNumber: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        inspectionCertAttached: false,
      };
      setOrders(prev => [newOrder, ...prev]);
    }
    setRfqs(prev => prev.map(item => item.id === rfqId ? { ...item, status: 'accepted' } : item));
  };

  // Admin toggles verification badge
  const toggleSupplierVerification = (supplierId: string) => {
    setSuppliers(prev => prev.map(sup => {
      if (sup.id === supplierId) {
        const nextVerified = !sup.verified;
        return {
          ...sup,
          verified: nextVerified,
          verificationDetails: {
            ...sup.verificationDetails,
            auditStatus: nextVerified ? 'verified' : 'pending',
            verifiedDate: nextVerified ? new Date().toISOString().split('T')[0] : undefined,
          },
        };
      }
      return sup;
    }));
  };

  // Register new supplier
  const registerNewSupplier = (newSupplier: Supplier) => {
    setSuppliers(prev => [newSupplier, ...prev]);
    setActiveSupplierId(newSupplier.id);
    setIsAuthenticated(true);
    setRole('supplier');
    setCurrentUser({
      name: newSupplier.contact.contactPerson,
      email: newSupplier.contact.email,
      company: newSupplier.name,
      role: 'supplier',
    });
  };

  // Supplier logs in
  const loginSupplier = (supplierId: string) => {
    setActiveSupplierId(supplierId);
    setRole('supplier');
    const sup = suppliers.find(s => s.id === supplierId);
    setCurrentUser({
      name: sup?.contact.contactPerson || 'Manufacturer',
      email: sup?.contact.email || 'plant@supplier.com',
      company: sup?.name || 'Manufacturing Plant',
      role: 'supplier',
    });
    setIsAuthenticated(true);
  };

  // Supplier edits profile
  const updateSupplierProfile = (updated: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  // Log Out (Returns user to Initial Landing Gateway)
  const logOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setRole('buyer');
    setActiveTab('discover');
    setFilters(INITIAL_FILTERS);
  };

  return {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    signInUser,
    role,
    setRole,
    theme,
    setTheme,
    suppliers,
    activeSupplierId,
    setActiveSupplierId,
    loginSupplier,
    registerNewSupplier,
    filters,
    setFilters,
    rankedResults,
    bookmarkedIds,
    toggleBookmark,
    comparedIds,
    toggleCompare,
    rfqs,
    orders,
    submitRfq,
    submitGeneralRequirement,
    routeRfqToSupplier,
    respondToRfq,
    acceptQuote,
    toggleSupplierVerification,
    updateSupplierProfile,
    logOut,
    selectedSupplierForProfile,
    setSelectedSupplierForProfile,
    selectedSupplierForRfq,
    setSelectedSupplierForRfq,
    isComparisonOpen,
    setIsComparisonOpen,
    isSupplierAuthOpen,
    setIsSupplierAuthOpen,
    isRequirementOpen,
    setIsRequirementOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    activeTab,
    setActiveTab,
  };
}
