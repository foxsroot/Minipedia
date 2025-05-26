import type { TokoSummary } from "./Toko";

export interface Barang {
    barangId: string;
    namaBarang: string;
    fotoBarang: string;
    deskripsiBarang: string;
    stokBarang: number;
    hargaBarang: number;
    kategoriProduk: string;
    diskonProduk?: number;
    toko: TokoSummary;
    jumlahTerjual: number;
    createdAt?: Date;
    updatedAt?: Date;
}