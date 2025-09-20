const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Hack Rice 15 Cloud Function!')
})
