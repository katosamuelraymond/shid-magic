import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Max file size: 50MB (50 * 1024 * 1024 bytes)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided for upload.' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${file.name}" exceeds the maximum allowed size of 50MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
          },
          { status: 400 }
        );
      }

      // Validate mime type
      const mime = file.type;
      if (!mime.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" is not a supported image format.` },
          { status: 400 }
        );
      }

      // Generate clean unique filename
      const ext = path.extname(file.name) || '.jpg';
      const safeName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, safeName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(filePath, buffer);

      // Return public URL path
      uploadedUrls.push(`/uploads/${safeName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
