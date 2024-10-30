import { parseDocument } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import { AnyNode, Element } from "domhandler";
import lerMangasInterface from "./types";

const url = "https://lermangas.me";

export default class mostPopulars {
  async getMostPopulars(): Promise<lerMangasInterface[]> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    const html = await response.text();
    const root = parseDocument(html);
    const data: lerMangasInterface[] = [];

    // Funções auxiliares
    const getTextContent = (element: Element | null): string => {
      return element ? DomUtils.textContent(element).trim() : "";
    };

    const getAttr = (element: Element | null, attr: string): string => {
      return element?.attribs?.[attr] || "";
    };

    // Função para encontrar elementos com uma classe específica
    const findElementsByClass = (
      className: string,
      root: Element | AnyNode
    ): Element[] => {
      const elements: AnyNode[] =
        root instanceof Element
          ? [root]
          : ((root as unknown as Element).children as AnyNode[]);
      return DomUtils.findAll(
        (elem) =>
          elem instanceof Element && elem.attribs?.class?.includes(className),
        elements
      ) as Element[];
    };

    // Seleciona os itens populares
    const popularItems = findElementsByClass("popular-item-wrap", root);

    popularItems.forEach((element) => {
      const titleElement = DomUtils.findOne(
        (el) =>
          el instanceof Element && el.attribs?.class?.includes("widget-title"),
        [element]
      );

      const titleLinkElement = titleElement
        ? DomUtils.findOne(
            (el) => el instanceof Element && el.name === "a",
            [titleElement]
          )
        : null;
      const title = getTextContent(titleLinkElement);
      const link = getAttr(titleLinkElement, "href");

      const imageElement = DomUtils.findOne(
        (el) =>
          el instanceof Element && el.attribs?.class?.includes("popular-img"),
        [element]
      );
      const imgTag = imageElement
        ? DomUtils.findOne(
            (el) => el instanceof Element && el.name === "img",
            [imageElement]
          )
        : null;
      const imageUrl = getAttr(imgTag, "src");

      // Processa os capítulos
      const chapters: { title: string; link: string }[] = [];
      const chapterElements = DomUtils.findAll(
        (el) =>
          el instanceof Element && el.attribs?.class?.includes("chapter-item"),
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

      // Adiciona o item ao array de dados
      data.push({
        title,
        link,
        imageUrl,
        chapters,
        rating: "N/A", // Define "N/A" como padrão, já que a estrutura original não possuía rating
      });
    });

    return data;
  }
}
