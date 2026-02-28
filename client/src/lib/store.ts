import { create } from 'zustand';

export type ClaimStatus = 'Submitted' | 'AI Processed' | 'Pre-Approved' | 'Under Manual Review' | 'Finalized';

export type Damage = {
  part: string;
  type: string;
  severity: 'Minor' | 'Medium' | 'Severe';
  confidence: number;
};

export type Claim = {
  id: string;
  date: string;
  status: ClaimStatus;
  vehicle: {
    brand: string;
    model: string;
    variant: string;
    year: string;
    engine: string;
    policyType: 'Comprehensive' | 'Third Party';
    policyNumber: string;
  };
  damages: Damage[];
  estimate: {
    parts: number;
    paint: number;
    labor: number;
    total: number;
    deductible: number;
    insurancePayable: number;
    customerPayable: number;
  };
  repairDuration: string;
  aiRiskScore: 'Low' | 'Medium' | 'High';
  aiConfidence: number;
  remarks?: string;
  images: string[];
};

type Store = {
  claims: Claim[];
  addClaim: (claim: Claim) => void;
  updateClaimStatus: (id: string, status: ClaimStatus, remarks?: string) => void;
};

export const useStore = create<Store>((set) => ({
  claims: [
    {
      id: "CLM-8B2A91",
      date: new Date().toISOString(),
      status: "Pre-Approved",
      vehicle: {
        brand: "Toyota",
        model: "Corolla Altis",
        variant: "VX CVT",
        year: "2022",
        engine: "Petrol",
        policyType: "Comprehensive",
        policyNumber: "POL-12345-67"
      },
      damages: [
        { part: "Front Bumper", type: "Dent", severity: "Severe", confidence: 92 },
        { part: "Left Door", type: "Scratch", severity: "Medium", confidence: 85 },
        { part: "Headlight", type: "Broken", severity: "Severe", confidence: 96 }
      ],
      estimate: {
        parts: 18000,
        paint: 8000,
        labor: 5400,
        total: 31400,
        deductible: 1570,
        insurancePayable: 29830,
        customerPayable: 1570
      },
      repairDuration: "2–4 days",
      aiRiskScore: "Low",
      aiConfidence: 91,
      images: []
    }
  ],
  addClaim: (claim) => set((state) => ({ claims: [claim, ...state.claims] })),
  updateClaimStatus: (id, status, remarks) => set((state) => ({
    claims: state.claims.map(c => c.id === id ? { ...c, status, remarks: remarks || c.remarks } : c)
  }))
}));