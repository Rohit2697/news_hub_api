import { NewsArticle } from "../interface";

export default function filterArticles(articles: NewsArticle[]): NewsArticle[] {
  return articles.filter(article => {
    return (
      article.source.name &&
      article.author &&
      article.title &&
      article.description &&
      article.url &&
      article.urlToImage &&
      article.publishedAt &&
      article.content
    );
  });
}