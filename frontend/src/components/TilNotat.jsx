// navigerer bruker til valgt Notat (page)

import {useNavigate, useParams} from 'react-router-dom';

function TilNotat({ notat }) {
  const naviger = useNavigate();
  const { navn } = useParams();

  const handleClick = () => naviger(`/interesse/${navn}/notatbok/notat/${notat}`);

  return (
    <button onClick={handleClick}>
      Notat: {notat}
    </button>
  );
}

export default TilNotat;
