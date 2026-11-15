import { leads as sampleLeads } from "@/lib/admin-data";
import {
  products as sampleProducts,
  type Product,
  type QuoteStatus,
  type QuoteSubmission,
  type StoreOrder,
} from "@/data/mockData";

export type { QuoteSubmission as QuoteLead } from "@/data/mockData";

type MockDatabase = {
  leads: QuoteSubmission[];
  orders: StoreOrder[];
  products: Product[];
};

const globalForMockDb = globalThis as typeof globalThis & {
  jamJamMockDatabase?: MockDatabase;
};

const sampleStatus: QuoteStatus[] = ["new", "contacted", "new", "contacted"];

export const database =
  globalForMockDb.jamJamMockDatabase ??
  (globalForMockDb.jamJamMockDatabase = {
    leads: sampleLeads.map<QuoteSubmission>((lead, index) => ({
      id: `sample-lead-${index + 1}`,
      name: lead.name,
      phone: lead.phone,
      service: lead.service,
      buildingType: "نامشخص",
      stops: 0,
      details: lead.details,
      status: sampleStatus[index],
      createdAt: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
    })),
    orders: [] as StoreOrder[],
    products: sampleProducts.map((product) => ({ ...product, specs: [...product.specs] })),
  });

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
