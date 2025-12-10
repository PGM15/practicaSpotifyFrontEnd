"use client";
import { createContext, useContext, useEffect, useState } from "react";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // 🟦 Cargar favoritos desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch (error) {
      console.error("Error cargando favoritos desde localStorage", error); // Control de error: fallo leyendo localStorage
    }
  }, []);

  // 🟩 Guardar favoritos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error guardando favoritos", error); // Control de error: fallo escribiendo localStorage
    }
  }, [favorites]);

  function toggleFavorite(item) {
    try {
      setFavorites(prev => {
        const exists = prev.find(f => f.id === item.id);
        if (exists) {
          return prev.filter(f => f.id !== item.id); // Control: evita duplicados
        }
        return [...prev, item];
      });
    } catch (error) {
      console.error("Error alternando favorito", error); // Control de error general
    }
  }

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoriteContext);
