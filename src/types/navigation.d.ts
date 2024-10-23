import { TabRoutesProps } from "../routes/TabNavigator";
import { StackRoutesProps } from "../routes/StackNavigator";
import { Manga } from "./../models/Manga";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// export declare global {
//   namespace ReactNavigation {
//     interface RootStackParamList {
//       MangaDetail: {
//         manga: Manga;
//       };
//       MangaChapter: {
//         chapterName: String;
//         mangaName: String;
//       };
//     }
//   }
// }
export declare global {
  namespace ReactNavigation {
    interface RootParamList extends TabRoutesProps, StackRoutesProps {}
  }
}
export type TabRoutes<RouteName extends keyof TabRoutesProps> =
  NativeStackScreenProps<TabRoutesProps, RouteName>;

export type StackRoutes<RouteName extends keyof StackRoutesProps> =
  NativeStackScreenProps<StackRoutesProps, RouteName>;
