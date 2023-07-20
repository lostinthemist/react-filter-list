import "./App.css";
import { useState, useEffect } from "react";

type Condition = "AND" | "OR";

export const App = () => {
  const [digits, setDigits] = useState<string[]>([]);
  const [upperCases, setUpperCases] = useState<string[]>([]);
  const [lowerCases, setLowerCases] = useState<string[]>([]);
  const [idNameList, setIdNameList] = useState<[string, string][]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [condition, setCondition] = useState<Condition>("AND");


  useEffect(() => {
    const fetchIdNames = async () => {
      const response = await fetch("id-name-list.json");
      const data = await response.json();
      setIdNameList(data);
      console.log(data);
    };

    fetchIdNames();
  }, []);

  useEffect(() => {
    const fetchCharacterLists = async () => {
      const response = await fetch("character-list.json");
      const { digits, upperCases, lowerCases } = await response.json();
      setDigits(digits);
      setUpperCases(upperCases);
      setLowerCases(lowerCases);
      console.log(digits, upperCases, lowerCases);
    };

    fetchCharacterLists();
  }, []);

  const handleCharSelect = (char: string) => {
    setSelectedChars((prevState) =>
      prevState.includes(char)
        ? prevState.filter((selectedChar) => selectedChar !== char)
        : [...prevState, char]
    );
  };

  const filterIdNameList = () => {
    const regex = new RegExp(searchTerm, "i");

    let filteredIdNameList = idNameList.filter(([id, name]) => {
      return regex.test(name);
    });

    if (selectedChars.length > 0) {
      if (condition === "AND") {
        filteredIdNameList = filteredIdNameList.filter(([id, name]) => {
          return selectedChars.every((char) => id.includes(char));
        });
      } else if (condition === "OR") {
        filteredIdNameList = filteredIdNameList.filter(([id, name]) => {
          return selectedChars.some((char) => id.includes(char));
        });
      }
    }

    return filteredIdNameList;
  };

  const filteredIdNameList = filterIdNameList();
  const filterIdNameListLength = filteredIdNameList.length;


  return (
    <div className="app">
      <div id="controls">
        <label className="searchbar-label">
          Enter a search term:
          <input id="searchbar" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </label>
        <div className="controls-radio">
          <label>
            <input type="radio" name="filter-condition" value="and" checked={condition === 'AND'} onChange={() => setCondition('AND')} />
            AND
          </label>
          <label>
            <input type="radio" name="filter-condition" value="or" checked={condition === 'OR'} onChange={() => setCondition('OR')} />
            OR
          </label>
        </div>
        <div id="selectbox">
          <div className="selectbox">
            <ul>
              {digits.map((digit) => (
                <li key={digit}>
                  <input
                    id={digit}
                    type="checkbox"
                    checked={selectedChars.includes(digit)}
                    onChange={() => handleCharSelect(digit)}
                  />
                  <label htmlFor={digit}>{digit}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="selectbox">
            <ul>
              {upperCases.map((letter) => (
                <li key={letter}>
                  <input
                    id={letter}
                    type="checkbox"
                    checked={selectedChars.includes(letter)}
                    onChange={() => handleCharSelect(letter)}
                  />
                  <label htmlFor={letter}>{letter}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="selectbox">
            <ul>
              {lowerCases.map((letter) => (
                <li key={letter}>
                  <input
                    id={letter}
                    type="checkbox"
                    checked={selectedChars.includes(letter)}
                    onChange={() => handleCharSelect(letter)}
                  />
                  <label htmlFor={letter}>{letter}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="results-container">
        <p>Results: {filterIdNameListLength}</p>
        <ul className="idnamelist">

          {filteredIdNameList.map(([id, name]) => (
            <li key={id}>{`${id} - ${name}`}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};
