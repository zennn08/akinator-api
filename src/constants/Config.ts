export const regions = [
  "en",
  "en_objects",
  "en_animals",
  "ar",
  "cn",
  "de",
  "de_animals",
  "es",
  "es_animals",
  "fr",
  "fr_objects",
  "fr_animals",
  "il",
  "it",
  "it_animals",
  "jp",
  "jp_animals",
  "kr",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "id"
] as const

export type region = (typeof regions)[number]

export const themes = {
  characters: 1,
  objects: 2,
  animals: 14
}
