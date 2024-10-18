export interface Chapter {
  title: string;
  link: string;
  releaseDate: string;
}
export interface MangaDetailResponse {
  title: string;
  description: string;
  imageUrl?: string;
  typeManga: string; // Ex: "Manhwa"
  rating: string; // Ex: "4.8"
  alternativeName: string;
  genres: string[]; // Ex: ["Comédia", "Fantasia", "Romance", "Shoujo"]
  status: string; // Ex: "Em andamento"
  releaseYear: string; // Ex: "2023"
  chapters?: Chapter[]; // Array de capítulos
}

export interface MangaSearchResponse {
  title: string;
  image?: string;
}
