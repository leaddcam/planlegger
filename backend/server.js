const express = require('express'); // web-rammeverk for Node.js for å enklere kunne lage APIer og håndtere HTTP-forespørsler
const cors = require('cors'); // sikkerhetslag i nettlesere: gir tillatelse for kommunikasjon mellom front- og backend uten å bli blokkert av nettleseren
const cookieParser = require('cookie-parser');

// express-app
const app = express();

// cookie- og json-parsing, samt aktiverer cors
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: ['http://localhost:5173'], credentials: true}));

// auth-route
app.use('/api/auth', require('./routes/auth')); 

// håndtering av løse notater
const notaterRoutes = require('./routes/notater');
app.use('/api/notater', notaterRoutes);

// håndtering av blokker og notater i blokker
const notatblokkerRoutes = require('./routes/notatblokker');
app.use('/api/notatblokker', notatblokkerRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
