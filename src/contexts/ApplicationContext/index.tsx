import { ReactNode, createContext, useState } from "react";

type ApplicationProviderProps = {
  children: ReactNode;
};

type User = {
  name: string;
};

type GameProviderValues = {
  user: User | undefined;
  selectedDeck: number;
  setSelectedDeck: (deckId: number) => void;
};

export const ApplicationContext = createContext({} as GameProviderValues);

export const ApplicationProvider = ({ children }: ApplicationProviderProps) => {
  const [user, setUser] = useState();
  const [selectedDeck, setSelectedDeck] = useState(0);

  return (
    <ApplicationContext.Provider
      value={{ user, selectedDeck, setSelectedDeck }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
