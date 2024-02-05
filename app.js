const firebase = require('firebase');

const firebaseConfig = {
  apiKey: 'SuaChaveAPI',
  authDomain: 'SeuDominio.firebaseapp.com',
  databaseURL: 'https://SeuProjeto.firebaseio.com',
  projectId: 'SeuProjeto',
  storageBucket: 'SeuProjeto.appspot.com',
  messagingSenderId: 'SeuID',
  appId: 'SeuAppID',
};

firebase.initializeApp(firebaseConfig);
