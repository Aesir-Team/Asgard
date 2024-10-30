import { parseDocument } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import { Element } from "domhandler";
import lerMangasInterface from "./types";

const url = "https://lermangas.me";

export default class InfoManga {
  async getMangas(query: string): Promise<lerMangasInterface[]> {
    const pageUrl = query;
    const response = await fetch(`${url}/manga/${pageUrl}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    const html = await response.text();
    const root = parseDocument(html);
    const data: lerMangasInterface[] = [];

    const getTextContent = (element: Element | null): string => {
      return element ? DomUtils.textContent(element).trim() : "";
    };

    const getAttr = (element: Element | null, attr: string): string => {
      return element?.attribs?.[attr] || "";
    };

    const wrapper = DomUtils.findOne(
      (elem) =>
        elem instanceof Element && elem.attribs?.class?.includes("wrap"),
      root.children
    );

    if (!wrapper) {
      return data;
    }

    const titleElement = DomUtils.findOne(
      (el) =>
        el instanceof Element && el.attribs?.class?.includes("rate-title"),
      [wrapper]
    );
    const title = getAttr(titleElement, "title");

    const summaryImageElement = DomUtils.findOne(
      (el) =>
        el instanceof Element && el.attribs?.class?.includes("summary_image"),
      [wrapper]
    );

    const imageAnchorElement = summaryImageElement
      ? DomUtils.findOne(
          (el) => el instanceof Element && el.name === "a",
          [summaryImageElement]
        )
      : null;

    const imageElement = imageAnchorElement
      ? DomUtils.findOne(
          (el) => el instanceof Element && el.name === "img",
          [imageAnchorElement]
        )
      : null;

    const imageUrl = getAttr(imageElement, "src");

    const ratingElement = DomUtils.findOne(
      (el) =>
        el instanceof Element &&
        el.attribs?.class?.includes("post-total-rating"),
      [wrapper]
    );
    const rating = getTextContent(ratingElement).split(" ")[0];

    const typeMangaElement = DomUtils.findOne(
      (el) =>
        el instanceof Element &&
        el.attribs?.class?.includes("summary-heading") &&
        getTextContent(el).includes("Tipo"),
      [wrapper]
    );
    const typeManga = typeMangaElement
      ? getTextContent(DomUtils.nextElementSibling(typeMangaElement))
      : "";

    const alternativeNameElement = DomUtils.findOne(
      (el) =>
        el instanceof Element &&
        el.attribs?.class?.includes("summary-heading") &&
        getTextContent(el).includes("Nome alternativo"),
      [wrapper]
    );
    const alternativeName = alternativeNameElement
      ? getTextContent(DomUtils.nextElementSibling(alternativeNameElement))
      : "";

    const genresElement = DomUtils.findOne(
      (el) =>
        el instanceof Element &&
        el.attribs?.class?.includes("summary-heading") &&
        getTextContent(el).includes("Gênero(s)"),
      [wrapper]
    );

    const genres = genresElement
      ? DomUtils.findAll(
          (el) => el instanceof Element && el.name === "a",
          DomUtils.nextElementSibling(genresElement)?.children || []
        ).map((genreElement) => getTextContent(genreElement))
      : [];

    const statusElement = DomUtils.findOne(
      (el) =>
        el instanceof Element &&
        el.attribs?.class?.includes("summary-heading") &&
        getTextContent(el).includes("Status"),
      [wrapper]
    );
    const status = statusElement
      ? getTextContent(DomUtils.nextElementSibling(statusElement))
      : "";

    const releaseYearElement = DomUtils.findOne(
      (el) =>
        el instanceof Element &&
        el.attribs?.class?.includes("summary-heading") &&
        getTextContent(el).includes("Lançamento"),
      [wrapper]
    );
    const releaseYear = releaseYearElement
      ? getTextContent(
          DomUtils.findOne(
            (el) => el instanceof Element && el.name === "a",
            DomUtils.nextElementSibling(releaseYearElement)?.children || []
          )
        )
      : "";

    const chapters: { title: string; link: string; releaseDate?: string }[] =
      [];
    const chapterElements = DomUtils.findAll(
      (el) =>
        el instanceof Element &&
        el.attribs?.class?.includes("wp-manga-chapter"),
      [wrapper]
    );

    chapterElements.forEach((chapterElement) => {
      const chapterLinkElement = DomUtils.findOne(
        (el) => el instanceof Element && el.name === "a",
        [chapterElement]
      );
      const chapterTitle = getTextContent(chapterLinkElement);
      const chapterLink = getAttr(chapterLinkElement, "href");

      const releaseDateElement = DomUtils.findOne(
        (el) =>
          el instanceof Element &&
          el.attribs?.class?.includes("chapter-release-date"),
        [chapterElement]
      );
      const releaseDate = getTextContent(releaseDateElement);

      chapters.push({
        title: chapterTitle,
        link: chapterLink,
        releaseDate,
      });
    });

    const descriptionElement = DomUtils.findOne(
      (el) =>
        el instanceof Element && el.attribs?.class?.includes("manga-excerpt"),
      [wrapper]
    );
    const description = getTextContent(descriptionElement);

    data.push({
      title,
      description,
      imageUrl,
      typeManga,
      rating,
      alternativeName,
      genres,
      status,
      releaseYear,
      chapters,
    });

    return data;
  }
}
