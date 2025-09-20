require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5001;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('hello from the backend!');
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, monthlyIncome } = req.body;

    // create user in firebase authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    // store additional user data in firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      monthlyIncome,
      email, // store email for easy lookup if needed
    });

    res.status(201).json({ message: 'user registered successfully!', uid: userRecord.uid });
  } catch (error) {
    console.error('error during firebase user registration:', error);
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // firebase authentication does not directly provide a sign-in method for the admin sdk
    // instead, we can verify the password by attempting to get the user by email
    // and then comparing a hashed password (if we were storing them ourselves)
    // or, more commonly, for a backend, you'd use a client-side sdk to sign in
    // and then send the id token to the backend for verification.
    // for this simplified example, we'll just check if the user exists by email
    // and assume a successful login if the user record is found.
    // in a real application, you would use firebase client sdk on the frontend to sign in
    // and then send the idtoken to the backend for verification using admin.auth().verifyidtoken(idtoken)

    const userRecord = await auth.getUserByEmail(email);

    // for a real login, you'd verify the password here. since admin sdk doesn't directly sign in,
    // and we're not storing passwords in firestore, this is a simplified mock.
    // a proper flow involves frontend firebase client sdk login and sending idtoken.

    res.status(200).json({ message: 'user logged in successfully (mock)! ', uid: userRecord.uid });
  } catch (error) {
    console.error('error during firebase user login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Budget Endpoints
app.post('/api/budget', async (req, res) => {
  try {
    const { userId, name, amount } = req.body;
    await db.collection('users').doc(userId).collection('budget').add({
      name,
      amount,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ message: 'budget entry added successfully!' });
  } catch (error) {
    console.error('error adding budget entry to firestore:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/budget/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const budgetSnapshot = await db.collection('users').doc(userId).collection('budget').orderBy('timestamp', 'asc').get();
    const budgetEntries = budgetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(budgetEntries);
  } catch (error) {
    console.error('error fetching budget entries from firestore:', error);
    res.status(500).json({ error: error.message });
  }
});

// Credit University Endpoints
app.get('/api/modules', async (req, res) => {
  try {
    const modulesRef = db.collection('modules');
    const moduleSnapshot = await modulesRef.get();

    if (moduleSnapshot.empty) {
      // seed initial modules if they don't exist
      const initialModules = [
        { title: 'what is credit?', content: 'credit is a contractual agreement in which a borrower receives something of value now and agrees to repay the lender at a later date—generally with interest.' },
        { title: 'how to improve your credit score', content: 'to improve your credit score, focus on paying bills on time, keeping credit utilization low, and avoiding new credit applications too frequently.' },
        { title: 'managing your income', content: 'effective income management involves budgeting, saving, and investing to achieve financial goals.' },
      ];
      const batch = db.batch();
      initialModules.forEach(module => {
        const newModuleRef = modulesRef.doc();
        batch.set(newModuleRef, module);
      });
      await batch.commit();
      console.log('initial credit university modules seeded.');

      const seededModulesSnapshot = await modulesRef.get();
      const seededModules = seededModulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(seededModules);

    } else {
      const modules = moduleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(modules);
    }
  } catch (error) {
    console.error('error fetching credit university modules from firestore:', error);
    res.status(500).json({ error: error.message });
  }
});

// Gemini Credit Advice Endpoint
app.post('/api/gemini-credit-advice', async (req, res) => {
  try {
    const { creditUsage, paymentHistory, creditAge, newCredit } = req.body;
    const prompt = `given the following credit information:\n      - credit usage: ${creditUsage}%\n      - payment history: ${paymentHistory}\n      - credit age: ${creditAge} years\n      - new credit: ${newCredit} recent applications\n      provide advice on how these factors might affect a credit score and suggest ways to improve it.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ advice: text });
  } catch (error) {
    console.error('error calling gemini api:', error);
    res.status(500).json({ error: 'failed to get advice from gemini.' });
  }
});

app.listen(port, () => {
  console.log(`backend listening at http://localhost:${port}`);
});
