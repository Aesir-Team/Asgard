import { parseDocument } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import { Element } from "domhandler";

const url = "https://lermangas.me";

export default class GetImagesManga {
  async getImagesManga(query: string): Promise<string[]> {
    const pagesUrl = query;
    const response = await fetch(`${url}/manga/${pagesUrl}`);
    if (!pagesUrl) throw new Error("URL não fornecida");
    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

    const html = await response.text();
    const root = parseDocument(html);
    const images: string[] = [];

    // Função auxiliar para obter atributo
    const getAttr = (element: Element | null, attr: string): string => {
      return element?.attribs?.[attr] || "";
    };

    // Expressão regular para verificar se a URL termina com um número e uma extensão de imagem
    const numberEndingRegex = /\/\d+\.(jpg|jpeg|png|gif)$/;

    // Busca todos os elementos de imagem presentes no documento
    const imageElements = DomUtils.findAll(
      (el): boolean =>
        el instanceof Element && el.name === "img" && !!el.attribs?.src, // Certifica-se de que o elemento possui um atributo 'src'
      root.children
    );

    imageElements.forEach((element) => {
      let imageUrl = getAttr(element, "src").trim();
      if (imageUrl) {
        // Corrige a URL se for relativa
        if (imageUrl.startsWith("/")) {
          imageUrl = `${url}${imageUrl}`;
        }

        // Verifica se a URL termina com um número e uma extensão válida
        if (numberEndingRegex.test(imageUrl)) {
          images.push(imageUrl);
        }
      }
    });

    if (images.length === 0) {
      throw new Error("Nenhuma imagem encontrada na página.");
    }

    return images;
  }
}
