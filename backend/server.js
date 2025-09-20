require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('./models/User');
const Budget = require('./models/Budget');
const Module = require('./models/Module');

const app = express();
const port = 5001;

// Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/financial_literacy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected...');
  // Seed initial modules if they don't exist
  const moduleCount = await Module.countDocuments();
  if (moduleCount === 0) {
    await Module.insertMany([
      { title: 'What is Credit?', content: 'Credit is a contractual agreement in which a borrower receives something of value now and agrees to repay the lender at a later date—generally with interest.' },
      { title: 'How to Improve Your Credit Score', content: 'To improve your credit score, focus on paying bills on time, keeping credit utilization low, and avoiding new credit applications too frequently.' },
      { title: 'Managing Your Income', content: 'Effective income management involves budgeting, saving, and investing to achieve financial goals.' },
    ]);
    console.log('Initial Credit University modules seeded.');
  }
})
.catch(err => console.error(err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, name, monthlyIncome } = req.body;
    const newUser = new User({ email, name, monthlyIncome });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Budget Endpoints
app.post('/api/budget', async (req, res) => {
  try {
    const { userId, name, amount } = req.body;
    const newBudgetEntry = new Budget({ userId, name, amount });
    await newBudgetEntry.save();
    res.status(201).json({ message: 'Budget entry added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/budget/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const budgetEntries = await Budget.find({ userId });
    res.status(200).json(budgetEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Credit University Endpoints
app.get('/api/modules', async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gemini Credit Advice Endpoint
app.post('/api/gemini-credit-advice', async (req, res) => {
  try {
    const { creditUsage, paymentHistory, creditAge, newCredit } = req.body;
    const prompt = `Given the following credit information:
      - Credit Usage: ${creditUsage}%
      - Payment History: ${paymentHistory}
      - Credit Age: ${creditAge} years
      - New Credit: ${newCredit} recent applications
      Provide advice on how these factors might affect a credit score and suggest ways to improve it.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ advice: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to get advice from Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
