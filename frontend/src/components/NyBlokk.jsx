function NyBlokk({ blokk, settBlokk }) {
  const leggTilBlokk = () => {
    const navn = prompt("Ny blokk:");
    if (navn && !blokk[navn]) {
      settBlokk(prev => ({ ...prev, [navn]: [] }));
    }
  };

  return (
    <button onClick={leggTilBlokk}>📁 Ny notatblokk</button>
  );
}

export default NyBlokk;
