import fs from 'fs';
import { IncomingForm } from 'formidable';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      keepExtensions: true,
      uploadDir: null
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { files } = await parseForm(req);
      if (!files.file || files.file.length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const file = files.file[0];
      const fileBuffer = file.filepath ? fs.readFileSync(file.filepath) : file;
      // Generate a unique filename
      const ext = file.originalFilename.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
      const blob = await put(uniqueName, fileBuffer, { access: 'public' });
      return res.status(200).json(blob);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}