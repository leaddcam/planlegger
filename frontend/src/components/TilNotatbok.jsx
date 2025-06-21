// navigerer brukeren til en Notatbok (liste over løse notater og notatblokker)

import { useNavigate, useParams } from 'react-router-dom';

function TilNotatbok() {
  const naviger = useNavigate();
  const { navn } = useParams();

  const håndterKlikk = () => {
    naviger(`/interesse/${navn}/notatbok`);
  };

  return (
    <button onClick={håndterKlikk}>
      Gå til Notatbok
    </button>
  );
}

export default TilNotatbok;
