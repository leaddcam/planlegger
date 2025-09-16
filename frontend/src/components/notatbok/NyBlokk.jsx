import '../../styles/NyBlokk.css';
import { useState } from 'react';
import { lagreNotatblokk } from '../../api/notatblokker';

/**
 * Props:
 * - blokk: objektmap { [blokkId]: { navn, notater: [] } }
 * - settBlokk: setState
 * - interesse?: string | null
 * - emne?: string | null
 */
function NyBlokk({ blokk, settBlokk, interesse = null, emne = null }) {
  const [venter, settVenter] = useState(false);

  const leggTilBlokk = async () => {
    const navn = prompt('Ny blokk:');
    if (!navn) return;

    // enkel kollisjonssjekk på navn i eksisterende map
    const finnes = Object.values(blokk || {}).some((b) => b?.navn === navn);
    if (finnes) {
      alert('Blokk med dette navnet finnes allerede.');
      return;
    }

    try {
      settVenter(true);

      // Send EKSakt én av interesse/emne (den andre blir null)
      const nyBlokk = await lagreNotatblokk({ interesse, emne, navn });
      // nyBlokk er hele raden fra backend, inkl. blokkId og navn

      settBlokk((prev) => ({
        ...prev,
        [nyBlokk.blokkId]: { navn: nyBlokk.navn, notater: [] },
      }));
    } catch (err) {
      alert('Kunne ikke lagre blokken: ' + err.message);
    } finally {
      settVenter(false);
    }
  };

  return (
    <button onClick={leggTilBlokk} disabled={venter} className="ny-blokk">
      {venter ? 'Lagrer...' : '📁'}
    </button>
  );
}

export default NyBlokk;
