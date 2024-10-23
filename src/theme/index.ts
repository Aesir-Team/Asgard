export default {
  colors: {
    background: "#2f1464",
    purpleLight: "#8357eb",
    purple: "#7728bc",
    purpleDark: "#280659",
    white: "#fff",
  },
  font_family: {
    regular: "NunitoSans_400Regular",
    medium: "NunitoSans_600SemiBold",
    bold: "NunitoSans_700Bold",
  },
  font_size: {
    small: 14,
    regular: 18,
    medium: 22,
    large: 26,
    xlarge: 32,
  },
};

  // async getAllDownloadedMangas(): Promise<string[]> {
  //   try {
  //     const baseDirectoryUri = `${FileSystem.documentDirectory}media/`;

  //     const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
  //     const dirList = items.filter(
  //       (item) => item !== ".DS_Store" && !item.startsWith(".")
  //     );
  //     return dirList;
  //   } catch (error) {
  //     console.error("Erro ao listar diretórios:", error);
  //     return [];
  //   }
  // }
  // async getDownloadedChapters(mangaName: string): Promise<any> {
  //   const baseDirectoryUri = `${FileSystem.documentDirectory}media/${mangaName}/`;
  //   const items = await FileSystem.readDirectoryAsync(baseDirectoryUri);
  //   const dirList = items.filter((item) => item !== ".DS_Store");
  //   const chapters = dirList.map((chapter) => ({ title: chapter }));
  //   return chapters;
  // }