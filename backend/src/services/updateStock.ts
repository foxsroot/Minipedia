import { Barang } from "../models/index";
import { ApiError } from "../utils/ApiError";

export async function updateStock(barangId: string, minQuantity: number) {
    try {
        const barang = await Barang.findByPk(barangId);

        if (!barang) {
            throw new ApiError(404, `Barang with id ${barangId} not found`);
        }

        if (barang.stokBarang < minQuantity) {
            throw new ApiError(400, `Insufficient stock for barangId ${barangId}. Available: ${barang.stokBarang}, Required: ${minQuantity}`);
        }

        barang.stokBarang += minQuantity;
        await barang.save();
        return barang;
    } catch (error) {
        console.error(`Failed to update stock for barangId ${barangId}:`, error);
        throw new ApiError(500, error instanceof Error ? error.message : 'Failed to update stock');
    }
}