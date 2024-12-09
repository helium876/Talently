import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function toJSON(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString()
    }
    return value
  }))
}

export function serializeMongooseObject<T>(obj: any): T {
  if (!obj) return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeMongooseObject(item)) as T;
  }

  // Handle dates
  if (obj instanceof Date) {
    return obj.toISOString() as any;
  }

  // Handle Buffer (for userId)
  if (Buffer.isBuffer(obj)) {
    return obj.toString('hex') as any;
  }

  // Convert Mongoose document to plain object
  const plainObj = obj.toObject ? obj.toObject() : obj;

  // Recursively serialize all nested objects and handle special types
  const serialized = Object.entries(plainObj).reduce((acc, [key, value]) => {
    if (key === '_id' || key.endsWith('Id')) {
      acc[key] = value.toString();
    } else if (Buffer.isBuffer(value)) {
      acc[key] = value.toString('hex');
    } else if (value instanceof Date) {
      acc[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      acc[key] = value.map(item => serializeMongooseObject(item));
    } else if (value && typeof value === 'object') {
      acc[key] = serializeMongooseObject(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as any);

  // Convert _id to id if it exists
  if (serialized._id) {
    serialized.id = serialized._id;
    delete serialized._id;
  }

  // Remove Mongoose internal fields
  delete serialized.__v;
  delete serialized.$__;
  delete serialized.$isNew;

  return serialized as T;
} 

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
} 