import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'VITALIS API is running' });
});

// ============ USER ROUTES ============
app.get('/api/user', (req, res) => {
    try {
        const user = db.prepare('SELECT * FROM users LIMIT 1').get() || {
            id: "u123",
            name: "Alex",
            email: "alex@vitalis.ai",
            points: 2450,
            level: 12,
            streak: 15,
            lastActive: new Date().toISOString()
        };
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

app.patch('/api/user', (req, res) => {
    try {
        const updates = req.body;
        res.json({ success: true, data: { ...updates, id: "u123" } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update user' });
    }
});

// ============ VITALS ROUTES ============
app.get('/api/vitals/current', (req, res) => {
    try {
        const data = {
            heartRate: 72,
            bloodPressure: '120/80',
            glucose: 95,
            oxygenLevel: 98,
            stressLevel: 3,
            temperature: 36.6,
            timestamp: new Date().toISOString(),
        };
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get('/api/vitals/history', (req, res) => {
    try {
        // Return mock historical data
        const days = parseInt(req.query.days as string) || 30;
        const data = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            data.push({
                date: date.toISOString().split('T')[0],
                heartRate: 65 + Math.random() * 15,
                glucose: 90 + Math.random() * 20,
                sleep: 6 + Math.random() * 3,
                stress: 1 + Math.random() * 4
            });
        }
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// ============ SLEEP ROUTES ============
app.get('/api/sleep', (req, res) => {
    try {
        const days = parseInt(req.query.days as string) || 7;
        const defaultData = [
            { id: "s1", date: "2024-03-01", duration: 7.5, quality: 85, deepSleep: 2.1, lightSleep: 4.2, remSleep: 1.2, awakeTime: 0.1 },
            { id: "s2", date: "2024-03-02", duration: 6.8, quality: 72, deepSleep: 1.5, lightSleep: 4.0, remSleep: 1.3, awakeTime: 0.3 }
        ];
        res.json({ success: true, data: defaultData });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ============ MOOD ROUTES ============
app.get('/api/mood', (req, res) => {
    res.json({ success: true, data: [] });
});

app.post('/api/mood', (req, res) => {
    const newMood = { id: uuidv4(), ...req.body, timestamp: new Date().toISOString() };
    res.json({ success: true, data: newMood });
});

// ============ GAMIFICATION ROUTES ============
app.get('/api/achievements', (req, res) => {
    res.json({ success: true, data: [] });
});

app.get('/api/guilds', (req, res) => {
    res.json({ success: true, data: [] });
});

app.get('/api/challenges', (req, res) => {
    res.json({ success: true, data: [] });
});

// ============ ANALYTICS ROUTES ============
app.get('/api/analytics/risk', (req, res) => {
    res.json({ success: true, data: { overall: 15, factors: ["sedentary", "high_stress"], details: "Moderate risk due to low activity." } });
});

app.get('/api/analytics/health-score', (req, res) => {
    res.json({ success: true, data: { score: 82, trend: 5, factors: [] } });
});

app.get('/api/analytics/scenarios', (req, res) => {
    res.json({ success: true, data: [] });
});

// Fallback for any other /api routes returning success:true
app.use('/api/*', (req, res) => {
    res.json({ success: true, data: {} });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://127.0.0.1:${PORT}`);
});
