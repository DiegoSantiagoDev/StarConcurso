import { useCallback, useEffect, useState } from 'react';
import { sanitizeFavorites } from '../lib/sanitize';

const KEY = 'star-favorites';

function read() {
  try {
    // O localStorage pode ter sido alterado (pelo usuário, por extensão ou por outro script): só ids simples e em quantidade limitada.
    return sanitizeFavorites(JSON.parse(localStorage.getItem(KEY) || '[]'));
  } catch {
    return []; // JSON corrompido ou storage indisponível (modo privado).
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch {
      /* storage indisponível: favoritos valem apenas na sessão */
    }
  }, [favorites]);

  // Mantém várias abas sincronizadas.
  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setFavorites(read());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback(
    (id) => setFavorites((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id])),
    [],
  );
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
