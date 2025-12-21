// Transaction data model and fraud detection logic

export interface Transaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  transaction_type: 'Debit' | 'Credit';
  location: string;
  timestamp: Date;
  device: 'ATM' | 'UPI' | 'POS' | 'Online';
  status: 'Normal' | 'Suspicious';
  fraud_reason?: string;
}

export interface NodeStatus {
  id: string;
  name: string;
  status: 'active' | 'failed';
  transactions: number;
  lastSync: Date;
  dataSize: string;
}

export interface FraudAlert {
  id: string;
  transaction: Transaction;
  alertType: 'High Amount' | 'Location Anomaly' | 'Velocity' | 'Device Anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface AnalyticsData {
  totalTransactions: number;
  fraudCount: number;
  normalCount: number;
  totalVolume: number;
  avgTransactionSize: number;
  highRiskAccounts: string[];
  hourlyTrend: { hour: string; count: number; fraud: number }[];
  deviceDistribution: { device: string; count: number }[];
  locationDistribution: { location: string; count: number }[];
}

// Locations for realistic data
const LOCATIONS = [
  'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Chennai, India',
  'Kolkata, India', 'Hyderabad, India', 'Pune, India', 'Ahmedabad, India',
  'London, UK', 'New York, USA', 'Dubai, UAE', 'Singapore'
];

const DEVICES: Transaction['device'][] = ['ATM', 'UPI', 'POS', 'Online'];

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate realistic account ID
const generateAccountId = () => {
  const prefix = ['ACC', 'SB', 'CA'][Math.floor(Math.random() * 3)];
  return `${prefix}${Math.floor(Math.random() * 9000000000) + 1000000000}`;
};

// Track recent transactions for velocity detection
const recentTransactions: Map<string, Transaction[]> = new Map();

// Fraud detection rules
export const detectFraud = (transaction: Transaction): { isFraud: boolean; reason?: string } => {
  // Rule 1: Very high transaction amount (> 500,000)
  if (transaction.amount > 500000) {
    return { isFraud: true, reason: 'Unusually high transaction amount' };
  }

  // Rule 2: High amount for Debit transactions (> 200,000)
  if (transaction.transaction_type === 'Debit' && transaction.amount > 200000) {
    return { isFraud: true, reason: 'High debit amount' };
  }

  // Rule 3: Velocity check - too many transactions in short time
  const accountTransactions = recentTransactions.get(transaction.account_id) || [];
  const recentCount = accountTransactions.filter(
    t => new Date().getTime() - t.timestamp.getTime() < 60000 // Last minute
  ).length;
  
  if (recentCount > 5) {
    return { isFraud: true, reason: 'Too many transactions in short time' };
  }

  // Rule 4: Location anomaly - transaction from unusual location
  if (accountTransactions.length > 0) {
    const lastLocation = accountTransactions[accountTransactions.length - 1]?.location;
    const foreignLocations = ['London, UK', 'New York, USA', 'Dubai, UAE', 'Singapore'];
    if (lastLocation && !foreignLocations.includes(lastLocation) && foreignLocations.includes(transaction.location)) {
      return { isFraud: true, reason: 'Sudden location change to foreign country' };
    }
  }

  // Rule 5: Random fraud for demonstration (5% chance)
  if (Math.random() < 0.05) {
    const reasons = [
      'Pattern matches known fraud signature',
      'Device fingerprint mismatch',
      'Unusual transaction time',
      'IP geolocation mismatch'
    ];
    return { isFraud: true, reason: reasons[Math.floor(Math.random() * reasons.length)] };
  }

  return { isFraud: false };
};

// Generate a single transaction
export const generateTransaction = (): Transaction => {
  const accountId = generateAccountId();
  const amount = Math.random() < 0.1 
    ? Math.floor(Math.random() * 900000) + 100000  // 10% high value
    : Math.floor(Math.random() * 50000) + 100;     // Normal range

  const transaction: Transaction = {
    transaction_id: `TXN${generateId().toUpperCase()}`,
    account_id: accountId,
    amount,
    transaction_type: Math.random() > 0.4 ? 'Debit' : 'Credit',
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    timestamp: new Date(),
    device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
    status: 'Normal'
  };

  // Apply fraud detection
  const fraudCheck = detectFraud(transaction);
  if (fraudCheck.isFraud) {
    transaction.status = 'Suspicious';
    transaction.fraud_reason = fraudCheck.reason;
  }

  // Track for velocity detection
  const accountTxns = recentTransactions.get(accountId) || [];
  accountTxns.push(transaction);
  if (accountTxns.length > 20) accountTxns.shift();
  recentTransactions.set(accountId, accountTxns);

  return transaction;
};

// Generate batch of transactions
export const generateBatch = (count: number): Transaction[] => {
  return Array.from({ length: count }, () => generateTransaction());
};

// Calculate analytics from transactions
export const calculateAnalytics = (transactions: Transaction[]): AnalyticsData => {
  const fraudCount = transactions.filter(t => t.status === 'Suspicious').length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // High risk accounts (more than 2 suspicious transactions)
  const accountFraudCount: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.status === 'Suspicious') {
      accountFraudCount[t.account_id] = (accountFraudCount[t.account_id] || 0) + 1;
    }
  });
  const highRiskAccounts = Object.entries(accountFraudCount)
    .filter(([_, count]) => count >= 2)
    .map(([account]) => account);

  // Hourly trend
  const hourlyData: Record<string, { count: number; fraud: number }> = {};
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';
    hourlyData[hour] = { count: 0, fraud: 0 };
  }
  transactions.forEach(t => {
    const hour = t.timestamp.getHours().toString().padStart(2, '0') + ':00';
    hourlyData[hour].count++;
    if (t.status === 'Suspicious') hourlyData[hour].fraud++;
  });

  // Device distribution
  const deviceData: Record<string, number> = {};
  DEVICES.forEach(d => deviceData[d] = 0);
  transactions.forEach(t => deviceData[t.device]++);

  // Location distribution
  const locationData: Record<string, number> = {};
  transactions.forEach(t => {
    locationData[t.location] = (locationData[t.location] || 0) + 1;
  });

  return {
    totalTransactions: transactions.length,
    fraudCount,
    normalCount: transactions.length - fraudCount,
    totalVolume,
    avgTransactionSize: transactions.length > 0 ? totalVolume / transactions.length : 0,
    highRiskAccounts,
    hourlyTrend: Object.entries(hourlyData).map(([hour, data]) => ({
      hour,
      count: data.count,
      fraud: data.fraud
    })),
    deviceDistribution: Object.entries(deviceData).map(([device, count]) => ({
      device,
      count
    })),
    locationDistribution: Object.entries(locationData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([location, count]) => ({ location, count }))
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format timestamp
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Initialize nodes
export const initializeNodes = (): NodeStatus[] => [
  { id: 'node1', name: 'Node 1 (Primary)', status: 'active', transactions: 0, lastSync: new Date(), dataSize: '0 MB' },
  { id: 'node2', name: 'Node 2 (Secondary)', status: 'active', transactions: 0, lastSync: new Date(), dataSize: '0 MB' },
  { id: 'node3', name: 'Node 3 (Backup)', status: 'active', transactions: 0, lastSync: new Date(), dataSize: '0 MB' }
];
