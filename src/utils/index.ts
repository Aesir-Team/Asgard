import _ from "lodash";

export function normalizeTitle(title: string): string {
  return _.kebabCase(title); // Converte para kebab case
}
