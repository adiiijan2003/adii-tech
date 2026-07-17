import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms-content.json');
const MEDIA_DIR = path.join(__dirname, 'public', 'media', 'uploads');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(MEDIA_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, MEDIA_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || 'file');
    const safeName = (file.originalname || 'upload').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, `${Date.now()}-${randomUUID()}${ext ? ext : ''}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const defaultCmsContent = {
  hero: {
    badge: 'FOUNDER & DIGITAL SYSTEMS ARCHITECT',
    titleLead: 'Innovative',
    rotatingWords: ['Multi-Disciplinary Technologist', 'Software Engineer', 'Cybersecurity Specialist'],
    name: 'Adeel Khan',
    description: 'Building secure, modern, production-ready digital experiences.',
    primaryCta: 'Explore Projects & Systems',
    secondaryCta: 'Schedule Consultation',
    imageUrl: '/media/hero-profile.jpg',
    stats: [
      { value: '12K+', label: 'STUDENTS' },
      { value: '13+', label: 'SYSTEMS READY' },
      { value: '100%', label: 'SUCCESS RATE' },
    ],
  },
  gallery: [],
  projects: [],
  courses: [],
  customSections: [],
  branding: {
    logoUrl: '',
    logoIcon: 'A',
    logoSize: 'medium',
    brandName: 'ADI TECH',
    showBrandName: true,
    brandSubtitle: 'Software House',
    showBrandSubtitle: true,
    headerGradient: 'linear-gradient(90deg, #0029a3, #0704e7, #1a0057)',
    headerBackgroundColor: '#08080C',
    contactPhone: '92 320 7914 669',
    contactEmail: 'admin@aditech.com',
    whatsappNumber: '923207914669',
  },
  theme: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#facc15',
    textDark: '#1e293b',
    textLight: '#f1f5f9',
    backgroundColor: '#ffffff',
    accentBackground: '#fef3c7',
  },
  footer: {
    companyDescription: 'Building exceptional digital experiences.',
    socialLinks: [],
    quickLinks: [],
    copyrightText: '© 2026 ADI TECH. All rights reserved.',
    showNewsletter: true,
  },
  elements: {
    borderRadius: 'rounded',
    buttonStyle: 'solid',
    cardShadow: 'medium',
    spacing: 'normal',
    fontSize: 'normal',
    headerPosition: 'sticky',
    showAnimations: true,
    showBreadcrumbs: true,
    showScrollTop: true,
  },
  updatedAt: new Date().toISOString(),
};

function readCmsContent() {
  if (!fs.existsSync(CMS_FILE)) {
    writeCmsContent(defaultCmsContent);
    return defaultCmsContent;
  }

  try {
    return JSON.parse(fs.readFileSync(CMS_FILE, 'utf8'));
  } catch (error) {
    console.error('Unable to read CMS file', error);
    return defaultCmsContent;
  }
}

function writeCmsContent(payload) {
  fs.writeFileSync(CMS_FILE, JSON.stringify(payload, null, 2));
}

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/cms', (_req, res) => {
  res.json(readCmsContent());
});

app.post('/api/cms', (req, res) => {
  const payload = req.body || defaultCmsContent;
  writeCmsContent({ ...payload, updatedAt: new Date().toISOString() });
  res.json(payload);
});

app.get('/api/media', (_req, res) => {
  const files = fs
    .readdirSync(MEDIA_DIR)
    .filter((name) => !name.startsWith('.'))
    .map((name) => {
      const fullPath = path.join(MEDIA_DIR, name);
      const stat = fs.statSync(fullPath);
      return {
        id: name,
        title: name,
        type: path.extname(name).toLowerCase().match(/\.(png|jpg|jpeg|webp|svg|gif|mp4|mov|webm|pdf|zip)$/)
          ? 'file'
          : 'file',
        url: `/media/uploads/${name}`,
        createdAt: stat.birthtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  res.json(files);
});

app.post('/api/media/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    id: req.file.filename,
    title: req.file.originalname,
    type: req.file.mimetype || 'application/octet-stream',
    url: `/media/uploads/${req.file.filename}`,
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

app.get('*', (_req, res) => {
  const indexFile = path.join(distDir, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(200).send('<!doctype html><html><body><h1>Adi Tech CMS is running</h1></body></html>');
  }
});

app.listen(PORT, () => {
  console.log(`Adi Tech CMS API listening on http://localhost:${PORT}`);
});
