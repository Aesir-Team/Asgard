import axios from "axios";
import * as FileSystem from "expo-file-system";
import { API_URL } from "@env";
export class MangaApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
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

  async getDownloadedImages(mangaName: string, chapterName: string) {
    const baseDirectoryUri = `${FileSystem.documentDirectory}media/${mangaName}/${chapterName}`;
    const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
    const sortedImages = items
      .filter((item) => item !== ".DS_Store")
      .sort(
        (a, b) =>
          parseInt(a.match(/\d+/)?.[0] || "0") -
          parseInt(b.match(/\d+/)?.[0] || "0")
      );
    return sortedImages.map((imageName) => `${baseDirectoryUri}/${imageName}`);
  }

  async getDownloadedChapters(mangaName: string): Promise<string[]> {
    const baseDirectoryUri = `${FileSystem.documentDirectory}media/${mangaName}/`;

    try {
      // Verifica se o diretório existe
      const dirInfo = await FileSystem.getInfoAsync(baseDirectoryUri);
      if (!dirInfo.exists || !dirInfo.isDirectory) {
        return []; // Retorna false se o diretório não existir ou não for um diretório
      }

      // Lê o diretório
      const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
      const dirList = items.filter((item) => item !== ".DS_Store");

      // Extrai a numeração dos capítulos e os classifica
      const sortedChapters = dirList
        .map((chapter) => ({
          title: chapter,
          number: this.extractChapterNumber(chapter), // Função para extrair o número do capítulo
        }))
        .filter(({ number }) => number !== null) // Remove os capítulos que não têm numeração
        .sort((a, b) => {
          const [aMain, aSub] = (a.number ?? "").split(".").map(Number);
          const [bMain, bSub] = (b.number ?? "").split(".").map(Number);
          if (aMain !== bMain) {
            return aMain - bMain; // Ordena pelos números principais
          }
          return (aSub || 0) - (bSub || 0); // Ordena pelos números secundários (caso existam)
        });

      // Retorna os títulos dos capítulos em ordem inversa
      return sortedChapters.map(({ title }) => title).reverse();
    } catch {
      return []; // Retorna false caso ocorra um erro ao acessar o diretório
    }
  }

  // Função para extrair o número do capítulo
  extractChapterNumber(chapter: string): string | null {
    const match = chapter.match(/(\d+(\.\d+)?)/); // Captura tanto capítulos inteiros quanto com sufixos decimais
    return match ? match[0] : null; // Retorna o número do capítulo ou null
  }
}
