import { rest } from "msw";
import { firstnames, lastnames } from "./names.json";

const digits: string[] = [];
for (let i = 0; i < 10; ++i) {
  digits.push(String.fromCharCode("0".charCodeAt(0) + i));
}

const lowerCases = (() => {
  const lowerCaseSet = new Set<string>();
  while (lowerCaseSet.size < 10) {
    lowerCaseSet.add(
      String.fromCharCode("a".charCodeAt(0) + Math.floor(Math.random() * 26))
    );
  }
  return Array.from(lowerCaseSet).sort();
})();

const upperCases = (() => {
  const upperCaseSet = new Set<string>();
  while (upperCaseSet.size < 10) {
    upperCaseSet.add(
      String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 26))
    );
  }
  return Array.from(upperCaseSet).sort();
})();

const idNameList = (() => {
  const allCharacters = ([] as string[]).concat(digits, lowerCases, upperCases);

  const idNameMap = new Map<string, string>();
  while (idNameMap.size < 2000) {
    const idCharSet = new Set<string>();
    while (idCharSet.size < 10) {
      const randChar = allCharacters.at(
        Math.floor(Math.random() * allCharacters.length)
      );
      if (randChar) {
        idCharSet.add(randChar);
      }
    }
    idNameMap.set(
      Array.from(idCharSet).join(""),
      `${firstnames[Math.floor(Math.random() * firstnames.length)]} ${
        lastnames[Math.floor(Math.random() * lastnames.length)]
      }`
    );
  }

  return Array.from(idNameMap);
})();

export const handlers = {
  getCharacterList: rest.get(
    "https://api.humelo.exam/character-list",
    (_, res, ctx) => {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              res(ctx.status(200), ctx.json({ digits, lowerCases, upperCases }))
            ),
          50 + Math.random() * 50
        )
      );
    }
  ),

  getIDList: rest.get("https://api.humelo.exam/id-name-list", (_, res, ctx) => {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(res(ctx.status(200), ctx.json(idNameList))),
        idNameList.length / 10
      )
    );
  }),
};
