// src/lib/utils/fileUpload.js
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function saveImageToStaticFolder(imageFile: File) {
    try {
        // Create static/images directory if it doesn't exist
        const staticDir = path.join(process.cwd(), 'static', 'images');
        await fs.mkdir(staticDir, { recursive: true });

        // Generate unique filename
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = path.join(staticDir, fileName);

        // Save file
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        return `/images/${fileName}`;
    } catch (error) {
        console.error('Error saving image:', error);
        throw new Error('Failed to save image');
    }
}