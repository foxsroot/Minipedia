import crypto from 'crypto';

export function encryptField(text: string, secret: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function decryptField(encrypted: string, secret: string): string {
    const [ivHex, encryptedHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export function decryptUserFields(user: any): any {
    const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;

    if (!ENCRYPT_SECRET || ENCRYPT_SECRET.length !== 64) {
        throw new Error('ENCRYPT_SECRET must be a 64-character hex string for decryption.');
    }

    const u = user.toJSON ? user.toJSON() : { ...user };
    const decryptedFields: any = { ...u };

    try {
        if (u.username) {
            decryptedFields.username = decryptField(u.username, ENCRYPT_SECRET);
        }
        if (u.email) {
            decryptedFields.email = decryptField(u.email, ENCRYPT_SECRET);
        }
        if (u.nama) {
            decryptedFields.nama = decryptField(u.nama, ENCRYPT_SECRET);
        }
        if (u.nomorTelpon) {
            decryptedFields.nomorTelpon = decryptField(u.nomorTelpon, ENCRYPT_SECRET);
        }
    } catch (e) {
        console.warn("Error during user field decryption. Returning original (potentially encrypted) values.", e);

        return {
            ...u,
            password: undefined,
        };
    }

    decryptedFields.password = undefined;

    return decryptedFields;
}