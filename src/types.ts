export interface Agent {
  id: string;
  name: string;
  companyName: string;
  mobileNo: string;
  emailId: string;
  reraNo?: string;
  avatarUrl: string;
}

export interface Buyer {
  id: string;
  name: string;
  companyName: string;
  mobileNo: string;
  emailId: string;
  reraNo?: string;
  portfolioSize: string;
  primaryAssetClass: string;
  avatarUrl: string;
}

export interface InventoryItem {
  id: string;
  title: string;
  type: 'Commercial' | 'Retail' | 'Industrial' | 'Multi-Family' | 'Office' | 'Mixed-Use' | 'Data Center';
  location: string;
  budgetRange: string;
  configuration: string;
  totalSize: string;
  paymentMethod: string;
  purpose: 'Lease/Rent' | 'Sale';
  valuation: string;
  yieldOpt?: string;
  status: 'Active' | 'Pending' | 'Closed';
  image: string;
  tags: string[];
  description?: string;
  matchScore?: number;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  targetLocation: string;
  sizeRequired: string;
  societyName?: string;
  configuration: string;
  minBudget: string;
  maxBudget: string;
  paymentMethod: string;
  purpose: 'Investment' | 'Owner-Occupied';
}

export interface LogActivity {
  id: string;
  type: 'match' | 'update' | 'post';
  title: string;
  description: string;
  timestamp: string;
  tag: string;
  color: 'green' | 'blue' | 'gray';
}
