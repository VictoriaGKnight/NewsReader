import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const ArticlesContext = createContext(null);

export function useArticles() {
  const ctx = useContext(ArticlesContext);
  if (!ctx) throw new Error("useArticles must be used within ArticlesProvider");
  return ctx;
}

export function ArticlesProvider({ children }) {
   const getAllUserArticles = () => savedArticlesByUser;

  const { user } = useAuth();

  const [savedArticlesByUser, setSavedArticlesByUser] = useState({});

  const getUserSavedArticles = () => {
    if (!user) return [];
    return savedArticlesByUser[user.username] || [];
  };

  const saveArticle = (article) => {
    if (!user) return;

    setSavedArticlesByUser((prev) => {
      const current = prev[user.username] || [];
      const alreadySaved = current.some((a) => a.url === article.url);
      if (alreadySaved) return prev;

      return {
        ...prev,
        [user.username]: [...current, article],
      };
    });
  };

  const removeArticle = (articleUrl) => {
    if (!user) return;

    setSavedArticlesByUser((prev) => {
      const current = prev[user.username] || [];
      return {
        ...prev,
        [user.username]: current.filter((a) => a.url !== articleUrl),
      };
    });
  };

  const isArticleSaved = (articleUrl) => {
    if (!user) return false;
    return (savedArticlesByUser[user.username] || []).some((a) => a.url === articleUrl);
  };


  return (
    <ArticlesContext.Provider
      value={{
        savedArticlesByUser,
        getUserSavedArticles,
        getAllUserArticles,
        saveArticle,
        removeArticle,
        isArticleSaved,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}