import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/comprobar/:palabra', async (req, res) => {
    const palabra = req.params.palabra.toLowerCase();

    try {
        const response = await fetch(`https://rae-api.com/api/words/${palabra}`);
        const data = await response.json();

        if (data.ok === false) {
            return res.json({ ok: false });
        }

        const valida = data.data && data.data.word ? true : false;

        return res.json({ ok: valida });

    } catch (err) {
        console.error(err);
        return res.json({ ok: false });
    }
});


app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
