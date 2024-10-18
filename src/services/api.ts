export class MangaApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://192.168.2.54:3000";
  }

  // Recupera uma lista de todos os mangás
  async getAllManga(page: number = 1): Promise<any> {
    const response = await fetch(`${this.baseUrl}/all-manga?page=${page}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar a lista de mangás");
    }
    return response.json();
  }

  // Recupera uma lista de mangás mais populares
  async getMostPopulars(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/most-populars`);
    if (!response.ok) {
      throw new Error("Erro ao buscar os mangás mais populares");
    }
    return response.json();
  }

  // Busca uma lista de mangás com base na pesquisa
  async searchManga(name: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/search?q=${name}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar mangás");
    }
    return response.json();
  }

  // Recupera um mangá específico com capítulos
  async getManga(urlLink: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/manga?q=${urlLink}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar o mangá");
    }
    return response.json();
  }

  // Recupera todas as imagens de um capítulo
  async getImages(urlLink: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/images?q=${urlLink}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar imagens do capítulo");
    }
    return response.json();
  }
}
