import { Agent, Buyer, InventoryItem, BuyerRequirement, LogActivity } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'AGT-4492-BX',
    name: 'Alexander Sterling',
    companyName: 'Sterling Global Realty',
    mobileNo: '+1 (555) 012-3456',
    emailId: 'a.sterling@dealbridge.com',
    reraNo: '#RERA-8832-TX-2024',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn-nUCpaWnqcC1zsXBZKXgOpcBbwKeZhKjUX2oqZJwYCW3O4USfRvD6y3IVqpSbe5f9v4PT8pskBwdUF5gBm_UBvUMm39dttBXmaJ5WdRngBp_R8x1pW5Rgz-XrJHXPP-fsng4eM5cU4WKnH5TAyAihfK6W1xv9IOuBmr5vT7Tx55vzc6y2rbzp1X-cz8ce5u6yuj3REisTDK4K8L3PtOoiIxO_7o2rBoQeGf6iSma1z_yZ02eRPxw-GoWK8KwICTDYGVpWuepaA22'
  }
];

export const INITIAL_BUYERS: Buyer[] = [
  {
    id: 'BY-5098-TH',
    name: 'Marcus Thorne',
    companyName: 'Thorne Capital Partners',
    mobileNo: '+1 (555) 987-6543',
    emailId: 'm.thorne@thornecapital.com',
    reraNo: '#RERA-8832-TX-2024',
    portfolioSize: '$25M - $100M',
    primaryAssetClass: 'Commercial',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXu-t4tFILC86BV5-pups-w_Ab5jKF1wSyo2glfXkwvivWX-IkdzOSKym8yV9290ARGk9bhS6ks7vSyxIk7Afgcw1wuWXPCa9CyJaVtS2ja7TzqCu6ago22GY5sjqqx8dSTfPthQ16cw-tD8ZQiYFNVH2XDiTCaD9pac-2sIuC6Ss9pps_y7O281NnswK88-Rbqq1H6KJ23FpIRdA-pmRPYj8PHExB5M0mbhGc5ThKHMrJ8nvgXzIfcMsgsq0iEEqJUB_Fh8u9GRQEgz'
  },
  {
    id: 'BY-3291-JK',
    name: 'Sarah Jenkins',
    companyName: 'Deal Bridge Tech Acquisitions',
    mobileNo: '+1 (555) 321-0987',
    emailId: 's.jenkins@dealbridgetech.com',
    reraNo: '#RERA-1192-B-02',
    portfolioSize: '$100M+',
    primaryAssetClass: 'Technology & Office',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQC7thwdkxIcQrYHc7kTlekE9_-4k_TYL3Lsx5pA6PXTjATj2vj7ihPaly9_yInfliMkKFX51wyxHYxbd7_bY5kQg5zw76msIia2rc--4D3SOtC3eESdTYaOpFiXIENZsK50Giyjl_9tvIbVggw3luQ2mDtjo7otpntp6aJyKi0eYafc-6in_96UmD6F5oQtMjAe822Mqw9gKVuCQDQq1wfzd0SoQt7GnnAk8_NjxpLYsaCUDcCPX5_a6DlhQlbc5rKXfbVEO6YkAv'
  }
];

export const INITIAL_LISTINGS: InventoryItem[] = [
  {
    id: 'DB-4921',
    title: 'Prime Commercial Complex',
    type: 'Commercial',
    location: 'Mayfair W1, London',
    budgetRange: '$40M - $45M',
    configuration: 'Grade A Corporate Office Space, 8 floors',
    totalSize: '22,400 SQ FT',
    paymentMethod: 'Escrow / Smart Contract',
    purpose: 'Sale',
    valuation: '$42.5M',
    yieldOpt: 'Yield: 6.5%',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0Ki-7X9Z9KSHjlO9E8T3-EXMdWO3hpCg3i0xdPC9PZntJwwj6a_lJszZ6N-FEkCZ_z18vcDoNAT-oBsV0Z5kJpz40qJxIgT2Hwm4rsjA0BBNjUF3PpmwYAF-T9x1ll5zWQ0NJEiNUR5icva7O5huSRpWeMZLBeIHnyPkTLO6xGQmQAOiws0AgckDQafWHyJo-_56Cx6rZiKc718SMq1zSLq15PxD5_4WPsmPLEKSClv_BNs4Gbt8Y7v_r5MlS0a0FyDM-3Qsu5ixp',
    tags: ['Leased', 'Fiber Optic Ready', 'A-Grade', 'LEED Certified'],
    description: 'A striking glass and steel premium commercial complex in the heart of London\'s prestigious Mayfair region, delivering steady rental yields of 6.5%.',
    matchScore: 98
  },
  {
    id: 'DB-5022',
    title: 'Metro Logistics Hub',
    type: 'Industrial',
    location: 'Jurong Industrial Estate, Singapore',
    budgetRange: '$15M - $20M',
    configuration: 'Bare Shell Warehousing, Grade A High Floor Class',
    totalSize: '24,000 SQ FT',
    paymentMethod: 'Wire Transfer',
    purpose: 'Sale',
    valuation: '$18.2M',
    yieldOpt: 'Yield: 7.2%',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAheSKeQ6_5O-Rx39JYmBWF7lsL_nmVHaDduAQPTxDxDx9gZtkZ0fgbJBfPLPYgcaD_ALy-VTewUOZVHOe3mdfT1LvwBHK2eKHoUjZyuRjUYbJ0sETain64PfAOcAokeqKOSpYROZ18Knp5gs4TId_62Ei8CkRZG_l39HLO7rPZfg2ehYnUtI0IkjouwQvGPx_z9WYKf7eomwSo7HOG8jm61uNBQkKtWvSDutFY_VnIm-uwghQAaECEJW4iB0LOKqqk--Cdbkz006b2',
    tags: ['Full Occupancy', 'Logistics', 'Solar Ready', '24/7 Security'],
    description: 'High-volume container logistics hub with pre-approved industrial solar panel grid clearances and high vertical clearances.',
    matchScore: 92
  },
  {
    id: 'DB-2191',
    title: 'Orchard Gateway Plaza',
    type: 'Retail',
    location: 'Orchard Road Corridor, Singapore',
    budgetRange: '$120M - $130M',
    configuration: 'Multi-Anchor Retail Complex',
    totalSize: '45,000 SQ FT',
    paymentMethod: 'Institutional Bank Transfer',
    purpose: 'Sale',
    valuation: '$125.0M',
    yieldOpt: 'Yield: 5.8%',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAFhl3cweX4il3IQAn3jdjynNGcTFo0ddf8cH0I2qXsePRPF0PlPT-wqPIAixrfFZuz_xQ40QEuh-cAjhDmbQBZq7zXGcS5qgYYIFjLlCeON7Ik0E_AzGM-OkWrl2m52Ndie_PylJyj65bvlllwQGVoL_vdbjFV4rHMiz9GljN8idapY-wquAXnvbuRZBrrGJmzwLQFuUwNPISWwjrrOkxYUaew96s3UKp0mKoKZjKP-xDtRhnzerIf80zNG0pWYTTn5RM-cPUfQeC',
    tags: ['Mixed-Use', 'Prime Location', 'High Footfall', 'Executive Lounge'],
    description: 'Vibrant retail gateway plaza featuring prominent anchor storefronts and extensive courtyard cafe dining spaces.',
    matchScore: 85
  },
  {
    id: 'DB-8812',
    title: 'Heritage Residences Portfolio',
    type: 'Multi-Family',
    location: 'Multiple Premium Districts, Singapore',
    budgetRange: '$80M - $95M',
    configuration: '12 Multi-Family Premium Apartments',
    totalSize: '65,000 SQ FT',
    paymentMethod: 'Escrow / Smart Contract',
    purpose: 'Sale',
    valuation: '$89.7M',
    yieldOpt: 'Yield: 8.1%',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC27mJ_bqHwOBk0Pbie-uSFYdA_89dGC7rg397Evu1w1oT9JgeL_Om-a6eZyql6D0HBIPkFPza5LTHBC8wxCqBfvvO8pCNxyxA5FfhI-NLQfeNOfhRegORkSIl9ewpYerRNWfOvb9U42FYhyFLv0zRSk_ILprDpDqC_J7-bjsTng6Bvkh_Rh0_z9otTRDxhqZx9YoCdSsWuDYQvQF0K8FloxCK6oFOHEceWS6rZZfdXxdO8y7edlQFw2uJ7avfRjJbBsW4ye5NjoPBY',
    tags: ['Institutional Quality', 'Value-Add', 'Sustainable Wood', 'Balcony Gardens'],
    description: 'Diversified residential block portfolio focusing on architectural sustainability, solid concrete elements, and organic visual integration.',
    matchScore: 94
  },
  {
    id: 'DB-1044',
    title: 'Cyberpark Tier III Center',
    type: 'Data Center',
    location: 'Changi North Science Park, Singapore',
    budgetRange: '$30M - $35M',
    configuration: 'Hyperscale Server Facility',
    totalSize: '18,500 SQ FT',
    paymentMethod: 'All-Cash Transaction',
    purpose: 'Lease/Rent',
    valuation: '$34.1M',
    yieldOpt: 'Triple Net Leased',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSPkgGTKk4RzvnH9-RsZn2GARxvaI4fcE34FPVxNtOp4DnFFjYYe3GCpmBBQr9doD93tiUf-UxLBTsxml0YnZQGUPnP-ZVvW2qXrurVMu42vDDNrzSFJ1xY7V6d6_oIcFo6jM1gI4eqzH4YA1xu19C_dW-MLnjmxz_8yM-9cPx7xxF8G1AOHJwJhOER1YOULQp-ub0FMJGgHbb3Prrgf_v7tX3GZ6Q_ZIVw5bDpF6H87vSQtj4IVNewsW7GLms1GeH45sFPH7B0-hW',
    tags: ['Triple Net Leased', 'High Power', 'Fiber Grid Multi-Route', 'Secure Perimeter'],
    description: 'Critical digital infrastructure with state-of-the-art chiller systems, secure dual entrance logic, and multi-threaded grid power connections.',
    matchScore: 91
  }
];

export const INITIAL_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 'REQ-101',
    buyerId: 'BY-5098-TH',
    targetLocation: 'Mayfair District, London',
    sizeRequired: '15,000 - 25,000 SQ FT',
    societyName: 'Mayfair Commercial Plaza',
    configuration: 'Grade A Office Space',
    minBudget: '$5M',
    maxBudget: '$10M',
    paymentMethod: 'Escrow / Smart Contract',
    purpose: 'Investment'
  },
  {
    id: 'REQ-102',
    buyerId: 'BY-3291-JK',
    targetLocation: 'Changi North, Singapore',
    sizeRequired: '10,000 - 20,000 SQ FT',
    societyName: 'Changi Science Complex',
    configuration: 'Data Center / Light Tech Space',
    minBudget: '$20M',
    maxBudget: '$40M',
    paymentMethod: 'Institutional Bank Transfer',
    purpose: 'Owner-Occupied'
  }
];

export const INITIAL_ACTIVITIES: LogActivity[] = [
  {
    id: 'ACT-001',
    type: 'match',
    title: 'New Match Found',
    description: 'Skyline Loft matches Requirement #REQ-101 (94% Match Score)',
    timestamp: '2m ago',
    tag: 'SUCCESS GREEN',
    color: 'green'
  },
  {
    id: 'ACT-002',
    type: 'update',
    title: 'Price Updated',
    description: 'Orchard Gateway Plaza listing valuation updated to $125.0M',
    timestamp: '1h ago',
    tag: 'AGENT BLUE',
    color: 'blue'
  },
  {
    id: 'ACT-003',
    type: 'post',
    title: 'New Inventory Posting',
    description: 'Cyberpark Tier III Center hyperscale server facility added to the network.',
    timestamp: '3h ago',
    tag: 'SYSTEM INTEGRITY',
    color: 'gray'
  }
];
