const express = require('express'); // web-rammeverk for Node.js for å enklere kunne lage APIer og håndtere HTTP-forespørsler
const cors = require('cors'); // sikkerhetslag i nettlesere: gir tillatelse for kommunikasjon mellom front- og backend uten å bli blokkert av nettleseren
const app = express();
const notaterRoutes = require('./routes/notater');

app.use(cors());
app.use(express.json());
app.use('/api/notater', notaterRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});