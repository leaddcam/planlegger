import '../styles/NyBlokk.css';

function NyBlokk({ blokk, settBlokk }) {
  const leggTilBlokk = () => {
    const navn = prompt("Ny blokk:");
    if (navn && !blokk[navn]) {
      settBlokk(prev => ({ ...prev, [navn]: [] }));
    }
  };

  return (
    <button onClick={leggTilBlokk} className="ny-blokk">📁</button>
  );
}

export default NyBlokk;
