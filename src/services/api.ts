import axios from "axios";
import * as FileSystem from "expo-file-system";
export class MangaApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://192.168.2.16:3000";
  }

  // Recupera uma lista de todos os mangás
  async getAllManga(page: number = 1): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/all-manga`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar a lista de mangás");
    }
  }

  // Recupera uma lista de mangás mais populares
  async getMostPopulars(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/most-populars`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar os mangás mais populares");
    }
  }

  // Busca uma lista de mangás com base na pesquisa
  async searchManga(mangaName: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { q: mangaName },
      });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar mangás");
    }
  }

  // Recupera um mangá específico com capítulos
  async getManga(mangaName: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/manga`, {
        params: { q: mangaName },
      });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao buscar o mangá");
    }
  }

  // Recupera todas as imagens de um capítulo
  async getImages(mangaName: string, chapterName: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/images`, {
        params: { q: `${mangaName}/${chapterName}` },
      });

      // Ordena as chaves numericamente e retorna as imagens ordenadas
      const sortedImages = Object.keys(response.data)
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => response.data[key]);

      return sortedImages;
    } catch (error) {
      throw new Error("Erro ao buscar imagens do capítulo");
    }
  }
  async getAllDownloadedMangas(): Promise<string[]> {
    try {
      const baseDirectoryUri = `${FileSystem.documentDirectory}media/`;

      const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
      const dirList = items.filter(
        (item) => item !== ".DS_Store" && !item.startsWith(".")
      );
      return dirList;
    } catch (error) {
      //console.error("Erro ao listar diretórios:", error);
      return [];
    }
  }
  async getDownloadedChapters(mangaName: string): Promise<string[] | false> {
    const baseDirectoryUri = `${FileSystem.documentDirectory}media/${mangaName}/`;

    try {
      const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
      const dirList = items.filter((item) => item !== ".DS_Store");
      return dirList;
    } catch {
      return false;
    }
  }
}
