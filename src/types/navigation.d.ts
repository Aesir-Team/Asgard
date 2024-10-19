import { Manga } from "./../models/Manga";
export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      MangaDetail: {
        manga: Manga;
      };
      MangaChapter: {
        chapterName: String;
        mangaName: String;
      };
    }
  }
}
