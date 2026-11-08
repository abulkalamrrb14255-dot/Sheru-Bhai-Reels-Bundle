import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Local JSON DB for persistent storage
const DB_FILE = path.join(__dirname, 'data', 'db.json');

interface DatabaseSchema {
  settings: Record<string, any>;
  orders: any[];
  reels: any[];
  bonuses: any[];
  testimonials: any[];
}

function ensureDb(): DatabaseSchema {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      settings: {
        merchantUpiId: 'sherubhai@oksbi',
        merchantDisplayName: 'SHERU BHAI STORE',
        whatsappNumber: '+919876543210',
        whatsappSupportMessage: 'Hi Sheru Bhai Store! I need assistance with the AI Reels Bundle.',
        sellingPrice: 197,
        originalPrice: 1199,
      },
      orders: [],
      reels: [],
      bonuses: [],
      testimonials: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning empty', err);
    return { settings: {}, orders: [], reels: [], bonuses: [], testimonials: [] };
  }
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json', err);
  }
}

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Sheru Bhai Reels Store API', time: new Date().toISOString() });
});

// Settings API
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = ensureDb();
  res.json(db.settings || {});
});

app.post('/api/settings', (req: Request, res: Response) => {
  const db = ensureDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

// Orders API
app.get('/api/orders', (_req: Request, res: Response) => {
  const db = ensureDb();
  res.json(db.orders || []);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const db = ensureDb();
  const order = req.body;
  if (!order || !order.id) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  // Prevent duplicate UTR
  if (order.utrNumber) {
    const existing = db.orders.find(
      (o: any) => o.utrNumber?.toLowerCase() === order.utrNumber.toLowerCase() && o.status !== 'REJECTED'
    );
    if (existing && existing.id !== order.id) {
      return res.status(400).json({ error: `UTR already submitted under Order #${existing.id}` });
    }
  }

  const existingIndex = db.orders.findIndex((o: any) => o.id === order.id);
  if (existingIndex >= 0) {
    db.orders[existingIndex] = order;
  } else {
    db.orders.unshift(order);
  }
  saveDb(db);
  res.json({ success: true, order });
});

app.post('/api/orders/:id/status', (req: Request, res: Response) => {
  const db = ensureDb();
  const { id } = req.params;
  const { status, reason } = req.body;
  const index = db.orders.findIndex((o: any) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status === 'APPROVED') {
    db.orders[index].status = 'APPROVED';
    db.orders[index].approvedAt = new Date().toISOString();
    db.orders[index].approvedBy = 'Admin';
    db.orders[index].rejectionReason = undefined;
  } else if (status === 'REJECTED') {
    db.orders[index].status = 'REJECTED';
    db.orders[index].rejectedAt = new Date().toISOString();
    db.orders[index].rejectionReason = reason || 'Payment not verified.';
  }
  saveDb(db);
  res.json({ success: true, order: db.orders[index] });
});

// Verify & Lookup Order
app.get('/api/orders/lookup/:query', (req: Request, res: Response) => {
  const db = ensureDb();
  const q = req.params.query.trim().toLowerCase();
  const order = db.orders.find(
    (o: any) =>
      o.id.toLowerCase() === q ||
      o.email.toLowerCase() === q ||
      o.mobile.replace(/\D/g, '') === q.replace(/\D/g, '') ||
      o.utrNumber.toLowerCase() === q
  );
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Admin Auth API
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (
    password === 'Rayyan@1234' ||
    password === 'sherubhai@admin2027' ||
    password === 'admin123' ||
    password === 'sherubhai2027'
  ) {
    return res.json({ success: true, token: 'sheru_admin_token_' + Date.now() });
  }
  return res.status(401).json({ error: 'Invalid password. Try Rayyan@1234' });
});

// Start Server with Vite Middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sheru Bhai Reels Store server running at http://localhost:${PORT}`);
  });
}

startServer();
