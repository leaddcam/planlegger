const express = require('express');
const router = express.Router();
const db = require('../db');


// legger til et nytt notat
router.post('/', async (req, res) => {
  const { interesse, tittel, innhold, blokkId} = req.body;
  console.log(req.body);

  if (!interesse || !tittel) {
    return res.status(400).json({ melding: 'Mangler data' });
  }

  try {
    // setter blokkId til null hvis ikke et gyldig tall fremmes
    const blokkVerdi = (blokkId && !isNaN(Number(blokkId))) ? Number(blokkId) : null;
    const sql = `INSERT INTO notater (interesse, tittel, innhold, blokkId) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [interesse, tittel, innhold || '', blokkVerdi]);

    console.log('Insert result: ', result);
    console.log('InsertId: ', result.insertId);
    
    if (!result.insertId) {
      return res.status(500).json({ melding: 'Kunne ikke lagre notat - mangler insertId' });
    }

    res.status(201).json({ notatId: result.insertId, melding: 'Notat lagret' });

  } catch (err) {
    console.error('Feil ved lagring av notat:', err);
    res.status(500).json({ melding: 'Serverfeil' });
  }
});

// henter alle notater for en interesse
router.get('/:interesse', (req, res) => {
    const { interesse } = req.params;
    db.query(
        'SELECT * FROM notater WHERE interesse = ?', 
        [interesse], 
        (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Feil ved henting av notater' });
        } else {
            res.json(result);
        }
    });
});

// henter ett notat basert på ID
router.get('/id/:id', (req, res) => {
    const {id} = req.params;
    db.query(
        'SELECT * FROM notater WHERE notatId = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({error: 'Feil ved henting av notat'});
            } else {
                res.json(result[0]);
            }
        }
    );
});


// oppdaterer eksisterende notat
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {tittel, innhold} = req.body;

    db.query(
        'UPDATE notater SET tittel = ?, innhold = ? WHERE notatId = ?',
        [tittel, innhold, id],
        (err, result) => {
            if (err) {
                console.error('DB feil: ', err);
                return res.status(500).json({error: 'Databasefeil'});
            } 
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Notat ikke funnet' });
            }

        res.json({success: true});
    });
});

// legger til notatblokk i notatblokker
router.post('/blokker', (req, res) => {
  const { interesse, navn } = req.body;

  db.query(
    'INSERT INTO notatblokker (interesse, navn, opprettelsesdato, antall_notater) VALUES (?, ?, NOW(), 0)',
    [interesse, navn],
    (err, result) => {
      if (err) {
        console.error('Feil ved opprettelse av blokk:', err);
        return res.status(500).json({ error: 'Feil ved opprettelse av blokk' });
      }
      res.json({ blokkId: result.insertId, interesse, navn });
    }
  );
});

// henter alle blokker for en interesse
router.get('/blokker/:interesse', (req, res) => {
  const { interesse } = req.params;
  db.query(
    'SELECT * FROM notatblokker WHERE interesse = ?',
    [interesse],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Feil ved henting av blokker' });
      }
      res.json(result);
    }
  );
});

router.get('/notatblokk/:blokkId', async (req, res) => {
  const blokkId = req.params.blokkId;
  try {
    const [rows] = await db.query(
      'SELECT * FROM notatblokker WHERE blokkId = ?',
      [blokkId]
    );
    if (rows.length === 0) {
      return res.status(404).json({melding: 'Notatblokk ikke funnet'});
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Feil ved henting av notatblokk:', err);
    res.status(500).json({melding: 'Serverfeil'});
  }
});




module.exports = router;
