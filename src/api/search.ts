import { parseDocument } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import { Element, Document } from "domhandler";
import lerMangasInterface from "./types";

const url = "https://lermangas.me";

export default class SearchManga {
  async searchManga(query: string, pages = 1): Promise<lerMangasInterface[]> {
    if (pages <= 0) throw new Error("Navegação inválida");
    const pagesUrl = `${url}/page/${pages}/?s=${query}&post_type=wp-manga`;

    // Faz a requisição HTTP para buscar o HTML da página
    const response = await fetch(pagesUrl);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    const html = await response.text();
    const root = parseDocument(html);
    const data: lerMangasInterface[] = [];

    // Funções auxiliares para extrair dados
    const getTextContent = (element: Element | null): string => {
      return element ? DomUtils.textContent(element).trim() : "";
    };

    const getAttr = (element: Element | null, attr: string): string => {
      return element?.attribs?.[attr] || "";
    };

    // Função para encontrar elementos com classe CSS
    const findElementsByClass = (
      className: string,
      root: Element | Document
    ): Element[] => {
      const elements = root instanceof Element ? [root] : root.children;
      return DomUtils.findAll(
        (elem) =>
          elem instanceof Element && elem.attribs?.class?.includes(className),
        elements
      ) as Element[];
    };

    // Itera sobre os elementos que contêm as informações dos mangás
    const items = findElementsByClass("c-tabs-item__content", root);

    items.forEach((element) => {
      const titleElement = DomUtils.findOne(
        (el) =>
          el instanceof Element && el.attribs?.class?.includes("post-title"),
        [element]
      );

      const linkElement = titleElement
        ? DomUtils.findOne(
            (el) => el instanceof Element && el.name === "a",
            [titleElement]
          )
        : null;

      const title = getTextContent(linkElement);
      const link = getAttr(linkElement, "href");

      const imageElement = DomUtils.findOne(
        (el) => el instanceof Element && el.name === "img",
        [element]
      );
      const imageUrl = getAttr(imageElement, "src");

      const ratingElement = DomUtils.findOne(
        (el) => el instanceof Element && el.attribs?.class?.includes("score"),
        [element]
      );
      const rating = getTextContent(ratingElement);

      const genresElement = DomUtils.findOne(
        (el) =>
          el instanceof Element && el.attribs?.class?.includes("mg_genres"),
        [element]
      );
      const genres = genresElement
        ? getTextContent(genresElement)
            .split(", ")
            .map((g) => g.trim())
        : [];

      const alternativeNameElement = DomUtils.findOne(
        (el) =>
          el instanceof Element &&
          el.attribs?.class?.includes("mg_alternative"),
        [element]
      );
      const alternativeName = getTextContent(alternativeNameElement);

      const statusElement = DomUtils.findOne(
        (el) =>
          el instanceof Element && el.attribs?.class?.includes("mg_status"),
        [element]
      );
      const status = getTextContent(statusElement);

      const releaseYearElement = DomUtils.findOne(
        (el) =>
          el instanceof Element && el.attribs?.class?.includes("mg_release"),
        [element]
      );
      const releaseYear = getTextContent(releaseYearElement);

      const chapters: { title: string; link: string }[] = [];
      const chapterElements = DomUtils.findAll(
        (el) => el instanceof Element && el.attribs?.class?.includes("chapter"),
        [element]
      );

      chapterElements.forEach((chapterElement) => {
        const chapterLinkElement = DomUtils.findOne(
          (el) => el instanceof Element && el.name === "a",
          [chapterElement]
        );
        const chapterTitle = getTextContent(chapterLinkElement);
        const chapterLink = getAttr(chapterLinkElement, "href");
        chapters.push({ title: chapterTitle, link: chapterLink });
      });

      // Adiciona os dados do mangá ao array de resultados
      data.push({
        title,
        link,
        imageUrl,
        rating,
        alternativeName,
        genres,
        status,
        releaseYear,
        chapters,
      });
    });
    return data;
  }
}
