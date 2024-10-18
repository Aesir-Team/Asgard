import { Image, TouchableOpacity } from "react-native";

interface MangaProps {
  name: String;
}

export function Manga({ name }: MangaProps) {
  return (
    <TouchableOpacity>
      <Image />
    </TouchableOpacity>
  )

}