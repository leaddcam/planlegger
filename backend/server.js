const express = require('express'); // web-rammeverk for Node.js for å enklere kunne lage APIer og håndtere HTTP-forespørsler
const cors = require('cors'); // sikkerhetslag i nettlesere: gir tillatelse for kommunikasjon mellom front- og backend uten å bli blokkert av nettleseren
const app = express();


// aktiverer cors og json-parsing
app.use(cors());
app.use(express.json());

const notaterRoutes = require('./routes/notatbok');
app.use('/api/notatbok', notaterRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
