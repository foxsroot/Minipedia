import type { Barang } from "./Barang";

export interface TokoSummary {
    namaToko: string;
    lokasiToko: string;
}

export interface TokoDetail extends TokoSummary {
    tokoId: string;
    userId: string;
    barang: Barang[];
}