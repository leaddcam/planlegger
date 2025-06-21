function NyttNotat({ settNotat }) {
  const leggTilNotat = () => {
    const tittel = prompt("Nytt notat:");
    if (tittel) {
      const nyttNotat = { id: Date.now(), tittel };
      settNotat(prev => [...prev, nyttNotat]);
    }
  };

  return (
    <button onClick={leggTilNotat}>➕ Nytt løst notat</button>
  );
}

export default NyttNotat;
